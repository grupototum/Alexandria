import type { Config } from "../config.js";
import { loadDivisionMapping } from "../data/load-artifacts.js";

export const METADATA_AGENTS_URI = "alexandria://metadata/agents";

export interface ResourceContent {
  uri: string;
  mimeType: string;
  text: string;
}

/**
 * RESOURCE `alexandria://metadata/agents`
 * Feed dinâmico do arquivo `AGENT_DIVISION_MAPPING.json`. Sempre relê do
 * disco (com cache em memória); para invalidar, chame `clearArtifactCache`.
 *
 * Retorna o JSON re-serializado para garantir formato estável e ordenado.
 */
export async function readMetadataAgents(config: Config): Promise<ResourceContent> {
  const mapping = await loadDivisionMapping(config.repoRoot);
  return {
    uri: METADATA_AGENTS_URI,
    mimeType: "application/json",
    text: JSON.stringify(mapping, null, 2),
  };
}
