/**
 * HierarchyView — visão Hierarquia do grid de agentes (M54 PR-5).
 * Cascata Circular: orquestradores no topo, demais agentes agrupados
 * por departamento (category) abaixo. Sem parent_id no DB hoje —
 * o agrupamento usa is_orchestrator/tipo D-052 + category.
 */
import { Icon } from "@iconify/react";
import type { GridAgent } from "@/hooks/useAgentsGrid";
import { AGENT_TYPE_ICONS, AGENT_TYPE_LABELS } from "@/types/agent-type";

interface HierarchyViewProps {
  agents: GridAgent[];
  onSelect: (agent: GridAgent) => void;
}

const STATUS_DOT: Record<string, string> = {
  online: "bg-emerald-500",
  idle: "bg-amber-500",
  maintenance: "bg-red-500",
  error: "bg-red-500",
  offline: "bg-stone-500",
};

export function HierarchyView({ agents, onSelect }: HierarchyViewProps) {
  const orchestrators = agents.filter((a) => a.type === "orquestrador" || a.isOrchestrator);
  const others = agents.filter((a) => !orchestrators.includes(a));

  const byCategory = new Map<string, GridAgent[]>();
  for (const agent of others) {
    const key = agent.category || "geral";
    const list = byCategory.get(key) || [];
    list.push(agent);
    byCategory.set(key, list);
  }
  const categories = [...byCategory.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="space-y-8">
      {/* Nível 0 — Orquestradores */}
      {orchestrators.length > 0 && (
        <section>
          <header className="flex items-center gap-2 mb-3">
            <Icon icon="solar:crown-linear" className="w-4 h-4 text-amber-500" />
            <h2 className="text-[12px] uppercase tracking-[0.08em] text-[#a3a3a3]">
              Orquestradores ({orchestrators.length})
            </h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {orchestrators.map((agent) => (
              <HierarchyNode key={agent.id} agent={agent} onSelect={onSelect} highlight />
            ))}
          </div>
        </section>
      )}

      {/* Nível 1 — Departamentos */}
      {categories.map(([cat, list]) => (
        <section key={cat}>
          <header className="flex items-center gap-2 mb-3 pl-4 border-l-2 border-[#ffffff14]">
            <Icon icon="solar:buildings-2-linear" className="w-4 h-4 text-[#a3a3a3]" />
            <h2 className="text-[12px] uppercase tracking-[0.08em] text-[#a3a3a3] capitalize">
              {cat} ({list.length})
            </h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pl-4">
            {list.map((agent) => (
              <HierarchyNode key={agent.id} agent={agent} onSelect={onSelect} />
            ))}
          </div>
        </section>
      ))}

      {orchestrators.length === 0 && categories.length === 0 && (
        <p className="text-[13px] text-[#a3a3a3] text-center py-12">
          Nenhum agente para exibir na hierarquia.
        </p>
      )}
    </div>
  );
}

function HierarchyNode({
  agent,
  onSelect,
  highlight = false,
}: {
  agent: GridAgent;
  onSelect: (agent: GridAgent) => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={() => onSelect(agent)}
      className={`card-krea text-left flex items-center gap-3 p-3 hover:-translate-y-0.5 transition-transform cursor-pointer ${
        highlight ? "ring-1 ring-amber-500/30" : ""
      }`}
    >
      <span className="text-xl shrink-0" role="img" aria-label={agent.name}>
        {agent.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[#fafafa] text-[13px] font-medium truncate">{agent.name}</p>
        <p className="text-[#a3a3a3] text-[11px] flex items-center gap-1 truncate">
          <Icon icon={AGENT_TYPE_ICONS[agent.type]} className="w-3 h-3 shrink-0" />
          {AGENT_TYPE_LABELS[agent.type]}
          {agent.tier != null && <span className="ml-1">· Tier {agent.tier}</span>}
        </p>
      </div>
      <div className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[agent.status] || STATUS_DOT.offline}`} />
    </button>
  );
}
