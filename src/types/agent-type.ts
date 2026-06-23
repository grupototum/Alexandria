/**
 * Tipo de agente — D-052 (M54 PR-2)
 * 5 categorias canônicas. Fonte de verdade no DB: agents_config.metadata.type
 * (backfill em supabase/migrations/20260610050000_backfill_agents_config_metadata_type.sql).
 * Enquanto a migration não for aplicada, inferAgentType() espelha a mesma heurística
 * no client como fallback — manter as duas em sincronia.
 */

export const AGENT_TYPES = [
  'pesquisador',
  'criativo',
  'consultivo',
  'execucao',
  'orquestrador',
] as const;

export type AgentType = (typeof AGENT_TYPES)[number];

export const AGENT_TYPE_LABELS: Record<AgentType, string> = {
  pesquisador: 'Pesquisador',
  criativo: 'Criativo',
  consultivo: 'Consultivo',
  execucao: 'Execução',
  orquestrador: 'Orquestrador',
};

export const AGENT_TYPE_ICONS: Record<AgentType, string> = {
  pesquisador: 'solar:magnifer-linear',
  criativo: 'solar:palette-linear',
  consultivo: 'solar:chat-square-like-linear',
  execucao: 'solar:bolt-linear',
  orquestrador: 'solar:crown-linear',
};

export function isAgentType(value: unknown): value is AgentType {
  return typeof value === 'string' && (AGENT_TYPES as readonly string[]).includes(value);
}

export interface AgentTypeInferenceInput {
  name: string;
  role?: string | null;
  description?: string | null;
  tier?: number | null;
  isOrchestrator?: boolean | null;
}

/** Heurística client-side — espelha a ordem e os padrões da migration de backfill. */
export function inferAgentType(input: AgentTypeInferenceInput): AgentType {
  const haystack = [input.name, input.role, input.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (input.isOrchestrator || input.tier === 1 || /(orquestr|orchestr|maestro)/.test(haystack)) {
    return 'orquestrador';
  }
  if (/(pesquis|research|anali|radar|monitor|scout|data|seo)/.test(haystack)) {
    return 'pesquisador';
  }
  if (/(criat|creative|design|copy|video|roteir|content|social|imagem|arte)/.test(haystack)) {
    return 'criativo';
  }
  if (/(consult|estrateg|advis|mentor|planej|hermione)/.test(haystack)) {
    return 'consultivo';
  }
  return 'execucao';
}

/** metadata.type do DB vence; heurística só quando ausente/inválido. */
export function resolveAgentType(
  metadata: Record<string, unknown> | null | undefined,
  fallback: AgentTypeInferenceInput,
): AgentType {
  const fromDb = metadata?.type;
  if (isAgentType(fromDb)) return fromDb;
  return inferAgentType(fallback);
}
