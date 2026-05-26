#!/usr/bin/env node

/**
 * Safe migration mirror: giles_knowledge -> hermione_*.
 *
 * Default mode is DRY RUN. Use --apply to write.
 * This script never deletes or updates giles_knowledge.
 * New artifacts are created as status=review so Hermione can approve them.
 *
 * Required env:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY
 *
 * Usage:
 *   node scripts/migrate-giles-to-hermione.mjs --limit 20
 *   node scripts/migrate-giles-to-hermione.mjs --apply --limit 200
 */

import crypto from "node:crypto";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const LIMIT = Number(readOption("--limit", "50"));
const OFFSET = Number(readOption("--offset", "0"));
const DEFAULT_AUTHOR = readOption("--author", "Alexandria Migration");
const DEFAULT_ORIGIN = readOption("--origin", "giles_knowledge");

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Erro: defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY/SUPABASE_SERVICE_KEY.");
  process.exit(2);
}

function readOption(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  return args[index + 1] || fallback;
}

async function main() {
  console.log(`Alexandria migration: giles_knowledge -> hermione_*`);
  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN"}`);
  console.log(`Limit: ${LIMIT}, Offset: ${OFFSET}`);

  const rows = await restGet(`/rest/v1/giles_knowledge?${new URLSearchParams({
    select: "*",
    order: "created_at.asc",
    limit: String(Math.max(1, Math.min(LIMIT, 500))),
    offset: String(Math.max(0, OFFSET)),
  }).toString()}`);

  if (!Array.isArray(rows) || rows.length === 0) {
    console.log("Nenhum registro encontrado em giles_knowledge para este recorte.");
    return;
  }

  const stats = {
    scanned: rows.length,
    skipped_empty: 0,
    skipped_duplicate_source: 0,
    planned: 0,
    sources_created: 0,
    artifacts_created: 0,
    links_created: 0,
    errors: 0,
  };

  for (const row of rows) {
    try {
      const normalized = normalizeGilesRow(row);
      if (!normalized.content) {
        stats.skipped_empty += 1;
        continue;
      }

      const sourceHash = sha256(normalized.content);
      const existingSource = await findSourceByHash(sourceHash);
      if (existingSource) {
        stats.skipped_duplicate_source += 1;
        continue;
      }

      stats.planned += 1;

      if (!APPLY) {
        console.log(`[dry-run] ${normalized.title} (${normalized.artifactType}) tags=${normalized.tags.join(",")}`);
        continue;
      }

      const source = await createSource(normalized, sourceHash);
      stats.sources_created += 1;

      const artifact = await createArtifact(normalized, sourceHash, row);
      stats.artifacts_created += 1;

      await createArtifactSourceLink(artifact.id, source.id);
      stats.links_created += 1;

      console.log(`[created] ${artifact.id} ${artifact.title}`);
    } catch (error) {
      stats.errors += 1;
      console.error(`[error] ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log(JSON.stringify(stats, null, 2));
  if (!APPLY) {
    console.log("Dry-run concluído. Reexecute com --apply para gravar.");
  }
}

function normalizeGilesRow(row) {
  const content = String(
    row.content || row.text || row.chunk || row.markdown || row.body || row.raw_content || ""
  ).trim();

  const sourceFile = String(
    row.source_file ||
    row.file_name ||
    row.source ||
    row.metadata?.source_file ||
    row.doc_id ||
    row.hierarchical_path ||
    row.title ||
    row.id ||
    "giles_knowledge"
  );
  const domain = cleanToken(row.dominio || row.domain || row.scope || "knowledge");
  const category = cleanToken(row.categoria || row.category || "document");
  const subcategory = cleanToken(row.subcategoria || row.subcategory || "");
  const title = titleFromRow(row, sourceFile, category);
  const tags = unique([
    ...asArray(row.tags),
    ...asArray(row.keywords),
    domain,
    category,
    subcategory,
  ].filter(Boolean)).slice(0, 20);

  return {
    title,
    fileName: sourceFile,
    content,
    origin: DEFAULT_ORIGIN,
    author: row.autor || row.author || DEFAULT_AUTHOR,
    sourceType: row.source_type || "giles_knowledge",
    artifactType: inferArtifactType(row, category, content),
    scope: domain,
    summary: summarize(content),
    tags,
    metadata: {
      migrated_from: "giles_knowledge",
      source_row_id: row.id || null,
      source_file: sourceFile,
      domain,
      category,
      subcategory: subcategory || null,
      confidence: row.confianca ?? row.confidence ?? null,
      migrated_at: new Date().toISOString(),
    },
  };
}

function titleFromRow(row, sourceFile, category) {
  const hierarchyTitle = Array.isArray(row.metadata?.hierarchy)
    ? row.metadata.hierarchy.filter(Boolean).join(" > ")
    : "";
  const explicit =
    row.title ||
    row.titulo ||
    row.name ||
    row.nome ||
    row.hierarchical_path ||
    hierarchyTitle ||
    row.doc_id;
  if (explicit && !isUuidLike(String(explicit))) return String(explicit).slice(0, 140);
  if (row.content && String(row.content).trim().length <= 140) return String(row.content).trim();
  const base = sourceFile.split("/").pop()?.replace(/\.[^.]+$/, "") || category || "Giles Knowledge";
  return base.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 140);
}

function isUuidLike(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim());
}

function inferArtifactType(row, category, content) {
  const values = [row.artifact_type, row.tipo, row.type, category, content.slice(0, 300)].join(" ").toLowerCase();
  if (values.includes("skill")) return "skill";
  if (values.includes("pop") || values.includes("procedimento")) return "pop";
  if (values.includes("prompt")) return "prompt";
  if (values.includes("decis")) return "decision";
  if (values.includes("resumo") || values.includes("summary")) return "summary";
  if (values.includes("context")) return "context_pack";
  return "document";
}

function summarize(content) {
  return content
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
}

function cleanToken(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9_-]+/gi, "_").replace(/^_+|_+$/g, "");
}

function asArray(value) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    return value.split(/[;,]/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function sha256(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

async function findSourceByHash(hash) {
  const params = new URLSearchParams({
    content_hash: `eq.${hash}`,
    select: "id,title,content_hash",
    limit: "1",
  });
  const rows = await restGet(`/rest/v1/hermione_sources?${params.toString()}`);
  return Array.isArray(rows) ? rows[0] : null;
}

async function createSource(normalized, contentHash) {
  const payload = {
    title: normalized.title,
    file_name: normalized.fileName,
    source_type: normalized.sourceType,
    origin: normalized.origin,
    author: normalized.author,
    content: normalized.content,
    content_hash: contentHash,
    detected_type: normalized.artifactType,
    tags: normalized.tags,
    metadata: normalized.metadata,
  };

  const rows = await restPost("/rest/v1/hermione_sources", payload);
  return firstInserted(rows, "hermione_sources");
}

async function createArtifact(normalized, sourceHash, rawRow) {
  const payload = {
    title: normalized.title,
    artifact_type: normalized.artifactType,
    status: "review",
    scope: normalized.scope || "knowledge",
    content: normalized.content,
    summary: normalized.summary,
    tags: normalized.tags,
    metadata: {
      ...normalized.metadata,
      source_hash: sourceHash,
      raw_giles_id: rawRow.id || null,
    },
    version: 1,
  };

  const rows = await restPost("/rest/v1/hermione_artifacts", payload);
  return firstInserted(rows, "hermione_artifacts");
}

async function createArtifactSourceLink(artifactId, sourceId) {
  const payload = {
    artifact_id: artifactId,
    source_id: sourceId,
    contribution_type: "migration_source",
  };
  const rows = await restPost("/rest/v1/hermione_artifact_sources", payload);
  return firstInserted(rows, "hermione_artifact_sources");
}

async function restGet(path) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    headers: restHeaders(),
  });
  return parseRest(response);
}

async function restPost(path, payload) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: "POST",
    headers: {
      ...restHeaders(),
      Prefer: "return=representation",
    },
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
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `Supabase REST ${response.status}`);
  }
  return payload;
}

function firstInserted(rows, table) {
  if (Array.isArray(rows) && rows[0]) return rows[0];
  throw new Error(`Insert em ${table} não retornou representação.`);
}

main().catch((error) => {
  console.error(`Erro fatal: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
