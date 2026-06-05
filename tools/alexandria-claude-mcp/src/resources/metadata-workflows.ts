import type { Config } from "../config.js";
import { loadExecutionMatrix } from "../data/load-artifacts.js";
import type { ResourceContent } from "./metadata-agents.js";

export const METADATA_WORKFLOWS_URI = "alexandria://metadata/workflows";

/**
 * RESOURCE `alexandria://metadata/workflows`
 * Feed do `AGENT_EXECUTION_MATRIX.json` — 20 workflows × 57 agentes.
 * Útil para descoberta antes de chamar `execute_agentic_task`: o agente
 * consulta este resource pra saber quais `task_name` existem e qual a
 * sequência esperada.
 */
export async function readMetadataWorkflows(config: Config): Promise<ResourceContent> {
  const matrix = await loadExecutionMatrix(config.repoRoot);
  return {
    uri: METADATA_WORKFLOWS_URI,
    mimeType: "application/json",
    text: JSON.stringify(matrix, null, 2),
  };
}
