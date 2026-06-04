import { z } from "zod";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Detecta o root do repositório Alexandria. O package vive em
 * `<root>/tools/alexandria-claude-mcp/src` → sobe 3 níveis.
 */
function detectRepoRoot(): string {
  return path.resolve(__dirname, "..", "..", "..");
}

const ConfigSchema = z.object({
  transport: z.enum(["stdio", "sse"]).default("stdio"),
  sse: z.object({
    host: z.string().default("127.0.0.1"),
    port: z.coerce.number().int().positive().default(4317),
  }),
  repoRoot: z.string(),
  supabase: z.object({
    url: z.string().url(),
    serviceRoleKey: z.string().min(1),
    // Threshold cosine pra match_documents/search_docs/etc. (schema doc §4).
    knowledgeThreshold: z.coerce.number().min(0).max(1).default(0.7),
  }),
  keycloak: z.object({
    bypass: z.coerce.boolean().default(false),
    issuerUrl: z.string().url().optional(),
    introspectUrl: z.string().url().optional(),
    clientMcpReadId: z.string().default("alexandria-mcp-read"),
    clientMcpReadSecret: z.string().optional(),
    clientAdminId: z.string().default("alexandria-admin"),
    clientAdminSecret: z.string().optional(),
  }),
  legacy: z.object({
    alexandriaUrl: z.string().optional(),
    alexandriaToken: z.string().optional(),
  }),
  logLevel: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

export type Config = z.infer<typeof ConfigSchema>;

export function loadConfig(): Config {
  const env = process.env;

  // Em modo bypass, Supabase ainda é obrigatório para os RESOURCES,
  // mas permite valores stub para testes locais.
  const rawSupabaseUrl = env.SUPABASE_URL ?? "https://stub.invalid";
  const rawSupabaseKey = env.SUPABASE_SERVICE_ROLE_KEY ?? "stub-service-role-key";

  return ConfigSchema.parse({
    transport: env.MCP_TRANSPORT,
    sse: {
      host: env.MCP_SSE_HOST,
      port: env.MCP_SSE_PORT,
    },
    repoRoot: env.REPO_ROOT ?? detectRepoRoot(),
    supabase: {
      url: rawSupabaseUrl,
      serviceRoleKey: rawSupabaseKey,
      knowledgeThreshold: env.SUPABASE_KNOWLEDGE_THRESHOLD,
    },
    keycloak: {
      bypass: env.KEYCLOAK_BYPASS,
      issuerUrl: env.KEYCLOAK_ISSUER_URL,
      introspectUrl: env.KEYCLOAK_INTROSPECT_URL,
      clientMcpReadId: env.KC_CLIENT_MCP_READ_ID,
      clientMcpReadSecret: env.KC_CLIENT_MCP_READ_SECRET,
      clientAdminId: env.KC_CLIENT_ADMIN_ID,
      clientAdminSecret: env.KC_CLIENT_ADMIN_SECRET,
    },
    legacy: {
      alexandriaUrl: env.ALEXANDRIA_MCP_URL,
      alexandriaToken: env.ALEXANDRIA_MCP_TOKEN,
    },
    logLevel: env.LOG_LEVEL,
  });
}
