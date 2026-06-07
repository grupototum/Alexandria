import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { extractBearer, verifyBearer } from "../src/auth/keycloak.js";
import type { Config } from "../src/config.js";
import { createLogger } from "../src/logger.js";

const logger = createLogger("fatal");

function baseConfig(overrides: Partial<Config["keycloak"]> = {}): Config {
  return {
    transport: "stdio",
    sse: { host: "127.0.0.1", port: 4317 },
    repoRoot: "/tmp",
    supabase: {
      url: "https://stub.invalid",
      serviceRoleKey: "stub",
      knowledgeThreshold: 0.7,
    },
    keycloak: {
      bypass: false,
      issuerUrl: "http://127.0.0.1:8180/realms/totum",
      introspectUrl: "http://127.0.0.1:8180/realms/totum/protocol/openid-connect/token/introspect",
      clientMcpReadId: "alexandria-mcp-read",
      clientMcpReadSecret: "secret",
      clientAdminId: "alexandria-admin",
      ...overrides,
    },
    legacy: {},
    logLevel: "fatal",
  } as Config;
}

describe("auth/keycloak — extractBearer", () => {
  it("extrai bearer simples", () => {
    expect(extractBearer("Bearer abc.def")).toBe("abc.def");
  });
  it("aceita case-insensitive", () => {
    expect(extractBearer("bearer XYZ")).toBe("XYZ");
  });
  it("retorna undefined quando vazio", () => {
    expect(extractBearer(undefined)).toBeUndefined();
    expect(extractBearer("Basic foo")).toBeUndefined();
  });
});

describe("auth/keycloak — verifyBearer (bypass)", () => {
  it("retorna ok+bypassed quando KEYCLOAK_BYPASS=true", async () => {
    const verdict = await verifyBearer({
      bearer: undefined,
      requiredScopes: ["alexandria:read"],
      config: baseConfig({ bypass: true }),
      logger,
    });
    expect(verdict.ok).toBe(true);
    expect(verdict.bypassed).toBe(true);
  });
});

describe("auth/keycloak — verifyBearer (introspection)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("rejeita quando bearer ausente", async () => {
    const verdict = await verifyBearer({
      bearer: undefined,
      requiredScopes: ["alexandria:read"],
      config: baseConfig(),
      logger,
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toMatch(/missing bearer/);
  });

  it("aceita token ativo com scope correto", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(
        JSON.stringify({
          active: true,
          scope: "openid alexandria:read",
          client_id: "alexandria-mcp-read",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    ) as unknown as typeof fetch;

    const verdict = await verifyBearer({
      bearer: "valid-token",
      requiredScopes: ["alexandria:read"],
      config: baseConfig(),
      logger,
    });
    expect(verdict.ok).toBe(true);
    expect(verdict.clientId).toBe("alexandria-mcp-read");
  });

  it("rejeita token sem scope necessário", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(
        JSON.stringify({ active: true, scope: "openid", client_id: "x" }),
        { status: 200 },
      ),
    ) as unknown as typeof fetch;

    const verdict = await verifyBearer({
      bearer: "valid",
      requiredScopes: ["alexandria:read"],
      config: baseConfig(),
      logger,
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toMatch(/missing scopes/);
  });

  it("rejeita token inactive", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ active: false }), { status: 200 }),
    ) as unknown as typeof fetch;

    const verdict = await verifyBearer({
      bearer: "expired",
      requiredScopes: ["alexandria:read"],
      config: baseConfig(),
      logger,
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toMatch(/inactive/);
  });

  it("rejeita quando introspection não está configurada (sem URL/secret)", async () => {
    const verdict = await verifyBearer({
      bearer: "any",
      requiredScopes: ["alexandria:read"],
      config: baseConfig({ introspectUrl: undefined, clientMcpReadSecret: undefined }),
      logger,
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toMatch(/not configured/);
  });

  it("rejeita quando o endpoint de introspection responde não-2xx (401)", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response("unauthorized", { status: 401 }),
    ) as unknown as typeof fetch;

    const verdict = await verifyBearer({
      bearer: "tok",
      requiredScopes: ["alexandria:read"],
      config: baseConfig(),
      logger,
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toMatch(/introspection http 401/);
  });

  it("rejeita graciosamente em erro de rede (fetch lança)", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error("ECONNREFUSED");
    }) as unknown as typeof fetch;

    const verdict = await verifyBearer({
      bearer: "tok",
      requiredScopes: ["alexandria:read"],
      config: baseConfig(),
      logger,
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toMatch(/network error/);
  });
});
