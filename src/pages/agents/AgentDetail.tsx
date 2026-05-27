import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Icon } from '@iconify/react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { Agent } from '@/hooks/useAgents';
import { classifyAgent } from '@/hooks/useAgentClassification';
import { AgentTabs } from './components/AgentTabs';
import { supabase } from '@/integrations/supabase/client';

const CATEGORIES = ['geral','comercial','criacao','marketing','analytics','social','trafego','tech','suporte'] as const;
const STATUSES   = ['standby','online','offline','idle','maintenance'] as const;

interface EditForm {
  name: string; role: string; emoji: string; description: string;
  category: string; status: string; agent_group: string; slug: string;
}

export default function AgentDetail() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    function mapRow(row: any): Agent {
      return {
        id: row.id,
        name: row.name,
        role: row.role,
        status: (row.status as Agent['status']) || 'offline',
        tasks: row.tasks || 0,
        type: inferType(row.category),
        category: row.category || 'geral',
        emoji: row.emoji || '🤖',
        created_at: row.created_at || new Date().toISOString(),
        tasks_completed: row.tasks || 0,
        success_rate: row.success_rate || 0,
        daily_tasks: row.daily_tasks || 0,
        slug: row.slug,
        credits_used: 0,
        parent_id: undefined,
        hierarchy_level: 0,
        is_orchestrator: false,
      };
    }

    async function loadAgent() {
      if (!agentId) return;
      try {
        setLoading(true);

        // Parallel: fetch this agent by id (or slug) + all agents for hierarchy
        const [singleRes, allRes] = await Promise.all([
          supabase
            .from('agents')
            .select('*')
            .or(`id.eq.${agentId},slug.eq.${agentId}`)
            .maybeSingle(),
          supabase
            .from('agents')
            .select('id,name,role,status,category,emoji,tasks,daily_tasks,success_rate,created_at,slug,agent_group'),
        ]);

        if (!isMounted) return;

        const typedAgents: Agent[] = (allRes.data || []).map(mapRow);
        setAgents(typedAgents);

        if (singleRes.data) {
          setAgent(mapRow(singleRes.data));
        } else {
          // fallback: find in full list (handles UUID vs slug mismatch)
          const found = typedAgents.find(a => a.id === agentId || a.slug === agentId);
          if (found) setAgent(found);
        }
      } catch (error) {
        console.error('Erro ao carregar agente:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAgent();

    // Subscribe to changes
    const channel = supabase
      .channel(`agent-${agentId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, () => {
        loadAgent();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [agentId]);

  function inferType(category: string | null): 'conversational' | 'processing' {
    const conversationalCategories = ['atendimento', 'chat', 'sdr', 'comercial'];
    return conversationalCategories.some(c => (category || '').toLowerCase().includes(c))
      ? 'conversational'
      : 'processing';
  }

  function openEdit() {
    if (!agent) return;
    setEditForm({
      name:        agent.name,
      role:        agent.role,
      emoji:       agent.emoji,
      description: (agent as any).description ?? '',
      category:    agent.category,
      status:      agent.status,
      agent_group: (agent as any).agent_group ?? '',
      slug:        agent.slug ?? '',
    });
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!agent || !editForm) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('agents')
        .update({
          name:        editForm.name,
          role:        editForm.role,
          emoji:       editForm.emoji,
          description: editForm.description || null,
          category:    editForm.category,
          status:      editForm.status,
          agent_group: editForm.agent_group || null,
          slug:        editForm.slug || null,
        })
        .eq('id', agent.id);
      if (error) throw error;
      toast.success('Agente atualizado com sucesso');
      setEditOpen(false);
    } catch (err: unknown) {
      toast.error(`Erro ao salvar: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setSaving(false);
    }
  }

  // Find parent and children
  const parentAgent = agent?.parent_id 
    ? agents.find(a => a.id === agent.parent_id)
    : null;
  
  const childAgents = agents.filter(a => a.parent_id === agentId);

  const classification = agent ? classifyAgent(agent.name) : null;

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-stone-400',
    idle: 'bg-amber-500',
    maintenance: 'bg-red-500',
  };

  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    idle: 'Em espera',
    maintenance: 'Manutenção',
  };

  const isNew = agent ? (() => {
    const created = new Date(agent.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  })() : false;

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen">
          <div className="max-w-[1400px] mx-auto p-8">
            <div className="h-32 bg-[#171717] animate-pulse rounded-[14px] mb-6 border border-white/5" />
            <div className="h-12 bg-[#171717] animate-pulse rounded-[14px] mb-6 border border-white/5" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-[#171717] animate-pulse rounded-[14px] border border-white/5" />
              <div className="h-96 bg-[#171717] animate-pulse rounded-[14px] border border-white/5" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!agent) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#171717] border border-white/5 flex items-center justify-center">
              <Icon icon="solar:ghost-linear" className="w-8 h-8 text-[#737373]" />
            </div>
            <h1 className="text-2xl font-medium text-[#fafafa] mb-2">Agente não encontrado</h1>
            <p className="text-[#a3a3a3] mb-6">O agente solicitado não existe ou foi removido.</p>
            <Button 
              onClick={() => navigate('/agents')} 
              variant="primary"
            >
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 border-b border-white/10"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="shrink-0"
                >
                  <Icon icon="solar:arrow-left-linear" className="w-5 h-5" />
                </Button>

                <div className="relative">
                  <div className={`
                    w-16 h-16 rounded-[4px] flex items-center justify-center text-3xl border border-white/10 bg-[#171717]
                  `}>
                    {agent.emoji}
                  </div>
                  <span className={`
                    absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-[#0a0a0a]
                    ${statusColors[agent.status]}
                  `} />
                </div>

                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-[28px] font-medium text-[#fafafa] tracking-[-0.02em]">
                      {agent.name}
                    </h1>
                    
                    {isNew && (
                      <Badge className="bg-[#ffffff] text-[#000000] text-[10px] uppercase tracking-[0.04em]">
                        New
                      </Badge>
                    )}
                    
                    {agent.is_orchestrator && (
                      <Badge variant="outline" className="text-[10px] uppercase tracking-[0.04em] border-amber-400/20 text-amber-500 bg-amber-500/10">
                        <Icon icon="solar:crown-linear" className="w-3 h-3 mr-1" />
                        Orquestrador
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-[14px] text-[#a3a3a3] mt-1">{agent.role}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="outline" 
                      className={`${classification?.bgColor} ${classification?.color} border-white/10 text-[10px] tracking-[0.04em] uppercase font-medium`}
                    >
                      <Icon icon={classification?.icon || ''} className="w-3 h-3 mr-1" />
                      {classification?.label}
                    </Badge>
                    
                    <span className="text-[11px] text-[#737373]">
                      Criado em {new Date(agent.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/agents')}
                >
                  <Icon icon="solar:graph-new-linear" className="w-4 h-4 mr-2" />
                  Ver no Dashboard
                </Button>
                <Button
                  variant="secondary"
                  onClick={openEdit}
                >
                  <Icon icon="solar:pen-linear" className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tabs Content */}
          <AgentTabs
            agent={agent}
            agents={agents}
            parentAgent={parentAgent}
            childAgents={childAgents}
          />
        </div>
      </div>

      {/* Edit Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-[#0a0a0a] border-l border-white/10 text-[#fafafa]">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-[20px] font-medium text-[#fafafa]">Editar Agente</SheetTitle>
          </SheetHeader>

          {editForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label className="text-[12px] text-[#a3a3a3] mb-1 block">Emoji</Label>
                  <Input
                    value={editForm.emoji}
                    onChange={e => setEditForm(f => f ? { ...f, emoji: e.target.value } : f)}
                    className="text-center text-xl"
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-[12px] text-[#a3a3a3] mb-1 block">Nome</Label>
                  <Input
                    value={editForm.name}
                    onChange={e => setEditForm(f => f ? { ...f, name: e.target.value } : f)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-[12px] text-[#a3a3a3] mb-1 block">Role / Função</Label>
                <Input
                  value={editForm.role}
                  onChange={e => setEditForm(f => f ? { ...f, role: e.target.value } : f)}
                />
              </div>

              <div>
                <Label className="text-[12px] text-[#a3a3a3] mb-1 block">Descrição</Label>
                <Textarea
                  value={editForm.description}
                  onChange={e => setEditForm(f => f ? { ...f, description: e.target.value } : f)}
                  rows={3}
                  className="bg-transparent border border-white/15 text-[#fafafa] rounded-[4px] resize-none focus-visible:ring-2 focus-visible:ring-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[12px] text-[#a3a3a3] mb-1 block">Categoria</Label>
                  <Select value={editForm.category} onValueChange={v => setEditForm(f => f ? { ...f, category: v } : f)}>
                    <SelectTrigger className="bg-transparent border-white/15 text-[#fafafa] rounded-[4px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#171717] border-white/10 text-[#fafafa] rounded-[4px]">
                      {CATEGORIES.map(c => (
                        <SelectItem key={c} value={c} className="hover:bg-[#262626] focus:bg-[#262626]">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[12px] text-[#a3a3a3] mb-1 block">Status</Label>
                  <Select value={editForm.status} onValueChange={v => setEditForm(f => f ? { ...f, status: v } : f)}>
                    <SelectTrigger className="bg-transparent border-white/15 text-[#fafafa] rounded-[4px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#171717] border-white/10 text-[#fafafa] rounded-[4px]">
                      {STATUSES.map(s => (
                        <SelectItem key={s} value={s} className="hover:bg-[#262626] focus:bg-[#262626]">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-[12px] text-[#a3a3a3] mb-1 block">Grupo</Label>
                <Input
                  value={editForm.agent_group}
                  onChange={e => setEditForm(f => f ? { ...f, agent_group: e.target.value } : f)}
                  placeholder="tier1, tier2, totum…"
                />
              </div>

              <div>
                <Label className="text-[12px] text-[#a3a3a3] mb-1 block">Slug</Label>
                <Input
                  value={editForm.slug}
                  onChange={e => setEditForm(f => f ? { ...f, slug: e.target.value } : f)}
                  placeholder="meu-agente"
                  className="font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={saveEdit}
                  disabled={saving}
                  className="flex-1"
                  variant="primary"
                >
                  {saving ? (
                    <Icon icon="solar:refresh-linear" className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Icon icon="solar:check-circle-linear" className="w-4 h-4 mr-2" />
                  )}
                  {saving ? 'Salvando…' : 'Salvar'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setEditOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
