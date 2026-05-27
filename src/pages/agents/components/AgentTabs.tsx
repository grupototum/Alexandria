import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@iconify/react';
import { TrendingUp } from 'lucide-react';
import type { Agent } from '@/hooks/useAgents';
import { classifyAgent } from '@/hooks/useAgentClassification';
import { AgentChat } from '@/components/agents/AgentChat';
import { N8NWorkflow } from './N8NWorkflow';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AgentTabsProps {
  agent: Agent;
  agents: Agent[];
  parentAgent?: Agent;
  childAgents: Agent[];
}

const COLORS = ['#1C1917', '#78716C', '#D6D3D1', '#A8A29E'];



export function AgentTabs({ agent, agents, parentAgent, childAgents }: AgentTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const classification = classifyAgent(agent.name);


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

  const isNew = (() => {
    const created = new Date(agent.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  })();

  const creditsData = [
    { name: 'Processamento', value: agent?.credits_used ? Math.round(agent.credits_used * 0.4) : 40 },
    { name: 'Storage', value: agent?.credits_used ? Math.round(agent.credits_used * 0.3) : 30 },
    { name: 'API', value: agent?.credits_used ? Math.round(agent.credits_used * 0.2) : 20 },
    { name: 'Outros', value: agent?.credits_used ? Math.round(agent.credits_used * 0.1) : 10 },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'solar:chart-2-linear' },
    { id: 'credits', label: 'Créditos', icon: 'solar:wallet-money-linear' },
    { id: 'effectiveness', label: 'Efetividade', icon: 'solar:trend-up-linear' },
    { id: 'hierarchy', label: 'Hierarquia', icon: 'solar:diagram-up-linear' },
    { id: 'chat', label: 'Chat', icon: 'solar:chat-dots-linear' },
    { id: 'n8n', label: 'N8N', icon: 'solar:workflow-linear' },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="border-b border-white/10">
        <TabsList className="bg-transparent border-0 p-0 h-12 w-full justify-start gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="
                data-[state=active]:bg-[#1b1728] 
                data-[state=active]:border-[#1f192a] 
                data-[state=active]:text-foreground
                data-[state=active]:shadow-sm
                border border-transparent
                text-muted-foreground
                px-4 py-2
                text-sm font-medium
                rounded-t-lg
                transition-all
              "
            >
              <Icon icon={tab.icon} className="w-4 h-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        <TabsContent value="overview" className="m-0 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Tarefas Hoje', value: agent.daily_tasks || 0, icon: 'solar:task-square-linear', color: 'text-[#fafafa]' },
                  { label: 'Taxa de Sucesso', value: `${agent.success_rate || 0}%`, icon: 'solar:check-circle-linear', color: 'text-emerald-500' },
                  { label: 'Total Tarefas', value: agent.tasks_completed || 0, icon: 'solar:clipboard-list-linear', color: 'text-blue-500' },
                  { label: 'Créditos Usados', value: agent.credits_used || 0, icon: 'solar:wallet-money-linear', color: 'text-amber-500' },
                ].map((stat, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Icon icon={stat.icon} className={`w-5 h-5 ${stat.color}`} />
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.04em] text-muted-foreground">{stat.label}</p>
                          <p className="text-xl font-medium text-foreground">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[14px] font-medium text-[#fafafa]">Atividade dos Últimos 7 Dias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50 text-muted-foreground" />
                      <p className="text-sm">Dados de atividade serão exibidos aqui</p>
                      <p className="text-xs mt-1">Quando o tracking estiver ativo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[14px] font-medium text-[#fafafa]">Efetividade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#1b1728"
                          strokeWidth="12"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#fd8925"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${(agent.success_rate || 0) * 3.52} 352`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-medium text-foreground">
                          {agent.success_rate || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[12px] text-muted-foreground text-center mt-4">
                    Taxa de sucesso nas tarefas executadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[14px] font-medium text-[#fafafa]">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-muted-foreground">ID</span>
                    <span className="text-foreground font-mono">{agent.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-muted-foreground">Categoria</span>
                    <span className="text-foreground">{agent.category}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-muted-foreground">Tipo</span>
                    <span className="text-foreground capitalize">{agent.type}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-muted-foreground">Status</span>
                    <span className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
                      <span className="text-foreground capitalize">{statusLabels[agent.status]}</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-muted-foreground">Criado em</span>
                    <span className="text-foreground">
                      {new Date(agent.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Credits Tab */}
        <TabsContent value="credits" className="m-0 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[14px] font-medium text-[#fafafa]">Uso de Créditos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={creditsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {creditsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#171717', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '4px',
                          color: '#fafafa'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {creditsData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-[2px]" 
                        style={{ backgroundColor: COLORS[i] }}
                      />
                      <span className="text-[12px] text-[#a3a3a3]">{item.name}</span>
                      <span className="text-[12px] text-[#fafafa] font-medium ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[14px] font-medium text-[#fafafa]">Histórico de Uso (7 dias)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-[#a3a3a3]">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#737373]" />
                    <p className="text-sm">Histórico de uso será exibido aqui</p>
                    <p className="text-[11px] mt-1">Quando os dados de créditos estiverem disponíveis</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-[14px] font-medium text-[#fafafa]">Detalhamento de Custos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creditsData.map((item, i) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-[13px] mb-1">
                        <span className="text-[#a3a3a3]">{item.name}</span>
                        <span className="text-[#fafafa] font-medium">{item.value} créditos</span>
                      </div>
                      <Progress 
                        value={(item.value / (agent.credits_used || 100)) * 100} 
                        className="h-2 bg-[#262626]"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[14px] font-medium text-[#fafafa]">Total</span>
                  <span className="text-[18px] font-medium text-[#fafafa]">{agent.credits_used || 0} créditos</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Effectiveness Tab */}
        <TabsContent value="effectiveness" className="m-0 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[14px] font-medium text-[#fafafa]">Taxa de Sucesso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#262626"
                        strokeWidth="16"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#fafafa"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={`${(agent.success_rate || 0) * 4.4} 440`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[32px] font-medium text-[#fafafa]">
                        {agent.success_rate || 0}%
                      </span>
                      <span className="text-[11px] text-[#a3a3a3] uppercase tracking-[0.04em]">sucesso</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[14px] font-medium text-[#fafafa]">Tarefas Completadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <span className="text-[48px] font-medium text-[#fafafa] leading-none">
                      {agent.tasks_completed || 0}
                    </span>
                    <p className="text-[12px] text-[#a3a3a3] mt-2">tarefas no total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[14px] font-medium text-[#fafafa]">Eficiência Diária</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <span className="text-[48px] font-medium text-[#fafafa] leading-none">
                      {agent.daily_tasks || 0}
                    </span>
                    <p className="text-[12px] text-[#a3a3a3] mt-2">tarefas hoje</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-[14px] font-medium text-[#fafafa]">Desempenho Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex items-center justify-center">
                  <div className="text-center text-[#737373]">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-[13px]">Dados de desempenho serão exibidos aqui</p>
                    <p className="text-[11px] mt-1 text-[#a3a3a3]">Quando o histórico semanal estiver disponível</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hierarchy Tab */}
        <TabsContent value="hierarchy" className="m-0 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {parentAgent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[14px] font-medium text-[#fafafa]">Agente Superior</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="flex items-center gap-4 p-4 bg-[#1b1728] rounded-xl border border-[#1f192a] cursor-pointer hover:bg-[#272333] transition-colors"
                    onClick={() => navigate(`/agents/${parentAgent.id}`)}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#272333] flex items-center justify-center text-2xl border border-[#1f192a]">
                      {parentAgent.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{parentAgent.name}</p>
                      <p className="text-[12px] text-muted-foreground">{parentAgent.role}</p>
                      <Badge variant="outline" className="text-[10px] mt-1 border-[#1f192a]">
                        Nível {parentAgent.hierarchy_level}
                      </Badge>
                    </div>
                    <Icon icon="solar:arrow-right-linear" className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className={!parentAgent ? 'lg:col-span-2' : ''}>
              <CardHeader>
                <CardTitle className="text-[14px] font-medium text-[#fafafa]">
                  Sub-agentes ({childAgents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {childAgents.length === 0 ? (
                  <p className="text-[13px] text-[#a3a3a3] text-center py-8">
                    Este agente não possui sub-agentes
                  </p>
                ) : (
                  <div className="space-y-3">
                    {childAgents.map((child) => (
                      <div 
                        key={child.id}
                        className="flex items-center gap-4 p-4 bg-[#1b1728] rounded-xl border border-[#1f192a] cursor-pointer hover:bg-[#272333] transition-colors"
                        onClick={() => navigate(`/agents/${child.id}`)}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#272333] flex items-center justify-center text-xl border border-[#1f192a]">
                          {child.emoji}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{child.name}</p>
                          <p className="text-[12px] text-muted-foreground">{child.role}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-muted-foreground">
                            ✓ {child.success_rate || 0}%
                          </span>
                          <Icon icon="solar:arrow-right-linear" className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-[14px] font-medium text-[#fafafa]">Posição na Hierarquia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-4">
                    {parentAgent && (
                      <>
                        <div className="text-center">
                          <div className="w-14 h-14 rounded-xl bg-[#1b1728] border border-[#1f192a] flex items-center justify-center text-xl mx-auto">
                            {parentAgent.emoji}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-2">{parentAgent.name}</p>
                        </div>
                        <Icon icon="solar:alt-arrow-right-linear" className="w-6 h-6 text-muted-foreground" />
                      </>
                    )}
                    
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl bg-[#272333] border border-[#1f192a] flex items-center justify-center text-3xl mx-auto ring-4 ring-[#1f192a]/50">
                        <span className="text-foreground">{agent.emoji}</span>
                      </div>
                      <p className="text-[13px] font-medium text-foreground mt-2">{agent.name}</p>
                      <Badge className="text-[10px] mt-1 bg-[#1b1728] text-foreground border border-[#1f192a]">Nível {agent.hierarchy_level}</Badge>
                    </div>
                    
                    {childAgents.length > 0 && (
                      <>
                        <Icon icon="solar:alt-arrow-right-linear" className="w-6 h-6 text-[#737373]" />
                        <div className="text-center">
                          <div className="flex -space-x-2">
                            {childAgents.slice(0, 3).map((child, i) => (
                              <div 
                                key={child.id}
                                className="w-10 h-10 rounded-full bg-[#171717] border border-white/10 flex items-center justify-center text-lg ring-2 ring-[#0a0a0a]"
                                style={{ zIndex: 3 - i }}
                              >
                                {child.emoji}
                              </div>
                            ))}
                            {childAgents.length > 3 && (
                              <div className="w-10 h-10 rounded-full bg-[#262626] border border-white/10 flex items-center justify-center text-xs ring-2 ring-[#0a0a0a]"
                              >
                                +{childAgents.length - 3}
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] text-[#a3a3a3] mt-2">{childAgents.length} sub-agentes</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="m-0 mt-0">
          <div className="max-w-3xl mx-auto">
            <AgentChat agent={agent} />
          </div>
        </TabsContent>

        {/* N8N Tab */}
        <TabsContent value="n8n" className="m-0 mt-0">
          <N8NWorkflow agent={agent} agents={agents} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
