/** Console Orquestrador (D-052) — ênfase em volume coordenado e custo agregado. */
import { ConsoleShell, type ConsoleMetric } from './ConsoleShell';
import type { AgentExecution } from './useAgentExecutions';

const METRICS: ConsoleMetric[] = [
  { key: 'execucoes', label: 'Orquestrações', icon: 'solar:crown-linear' },
  { key: 'sucesso', label: 'Taxa de sucesso', icon: 'solar:check-circle-linear' },
  { key: 'custo', label: 'Custo agregado', icon: 'solar:wallet-money-linear' },
  { key: 'tokens', label: 'Tokens totais', icon: 'solar:document-text-linear' },
];

export function ConsoleOrquestrador(props: { executions: AgentExecution[]; isLoading: boolean; error: Error | null }) {
  return (
    <ConsoleShell
      title="Console de Orquestração"
      subtitle="Fluxos coordenados por este orquestrador na Cascata Circular."
      icon="solar:crown-linear"
      metrics={METRICS}
      {...props}
    />
  );
}
