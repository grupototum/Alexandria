import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import type { Config } from "./config.js";
import type { Logger } from "./logger.js";
import {
  METADATA_AGENTS_URI,
  readMetadataAgents,
} from "./resources/metadata-agents.js";
import {
  METADATA_WORKFLOWS_URI,
  readMetadataWorkflows,
} from "./resources/metadata-workflows.js";
import {
  METADATA_HEALTH_URI,
  readMetadataHealth,
} from "./resources/metadata-health.js";
import {
  KNOWLEDGE_SEARCH_URI_BASE,
  KNOWLEDGE_SEARCH_URI_TEMPLATE,
  readKnowledgeSearch,
} from "./resources/knowledge-search.js";
import {
  OPERATIONS_DOCS_URI_BASE,
  OPERATIONS_DOCS_URI_TEMPLATE,
  readOperationsDocs,
} from "./resources/operations-docs.js";
import {
  EXECUTE_AGENTIC_TASK_JSON_SCHEMA,
  ExecuteAgenticTaskInputSchema,
  executeAgenticTask,
} from "./tools/execute-agentic-task.js";
import {
  LOG_AGENT_METRICS_JSON_SCHEMA,
  LogAgentMetricsInputSchema,
  logAgentMetrics,
} from "./tools/log-agent-metrics.js";
import {
  LEGACY_SCHEMAS,
  alexandriaContextPack,
  alexandriaGetArtifact,
  alexandriaSearch,
} from "./tools/legacy.js";

export const SERVER_INFO = {
  name: "alexandria",
  version: "0.2.0",
} as const;

/**
 * Constrói um `Server` MCP com todos os resources + tools registrados.
 * Mesma instância pode ser conectada a múltiplos transportes (Stdio e SSE).
 */
export function buildServer(params: { config: Config; logger: Logger }): Server {
  const { config, logger } = params;

  const server = new Server(
    { name: SERVER_INFO.name, version: SERVER_INFO.version },
    {
      capabilities: {
        resources: { subscribe: false, listChanged: false },
        tools: {},
      },
    },
  );

  // ------------------------- RESOURCES -------------------------------
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [
      {
        uri: METADATA_AGENTS_URI,
        name: "Agent Division Mapping",
        description: "Feed dinâmico de AGENT_DIVISION_MAPPING.json (57 agentes / 7 divisões).",
        mimeType: "application/json",
      },
      {
        uri: METADATA_WORKFLOWS_URI,
        name: "Agent Execution Matrix",
        description:
          "Feed dinâmico de AGENT_EXECUTION_MATRIX.json (20 workflows). Consulte antes de chamar execute_agentic_task.",
        mimeType: "application/json",
      },
      {
        uri: METADATA_HEALTH_URI,
        name: "Agent Health Metrics",
        description:
          "Feed dinâmico de AGENT_HEALTH_METRICS.json (SLA targets e resource budgets por agente).",
        mimeType: "application/json",
      },
    ],
  }));

  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
    resourceTemplates: [
      {
        uriTemplate: KNOWLEDGE_SEARCH_URI_TEMPLATE,
        name: "Alexandria Knowledge Search (giles_knowledge)",
        description:
          "Busca semântica em giles_knowledge (657 chunks, fonte canônica) via RPC match_documents. Embedding 768d gerado client-side. Params: q (obrigatório), limit (opcional, max 50).",
        mimeType: "application/json",
      },
      {
        uriTemplate: OPERATIONS_DOCS_URI_TEMPLATE,
        name: "Alexandria Operations Docs (alexandria_documents)",
        description:
          "Busca semântica em alexandria_documents via search_docs/search_pops/search_skills. Params: type (doc|pop|skill, default doc), q (obrigatório), limit (opcional).",
        mimeType: "application/json",
      },
    ],
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
    const uri = req.params.uri;

    if (uri === METADATA_AGENTS_URI) {
      const content = await readMetadataAgents(config);
      return { contents: [content] };
    }

    if (uri === METADATA_WORKFLOWS_URI) {
      const content = await readMetadataWorkflows(config);
      return { contents: [content] };
    }

    if (uri === METADATA_HEALTH_URI) {
      const content = await readMetadataHealth(config);
      return { contents: [content] };
    }

    if (uri.startsWith(KNOWLEDGE_SEARCH_URI_BASE)) {
      const content = await readKnowledgeSearch({ uri, config, logger });
      return { contents: [content] };
    }

    if (uri.startsWith(OPERATIONS_DOCS_URI_BASE)) {
      const content = await readOperationsDocs({ uri, config, logger });
      return { contents: [content] };
    }

    throw new Error(`unknown resource uri: ${uri}`);
  });

  // -------------------------- TOOLS ----------------------------------
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "execute_agentic_task",
        description:
          "Valida (contra AGENT_EXECUTION_MATRIX.json) e carrega o payload pronto para uma execução agentica. NÃO executa.",
        inputSchema: EXECUTE_AGENTIC_TASK_JSON_SCHEMA,
      },
      {
        name: "log_agent_metrics",
        description:
          "Registra latência, tokens e sucesso de uma execução (append-only) comparando com SLA de AGENT_HEALTH_METRICS.json.",
        inputSchema: LOG_AGENT_METRICS_JSON_SCHEMA,
      },
      {
        name: "alexandria_search",
        description:
          "[legacy] Busca artefatos, skills, POPs, prompts, decisões e pacotes de contexto na Alexandria.",
        inputSchema: LEGACY_SCHEMAS.alexandria_search,
      },
      {
        name: "alexandria_get_artifact",
        description: "[legacy] Carrega um artefato completo pelo ID retornado em alexandria_search.",
        inputSchema: LEGACY_SCHEMAS.alexandria_get_artifact,
      },
      {
        name: "alexandria_context_pack",
        description: "[legacy] Gera um pacote Markdown com artefatos relevantes para uma tarefa.",
        inputSchema: LEGACY_SCHEMAS.alexandria_context_pack,
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const name = req.params.name;
    const args = (req.params.arguments ?? {}) as unknown;
    try {
      switch (name) {
        case "execute_agentic_task": {
          const parsed = ExecuteAgenticTaskInputSchema.parse(args);
          const result = await executeAgenticTask(parsed, config);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }
        case "log_agent_metrics": {
          const parsed = LogAgentMetricsInputSchema.parse(args);
          const result = await logAgentMetrics(parsed, config, logger);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }
        case "alexandria_search": {
          const result = await alexandriaSearch(args, config);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }
        case "alexandria_get_artifact": {
          const result = await alexandriaGetArtifact(args, config);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }
        case "alexandria_context_pack": {
          const result = await alexandriaContextPack(args, config);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }
        default:
          throw new Error(`unknown tool: ${name}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error({ err: message, tool: name }, "tool call failed");
      return {
        isError: true,
        content: [{ type: "text", text: `tool '${name}' failed: ${message}` }],
      };
    }
  });

  return server;
}
