import type { Config } from "../config.js";
import type { Logger } from "../logger.js";

export interface IntrospectionResult {
  active: boolean;
  scope?: string;
  client_id?: string;
  sub?: string;
  exp?: number;
}

export interface AuthVerdict {
  ok: boolean;
  reason?: string;
  scopes: string[];
  clientId?: string;
  bypassed: boolean;
}

/**
 * Verifica um Bearer token via RFC 7662 (OAuth 2.0 Token Introspection)
 * contra o Keycloak. Quando `KEYCLOAK_BYPASS=true`, retorna `ok: true`
 * com `bypassed: true` — útil em desenvolvimento local antes do tunnel
 * `auth.grupototum.com` estar pronto.
 *
 * D-022/D-023: usa client `alexandria-mcp-read` para introspecionar.
 */
export async function verifyBearer(params: {
  bearer: string | undefined;
  requiredScopes: string[];
  config: Config;
  logger: Logger;
}): Promise<AuthVerdict> {
  const { bearer, requiredScopes, config, logger } = params;

  if (config.keycloak.bypass) {
    logger.warn(
      { requiredScopes },
      "KEYCLOAK_BYPASS ativo — autenticação desligada (NÃO USAR EM PROD)",
    );
    return { ok: true, scopes: requiredScopes, bypassed: true };
  }

  if (!bearer) {
    return { ok: false, reason: "missing bearer token", scopes: [], bypassed: false };
  }

  const { introspectUrl, clientMcpReadId, clientMcpReadSecret } = config.keycloak;
  if (!introspectUrl || !clientMcpReadSecret) {
    return {
      ok: false,
      reason: "introspection not configured (KEYCLOAK_INTROSPECT_URL / KC_CLIENT_MCP_READ_SECRET)",
      scopes: [],
      bypassed: false,
    };
  }

  const body = new URLSearchParams({
    token: bearer,
    client_id: clientMcpReadId,
    client_secret: clientMcpReadSecret,
  });

  let result: IntrospectionResult;
  try {
    const response = await fetch(introspectUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!response.ok) {
      return {
        ok: false,
        reason: `introspection http ${response.status}`,
        scopes: [],
        bypassed: false,
      };
    }
    result = (await response.json()) as IntrospectionResult;
  } catch (err) {
    logger.error({ err }, "Keycloak introspection failed");
    return { ok: false, reason: "introspection network error", scopes: [], bypassed: false };
  }

  if (!result.active) {
    return { ok: false, reason: "token inactive", scopes: [], bypassed: false };
  }

  const scopes = (result.scope ?? "").split(/\s+/).filter(Boolean);
  const missing = requiredScopes.filter((s) => !scopes.includes(s));
  if (missing.length > 0) {
    return {
      ok: false,
      reason: `missing scopes: ${missing.join(",")}`,
      scopes,
      bypassed: false,
      ...(result.client_id ? { clientId: result.client_id } : {}),
    };
  }

  return {
    ok: true,
    scopes,
    bypassed: false,
    ...(result.client_id ? { clientId: result.client_id } : {}),
  };
}

export function extractBearer(authHeader: string | undefined): string | undefined {
  if (!authHeader) return undefined;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  return match?.[1];
}
