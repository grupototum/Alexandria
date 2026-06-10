/**
 * useAgentsGrid — data source do grid de agentes (M54 PR-2).
 * Junta as DUAS tabelas canônicas (mesmo padrão do useAlexandria):
 *  - `agents` (mirror de display): nome, status, emoji, role, description, category
 *  - `agents_config` (config elizaOS): bio/system_prompt, model_override, tier, metadata
 * bio e modelo só existem em agents_config; tipo (D-052) vem de
 * agents_config.metadata.type com fallback de inferência client-side.
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { resolveAgentType, type AgentType } from '@/types/agent-type';
import type { AgentRuntimeStatus } from '@/types/status';

export interface GridAgent {
  id: string;
  name: string;
  emoji: string;
  role: string | null;
  description: string | null;
  status: AgentRuntimeStatus;
  category: string;
  type: AgentType;
  bio: string | null;
  model: string | null;
  tier: number | null;
  isOrchestrator: boolean;
  agentGroup: string | null;
  slug: string | null;
  createdAt: string | null;
}

interface AgentRow {
  id: string;
  name: string;
  emoji: string | null;
  role: string | null;
  description: string | null;
  status: string | null;
  category: string | null;
  agent_group: string | null;
  slug: string | null;
  is_orchestrator?: boolean | null;
  created_at: string | null;
}

interface AgentConfigRow {
  id?: string;
  agent_id: string;
  name: string;
  tier: number | null;
  model_override: string | null;
  system_prompt: string | null;
  metadata: Record<string, unknown> | null;
}

const RUNTIME_STATUSES: AgentRuntimeStatus[] = ['online', 'offline', 'idle', 'error', 'maintenance'];

function normalizeStatus(status: string | null): AgentRuntimeStatus {
  return RUNTIME_STATUSES.includes(status as AgentRuntimeStatus)
    ? (status as AgentRuntimeStatus)
    : 'offline';
}

function mergeAgent(row: AgentRow, config: AgentConfigRow | undefined): GridAgent {
  const isOrchestrator = Boolean(row.is_orchestrator);
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji || '🤖',
    role: row.role,
    description: row.description,
    status: normalizeStatus(row.status),
    category: row.category || 'geral',
    type: resolveAgentType(config?.metadata, {
      name: row.name,
      role: row.role,
      description: row.description,
      tier: config?.tier,
      isOrchestrator,
    }),
    bio: config?.system_prompt || null,
    model: config?.model_override || null,
    tier: config?.tier ?? null,
    isOrchestrator,
    agentGroup: row.agent_group,
    slug: row.slug,
    createdAt: row.created_at,
  };
}

export const useAgentsGrid = () => {
  const [agents, setAgents] = useState<GridAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [agentsRes, configRes] = await Promise.all([
        (supabase as any)
          .from('agents')
          .select('id,name,emoji,role,description,status,category,agent_group,slug,is_orchestrator,created_at')
          .order('name'),
        (supabase as any)
          .from('agents_config')
          .select('id,agent_id,name,tier,model_override,system_prompt,metadata'),
      ]);

      if (agentsRes.error) throw new Error(agentsRes.error.message || 'Erro ao carregar agentes.');
      if (configRes.error) throw new Error(configRes.error.message || 'Erro ao carregar agents_config.');

      const rows = (agentsRes.data || []) as AgentRow[];
      const configs = (configRes.data || []) as AgentConfigRow[];

      // Mirror sync usa o mesmo UUID; agent_id (id lógico) cobre rows antigas
      const byId = new Map<string, AgentConfigRow>();
      for (const config of configs) {
        if (config.id) byId.set(config.id, config);
        byId.set(config.agent_id, config);
      }

      setAgents(rows.map((row) => mergeAgent(row, byId.get(row.id) || (row.slug ? byId.get(row.slug) : undefined))));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar grid de agentes.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();

    const channel = supabase
      .channel('agents-grid')
      .on('postgres_changes' as never, { event: '*', schema: 'public', table: 'agents' }, () => {
        void load();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return { agents, isLoading, error, refetch: load };
};
