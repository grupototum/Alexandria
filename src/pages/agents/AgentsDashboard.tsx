import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { usePageTransition } from "@/hooks/usePageTransition";
import { PageSkeleton } from "@/components/loading";
import { useNavigate } from "react-router-dom";
import { EmptyState, PageHeader, Toolbar } from "@/components/ui/patterns";
import { Icon } from "@iconify/react";
import { Bot, Search, Plus } from "lucide-react";
import { useAgentsGrid, type GridAgent } from "@/hooks/useAgentsGrid";
import { AGENT_TYPES, AGENT_TYPE_ICONS, AGENT_TYPE_LABELS, type AgentType } from "@/types/agent-type";
import { HierarchyView } from "./components/HierarchyView";

const CATEGORIES = ["Todos", "ADM", "Comercial", "Criação", "Técnico"];

const STATUS_DOT: Record<string, string> = {
  online: "bg-emerald-500",
  idle: "bg-amber-500",
  maintenance: "bg-red-500",
  error: "bg-red-500",
  offline: "bg-stone-500",
};

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 },
});

export default function AgentsDashboard() {
  const navigate = useNavigate();
  const pageTransition = usePageTransition();
  const { agents, isLoading, error } = useAgentsGrid();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [typeFilter, setTypeFilter] = useState<AgentType | "todos">("todos");
  const [view, setView] = useState<"grid" | "hierarquia">("grid");

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return agents.filter((a) => {
      const matchSearch =
        !term ||
        a.name.toLowerCase().includes(term) ||
        (a.role || "").toLowerCase().includes(term) ||
        (a.description || "").toLowerCase().includes(term);
      const matchCat = category === "Todos" || a.category === category;
      const matchType = typeFilter === "todos" || a.type === typeFilter;
      return matchSearch && matchCat && matchType;
    });
  }, [agents, search, category, typeFilter]);

  if (isLoading) {
    return (
      <AppLayout>
        <motion.div {...pageTransition}>
          <PageSkeleton />
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.main {...pageTransition} className="min-h-screen bg-background" aria-label="Agents dashboard">
        <div className="max-w-[1200px] mx-auto p-4 sm:p-6 space-y-10">

          {/* ─── Header ─── */}
          <motion.div {...anim(0)}>
            <PageHeader
              eyebrow="REDE OPERACIONAL"
              title="Totum Agents"
              description="Sua equipe de inteligência artificial. Gerencie as personalidades, skills e DNA de cada agente do seu ecossistema."
              icon={Bot}
              actions={
                <button onClick={() => navigate("/agents/new")} className="button-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Agente
                </button>
              }
            />
          </motion.div>

          {/* ─── Filters ─── */}
          <motion.div {...anim(1)} className="space-y-4">
            <Toolbar>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`badge-krea px-4 py-2 text-xs transition-all ${
                      category === cat
                        ? "bg-white text-black opacity-100"
                        : "opacity-70 hover:opacity-100 cursor-pointer"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 items-center w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                  <input
                    id="agent-search"
                    name="agent-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar agente..."
                    className="input-krea pl-9 h-10 w-full"
                  />
                </div>

                <div className="flex rounded-lg border border-[#ffffff14] overflow-hidden shrink-0">
                  {(["grid", "hierarquia"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      aria-pressed={view === v}
                      className={`px-3 h-10 text-xs flex items-center gap-1.5 transition-colors ${
                        view === v ? "bg-white text-black" : "text-[#a3a3a3] hover:text-[#fafafa]"
                      }`}
                    >
                      <Icon
                        icon={v === "grid" ? "solar:widget-4-linear" : "solar:diagram-up-linear"}
                        className="w-4 h-4"
                      />
                      {v === "grid" ? "Grid" : "Hierarquia"}
                    </button>
                  ))}
                </div>
              </div>
            </Toolbar>

            {/* Filtro por tipo (D-052) */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTypeFilter("todos")}
                className={`badge-krea px-3 py-1.5 text-[11px] transition-all ${
                  typeFilter === "todos"
                    ? "bg-white text-black opacity-100"
                    : "opacity-70 hover:opacity-100 cursor-pointer"
                }`}
              >
                Todos os tipos
              </button>
              {AGENT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`badge-krea px-3 py-1.5 text-[11px] flex items-center gap-1.5 transition-all ${
                    typeFilter === t
                      ? "bg-white text-black opacity-100"
                      : "opacity-70 hover:opacity-100 cursor-pointer"
                  }`}
                >
                  <Icon icon={AGENT_TYPE_ICONS[t]} className="w-3.5 h-3.5" />
                  {AGENT_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ─── Conteúdo ─── */}
          <motion.div {...anim(2)}>
            {error ? (
              <EmptyState
                icon={Bot}
                title="Erro ao carregar agentes"
                description={error.message}
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={Bot}
                title="Nenhum agente encontrado"
                description="Ajuste a busca ou cadastre um novo agente para sua rede."
                actionLabel="Novo Agente"
                onAction={() => navigate("/agents/new")}
              />
            ) : view === "hierarquia" ? (
              <HierarchyView agents={filtered} onSelect={(a) => navigate(`/agents/${a.id}`)} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} onClick={() => navigate(`/agents/${agent.id}`)} />
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </motion.main>
    </AppLayout>
  );
}

/** Card condensado (M54 PR-2): header + meta em 2 colunas internas + descrição curta. */
function AgentCard({ agent, onClick }: { agent: GridAgent; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="card-krea text-left flex flex-col gap-3 p-4 hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl shrink-0" role="img" aria-label={agent.name}>
            {agent.emoji}
          </span>
          <div className="min-w-0">
            <h3 className="text-[#fafafa] font-medium text-[14px] truncate">{agent.name}</h3>
            <span className="text-[#a3a3a3] text-[11px] capitalize tracking-wide truncate block">
              {agent.role || agent.category}
            </span>
          </div>
        </div>
        <div
          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${STATUS_DOT[agent.status] || STATUS_DOT.offline}`}
          title={agent.status}
        />
      </div>

      {/* Meta condensada em 2 colunas internas */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] pt-2 border-t border-[#ffffff0f]">
        <div className="flex items-center gap-1.5 text-[#a3a3a3] min-w-0">
          <Icon icon={AGENT_TYPE_ICONS[agent.type]} className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{AGENT_TYPE_LABELS[agent.type]}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#a3a3a3] min-w-0">
          <Icon icon="solar:buildings-2-linear" className="w-3.5 h-3.5 shrink-0" />
          <span className="capitalize truncate">{agent.category}</span>
        </div>
        {agent.model && (
          <div className="flex items-center gap-1.5 text-[#a3a3a3] min-w-0">
            <Icon icon="solar:cpu-linear" className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate font-mono text-[10px]">{agent.model}</span>
          </div>
        )}
        {agent.tier != null && (
          <div className="flex items-center gap-1.5 text-[#a3a3a3] min-w-0">
            <Icon icon="solar:layers-minimalistic-linear" className="w-3.5 h-3.5 shrink-0" />
            <span>Tier {agent.tier}</span>
          </div>
        )}
      </div>

      {(agent.description || agent.bio) && (
        <p className="text-[#a3a3a3] text-[12px] leading-relaxed line-clamp-2">
          {agent.description || agent.bio}
        </p>
      )}
    </button>
  );
}
