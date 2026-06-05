import { z } from "zod";
import type { Config } from "../config.js";
import {
  loadDivisionMapping,
  loadExecutionMatrix,
  loadPromptOrDna,
  type Workflow,
} from "../data/load-artifacts.js";

export const ExecuteAgenticTaskInputSchema = z.object({
  division: z
    .string()
    .min(1)
    .describe("ID ou nome da divisão (ex: 'DIV-001' ou 'Growth & Sales Pipeline')."),
  task_name: z
    .string()
    .min(1)
    .describe("Nome do workflow ou identificador da tarefa (ex: 'workflow_1_lead_intake')."),
  context_query: z
    .string()
    .min(1)
    .describe("Contexto/objetivo da execução, usado para enriquecer o payload retornado."),
});

export type ExecuteAgenticTaskInput = z.infer<typeof ExecuteAgenticTaskInputSchema>;

/** JSON Schema serializável para o handshake `tools/list` do MCP. */
export const EXECUTE_AGENTIC_TASK_JSON_SCHEMA = {
  type: "object",
  required: ["division", "task_name", "context_query"],
  additionalProperties: false,
  properties: {
    division: {
      type: "string",
      minLength: 1,
      description: "ID ou nome da divisão (ex: 'DIV-001' ou 'Growth & Sales Pipeline').",
    },
    task_name: {
      type: "string",
      minLength: 1,
      description: "Nome do workflow ou identificador da tarefa (ex: 'workflow_1_lead_intake').",
    },
    context_query: {
      type: "string",
      minLength: 1,
      description: "Contexto/objetivo da execução, usado para enriquecer o payload retornado.",
    },
  },
} as const;

export interface AgenticTaskPayload {
  division: { id: string; name: string };
  workflow: Workflow;
  context_query: string;
  resolved_agents: Array<{
    agent_id: string;
    sequence: number;
    timeout_s: number;
    required: boolean;
    parallelizable: boolean;
    condition?: string;
    prompt?: { source: "prompt" | "dna"; path: string; content: string };
  }>;
  notes: string[];
}

/**
 * TOOL `execute_agentic_task`
 *
 * NÃO executa. Apenas valida + carrega o payload pronto para um runner
 * externo (Claude/Cursor/n8n) disparar. Validações:
 *   1) `division` precisa existir em AGENT_DIVISION_MAPPING.json
 *   2) `task_name` precisa existir em AGENT_EXECUTION_MATRIX.json
 *   3) Cada agente do workflow precisa estar declarado na divisão indicada
 *      OU em qualquer outra divisão (validamos só existência global aqui;
 *      cross-division é permitido).
 *   4) Para cada agente, tenta resolver prompt em `Prompts/<task>.md` →
 *      fallback `DNAS_39_AGENTES/<agent>.md`.
 */
export async function executeAgenticTask(
  input: ExecuteAgenticTaskInput,
  config: Config,
): Promise<AgenticTaskPayload> {
  const [mapping, matrix] = await Promise.all([
    loadDivisionMapping(config.repoRoot),
    loadExecutionMatrix(config.repoRoot),
  ]);

  // 1) Resolver divisão
  const division = mapping.divisions.find(
    (d) => d.division_id === input.division || d.division_name === input.division,
  );
  if (!division) {
    throw new Error(
      `division '${input.division}' não encontrada em AGENT_DIVISION_MAPPING.json`,
    );
  }

  // 2) Resolver workflow
  const workflow =
    matrix.execution_matrix[input.task_name] ??
    Object.values(matrix.execution_matrix).find(
      (w) => w.workflow_name === input.task_name || w.workflow_id === input.task_name,
    );
  if (!workflow) {
    throw new Error(
      `task_name '${input.task_name}' não encontrada em AGENT_EXECUTION_MATRIX.json`,
    );
  }

  // 3) Validar agentes (existência global) e carregar prompt/dna
  const knownAgentIds = new Set<string>(
    mapping.divisions.flatMap((d) => d.agents.map((a) => a.agent_id)),
  );
  const notes: string[] = [];
  const resolved: AgenticTaskPayload["resolved_agents"] = [];
  for (const step of workflow.agents) {
    if (!knownAgentIds.has(step.agent_id)) {
      throw new Error(
        `agente '${step.agent_id}' do workflow '${workflow.workflow_id}' não consta no mapping`,
      );
    }
    const promptOrDna = await loadPromptOrDna(
      config.repoRoot,
      input.task_name,
      step.agent_id,
    );
    if (!promptOrDna) {
      notes.push(
        `prompt/DNA não encontrado para agent_id='${step.agent_id}' / task_name='${input.task_name}'`,
      );
    }
    resolved.push({
      agent_id: step.agent_id,
      sequence: step.sequence,
      timeout_s: step.timeout_s,
      required: step.required,
      parallelizable: step.parallelizable,
      ...(step.condition !== undefined ? { condition: step.condition } : {}),
      ...(promptOrDna ? { prompt: promptOrDna } : {}),
    });
  }

  return {
    division: { id: division.division_id, name: division.division_name },
    workflow,
    context_query: input.context_query,
    resolved_agents: resolved,
    notes,
  };
}
