/** Console Criativo (D-052) — ênfase em produção de conteúdo e custo por peça. */
import { ConsoleShell, type ConsoleMetric } from './ConsoleShell';
import type { AgentExecution } from './useAgentExecutions';

const METRICS: ConsoleMetric[] = [
  { key: 'execucoes', label: 'Peças geradas', icon: 'solar:palette-linear' },
  { key: 'custo', label: 'Custo total', icon: 'solar:wallet-money-linear' },
  { key: 'duracao', label: 'Duração média', icon: 'solar:clock-circle-linear' },
  { key: 'sucesso', label: 'Taxa de sucesso', icon: 'solar:check-circle-linear' },
];

export function ConsoleCriativo(props: { executions: AgentExecution[]; isLoading: boolean; error: Error | null }) {
  return (
    <ConsoleShell
      title="Console Criativo"
      subtitle="Execuções de criação de conteúdo, design e copy deste agente."
      icon="solar:palette-linear"
      metrics={METRICS}
      {...props}
    />
  );
}
