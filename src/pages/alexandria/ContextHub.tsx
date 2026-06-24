import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Agent, normalizeSkillIds } from '@/types/alexandria';
import { Users, Zap } from 'lucide-react';

interface ContextHubProps {
  agents?: Agent[];
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  online: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Online' },
  offline: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Offline' },
  idle: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Idle' },
  error: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Erro' },
  maintenance: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Manutenção' },
  active: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Ativo' },
  inactive: { bg: 'bg-zinc-500/15', text: 'text-zinc-400', label: 'Inativo' },
  testing: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', label: 'Testing' },
};

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: 'easeOut' },
};
const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export default function ContextHub({ agents = [] }: ContextHubProps) {
  const onlineCount = agents.filter((a) => a.status === 'online' || a.status === 'active').length;
  const totalSkills = agents.reduce((sum, a) => sum + (normalizeSkillIds(a.skills).length), 0);

  return (
    <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={fadeIn}>
          <Card className="p-6 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Agentes</p>
                <p className="text-3xl font-bold">{agents.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-40" aria-hidden="true" />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="p-6 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="text-3xl font-bold">{onlineCount}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-emerald-500" aria-hidden="true" />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="p-6 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Skills Associadas</p>
                <p className="text-3xl font-bold">{totalSkills}</p>
              </div>
              <Zap className="h-8 w-8 text-amber-500 opacity-40" aria-hidden="true" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Grid de Agentes */}
      {agents.length === 0 ? (
        <motion.div variants={fadeIn}>
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum agente encontrado</p>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => {
            const statusColor = statusColors[agent.status] || statusColors.offline;

            return (
              <motion.div
                key={agent.agent_id}
                variants={fadeIn}
                whileHover={{ y: 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Card className="p-6 transition-shadow hover:shadow-md h-full">
                  {/* Cabeçalho */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl" aria-hidden="true">{agent.emoji}</span>
                      <div>
                        <h3 className="font-semibold">{agent.name}</h3>
                        <p className="text-xs text-muted-foreground">Tier {agent.tier}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <Badge className={`${statusColor.bg} ${statusColor.text} border-0`}>
                      {statusColor.label}
                    </Badge>
                  </div>

                  {/* Preview do System Prompt */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Prompt:</p>
                    <p className="text-xs bg-muted p-2 rounded line-clamp-2">
                      {agent.system_prompt}
                    </p>
                  </div>

                  {/* Skills */}
                  {(() => {
                    const skillIds = normalizeSkillIds(agent.skills);
                    return (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Skills ({skillIds.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {skillIds.slice(0, 3).map((id) => (
                            <Badge key={id} variant="outline" className="text-xs">
                              {id}
                            </Badge>
                          ))}
                          {skillIds.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{skillIds.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
