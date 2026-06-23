/**
 * useAgentExecutions — leitura de public.agent_executions (M54 PR-4).
 * Contrato: docs/API_ALEXANDRIA_CONTRACT.md v3 (ancorado no DB ao vivo).
 *  - status: pending | running | success | error (CHECK constraint)
 *  - duration_ms / total_tokens / total_cost são COLUNAS DEDICADAS
 *  - jsonb chama-se `context` (não metadata); campos virtuais: model,
 *    retry_count, context_tokens
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ExecutionStatus } from '@/types/status';

export interface AgentExecution {
  id: string;
  executionId: string;
  agentId: string;
  status: ExecutionStatus;
  inputData: string | null;
  outputData: unknown;
  errorMessage: string | null;
  durationMs: number | null;
  totalTokens: number | null;
  totalCost: number | null;
  createdAt: string | null;
  // virtuais do jsonb `context` (§1.2 do contract)
  model: string | null;
  retryCount: number | null;
  contextTokens: number | null;
}

const STATUSES: ExecutionStatus[] = ['pending', 'running', 'success', 'error'];

function normalizeStatus(status: string | null): ExecutionStatus {
  return STATUSES.includes(status as ExecutionStatus) ? (status as ExecutionStatus) : 'pending';
}

interface ExecutionRow {
  id: string;
  execution_id: string;
  agent_id: string;
  status: string | null;
  input_data: string | null;
  output_data: unknown;
  error_message: string | null;
  duration_ms: number | null;
  total_tokens: number | null;
  total_cost: number | null;
  context: Record<string, unknown> | null;
  created_at: string | null;
}

function mapRow(row: ExecutionRow): AgentExecution {
  const context = row.context || {};
  return {
    id: row.id,
    executionId: row.execution_id,
    agentId: row.agent_id,
    status: normalizeStatus(row.status),
    inputData: row.input_data,
    outputData: row.output_data,
    errorMessage: row.error_message,
    durationMs: row.duration_ms,
    totalTokens: row.total_tokens,
    totalCost: row.total_cost,
    createdAt: row.created_at,
    model: typeof context.model === 'string' ? context.model : null,
    retryCount: typeof context.retry_count === 'number' ? context.retry_count : null,
    contextTokens: typeof context.context_tokens === 'number' ? context.context_tokens : null,
  };
}

/**
 * agent_executions.agent_id é text (id lógico) — buscamos por todos os
 * identificadores conhecidos do agente (uuid do mirror + slug).
 */
export const useAgentExecutions = (agentIds: string[], limit = 50) => {
  const [executions, setExecutions] = useState<AgentExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const ids = agentIds.filter(Boolean);
  const idsKey = ids.join(',');

  const load = useCallback(async () => {
    if (!idsKey) {
      setExecutions([]);
      setIsLoading(false);
      return;
    }
    try {
      setError(null);
      const { data, error: queryError } = await (supabase as any)
        .from('agent_executions')
        .select(
          'id,execution_id,agent_id,status,input_data,output_data,error_message,duration_ms,total_tokens,total_cost,context,created_at',
        )
        .in('agent_id', idsKey.split(','))
        .order('created_at', { ascending: false })
        .limit(limit);

      if (queryError) throw new Error(queryError.message || 'Erro ao carregar execuções.');
      setExecutions(((data || []) as ExecutionRow[]).map(mapRow));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar execuções.'));
    } finally {
      setIsLoading(false);
    }
  }, [idsKey, limit]);

  useEffect(() => {
    void load();
  }, [load]);

  return { executions, isLoading, error, refetch: load };
};
