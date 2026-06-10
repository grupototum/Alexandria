/**
 * ConsoleAdaptativo — dispatcher do Console por tipo de agente (M54 PR-4).
 * Resolve o tipo D-052 do agente (metadata.type no DB via grid, ou inferência
 * client-side como fallback) e renderiza o Console{Tipo} correspondente.
 */
import type { Agent } from '@/hooks/useAgents';
import { inferAgentType, isAgentType, type AgentType } from '@/types/agent-type';
import { useAgentExecutions } from './useAgentExecutions';
import { ConsolePesquisador } from './ConsolePesquisador';
import { ConsoleCriativo } from './ConsoleCriativo';
import { ConsoleConsultivo } from './ConsoleConsultivo';
import { ConsoleExecucao } from './ConsoleExecucao';
import { ConsoleOrquestrador } from './ConsoleOrquestrador';

interface ConsoleAdaptativoProps {
  agent: Agent;
}

const CONSOLES: Record<AgentType, typeof ConsoleExecucao> = {
  pesquisador: ConsolePesquisador,
  criativo: ConsoleCriativo,
  consultivo: ConsoleConsultivo,
  execucao: ConsoleExecucao,
  orquestrador: ConsoleOrquestrador,
};

export function ConsoleAdaptativo({ agent }: ConsoleAdaptativoProps) {
  const type: AgentType = isAgentType(agent.type)
    ? agent.type
    : inferAgentType({
        name: agent.name,
        role: agent.role,
        description: agent.description,
        isOrchestrator: agent.is_orchestrator,
      });

  const { executions, isLoading, error } = useAgentExecutions(
    [agent.id, agent.slug || ''].filter(Boolean),
  );

  const Console = CONSOLES[type];
  return <Console executions={executions} isLoading={isLoading} error={error} />;
}
