#!/usr/bin/env node

/**
 * Hermione artifact curation helper.
 *
 * Safe by default: dry-run only unless --apply is explicitly passed.
 * Requires explicit --approve-ids and refuses to touch non-review artifacts.
 * Never prints Supabase secrets.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const DRY_RUN = args.includes("--dry-run") || !APPLY;
const APPROVE_IDS = parseIds(readOption("--approve-ids", ""));

if (args.includes("--help") || args.includes("-h")) {
  usage(0);
}

if (APPLY && args.includes("--dry-run")) {
  fail("Use apenas um modo: --dry-run ou --apply.");
}

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.log(`SUPABASE_URL=${SUPABASE_URL ? "presente" : "ausente"}`);
  console.log(`SERVICE_KEY=${SERVICE_KEY ? "presente" : "ausente"}`);
  fail("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY/SUPABASE_SERVICE_KEY.", 2);
}

if (APPROVE_IDS.length === 0) {
  usage(1);
}

await main();

async function main() {
  console.log("Hermione artifact curation");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "APPLY"}`);
  console.log(`SUPABASE_URL=${SUPABASE_URL ? "presente" : "ausente"}`);
  console.log(`SERVICE_KEY=${SERVICE_KEY ? "presente" : "ausente"}`);
  console.log(`Requested IDs: ${APPROVE_IDS.length}`);

  const rows = await fetchArtifactsByIds(APPROVE_IDS);
  const byId = new Map(rows.map((row) => [row.id, row]));
  const missing = APPROVE_IDS.filter((id) => !byId.has(id));
  const nonReview = rows.filter((row) => row.status !== "review");

  if (missing.length > 0) {
    console.log("Missing IDs:");
    for (const id of missing) console.log(`- ${id}`);
  }

  if (nonReview.length > 0) {
    console.log("Non-review artifacts:");
    for (const row of nonReview) {
      console.log(`- ${row.id} status=${row.status} title=${row.title}`);
    }
  }

  printPlan(rows, missing, nonReview);

  if (missing.length > 0 || nonReview.length > 0) {
    fail("Dry-run bloqueado: todos os IDs precisam existir e estar em review.", 3);
  }

  if (DRY_RUN) {
    console.log("Nenhum dado foi alterado. Reexecute com --apply para promover os IDs validados.");
    return;
  }

  const updated = await approveArtifacts(APPROVE_IDS);
  console.log(`Artifacts promoted: ${updated.length}`);
  for (const row of updated) {
    console.log(`approved\t${row.id}\t${row.title}`);
  }
}

function readOption(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  return args[index + 1] || fallback;
}

function parseIds(value) {
  return unique(String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean));
}

function unique(values) {
  return Array.from(new Set(values));
}

function usage(exitCode) {
  console.log(`Uso:
  node scripts/curate-hermione-artifacts.mjs --dry-run --approve-ids id1,id2
  node scripts/curate-hermione-artifacts.mjs --apply --approve-ids id1,id2

Ambiente:
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_SERVICE_KEY
`);
  process.exit(exitCode);
}

async function fetchArtifactsByIds(ids) {
  const params = new URLSearchParams({
    select: "id,title,artifact_type,status,scope,summary,tags,metadata,created_at,updated_at",
    id: `in.(${ids.join(",")})`,
  });
  const rows = await restGet(`/rest/v1/hermione_artifacts?${params.toString()}`);
  if (!Array.isArray(rows)) return [];
  const order = new Map(ids.map((id, index) => [id, index]));
  return rows.toSorted((a, b) => (order.get(a.id) ?? 9999) - (order.get(b.id) ?? 9999));
}

async function approveArtifacts(ids) {
  const params = new URLSearchParams({
    id: `in.(${ids.join(",")})`,
    select: "id,title,status",
  });
  const payload = {
    status: "approved",
    updated_at: new Date().toISOString(),
  };
  const rows = await restPatch(`/rest/v1/hermione_artifacts?${params.toString()}`, payload);
  return Array.isArray(rows) ? rows : [];
}

function printPlan(rows, missing, nonReview) {
  console.log("\nPlan:");
  console.log("id\ttitle\ttype\tstatus_atual\taction");
  const blocked = new Set([...missing, ...nonReview.map((row) => row.id)]);
  for (const row of rows) {
    const action = blocked.has(row.id) ? "blocked" : "approve";
    console.log(`${row.id}\t${sanitize(row.title)}\t${row.artifact_type || ""}\t${row.status || ""}\t${action}`);
  }
}

function sanitize(value) {
  return String(value || "").replace(/[\t\r\n]+/g, " ").trim();
}

async function restGet(path) {
  const response = await fetch(`${SUPABASE_URL}${path}`, { headers: restHeaders() });
  return parseRest(response);
}

async function restPatch(path, payload) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: "PATCH",
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

function fail(message, exitCode = 1) {
  console.error(`Erro: ${message}`);
  process.exit(exitCode);
}
