import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { usePageTransition } from "@/hooks/usePageTransition";
import { PageSkeleton } from "@/components/loading";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState, PageHeader, Toolbar } from "@/components/ui/patterns";
import { Bot, Search, Plus } from "lucide-react";
import type { Agent } from "@/hooks/useAgents";

const CATEGORIES = ["Todos", "ADM", "Comercial", "Criação", "Técnico"];

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 },
});

export default function AgentsDashboard() {
  const navigate = useNavigate();
  const pageTransition = usePageTransition();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  useEffect(() => {
    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function load() {
      try {
        const { data } = await supabase.from("agents").select("*");
        if (!isMounted) return;

        if (data) {
          const typedAgents = data.map(agent => ({
            id: agent.id,
            name: agent.name,
            role: agent.role,
            status: (agent.status as Agent['status']) || 'offline',
            type: inferType(agent.category),
            category: agent.category || 'geral',
            emoji: agent.emoji || '🤖',
            created_at: agent.created_at || new Date().toISOString(),
            tasks: agent.tasks || 0,
            tasks_completed: agent.tasks || 0,
            success_rate: agent.success_rate || 0,
            daily_tasks: agent.daily_tasks || 0,
            credits_used: 0,
            parent_id: undefined,
            hierarchy_level: 0,
            is_orchestrator: false,
          }));
          setAgents(typedAgents as Agent[]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados dos agentes:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    channel = supabase
      .channel("agents-dash")
      .on("postgres_changes" as never, { event: "*", schema: "public", table: "agents" }, () => {
        if (!isMounted) return;
        supabase.from("agents").select("*").then(({ data }) => {
          if (data && isMounted) {
            const typedAgents = data.map(agent => ({
              id: agent.id,
              name: agent.name,
              role: agent.role,
              status: (agent.status as Agent['status']) || 'offline',
              type: inferType(agent.category),
              category: agent.category || 'geral',
              emoji: agent.emoji || '🤖',
              created_at: agent.created_at || new Date().toISOString(),
              tasks: agent.tasks || 0,
              tasks_completed: agent.tasks || 0,
              success_rate: agent.success_rate || 0,
              daily_tasks: agent.daily_tasks || 0,
              credits_used: 0,
              parent_id: undefined,
              hierarchy_level: 0,
              is_orchestrator: false,
            }));
            setAgents(typedAgents as Agent[]);
          }
        });
      });
    channel.subscribe();

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  function inferType(category: string | null): 'conversational' | 'processing' {
    const conversationalCategories = ['atendimento', 'chat', 'sdr', 'comercial'];
    return conversationalCategories.some(c => (category || '').toLowerCase().includes(c))
      ? 'conversational'
      : 'processing';
  }

  const filtered = useMemo(() => {
    return agents.filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Todos" || a.category === category;
      return matchSearch && matchCat;
    });
  }, [agents, search, category]);

  if (loading) {
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
        <div className="max-w-[920px] mx-auto p-4 sm:p-6 space-y-12">

          {/* ─── Header ─── */}
          <motion.div {...anim(0)}>
            <PageHeader
              eyebrow="REDE OPERACIONAL"
              title="Totum Agents"
              description="Sua equipe de inteligência artificial. Gerencie as personalidades, skills e DNA de cada agente do seu ecossistema."
              icon={Bot}
              actions={
                <button
                  onClick={() => navigate('/agents/new')}
                  className="button-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Agente
                </button>
              }
            />
          </motion.div>

          {/* ─── Filters ─── */}
          <motion.div {...anim(1)}>
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
              </div>
            </Toolbar>
          </motion.div>

          {/* ─── Agent Tree / Cards ─── */}
          <motion.div {...anim(2)}>
            {filtered.length === 0 ? (
              <EmptyState
                icon={Bot}
                title="Nenhum agente encontrado"
                description="Ajuste a busca ou cadastre um novo agente para sua rede."
                actionLabel="Novo Agente"
                onAction={() => navigate("/agents/new")}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((agent) => (
                  <div
                    key={agent.id}
                    className="card-krea flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl" role="img" aria-label={agent.name}>
                            {agent.emoji}
                          </span>
                          <div>
                            <h3 className="text-[#fafafa] font-medium text-[15px]">{agent.name}</h3>
                            <span className="text-[#a3a3a3] text-[12px] capitalize tracking-wide">{agent.category}</span>
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-[#10b981]' : 'bg-[#f87171]'}`} />
                      </div>

                      <div className="text-[#a3a3a3] text-[13px] leading-relaxed line-clamp-3">
                        {agent.role || "Nenhum DNA ou descrição configurada para este agente ainda. Adicione uma persona para otimizar suas interações."}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#ffffff0f]">
                        <span className="badge-krea text-[10px]">Linguagem</span>
                        {agent.category.toLowerCase().includes("adm") && <span className="badge-krea text-[10px]">Dados</span>}
                        {agent.category.toLowerCase().includes("comercial") && <span className="badge-krea text-[10px]">CRM</span>}
                        {agent.category.toLowerCase().includes("criação") && <span className="badge-krea text-[10px]">Visão</span>}
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => handleAgentClick(agent)}
                        className="button-secondary w-full text-xs"
                      >
                        Acessar Agente
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </motion.main>
    </AppLayout>
  );

  function handleAgentClick(agent: Agent) {
    navigate(`/agents/${agent.id}`);
  }
}
