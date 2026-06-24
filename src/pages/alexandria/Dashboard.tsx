import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AlexandriaContextData } from '@/types/alexandria';
import { BookOpen, Zap, Users, TrendingUp } from 'lucide-react';

interface DashboardProps {
  data: AlexandriaContextData;
}

export default function Dashboard({ data }: DashboardProps) {
  const stats = [
    {
      label: 'Documentos',
      value: data.stats.totalDocuments,
      icon: BookOpen,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Skills Ativas',
      value: data.stats.totalSkills,
      icon: Zap,
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      label: 'Agentes',
      value: data.stats.totalAgents,
      icon: Users,
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      label: 'Taxa de Uso',
      value: '92%',
      icon: TrendingUp,
      color: 'bg-purple-500/10 text-purple-600',
    },
  ];

  const documentTypes = {
    design_system: data.documents.filter((d) => d.type === 'design_system').length,
    pops: data.documents.filter((d) => d.type === 'pops').length,
    slas: data.documents.filter((d) => d.type === 'slas').length,
    client_info: data.documents.filter((d) => d.type === 'client_info').length,
  };

  const fadeIn = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25, ease: 'easeOut' },
  };
  const stagger = {
    animate: { transition: { staggerChildren: 0.07 } },
  };

  return (
    <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={fadeIn}>
              <Card className="p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Distribuição de Documentos */}
      <motion.div variants={fadeIn}>
        <Card className="p-6 transition-shadow hover:shadow-md">
          <h3 className="font-semibold text-lg mb-4">📚 Distribuição de Documentos</h3>
          <div className="space-y-4">
            {Object.entries(documentTypes).map(([type, count]) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{
                      width: `${data.stats.totalDocuments > 0 ? (count / data.stats.totalDocuments) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Top Skills */}
      <motion.div variants={fadeIn}>
        <Card className="p-6 transition-shadow hover:shadow-md">
          <h3 className="font-semibold text-lg mb-4">⭐ Skills mais Usadas</h3>
          {data.skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma skill encontrada</p>
          ) : (
            <div className="space-y-3">
              {data.skills.slice(0, 5).map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl" aria-hidden="true">{skill.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm">{skill.name}</p>
                      <p className="text-xs text-muted-foreground">{skill.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{skill.success_rate || 0}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Status do Ecossistema */}
      <motion.div variants={fadeIn}>
        <Card className="p-6 transition-shadow hover:shadow-md">
          <h3 className="font-semibold text-lg mb-4">🎯 Status do Ecossistema</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Documentos Indexados</span>
              <span className="font-semibold text-emerald-500">OK</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Skills Operacionais</span>
              <span className="font-semibold text-emerald-500">OK</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Agentes Online</span>
              <span className="font-semibold text-emerald-500">
                {data.stats.activeAgents}/{data.stats.totalAgents}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Última Sincronização</span>
              <span className="font-semibold text-emerald-500">Agora</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
