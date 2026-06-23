/** Console Consultivo (D-052) — ênfase em profundidade de contexto das consultas. */
import { ConsoleShell, type ConsoleMetric } from './ConsoleShell';
import type { AgentExecution } from './useAgentExecutions';

const METRICS: ConsoleMetric[] = [
  { key: 'execucoes', label: 'Consultas', icon: 'solar:chat-square-like-linear' },
  { key: 'tokens', label: 'Tokens de contexto', icon: 'solar:document-text-linear' },
  { key: 'sucesso', label: 'Taxa de sucesso', icon: 'solar:check-circle-linear' },
  { key: 'custo', label: 'Custo total', icon: 'solar:wallet-money-linear' },
];

export function ConsoleConsultivo(props: { executions: AgentExecution[]; isLoading: boolean; error: Error | null }) {
  return (
    <ConsoleShell
      title="Console Consultivo"
      subtitle="Consultas estratégicas e sessões de advisory deste agente."
      icon="solar:chat-square-like-linear"
      metrics={METRICS}
      {...props}
    />
  );
}
