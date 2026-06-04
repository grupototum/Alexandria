import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Schemas Zod alinhados ao formato real dos JSONs no root do repo Alexandria.
// Mantemos `passthrough()` onde o schema é grande para não quebrar caso o
// time adicione campos extras — a validação foca nos campos consumidos.
// ---------------------------------------------------------------------------

const AgentSchema = z
  .object({
    agent_id: z.string(),
    agent_name: z.string(),
    type: z.string(),
    primary_role: z.string(),
    capabilities: z.array(z.string()).default([]),
    timeout_seconds: z.number().int().positive(),
    success_criteria: z.string(),
    fallback_agent: z.string().nullable(),
    slack_channel: z.string(),
    dependencies: z.array(z.string()).default([]),
    parallelizable: z.boolean(),
    sla: z.object({
      success_rate_target: z.number(),
      avg_response_time_ms: z.number(),
      max_tokens: z.number(),
    }),
  })
  .passthrough();

const DivisionSchema = z
  .object({
    division_id: z.string(),
    division_name: z.string(),
    description: z.string(),
    agents: z.array(AgentSchema),
  })
  .passthrough();

export const DivisionMappingSchema = z
  .object({
    project: z.string(),
    timestamp: z.string(),
    total_agents: z.number().int(),
    total_divisions: z.number().int(),
    divisions: z.array(DivisionSchema),
  })
  .passthrough();

export type DivisionMapping = z.infer<typeof DivisionMappingSchema>;
export type Agent = z.infer<typeof AgentSchema>;

const WorkflowStepSchema = z
  .object({
    sequence: z.number().int().positive(),
    agent_id: z.string(),
    timeout_s: z.number().int().positive(),
    required: z.boolean(),
    parallelizable: z.boolean(),
    condition: z.string().optional(),
  })
  .passthrough();

const WorkflowSchema = z
  .object({
    workflow_id: z.string(),
    workflow_name: z.string(),
    trigger: z.string(),
    agents: z.array(WorkflowStepSchema),
    total_duration_s: z.number(),
    parallel_duration_s: z.number().optional(),
    expected_daily_executions: z.number().optional(),
    retry_policy: z.string(),
    sla_target: z.number(),
  })
  .passthrough();

export const ExecutionMatrixSchema = z
  .object({
    title: z.string(),
    total_agents: z.number().int(),
    total_workflows: z.number().int(),
    execution_matrix: z.record(z.string(), WorkflowSchema),
  })
  .passthrough();

export type ExecutionMatrix = z.infer<typeof ExecutionMatrixSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;

export const HealthMetricsSchema = z
  .object({
    title: z.string(),
    total_agents: z.number().int(),
    health_metrics: z.record(z.string(), z.unknown()),
  })
  .passthrough();

export type HealthMetrics = z.infer<typeof HealthMetricsSchema>;

// ---------------------------------------------------------------------------
// Loaders com cache em memória (process-local). Reload manual via clearCache().
// Usamos Map<string, unknown> para conviver com `exactOptionalPropertyTypes`.
// ---------------------------------------------------------------------------

const cache = new Map<string, unknown>();

export function clearArtifactCache(): void {
  cache.clear();
}

async function readJson<S extends z.ZodTypeAny>(
  repoRoot: string,
  filename: string,
  schema: S,
): Promise<z.output<S>> {
  const full = path.join(repoRoot, filename);
  const raw = await readFile(full, "utf8");
  const parsed: unknown = JSON.parse(raw);
  return schema.parse(parsed) as z.output<S>;
}

async function memo<T>(key: string, factory: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit !== undefined) {
    return hit as T;
  }
  const fresh = await factory();
  cache.set(key, fresh);
  return fresh;
}

export function loadDivisionMapping(repoRoot: string): Promise<DivisionMapping> {
  return memo("divisionMapping", () =>
    readJson(repoRoot, "AGENT_DIVISION_MAPPING.json", DivisionMappingSchema),
  );
}

export function loadExecutionMatrix(repoRoot: string): Promise<ExecutionMatrix> {
  return memo("executionMatrix", () =>
    readJson(repoRoot, "AGENT_EXECUTION_MATRIX.json", ExecutionMatrixSchema),
  );
}

export function loadHealthMetrics(repoRoot: string): Promise<HealthMetrics> {
  return memo("healthMetrics", () =>
    readJson(repoRoot, "AGENT_HEALTH_METRICS.json", HealthMetricsSchema),
  );
}

export function loadArchitectureMd(repoRoot: string): Promise<string> {
  return memo("architectureMd", () =>
    readFile(path.join(repoRoot, "AGENT_ARCHITECTURE.md"), "utf8"),
  );
}

// ---------------------------------------------------------------------------
// Prompts e DNAs — resolvidos por agent_id / task_name.
// ---------------------------------------------------------------------------

/**
 * Tenta carregar o prompt do `task_name` no diretório `Prompts/`. Se não
 * existir, tenta o DNA do `agent_id` em `DNAS_39_AGENTES/`. Retorna `null`
 * se nenhum arquivo for encontrado.
 *
 * Aceita extensão `.md` (canônica) e também sem extensão por conveniência.
 */
export async function loadPromptOrDna(
  repoRoot: string,
  taskName: string,
  agentId: string,
): Promise<{ source: "prompt" | "dna"; path: string; content: string } | null> {
  const candidates: Array<{ source: "prompt" | "dna"; full: string }> = [
    { source: "prompt", full: path.join(repoRoot, "Prompts", `${taskName}.md`) },
    { source: "prompt", full: path.join(repoRoot, "Prompts", taskName) },
    { source: "dna", full: path.join(repoRoot, "DNAS_39_AGENTES", `${agentId}.md`) },
    { source: "dna", full: path.join(repoRoot, "DNAS_39_AGENTES", agentId) },
  ];

  for (const candidate of candidates) {
    try {
      const content = await readFile(candidate.full, "utf8");
      return { source: candidate.source, path: candidate.full, content };
    } catch {
      // tenta o próximo
    }
  }

  return null;
}
