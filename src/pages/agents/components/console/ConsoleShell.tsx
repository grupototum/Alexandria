/**
 * ConsoleShell — base compartilhada dos consoles adaptativos (M54 PR-4).
 * Cada Console{Tipo} configura ênfase de métricas e texto; o shell cuida
 * de stats, lista de execuções e estados vazios. Status/colunas seguem
 * o contract v3 (docs/API_ALEXANDRIA_CONTRACT.md).
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import type { ExecutionStatus } from '@/types/status';
import type { AgentExecution } from './useAgentExecutions';

export interface ConsoleMetric {
  key: 'execucoes' | 'sucesso' | 'duracao' | 'tokens' | 'custo' | 'retries';
  label: string;
  icon: string;
}

interface ConsoleShellProps {
  title: string;
  subtitle: string;
  icon: string;
  metrics: ConsoleMetric[];
  executions: AgentExecution[];
  isLoading: boolean;
  error: Error | null;
}

const STATUS_UI: Record<ExecutionStatus, { label: string; className: string; icon: string }> = {
  pending: { label: 'Pendente', className: 'text-amber-500 border-amber-500/30 bg-amber-500/10', icon: 'solar:clock-circle-linear' },
  running: { label: 'Executando', className: 'text-blue-500 border-blue-500/30 bg-blue-500/10', icon: 'solar:refresh-linear' },
  success: { label: 'Sucesso', className: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10', icon: 'solar:check-circle-linear' },
  error: { label: 'Erro', className: 'text-red-500 border-red-500/30 bg-red-500/10', icon: 'solar:danger-circle-linear' },
};

function formatDuration(ms: number | null): string {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatCost(cost: number | null): string {
  if (cost == null) return '—';
  return `$${cost.toFixed(4)}`;
}

function computeMetric(key: ConsoleMetric['key'], executions: AgentExecution[]): string {
  if (executions.length === 0) return '—';
  switch (key) {
    case 'execucoes':
      return String(executions.length);
    case 'sucesso': {
      const finished = executions.filter((e) => e.status === 'success' || e.status === 'error');
      if (finished.length === 0) return '—';
      const ok = finished.filter((e) => e.status === 'success').length;
      return `${Math.round((ok / finished.length) * 100)}%`;
    }
    case 'duracao': {
      const values = executions.map((e) => e.durationMs).filter((v): v is number => v != null);
      if (values.length === 0) return '—';
      return formatDuration(Math.round(values.reduce((a, b) => a + b, 0) / values.length));
    }
    case 'tokens': {
      const total = executions.reduce((sum, e) => sum + (e.totalTokens || 0), 0);
      return total > 0 ? total.toLocaleString('pt-BR') : '—';
    }
    case 'custo': {
      const total = executions.reduce((sum, e) => sum + (e.totalCost || 0), 0);
      return total > 0 ? formatCost(total) : '—';
    }
    case 'retries': {
      const total = executions.reduce((sum, e) => sum + (e.retryCount || 0), 0);
      return String(total);
    }
  }
}

export function ConsoleShell({ title, subtitle, icon, metrics, executions, isLoading, error }: ConsoleShellProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-[#1b1728] animate-pulse rounded-2xl border border-[#1f192a]" />
        <div className="h-64 bg-[#1b1728] animate-pulse rounded-2xl border border-[#1f192a]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header do console */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#1b1728] border border-[#1f192a] flex items-center justify-center">
          <Icon icon={icon} className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h2 className="text-[16px] font-medium text-foreground">{title}</h2>
          <p className="text-[12px] text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {/* Métricas com ênfase por tipo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.key}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Icon icon={metric.icon} className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.04em] text-muted-foreground">{metric.label}</p>
                  <p className="text-xl font-medium text-foreground">{computeMetric(metric.key, executions)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Execuções */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[14px] font-medium text-[#fafafa]">
            Execuções recentes ({executions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-[13px] text-red-500 text-center py-8">{error.message}</p>
          ) : executions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Icon icon="solar:inbox-linear" className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-[13px]">Nenhuma execução registrada para este agente ainda.</p>
              <p className="text-[11px] mt-1">As execuções aparecem aqui quando o agente roda via runtime.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {executions.map((exec) => {
                const status = STATUS_UI[exec.status];
                return (
                  <div
                    key={exec.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 p-3 bg-[#1b1728] rounded-xl border border-[#1f192a]"
                  >
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-[0.04em] ${status.className}`}>
                      <Icon icon={status.icon} className={`w-3 h-3 mr-1 ${exec.status === 'running' ? 'animate-spin' : ''}`} />
                      {status.label}
                    </Badge>

                    <span className="text-[12px] text-foreground font-mono truncate max-w-[180px]" title={exec.executionId}>
                      {exec.executionId}
                    </span>

                    <span className="text-[11px] text-muted-foreground">
                      {exec.createdAt ? new Date(exec.createdAt).toLocaleString('pt-BR') : '—'}
                    </span>

                    <div className="flex items-center gap-3 ml-auto text-[11px] text-muted-foreground">
                      {exec.model && (
                        <span className="font-mono" title="Modelo (context.model)">{exec.model}</span>
                      )}
                      <span title="Duração">{formatDuration(exec.durationMs)}</span>
                      {exec.totalTokens != null && (
                        <span title="Tokens totais">{exec.totalTokens.toLocaleString('pt-BR')} tok</span>
                      )}
                      {exec.totalCost != null && <span title="Custo">{formatCost(exec.totalCost)}</span>}
                      {exec.retryCount != null && exec.retryCount > 0 && (
                        <span className="text-amber-500" title="Retentativas (context.retry_count)">
                          ↻ {exec.retryCount}
                        </span>
                      )}
                    </div>

                    {exec.status === 'error' && exec.errorMessage && (
                      <p className="w-full text-[11px] text-red-400 truncate" title={exec.errorMessage}>
                        {exec.errorMessage}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
