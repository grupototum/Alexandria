import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RagDocument, Skill, Agent, AlexandriaContextData } from '@/types/alexandria';

interface DashboardAgentRow {
  id: string;
  name: string;
  emoji: string | null;
  role: string | null;
  description: string | null;
  status: string | null;
  agent_group?: string | null;
  created_at: string | null;
}

type AlexandriaAgentConfigRow = Agent;
type ListResult<T> = { data: T[] | null; error: { message?: string } | null };

function tierFromGroup(group: string | null): number {
  if (!group) return 2;
  if (group === 'tier1' || group.endsWith('-1')) return 1;
  if (group === 'tier3' || group.endsWith('-3')) return 3;
  return 2;
}

function adaptDashboardAgent(row: DashboardAgentRow): Agent {
  return {
    agent_id: row.id,
    name: row.name,
    emoji: row.emoji || '🤖',
    tier: tierFromGroup(row.agent_group),
    system_prompt: row.description || row.role || '',
    skills: [],
    status: (row.status === 'online' ? 'active' : 'inactive') as Agent['status'],
    created_at: row.created_at,
  };
}

function assertListResult<T>(result: ListResult<T>, label: string): T[] {
  if (result.error) {
    throw new Error(result.error.message || `Erro ao carregar ${label}.`);
  }

  return result.data || [];
}

export const useAlexandria = () => {
  const [data, setData] = useState<AlexandriaContextData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadAlexandriaData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [documentsRes, skillsRes, configRes, dashRes] = await Promise.all([
        (supabase as any).from('rag_documents').select('*').order('created_at', { ascending: false }),
        (supabase as any).from('skills').select('*').eq('status', 'active').order('name'),
        (supabase as any).from('agents_config').select('*').order('name'),
        (supabase as any).from('agents').select('id,name,emoji,role,description,status,category,agent_group,slug,created_at').order('name'),
      ]) as [
        ListResult<RagDocument>,
        ListResult<Skill>,
        ListResult<AlexandriaAgentConfigRow>,
        ListResult<DashboardAgentRow>,
      ];

      const documents = assertListResult(documentsRes, 'documentos RAG');
      const skills = assertListResult(skillsRes, 'skills');
      const configAgents = assertListResult(configRes, 'configurações de agentes');
      const dashAgents = assertListResult(dashRes, 'agentes do dashboard');

      // Merge: dashboard agents not already in agents_config (matched by id)
      const configIds = new Set(configAgents.map((agent) => agent.agent_id));
      const merged: Agent[] = [
        ...configAgents,
        ...dashAgents.filter((agent) => !configIds.has(agent.id)).map(adaptDashboardAgent),
      ];

      const stats = {
        totalDocuments: documents.length,
        totalSkills: skills.length,
        totalAgents:    merged.length,
        activeAgents: merged.filter((agent) => agent.status === 'active').length,
      };

      setData({
        documents,
        skills,
        agents:    merged,
        stats,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao carregar dados Alexandria');
      setError(error);
      console.error('Erro ao carregar Alexandria:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAlexandriaData();
  }, [loadAlexandriaData]);

  return { data, isLoading, error, refetch: loadAlexandriaData };
};
