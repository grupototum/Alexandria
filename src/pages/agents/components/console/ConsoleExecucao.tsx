/** Console Execução (D-052) — ênfase em throughput, latência e retentativas. */
import { ConsoleShell, type ConsoleMetric } from './ConsoleShell';
import type { AgentExecution } from './useAgentExecutions';

const METRICS: ConsoleMetric[] = [
  { key: 'execucoes', label: 'Execuções', icon: 'solar:bolt-linear' },
  { key: 'duracao', label: 'Duração média', icon: 'solar:clock-circle-linear' },
  { key: 'retries', label: 'Retentativas', icon: 'solar:refresh-linear' },
  { key: 'sucesso', label: 'Taxa de sucesso', icon: 'solar:check-circle-linear' },
];

export function ConsoleExecucao(props: { executions: AgentExecution[]; isLoading: boolean; error: Error | null }) {
  return (
    <ConsoleShell
      title="Console de Execução"
      subtitle="Tarefas operacionais executadas por este agente."
      icon="solar:bolt-linear"
      metrics={METRICS}
      {...props}
    />
  );
}
