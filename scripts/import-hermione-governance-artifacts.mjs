#!/usr/bin/env node

/**
 * Import Hermione/Alexandria governance artifacts safely.
 *
 * Default mode is DRY RUN. Use --apply to insert review artifacts.
 * Never prints Supabase secrets.
 */

import crypto from "node:crypto";
import fs from "node:fs";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const DRY_RUN = args.includes("--dry-run") || !APPLY;
const FILE = readOption("--file", "");
const ALLOWED_TYPES = new Set(["skill", "pop", "prompt", "decision", "summary", "document", "context_pack"]);

if (args.includes("--help") || args.includes("-h")) usage(0);
if (APPLY && args.includes("--dry-run")) fail("Use apenas um modo: --dry-run ou --apply.");
if (!FILE) usage(1);
if (!fs.existsSync(FILE)) fail(`Arquivo não encontrado: ${FILE}`, 2);

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.log(`SUPABASE_URL=${SUPABASE_URL ? "presente" : "ausente"}`);
  console.log(`SERVICE_KEY=${SERVICE_KEY ? "presente" : "ausente"}`);
  fail("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY/SUPABASE_SERVICE_KEY.", 2);
}

await main();

async function main() {
  console.log("Hermione governance import");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "APPLY"}`);
  console.log(`SUPABASE_URL=${SUPABASE_URL ? "presente" : "ausente"}`);
  console.log(`SERVICE_KEY=${SERVICE_KEY ? "presente" : "ausente"}`);
  console.log(`File: ${FILE}`);

  const bundle = readBundle(FILE);
  const artifacts = normalizeArtifacts(bundle);
  console.log(`Artifacts in file: ${artifacts.length}`);

  const columns = await loadTableColumns("hermione_artifacts");
  const duplicateChecks = await Promise.all(artifacts.map((artifact) => findDuplicates(artifact)));
  const plans = artifacts.map((artifact, index) => buildPlan(artifact, duplicateChecks[index], columns));

  printPlan(plans);

  const duplicatePlans = plans.filter((plan) => plan.duplicate_found);
  if (duplicatePlans.length > 0) {
    console.log(`Duplicados ou equivalentes encontrados: ${duplicatePlans.length}`);
  }

  if (DRY_RUN) {
    console.log("Nenhum dado foi alterado. Reexecute com --apply para importar somente os itens sem duplicado.");
    return;
  }

  const createPlans = plans.filter((plan) => plan.action === "create_review");
  const inserted = [];
  for (const plan of createPlans) {
    const row = await insertArtifact(plan.payload);
    inserted.push(row);
  }

  console.log(`Artifacts inserted: ${inserted.length}`);
  for (const row of inserted) console.log(`created\t${row.id}\t${row.status}\t${row.title}`);
}

function readBundle(file) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`JSON inválido: ${error instanceof Error ? error.message : String(error)}`, 2);
  }
  return parsed;
}

function normalizeArtifacts(bundle) {
  if (!bundle || !Array.isArray(bundle.artifacts)) fail("JSON precisa conter artifacts[].", 2);
  if (bundle.artifacts.length !== 5) fail(`Esperados exatamente 5 artifacts; encontrado ${bundle.artifacts.length}.`, 2);

  return bundle.artifacts.map((artifact, index) => {
    const required = ["slug", "title", "type", "domain", "summary", "content"];
    for (const key of required) {
      if (!artifact[key] || typeof artifact[key] !== "string") {
        fail(`Artifact ${index + 1}: campo obrigatório inválido: ${key}.`, 2);
      }
    }
    const mappedType = ALLOWED_TYPES.has(artifact.type) ? artifact.type : "document";
    const tags = Array.isArray(artifact.tags) ? artifact.tags.map(String).filter(Boolean) : [];
    return {
      slug: artifact.slug.trim(),
      title: artifact.title.trim(),
      originalType: artifact.type.trim(),
      artifactType: mappedType,
      scope: artifact.domain.trim(),
      status: "review",
      sourceFile: String(artifact.source_file || "").trim(),
      tags,
      summary: artifact.summary.trim(),
      content: artifact.content.trim(),
      metadata: {
        slug: artifact.slug.trim(),
        original_type: artifact.type.trim(),
        source_file: String(artifact.source_file || "").trim() || null,
        bundle: bundle.bundle || null,
        prepared_by: bundle.operator || null,
        owner: bundle.owner || null,
        approval: bundle.approval || null,
        imported_from: "alexandria_governanca_hermione_artifacts_v1",
        content_hash: sha256(artifact.content.trim()),
      },
    };
  });
}

function buildPlan(artifact, duplicates, columns) {
  const duplicate_found = duplicates.length > 0;
  const action = duplicate_found ? "blocked_duplicate" : "create_review";
  const payload = selectKnownColumns({
    title: artifact.title,
    artifact_type: artifact.artifactType,
    status: "review",
    scope: artifact.scope,
    summary: artifact.summary,
    content: artifact.content,
    tags: artifact.tags,
    metadata: artifact.metadata,
    version: 1,
  }, columns);

  return {
    slug: artifact.slug,
    title: artifact.title,
    original_type: artifact.originalType,
    artifact_type: artifact.artifactType,
    domain: artifact.scope,
    status_planned: "review",
    duplicate_found,
    duplicate_matches: duplicates,
    action,
    payload,
  };
}

function selectKnownColumns(payload, columns) {
  const selected = {};
  for (const [key, value] of Object.entries(payload)) {
    if (columns.has(key)) selected[key] = value;
  }
  return selected;
}

async function loadTableColumns(table) {
  const rows = await restGet(`/rest/v1/${table}?select=*&limit=1`);
  const fallback = ["title", "artifact_type", "status", "scope", "content", "summary", "tags", "metadata", "version"];
  const fromRows = Array.isArray(rows) && rows[0] ? Object.keys(rows[0]) : fallback;
  return new Set([...fallback, ...fromRows]);
}

async function findDuplicates(artifact) {
  const matches = [];
  const titleRows = await restGet(`/rest/v1/hermione_artifacts?${new URLSearchParams({
    select: "id,title,status,artifact_type,scope,summary,metadata",
    title: `eq.${artifact.title}`,
    limit: "10",
  }).toString()}`);
  for (const row of asArray(titleRows)) matches.push({ reason: "title", ...compactMatch(row) });

  const slugRows = await restGet(`/rest/v1/hermione_artifacts?${new URLSearchParams({
    select: "id,title,status,artifact_type,scope,summary,metadata",
    "metadata->>slug": `eq.${artifact.slug}`,
    limit: "10",
  }).toString()}`);
  for (const row of asArray(slugRows)) matches.push({ reason: "slug", ...compactMatch(row) });

  const phrase = artifact.summary.slice(0, 80).replace(/[,%]/g, " ").trim();
  if (phrase.length >= 24) {
    const phraseRows = await restGet(`/rest/v1/hermione_artifacts?${new URLSearchParams({
      select: "id,title,status,artifact_type,scope,summary,metadata",
      or: `(summary.ilike.*${phrase}*,content.ilike.*${phrase}*)`,
      limit: "10",
    }).toString()}`);
    for (const row of asArray(phraseRows)) matches.push({ reason: "summary_phrase", ...compactMatch(row) });
  }

  return uniqueMatches(matches);
}

function compactMatch(row) {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    artifact_type: row.artifact_type,
    scope: row.scope,
  };
}

function uniqueMatches(matches) {
  const seen = new Set();
  const unique = [];
  for (const match of matches) {
    const key = `${match.reason}:${match.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(match);
  }
  return unique;
}

function printPlan(plans) {
  console.log("\nPlan:");
  console.log("slug\ttitle\ttype\tmapped_type\tdomain\tstatus_planned\tduplicate\taction");
  for (const plan of plans) {
    console.log([
      plan.slug,
      clean(plan.title),
      plan.original_type,
      plan.artifact_type,
      plan.domain,
      plan.status_planned,
      plan.duplicate_found ? "sim" : "não",
      plan.action,
    ].join("\t"));
    for (const match of plan.duplicate_matches) {
      console.log(`  duplicate\t${match.reason}\t${match.id}\t${match.status}\t${clean(match.title)}`);
    }
  }
}

async function insertArtifact(payload) {
  const rows = await restPost("/rest/v1/hermione_artifacts", payload);
  if (Array.isArray(rows) && rows[0]) return rows[0];
  throw new Error("Insert em hermione_artifacts não retornou representação.");
}

function readOption(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  return args[index + 1] || fallback;
}

function usage(exitCode) {
  console.log(`Uso:\n  node scripts/import-hermione-governance-artifacts.mjs --dry-run --file /path/artifacts.json\n  node scripts/import-hermione-governance-artifacts.mjs --apply --file /path/artifacts.json`);
  process.exit(exitCode);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function sha256(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

function clean(value) {
  return String(value || "").replace(/[\t\r\n]+/g, " ").trim();
}

async function restGet(path) {
  const response = await fetch(`${SUPABASE_URL}${path}`, { headers: restHeaders() });
  return parseRest(response);
}

async function restPost(path, payload) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: "POST",
    headers: { ...restHeaders(), Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
  return parseRest(response);
}

function restHeaders() {
  return {
    apikey: SERVICE_KEY,
    authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };
}

async function parseRest(response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || payload?.error || `Supabase REST ${response.status}`);
  return payload;
}

function fail(message, exitCode = 1) {
  console.error(`Erro: ${message}`);
  process.exit(exitCode);
}
