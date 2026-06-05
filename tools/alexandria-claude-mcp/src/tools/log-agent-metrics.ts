import { z } from "zod";
import type { Config } from "../config.js";
import type { Logger } from "../logger.js";
import { getSupabase } from "../supabase.js";
import { loadHealthMetrics } from "../data/load-artifacts.js";

export const LogAgentMetricsInputSchema = z.object({
  agent: z.string().min(1).describe("agent_id (ex: 'ARTEMIS')."),
  latency_ms: z.number().int().nonnegative().describe("Latência total da execução em ms."),
  tokens_in: z.number().int().nonnegative().describe("Tokens de entrada consumidos."),
  tokens_out: z.number().int().nonnegative().describe("Tokens de saída gerados."),
  success: z.boolean().describe("Resultado final da execução."),
  workflow_id: z.string().optional().describe("workflow_id correlacionado, se houver."),
  error_message: z.string().optional().describe("Mensagem de erro quando success=false."),
});

export type LogAgentMetricsInput = z.infer<typeof LogAgentMetricsInputSchema>;

export const LOG_AGENT_METRICS_JSON_SCHEMA = {
  type: "object",
  required: ["agent", "latency_ms", "tokens_in", "tokens_out", "success"],
  additionalProperties: false,
  properties: {
    agent: { type: "string", minLength: 1, description: "agent_id (ex: 'ARTEMIS')." },
    latency_ms: { type: "integer", minimum: 0, description: "Latência total em ms." },
    tokens_in: { type: "integer", minimum: 0, description: "Tokens de entrada consumidos." },
    tokens_out: { type: "integer", minimum: 0, description: "Tokens de saída gerados." },
    success: { type: "boolean", description: "Resultado final da execução." },
    workflow_id: { type: "string", description: "workflow_id correlacionado, se houver." },
    error_message: { type: "string", description: "Mensagem de erro quando success=false." },
  },
} as const;

export interface LogAgentMetricsResult {
  recorded: boolean;
  storage: "supabase" | "log-only";
  agent_known: boolean;
  sla: {
    avg_response_time_ms_target: number | null;
    breach_latency: boolean | null;
    max_tokens_target: number | null;
    breach_tokens: boolean | null;
  };
}

/**
 * TOOL `log_agent_metrics`
 *
 * Registra uma execução real no fluxo gerenciado por
 * AGENT_HEALTH_METRICS.json — na prática grava em uma tabela append-only
 * no Supabase (`agent_metrics_log`) e devolve a comparação com o SLA alvo.
 *
 * Quando a tabela não existe ou Supabase está em modo stub, faz `log-only`
 * (escreve no logger sem persistir) para não bloquear o agente.
 */
export async function logAgentMetrics(
  input: LogAgentMetricsInput,
  config: Config,
  logger: Logger,
): Promise<LogAgentMetricsResult> {
  const health = await loadHealthMetrics(config.repoRoot);
  const entry = health.health_metrics[input.agent] as
    | { sla_metrics?: { avg_response_time_ms?: number }; resource_metrics?: { max_tokens_per_exec?: number } }
    | undefined;

  const avgTarget = entry?.sla_metrics?.avg_response_time_ms ?? null;
  const maxTokens = entry?.resource_metrics?.max_tokens_per_exec ?? null;
  const totalTokens = input.tokens_in + input.tokens_out;

  const sla: LogAgentMetricsResult["sla"] = {
    avg_response_time_ms_target: avgTarget,
    breach_latency: avgTarget === null ? null : input.latency_ms > avgTarget,
    max_tokens_target: maxTokens,
    breach_tokens: maxTokens === null ? null : totalTokens > maxTokens,
  };

  // Tenta persistir no Supabase
  try {
    const supabase = getSupabase(config);
    const insert = await supabase.from("agent_metrics_log").insert({
      agent_id: input.agent,
      latency_ms: input.latency_ms,
      tokens_in: input.tokens_in,
      tokens_out: input.tokens_out,
      success: input.success,
      workflow_id: input.workflow_id ?? null,
      error_message: input.error_message ?? null,
      breach_latency: sla.breach_latency,
      breach_tokens: sla.breach_tokens,
      recorded_at: new Date().toISOString(),
    });
    if (!insert.error) {
      return {
        recorded: true,
        storage: "supabase",
        agent_known: Boolean(entry),
        sla,
      };
    }
    logger.warn(
      { err: insert.error.message, agent: input.agent },
      "agent_metrics_log insert falhou — caindo para log-only",
    );
  } catch (err) {
    logger.warn({ err, agent: input.agent }, "supabase indisponível — log-only");
  }

  logger.info({ event: "agent_metrics", input, sla }, "metric (log-only)");
  return { recorded: false, storage: "log-only", agent_known: Boolean(entry), sla };
}
