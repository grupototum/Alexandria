/** Console Pesquisador (D-052) — ênfase em volume de contexto e tokens de busca. */
import { ConsoleShell, type ConsoleMetric } from './ConsoleShell';
import type { AgentExecution } from './useAgentExecutions';

const METRICS: ConsoleMetric[] = [
  { key: 'execucoes', label: 'Pesquisas', icon: 'solar:magnifer-linear' },
  { key: 'tokens', label: 'Tokens processados', icon: 'solar:document-text-linear' },
  { key: 'duracao', label: 'Duração média', icon: 'solar:clock-circle-linear' },
  { key: 'sucesso', label: 'Taxa de sucesso', icon: 'solar:check-circle-linear' },
];

export function ConsolePesquisador(props: { executions: AgentExecution[]; isLoading: boolean; error: Error | null }) {
  return (
    <ConsoleShell
      title="Console de Pesquisa"
      subtitle="Execuções de coleta, análise e monitoramento deste agente."
      icon="solar:magnifer-linear"
      metrics={METRICS}
      {...props}
    />
  );
}
