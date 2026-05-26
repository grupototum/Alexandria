#!/usr/bin/env node

/**
 * Alexandria CLI
 * Universal terminal client for Totum's Alexandria context layer.
 *
 * Env:
 *   ALEXANDRIA_MCP_URL=https://.../functions/v1/alexandria-mcp
 *   ALEXANDRIA_MCP_TOKEN=...
 */

const DEFAULT_URL = "https://cgpkfhrqprqptvehatad.supabase.co/functions/v1/alexandria-mcp";

const ALEXANDRIA_MCP_URL = process.env.ALEXANDRIA_MCP_URL || DEFAULT_URL;
const ALEXANDRIA_MCP_TOKEN = process.env.ALEXANDRIA_MCP_TOKEN || process.env.ALEXANDRIA_TOKEN || "";

const args = process.argv.slice(2);
const command = args[0];

function usage(exitCode = 0) {
  const text = `Alexandria CLI — camada universal de contexto da Totum

Uso:
  alexandria search "termo" [--limit 8] [--type pop]
  alexandria context "tarefa" [--agent pepper] [--domain agentes_ia] [--limit 6]
  alexandria get <artifact-id>
  alexandria manifest

Variáveis:
  ALEXANDRIA_MCP_URL     URL da edge function alexandria-mcp
  ALEXANDRIA_MCP_TOKEN   Token de leitura da Alexandria

Exemplos:
  alexandria search "POP de SDR"
  alexandria context "criar campanha para cliente odontológico" --agent pepper
  alexandria get 00000000-0000-0000-0000-000000000000
`;
  console.log(text);
  process.exit(exitCode);
}

function parseOptions(argv) {
  const options = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) {
      options._.push(item);
      continue;
    }
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      options[key] = true;
      continue;
    }
    options[key] = next;
    i += 1;
  }
  return options;
}

function requireToken() {
  if (!ALEXANDRIA_MCP_TOKEN) {
    console.error("Erro: defina ALEXANDRIA_MCP_TOKEN ou ALEXANDRIA_TOKEN no ambiente.");
    process.exit(2);
  }
}

async function request(body, { tokenRequired = true } = {}) {
  if (tokenRequired) requireToken();

  const headers = { "Content-Type": "application/json" };
  if (ALEXANDRIA_MCP_TOKEN) headers["x-alexandria-token"] = ALEXANDRIA_MCP_TOKEN;

  const response = await fetch(ALEXANDRIA_MCP_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Alexandria HTTP ${response.status}`);
  }
  return payload;
}

function print(payload, preferMarkdown = false) {
  if (preferMarkdown && payload?.markdown) {
    console.log(payload.markdown);
    return;
  }
  console.log(JSON.stringify(payload, null, 2));
}

async function main() {
  if (!command || command === "help" || command === "--help" || command === "-h") usage(0);

  if (command === "manifest") {
    const response = await fetch(ALEXANDRIA_MCP_URL, { method: "GET" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Alexandria HTTP ${response.status}`);
    print(payload);
    return;
  }

  const options = parseOptions(args.slice(1));

  if (command === "search") {
    const query = options._.join(" ").trim();
    if (!query) usage(1);
    const payload = await request({
      action: "search",
      query,
      artifactType: options.type,
      limit: Number(options.limit || 8),
      agent: options.agent,
      domain: options.domain,
    });
    print(payload);
    return;
  }

  if (command === "context" || command === "context-pack") {
    const query = options._.join(" ").trim();
    if (!query) usage(1);
    const payload = await request({
      action: "context_pack",
      query,
      agent: options.agent || "terminal",
      domain: options.domain,
      limit: Number(options.limit || 6),
    });
    print(payload, true);
    return;
  }

  if (command === "get") {
    const artifactId = options._[0];
    if (!artifactId) usage(1);
    const payload = await request({ action: "get_artifact", artifactId });
    print(payload);
    return;
  }

  usage(1);
}

main().catch((error) => {
  console.error(`Erro: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
