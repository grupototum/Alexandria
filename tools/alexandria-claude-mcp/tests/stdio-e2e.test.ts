import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(PKG_ROOT, "..", "..");

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: unknown;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: number;
  result?: unknown;
  error?: { code: number; message: string };
}

/**
 * Spawn o servidor MCP via Stdio e troca um conjunto de JSON-RPC. Não usa
 * o transporte real do SDK — fala JSON-RPC direto pelo pipe stdio, que
 * é exatamente o que um cliente MCP (Claude Desktop, Cursor, etc.) faz.
 *
 * Roda via `tsx` (já dev dep) — sem precisar de build prévio.
 */
async function rpcRound(messages: JsonRpcRequest[]): Promise<JsonRpcResponse[]> {
  const tsxBin = path.join(PKG_ROOT, "node_modules", ".bin", "tsx");
  const child = spawn(
    tsxBin,
    [path.join(PKG_ROOT, "src", "index.ts")],
    {
      env: {
        ...process.env,
        MCP_TRANSPORT: "stdio",
        REPO_ROOT,
        SUPABASE_URL: "https://stub.invalid",
        SUPABASE_SERVICE_ROLE_KEY: "stub",
        KEYCLOAK_BYPASS: "true",
        LOG_LEVEL: "fatal",
        EMBEDDING_PROVIDER: "stub",
      },
      stdio: ["pipe", "pipe", "pipe"],
    },
  );

  const responses: JsonRpcResponse[] = [];
  let buffer = "";
  const expected = messages.length;

  const done = new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("rpcRound timeout")), 15_000);
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          responses.push(JSON.parse(line) as JsonRpcResponse);
        } catch {
          // ignora linhas não-JSON (não esperado, mas defensivo)
        }
      }
      if (responses.length >= expected) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.on("error", reject);
    child.on("exit", () => {
      // Resolve mesmo se acabar antes — o test asserta tamanho depois.
      clearTimeout(timer);
      resolve();
    });
  });

  for (const msg of messages) {
    child.stdin.write(`${JSON.stringify(msg)}\n`);
  }

  await done;
  child.kill("SIGTERM");
  return responses;
}

describe("E2E stdio — MCP smoke", () => {
  it("initialize → tools/list → resources/list", async () => {
    const responses = await rpcRound([
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "vitest-smoke", version: "0.0.0" },
        },
      },
      { jsonrpc: "2.0", id: 2, method: "tools/list" },
      { jsonrpc: "2.0", id: 3, method: "resources/list" },
    ]);

    const byId = new Map(responses.map((r) => [r.id, r]));
    const init = byId.get(1);
    const tools = byId.get(2);
    const resources = byId.get(3);

    expect(init?.result).toMatchObject({
      serverInfo: { name: "alexandria", version: "0.2.0" },
    });
    const toolNames = (tools?.result as { tools: Array<{ name: string }> } | undefined)
      ?.tools.map((t) => t.name);
    expect(toolNames).toEqual(
      expect.arrayContaining([
        "execute_agentic_task",
        "log_agent_metrics",
        "alexandria_search",
        "alexandria_get_artifact",
        "alexandria_context_pack",
      ]),
    );
    const resourceUris = (
      resources?.result as { resources: Array<{ uri: string }> } | undefined
    )?.resources.map((r) => r.uri);
    expect(resourceUris).toEqual(
      expect.arrayContaining([
        "alexandria://metadata/agents",
        "alexandria://metadata/workflows",
        "alexandria://metadata/health",
      ]),
    );
  });

  it("resources/read alexandria://metadata/agents devolve o JSON com 57 agentes", async () => {
    const responses = await rpcRound([
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "vitest-smoke", version: "0.0.0" },
        },
      },
      {
        jsonrpc: "2.0",
        id: 2,
        method: "resources/read",
        params: { uri: "alexandria://metadata/agents" },
      },
    ]);

    const read = responses.find((r) => r.id === 2);
    const contents = (read?.result as { contents: Array<{ text: string }> } | undefined)?.contents;
    expect(contents?.length).toBe(1);
    const parsed = JSON.parse(contents?.[0]?.text ?? "{}") as { total_agents: number };
    expect(parsed.total_agents).toBe(57);
  });

  // Regressão M118: metadata/workflows e metadata/health falhavam em runtime
  // (ZodError) sem nenhum teste exercitar o read. Este teste lê TODOS os
  // resources estáticos de metadata e exige read OK (sem error JSON-RPC).
  it("resources/read de TODOS os metadata estáticos não retorna erro (regressão M118)", async () => {
    const uris = [
      "alexandria://metadata/agents",
      "alexandria://metadata/workflows",
      "alexandria://metadata/health",
    ];
    const responses = await rpcRound([
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "vitest-smoke", version: "0.0.0" },
        },
      },
      ...uris.map((uri, i) => ({
        jsonrpc: "2.0" as const,
        id: i + 2,
        method: "resources/read",
        params: { uri },
      })),
    ]);

    uris.forEach((uri, i) => {
      const r = responses.find((x) => x.id === i + 2);
      expect(r, `sem resposta para ${uri}`).toBeDefined();
      expect(r?.error, `${uri} retornou erro: ${JSON.stringify(r?.error)}`).toBeUndefined();
      const contents = (r?.result as { contents?: Array<{ text: string }> } | undefined)?.contents;
      expect(contents?.length, `${uri} sem contents`).toBe(1);
      // Garante JSON parseável (o bug devolvia 0 bytes / nenhum content).
      expect(() => JSON.parse(contents?.[0]?.text ?? "")).not.toThrow();
    });
  });
});
