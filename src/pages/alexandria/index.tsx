import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { useAlexandria } from '@/hooks/useAlexandria';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader, DataPanel } from '@/components/ui/patterns';
import { Loader2, RefreshCw, BookOpen, FileText, Users, Zap, ExternalLink, Brain, Upload, Download, GitBranch, Sparkles, Link2, ArrowRight } from 'lucide-react';
import Dashboard from './Dashboard';
import ContextHub from './ContextHub';

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
};

export default function AlexandriaPage() {
  const { data, isLoading, error, refetch } = useAlexandria();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(initialTab === 'exports' || initialTab === 'bridges' ? initialTab : 'dashboard');
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" aria-hidden="true" />
          <p className="text-muted-foreground">Carregando Alexandria...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 text-center max-w-md">
            <p className="text-destructive font-semibold mb-2" role="alert">Erro ao carregar dados</p>
            <p className="text-sm text-muted-foreground mb-4">
              {error?.message || 'Não foi possível conectar ao Supabase'}
            </p>
            <Button onClick={refetch} variant="outline" size="sm" aria-label="Tentar carregar dados novamente">
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Tentar novamente
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <AppLayout>
      <PageBreadcrumb />
      <motion.div
        className="space-y-6 p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <PageHeader
          eyebrow="Knowledge First"
          title="Alexandria"
          description="Second brain do Totum OS: fontes, artefatos, skills, POPs, decisões e pacotes de contexto para usar dentro ou fora do sistema."
          icon={BookOpen}
          actions={
            <>
              <Button onClick={() => navigate('/hermione')} className="gap-2">
                <Brain className="h-4 w-4" aria-hidden="true" />
                Consultar Hermione
              </Button>
              <Button onClick={refetch} variant="outline" size="sm" aria-label="Atualizar dados da Alexandria">
                <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                Atualizar
              </Button>
            </>
          }
        />

        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
          <motion.div variants={fadeIn}>
            <Card className="border-primary/20 bg-card transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center border border-primary/30 bg-primary/10 text-primary">
                    <Upload className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold">Hermione assimila documentos e devolve artefatos utilizáveis</p>
                    <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                      Envie MDs e textos de várias IAs para analisar, unificar, apontar lacunas e gerar skills, POPs, prompts, decisões ou pacotes de contexto com download.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['Claude', 'Kimi', 'ChatGPT', 'Gemini', 'MCP'].map((item) => (
                        <Badge key={item} variant="outline">{item}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={() => navigate('/hermione')} className="shrink-0 gap-2">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Criar artefato
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="border-border/80 bg-white transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-secondary text-primary">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Tutorial interativo da Alexandria</p>
                    <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                      Um tour guiado para entender o papel de cada página, como elas se conectam e qual resultado esperar no uso do dia a dia.
                    </p>
                  </div>
                </div>
                <Button onClick={() => navigate('/alexandria/tutorial')} className="shrink-0 gap-2">
                  Abrir tutorial
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Tabs principais */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6" aria-label="Seções da Alexandria">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Zap className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Biblioteca</span>
            </TabsTrigger>
            <TabsTrigger value="pops" className="flex items-center gap-2">
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">POPs & SLAs</span>
            </TabsTrigger>
            <TabsTrigger value="context" className="flex items-center gap-2">
              <Users className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Context Hub</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Skills Center</span>
            </TabsTrigger>
            <TabsTrigger value="bridges" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Conexões</span>
            </TabsTrigger>
            <TabsTrigger value="exports" className="flex items-center gap-2">
              <Download className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Exportar</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="dashboard" className="mt-6">
                <Dashboard data={data} />
              </TabsContent>

              <TabsContent value="pops" className="mt-6">
                <div className="flex items-center justify-center min-h-[40vh]">
                  <Card className="max-w-md w-full">
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-7 w-7 text-primary" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-xl">Portal POPs & SLAs</CardTitle>
                      <CardDescription>
                        Gerencie Procedimentos Operacionais Padrão e Acordos de Nível de Serviço do ecossistema Totum.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pt-4">
                      <Button onClick={() => navigate('/alexandria/pops')} className="gap-2">
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        Abrir
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="context" className="mt-6">
                <ContextHub agents={data.agents} />
              </TabsContent>

              <TabsContent value="skills" className="mt-6">
                <div className="flex items-center justify-center min-h-[40vh]">
                  <Card className="max-w-md w-full">
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
                        <Zap className="h-7 w-7 text-amber-500" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-xl">Skills Central</CardTitle>
                      <CardDescription>
                        Explore e gerencie todas as skills disponíveis nos agentes do ecossistema Totum.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pt-4">
                      <Button onClick={() => navigate('/alexandria/skills')} className="gap-2">
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        Abrir
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="bridges" className="mt-6">
                <Card className="border-primary/20 bg-card transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center border border-primary/30 bg-primary/10 text-primary">
                        <Link2 className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold">Conectar Segundo Cérebro sem vazar vida pessoal</p>
                        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                          Importe apenas pacotes sanitizados da Bulma/Logseq, classifique verde/amarelo/vermelho e crie uma fonte rastreável na Alexandria.
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/alexandria/bridges')} className="shrink-0 gap-2">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Abrir Conexões
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exports" className="mt-6">
                <div className="grid gap-4 lg:grid-cols-3">
                  {[
                    {
                      title: 'Pacote Claude',
                      description: 'Contexto longo, instruções, fontes e decisões em Markdown para continuar no Claude.',
                      icon: Brain,
                    },
                    {
                      title: 'Pacote ChatGPT/Gemini',
                      description: 'Prompt principal, exemplos, restrições e saída esperada para execução rápida.',
                      icon: Sparkles,
                    },
                    {
                      title: 'Pacote MCP/local',
                      description: 'Estrutura preparada para futuras inserções de contexto e skills em apps locais de IA.',
                      icon: GitBranch,
                    },
                  ].map((item) => (
                    <motion.div key={item.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <DataPanel>
                        <div className="flex items-start gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center border border-border bg-muted text-muted-foreground">
                            <item.icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{item.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                            <Button className="mt-4" variant="outline" onClick={() => navigate('/ai-command-center')}>
                              Preparar no Command Center
                            </Button>
                          </div>
                        </div>
                      </DataPanel>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
