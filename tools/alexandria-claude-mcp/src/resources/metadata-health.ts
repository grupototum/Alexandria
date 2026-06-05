import type { Config } from "../config.js";
import { loadHealthMetrics } from "../data/load-artifacts.js";
import type { ResourceContent } from "./metadata-agents.js";

export const METADATA_HEALTH_URI = "alexandria://metadata/health";

/**
 * RESOURCE `alexandria://metadata/health`
 * Feed do `AGENT_HEALTH_METRICS.json` — targets de SLA + resource metrics
 * por agente. Lido por `log_agent_metrics` para comparar execução real
 * contra alvo, e exposto aqui pra agentes/dashboards consultarem.
 */
export async function readMetadataHealth(config: Config): Promise<ResourceContent> {
  const health = await loadHealthMetrics(config.repoRoot);
  return {
    uri: METADATA_HEALTH_URI,
    mimeType: "application/json",
    text: JSON.stringify(health, null, 2),
  };
}
