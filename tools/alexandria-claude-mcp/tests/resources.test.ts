import { describe, it, expect, beforeEach } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  clearArtifactCache,
  DivisionMappingSchema,
  loadDivisionMapping,
} from "../src/data/load-artifacts.js";
import { readMetadataAgents } from "../src/resources/metadata-agents.js";
import type { Config } from "../src/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// tests/ → tools/alexandria-claude-mcp/ → tools/ → <repo root>
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

function stubConfig(overrides: Partial<Config> = {}): Config {
  return {
    transport: "stdio",
    sse: { host: "127.0.0.1", port: 4317 },
    repoRoot: REPO_ROOT,
    supabase: {
      url: "https://stub.invalid",
      serviceRoleKey: "stub",
      knowledgeThreshold: 0.7,
    },
    keycloak: {
      bypass: true,
      clientMcpReadId: "alexandria-mcp-read",
      clientAdminId: "alexandria-admin",
    },
    legacy: {},
    logLevel: "warn",
    ...overrides,
  } as Config;
}

describe("RESOURCE alexandria://metadata/agents", () => {
  beforeEach(() => clearArtifactCache());

  it("carrega AGENT_DIVISION_MAPPING.json e valida o schema", async () => {
    const mapping = await loadDivisionMapping(REPO_ROOT);
    const parsed = DivisionMappingSchema.parse(mapping);
    expect(parsed.total_agents).toBe(57);
    expect(parsed.total_divisions).toBe(7);
    expect(parsed.divisions.length).toBe(7);
  });

  it("expõe o conteúdo como JSON formatado", async () => {
    const config = stubConfig();
    const content = await readMetadataAgents(config);
    expect(content.uri).toBe("alexandria://metadata/agents");
    expect(content.mimeType).toBe("application/json");
    const parsed = JSON.parse(content.text) as { total_agents: number };
    expect(parsed.total_agents).toBe(57);
  });

  it("snapshot estrutural: divisões e contagem de agentes", async () => {
    const mapping = await loadDivisionMapping(REPO_ROOT);
    const summary = mapping.divisions.map((d) => ({
      id: d.division_id,
      name: d.division_name,
      agents: d.agents.length,
    }));
    expect(summary).toMatchInlineSnapshot(`
      [
        {
          "agents": 11,
          "id": "DIV-001",
          "name": "Growth & Sales Pipeline",
        },
        {
          "agents": 8,
          "id": "DIV-002",
          "name": "Brand & Marketing",
        },
        {
          "agents": 8,
          "id": "DIV-003",
          "name": "Customer Success & Operations",
        },
        {
          "agents": 6,
          "id": "DIV-004",
          "name": "Analytics & Reporting",
        },
        {
          "agents": 3,
          "id": "DIV-005",
          "name": "Integration & APIs",
        },
        {
          "agents": 2,
          "id": "DIV-006",
          "name": "QA & Validation",
        },
        {
          "agents": 1,
          "id": "DIV-007",
          "name": "Future & Innovation",
        },
      ]
    `);
  });
});
