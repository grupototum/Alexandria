# 🔗 TOTUM 3.0 — DEPENDENCY MATRIX & CRITICAL PATH

> Análise de quais fases dependem de quais, onde estão os gargalos, e o que pode ser paralelizado.

---

## 🎯 MATRIZ DE DEPENDÊNCIAS

```
FASE 0 (PREP)
    ├─ 0.1 Credenciais (Groq, Google, Supabase)  [CRÍTICO]
    ├─ 0.2 Repos (Alexandria, Totum-Chat)         [CRÍTICO]
    ├─ 0.3 Backup Supabase                        [CRÍTICO]
    └─ 0.4 Tags & Logs                            [INFORMATIVO]
         │
         └──> BLOQUEADOR para: Fases 1, 2, 3, 4, 5, 6

         Tempo: 2h
         Status: EXECUTÁVEL AGORA
         Responsável: Israel
         Parallelizável: SIM (não tem dependências internas)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FASE 1 (LOBEHUB NA VPS)
    ├─ 1.1 Docker setup na VPS                    [CRÍTICO]
    ├─ 1.2 Ollama + modelos (qwen3:8b, 1.7b)      [CRÍTICO]
    ├─ 1.3 Config providers (Ollama, Groq, Gemini)[CRÍTICO]
    ├─ 1.4 Nginx reverse proxy + SSL              [CRÍTICO]
    ├─ 1.5 DNS configurado                        [CRÍTICO]
    │
    ├──> Depende de: Fase 0 (credenciais + repos)
    ├──> BLOQUEADOR para: Fases 2, 4, 5
    │
    ├──> Pode rodar EM PARALELO com: Fase 3 (Alexandria coding)
    │
    │    Motivo: Alexandria não precisa LobeHub rodando
    │    Ela usa Supabase + Gemini API diretamente
    │
    Tempo: 6h (Dias 2-3)
    Status: BLOCADO até Fase 0 ✓
    Responsável: Israel (ou DevOps)
    Parallelizável: NÃO (fases internas sequenciais)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FASE 3 (ALEXANDRIA STANDALONE) **PODE RODAR EM PARALELO COM FASE 1**
    ├─ 3.1 Extrair código do Totum-OS             [CRÍTICO]
    ├─ 3.2 Criar projeto Vite standalone          [CRÍTICO]
    ├─ 3.3 Config Supabase                        [CRÍTICO]
    ├─ 3.4 Deploy (Vercel ou VPS)                 [CRÍTICO]
    └─ 3.5 API endpoints para plugin              [CRÍTICO]
         │
         ├──> Depende de: Fase 0 (repos + credenciais)
         ├──> NÃO depende de: Fase 1 (LobeHub)
         ├──> BLOQUEADOR para: Fase 4 (plugin)
         │
         ├──> Pode rodar EM PARALELO com: Fase 1
         │    (Enquanto instalam Ollama na VPS, vocês codificam Alexandria)
         │
    Tempo: 8h (Dias 5-7)
    Mas pode COMEÇAR: Dia 2 (junto com Fase 1)
    Status: BLOCADO até Fase 0 ✓
    Responsável: Israel + Frontend dev
    Parallelizável: SIM (com Fase 1)
         ↓
         OPORTUNIDADE: Começar Fase 3 no Dia 2 (paralelizar com Fase 1)
         RESULTADO: Ganhar 6 dias de overlap

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FASE 2 (IMPORTAR AGENTES)
    ├─ 2.1 Clonar agency-agents DNAs              [CRÍTICO]
    ├─ 2.2 Importar agentes no LobeHub            [CRÍTICO]
    ├─ 2.3 Importar agentes Totum existentes      [CRÍTICO]
    └─ 2.4 Testar cada agente                     [CRÍTICO]
         │
         ├──> Depende de: Fase 1 (LobeHub rodando)
         ├──> BLOQUEADOR para: Fase 4 (plugin testing)
         │
    Tempo: 3h (Dia 4)
    Status: BLOCADO até Fase 1 ✓
    Responsável: Israel
    Parallelizável: NÃO (precisa LobeHub running)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FASE 4 (PLUGIN ALEXANDRIA ↔ LOBEHUB)
    ├─ 4.1 Criar plugin LobeHub                   [CRÍTICO]
    ├─ 4.2 Config function calling                [CRÍTICO]
    └─ 4.3 Testar integração end-to-end           [CRÍTICO]
         │
         ├──> Depende de: Fase 1 (LobeHub) + Fase 3 (Alexandria API)
         ├──> BLOQUEADOR para: Fase 5 (data flow)
         │
    Tempo: 4h (Dia 8)
    Status: BLOCADO até Fase 1 + 3 ✓
    Responsável: Israel
    Parallelizável: NÃO (precisa Fase 1 + 3)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FASE 5 (FLUXO DE CAPTURA DE DADOS)
    ├─ 5.1 n8n workflow (captura de outputs)      [CRÍTICO]
    ├─ 5.2 Categorias de ingestão                 [CRÍTICO]
    └─ 5.3 Google Drive watch + Email ingestion   [CRÍTICO]
         │
         ├──> Depende de: Fase 3 (Alexandria) + Fase 4 (plugin)
         ├──> BLOQUEADOR para: Fase 6 (cutover)
         │
    Tempo: 4h (Dias 9-10)
    Status: BLOCADO até Fase 4 ✓
    Responsável: Israel (n8n config)
    Parallelizável: NÃO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FASE 6 (CUTOVER & DEMO)
    ├─ 6.1 Validação lado a lado                  [CRÍTICO]
    ├─ 6.2 Migrar DNS                             [CRÍTICO]
    └─ 6.3 Demo sócios + guia                     [INFORMATIVO]
         │
         ├──> Depende de: Fase 5 (tudo pronto)
         ├──> BLOQUEADOR para: PRODUÇÃO
         │
    Tempo: 2h (Dia 11)
    Status: BLOCADO até Fase 5 ✓
    Responsável: Israel
    Parallelizável: NÃO (final)
```

---

## 🚨 CAMINHO CRÍTICO (Critical Path)

```
Dia 1  → Fase 0: Credenciais + Repos (2h)           [CRÍTICO]
           │
           ├─────────────────┬────────────────────┐
           │                 │                    │
Dias 2-3→ Fase 1: LobeHub    │   Fase 3: Alexandria (pode começar)
         (6h, VPS)           │   (pode começar em paralelo)
           │                 │
           ├─────────────────┘
           │
Dia 4   → Fase 2: Agentes (3h, requer Fase 1)   [CRÍTICO]
           │
Dias 5-7→ Fase 3: Alexandria (cont. + finish)   [CRÍTICO]
           │
Dia 8   → Fase 4: Plugin (4h, requer 1+3)       [CRÍTICO]
           │
Dias 9-10→ Fase 5: Data flow (4h, requer 4)     [CRÍTICO]
           │
Dia 11  → Fase 6: Cutover (2h, requer 5)        [CRÍTICO]

TOTAL: 11 dias sequenciais (mas com 6 dias de overlap possível)
TEMPO DE TRABALHO: 31 horas
CAMINHO CRÍTICO: Fase 0 → 1 → 2 → 4 → 5 → 6
                 (todas as outras alimentam este caminho)
```

---

## 💡 OTIMIZAÇÕES POSSÍVEIS

### Opção A: Serializado (plano original)
```
Dia 1:  Fase 0 (2h)
Dias 2-3: Fase 1 (6h)
Dia 4:  Fase 2 (3h)
Dias 5-7: Fase 3 (8h)
Dia 8:  Fase 4 (4h)
Dias 9-10: Fase 5 (4h)
Dia 11: Fase 6 (2h)

Total: 11 dias (plano original) ✓
```

### Opção B: Parallelizado (RECOMENDADO) 🚀

```
Dia 1:  Fase 0 (2h)
        │
        ├─ Dias 2-3 (6h): Fase 1 (LobeHub VPS)
        │
        ├─ Dias 2-6 (8h): Fase 3 (Alexandria coding)  ← PARALELO!
        │                 (enquanto instalam Ollama)
        │
        Dia 4:  Fase 2 (3h, precisa Fase 1 rodando)
        │
        Dia 8:  Fase 4 (4h, precisa Fase 1 + 3)
        │
        Dias 9-10: Fase 5 (4h)
        │
        Dia 11: Fase 6 (2h)

Total: AINDA 11 dias (mas com MAIS OVERLAP)
BENEFÍCIO: Menos stress, mais tempo para QA, menos noites

Tarefas em paralelo:
- Israel (ou DevOps) cuida da VPS (Fase 1)
- Frontend dev cuida de Alexandria (Fase 3)
- Eles se encontram no Dia 4 com Fase 1 + 3 prontas
```

### Opção C: Agressiva (se tiver 2 devs)

```
Dia 1:  Fase 0 (2h)
        │
Dias 2-3:
        ├─ Dev1: Fase 1 (LobeHub VPS)
        └─ Dev2: Fase 3 (Alexandria frontend)

Dia 4:  Fase 2 (Dev1, 3h)

Dias 5-6:
        ├─ Dev1: Fase 4 (plugin)
        └─ Dev2: Refinamentos Alexandria

Dias 7-8: Fase 5 (n8n setup, pode ser Dev1 ou Dev2)

Dias 9-10: QA completo (ambos)

Dia 11: Cutover

RESULTADO: Mais relaxado, melhor qualidade
TRADEOFF: Precisa de 2 devs simultâneos
```

---

## 🎯 BLOQUEADORES E RISCOS DO CAMINHO CRÍTICO

```
BLOQUEADOR 1: Fase 0 não completa
  └─ Afeta: TUDO (Fases 1-6)
  └─ Mitigação: Fazer Fase 0 PRIMEIRO, sem paralelizar
  └─ Tempo: 2h, fácil de completar

BLOQUEADOR 2: VPS não tem espaço/RAM para Ollama
  └─ Afeta: Fase 1, logo Fases 2-6
  └─ Mitigação: Validar espaço ANTES (ls -lh / no VPS)
  └─ Fallback: Usar qwen3:1.7b (menor) ou mover Ollama para NFS

BLOQUEADOR 3: Supabase credenciais inválidas
  └─ Afeta: Fases 3, 5 (Alexandria)
  └─ Mitigação: Testar creds em Fase 0
  └─ Fallback: Criar novo projeto Supabase

BLOQUEADOR 4: Groq/Gemini limits atingidos
  └─ Afeta: Fases 1-2, depois Fases 4-5
  └─ Mitigação: Usar Ollama local como fallback (já in-place)
  └─ Zero impacto: Ollama está sempre disponível

BLOQUEADOR 5: Sócios não conseguem logar em apps.grupototum.com
  └─ Afeta: Fase 2 (teste de agentes)
  └─ Mitigação: Usar ACCESS_CODE simples + IP whitelisting
```

---

## 📊 GRÁFICO GANTT (ASCII)

```
Fase    Dias    |--|--|--|--|--|--|--|--|--|--|--| Status
────────────────────────────────────────────────────
0       D1      |██| Credenciais + Repos        CRÍTICO

1       D2-3    |--███████| LobeHub VPS         CRÍTICO
3       D2-6    |--████████████| Alexandria     CRÍTICO (paralelo!)

2       D4      |---███| Agentes                CRÍTICO
4       D8      |------████| Plugin              CRÍTICO
5       D9-10   |--------████| Data flow         CRÍTICO
6       D11     |----------██| Cutover           CRÍTICO

Legenda:
|--| = esperando
|██| = executando
```

---

## ✅ CHECKLIST DE MONITORAMENTO

```
Pré-Fase 0:
[ ] Verificar espaço VPS: df -h /  (precisa 20GB)
[ ] Verificar RAM VPS: free -h     (precisa 4GB)
[ ] Validar acesso SSH à VPS
[ ] Confirmar credenciais Supabase existentes

Pré-Fase 1:
[ ] Groq API key testada (curl test request)
[ ] Google API key testada (curl test request)
[ ] DNS pode ser modificado (acesso painel)

Pré-Fase 3 (se paralelizar):
[ ] Node.js 18+ no machine de desenvolvimento
[ ] npm/yarn funcionando
[ ] Git clone Totum-OS sucesso

Checkpoint Dia 4 (Fase 2):
[ ] LobeHub rodando em [apps.grupototum.com](http://apps.grupototum.com)
[ ] Ollama respondendo (ollama list)
[ ] Groq API key ativo
[ ] Gemini API ativo

Checkpoint Dia 8 (Fase 4):
[ ] Alexandria rodando em [alexandria.grupototum.com](http://alexandria.grupototum.com)
[ ] Plugin criado e testado
[ ] Busca Alexandria ↔ LobeHub funciona

Final (Dia 11):
[ ] DNS migrado
[ ] Legacy Totum-OS em [legacy.grupototum.com](http://legacy.grupototum.com)
[ ] Sócios conseguem logar
[ ] Agentes respondendo
[ ] Hermione chat funcionando
```

---

## 🎓 RECOMENDAÇÃO FINAL

**Usar Opção B (Parallelizado)**:
- Mesma duração (11 dias)
- Menos stress
- Tempo para QA e fixes
- Mais profissional

**Se for paralelizar**:
1. Israel cuida Fase 1 (VPS)
2. Frontend dev cuida Fase 3 (Alexandria)
3. Se não tiver dev: fazer Opção A (serializado, mas tudo corre bem)

**Crítico**: Não pular Fase 0. É o gargalo que libera tudo.

---

*Análise de dependências para TOTUM 3.0*
*Próximo: Executar Fase 0*
