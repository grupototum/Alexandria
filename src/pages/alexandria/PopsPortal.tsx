import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Filter,
  ChevronRight,
  ChevronDown,
  BookOpen,
  X,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const statusColors: Record<string, string> = {
  draft: 'bg-zinc-800 text-zinc-300',
  review: 'bg-yellow-500/10 text-yellow-400',
  approved: 'bg-emerald-500/10 text-emerald-400',
  deprecated: 'bg-red-500/10 text-red-400'
};

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  review: 'Revisão',
  approved: 'Aprovado',
  deprecated: 'Descontinuado'
};

interface Pop {
  id: string;
  titulo: string;
  descricao: string | null;
  departamento: string;
  status: string;
  sla_horas: number | null;
  responsavel: string | null;
  versao: string | null;
  conteudo: string | null;
  tags: string[] | null;
  criado_por: string | null;
  created_at: string;
  updated_at: string;
}

const emptyForm = {
  titulo: '',
  departamento: '',
  status: 'draft',
  sla_horas: 24,
  responsavel: '',
  descricao: ''
};

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: 'easeOut' },
};
const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};

export default function PopsPortal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartamento, setSelectedDepartamento] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pops, setPops] = useState<Pop[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchPops = async () => {
    setIsLoading(true);
    const { data, error } = await (supabase as any).from('pops').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setPops(data as Pop[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPops();
  }, []);

  const departamentos = [...new Set(pops.map(p => p.departamento))].sort();

  const filteredPops = pops.filter(pop => {
    if (selectedDepartamento && pop.departamento !== selectedDepartamento) return false;
    if (searchQuery && !pop.titulo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Stats computed from real data
  const approvedCount = pops.filter(p => p.status === 'approved').length;
  const avgSla = pops.length > 0
    ? Math.round(pops.reduce((sum, p) => sum + (p.sla_horas || 0), 0) / pops.length)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.departamento.trim()) {
      setFormError('Título e Departamento são obrigatórios.');
      return;
    }
    setFormError(null);
    setSubmitting(true);
    const { error } = await (supabase as any).from('pops').insert([{
      titulo: form.titulo.trim(),
      departamento: form.departamento.trim(),
      status: form.status,
      sla_horas: Number(form.sla_horas) || 24,
      responsavel: form.responsavel.trim() || null,
      descricao: form.descricao.trim() || null
    }]);
    setSubmitting(false);
    if (error) {
      setFormError('Erro ao salvar. Tente novamente.');
      return;
    }
    setForm(emptyForm);
    setShowForm(false);
    fetchPops();
  };

  return (
    <AppLayout>
      <PageBreadcrumb />
      <motion.div className="p-8 space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Header */}
        <motion.div variants={fadeIn} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Portal de POPs SLA</h1>
            <p className="text-muted-foreground mt-1">
              Procedimentos Operacionais Padrão com SLAs
            </p>
          </div>
          <Button onClick={() => setShowForm(v => !v)}>
            {showForm ? <X size={18} className="mr-2" aria-hidden="true" /> : <Plus size={18} className="mr-2" aria-hidden="true" />}
            {showForm ? 'Cancelar' : 'Novo POP'}
          </Button>
        </motion.div>

        {/* New POP inline form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              variants={fadeIn}
            >
              <Card className="border-primary/20 bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg">Novo Procedimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="titulo">Título *</Label>
                        <Input
                          id="titulo"
                          placeholder="Nome do procedimento"
                          value={form.titulo}
                          onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="departamento">Departamento *</Label>
                        <Input
                          id="departamento"
                          placeholder="Ex: Operações, Comercial..."
                          value={form.departamento}
                          onChange={e => setForm(f => ({ ...f, departamento: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="status">Status</Label>
                        <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                          <SelectTrigger id="status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Rascunho</SelectItem>
                            <SelectItem value="review">Revisão</SelectItem>
                            <SelectItem value="approved">Aprovado</SelectItem>
                            <SelectItem value="deprecated">Descontinuado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="sla_horas">SLA (horas)</Label>
                        <Input
                          id="sla_horas"
                          type="number"
                          min={1}
                          value={form.sla_horas}
                          onChange={e => setForm(f => ({ ...f, sla_horas: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="responsavel">Responsável</Label>
                        <Input
                          id="responsavel"
                          placeholder="Nome do responsável"
                          value={form.responsavel}
                          onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        placeholder="Descreva o procedimento..."
                        value={form.descricao}
                        onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    {formError && (
                      <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                        <AlertCircle size={14} aria-hidden="true" /> {formError}
                      </p>
                    )}
                    <div className="flex gap-3">
                      <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" />}
                        Salvar POP
                      </Button>
                      <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(emptyForm); setFormError(null); }}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter */}
        <motion.div variants={fadeIn}>
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
                  <Input
                    placeholder="Buscar POPs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter size={18} className="mr-2" aria-hidden="true" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Departments */}
        <motion.div variants={fadeIn} className="flex gap-2 flex-wrap">
          <Button
            variant={selectedDepartamento === null ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setSelectedDepartamento(null)}
          >
            Todos
          </Button>
          {departamentos.map((dept) => (
            <Button
              key={dept}
              variant={selectedDepartamento === dept ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSelectedDepartamento(dept)}
            >
              {dept}
            </Button>
          ))}
        </motion.div>

        {/* POPs List */}
        <motion.div variants={fadeIn}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Procedimentos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin mr-2" aria-hidden="true" />
                  <span className="text-muted-foreground">Carregando...</span>
                </div>
              ) : filteredPops.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText size={48} className="mx-auto mb-4 text-muted" aria-hidden="true" />
                  <p>Nenhum POP encontrado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPops.map((pop) => (
                    <div key={pop.id}>
                      <div
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === pop.id ? null : pop.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="text-primary" size={20} aria-hidden="true" />
                          </div>
                          <div>
                            <h4 className="font-medium">{pop.titulo}</h4>
                            <p className="text-sm text-muted-foreground">{pop.departamento}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={(statusColors[pop.status] || 'bg-zinc-800').split(' ')[0]}>
                            {statusLabels[pop.status] || pop.status}
                          </Badge>
                          {expandedId === pop.id ? (
                            <ChevronDown size={18} className="text-muted-foreground" aria-hidden="true" />
                          ) : (
                            <ChevronRight size={18} className="text-muted-foreground" aria-hidden="true" />
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedId === pop.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="border border-t-0 rounded-b-lg bg-muted/40 px-6 py-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wide">SLA</p>
                                  <p className="text-sm font-medium">{pop.sla_horas ? `${pop.sla_horas}h` : '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Responsável</p>
                                  <p className="text-sm font-medium">{pop.responsavel || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Versão</p>
                                  <p className="text-sm font-medium">{pop.versao || '1.0'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
                                  <p className="text-sm font-medium">{statusLabels[pop.status] || pop.status}</p>
                                </div>
                              </div>
                              {pop.descricao && (
                                <p className="text-sm text-muted-foreground leading-relaxed">{pop.descricao}</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* SLA Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div variants={fadeIn}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Clock size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SLA Médio</p>
                    <p className="text-2xl font-bold">{avgSla > 0 ? `${avgSla}h` : '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <CheckCircle size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aprovados</p>
                    <p className="text-2xl font-bold">{approvedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                    <BookOpen size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Departamentos</p>
                    <p className="text-2xl font-bold">{departamentos.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
