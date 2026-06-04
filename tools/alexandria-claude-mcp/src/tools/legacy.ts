import { z } from "zod";
import type { Config } from "../config.js";

const SearchInputSchema = z.object({
  query: z.string().min(1),
  artifactType: z
    .enum(["skill", "pop", "prompt", "decision", "summary", "document", "context_pack"])
    .optional(),
  limit: z.number().int().positive().max(50).default(8),
});

const GetArtifactInputSchema = z.object({
  artifactId: z.string().min(1),
});

const ContextPackInputSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().positive().max(50).default(6),
});

export const LEGACY_SCHEMAS = {
  alexandria_search: {
    type: "object",
    required: ["query"],
    additionalProperties: false,
    properties: {
      query: { type: "string", minLength: 1 },
      artifactType: {
        type: "string",
        enum: ["skill", "pop", "prompt", "decision", "summary", "document", "context_pack"],
      },
      limit: { type: "integer", minimum: 1, maximum: 50, default: 8 },
    },
  },
  alexandria_get_artifact: {
    type: "object",
    required: ["artifactId"],
    additionalProperties: false,
    properties: { artifactId: { type: "string", minLength: 1 } },
  },
  alexandria_context_pack: {
    type: "object",
    required: ["query"],
    additionalProperties: false,
    properties: {
      query: { type: "string", minLength: 1 },
      limit: { type: "integer", minimum: 1, maximum: 50, default: 6 },
    },
  },
} as const;

/**
 * As 3 tools legadas continuam fazendo proxy HTTP para `ALEXANDRIA_MCP_URL`
 * (compat com o `server.mjs` antigo). Quando a URL não está configurada,
 * lançam erro claro pro chamador entender que só a parte hub do MCP está
 * ativa nesta instância.
 */
async function legacyRequest(body: unknown, config: Config): Promise<unknown> {
  const { alexandriaUrl, alexandriaToken } = config.legacy;
  if (!alexandriaUrl || !alexandriaToken) {
    throw new Error(
      "Tools legadas (alexandria_search / _get_artifact / _context_pack) requerem ALEXANDRIA_MCP_URL + ALEXANDRIA_MCP_TOKEN.",
    );
  }
  const response = await fetch(alexandriaUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-alexandria-token": alexandriaToken,
    },
    body: JSON.stringify(body),
  });
  const payload: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "error" in payload
        ? String((payload as { error?: unknown }).error)
        : `HTTP ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

export async function alexandriaSearch(
  rawArgs: unknown,
  config: Config,
): Promise<unknown> {
  const args = SearchInputSchema.parse(rawArgs);
  return legacyRequest({ action: "search", ...args }, config);
}

export async function alexandriaGetArtifact(
  rawArgs: unknown,
  config: Config,
): Promise<unknown> {
  const args = GetArtifactInputSchema.parse(rawArgs);
  return legacyRequest({ action: "get_artifact", ...args }, config);
}

export async function alexandriaContextPack(
  rawArgs: unknown,
  config: Config,
): Promise<unknown> {
  const args = ContextPackInputSchema.parse(rawArgs);
  return legacyRequest({ action: "context_pack", ...args }, config);
}
