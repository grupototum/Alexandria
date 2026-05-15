# 📋 GUIA: Fase 2+3 Unificado

## ✅ Segurança Validada

Unificar Fase 2+3 é **SEGURO** porque:

| Critério | Status | Motivo |
|----------|--------|--------|
| **Dependências** | ✅ Seguro | Alexandria é independente (só precisa credenciais) |
| **Dados Críticos** | ✅ Seguro | Apenas setup/config, sem produção |
| **Rollback** | ✅ Seguro | Git tag v1.0-pre-migration + Supabase backup ainda valem |
| **Checkpoints** | ✅ Seguro | Script tem validações entre fases |
| **Debug** | ✅ Seguro | Logs separados por fase, fácil identificar onde falhou |

---

## 🚀 Como Executar

### **Pré-requisitos**
```bash
# 1. Ter Fase 1 completa (Totum-Chat rodando em :3210)
# 2. .env.local com credenciais (do setup Fase 0)
# 3. SSH key configurada (~/.ssh/totum_vps_ed25519)
```

### **Executar o Script**

```bash
# Tornar executável
chmod +x ~/Documents/Claude/Projects/Totum\ OS/fase2-3-unificado.sh

# Executar
~/Documents/Claude/Projects/Totum\ OS/fase2-3-unificado.sh
```

---

## 📊 O que faz

### **Fase 2: Alexandria Setup (~4h)**
```
1. Clonar Alexandria localmente
2. Criar estrutura de pastas (src, scripts, docs, data)
3. Configurar package.json com dependências (Express, Supabase, Google Embedding)
4. Criar .env.alexandria com credenciais
5. Validar conexão Supabase
6. Criar scripts de migração (criar tabelas pgvector)
```

### **Fase 3: Integration (~4h)**

#### 3.1 - Configuração Básica
```
1. Configurar Totum-Chat para usar Alexandria
2. Criar endpoints em Alexandria
```

#### 3.2 - **Alexandria Skill Discovery** ⭐ NOVO
```
Princípio: "Não decidir se precisa de skill. A Alexandria define o que cobre."

Endpoints criados:
  POST /discover
    ↓ Input: query, context, types, limit
    ↓ Output: Descobrir skills, POPs, docs relevantes
    ↓ Score de relevância automático

  POST /rag/search (tradicional)
    ↓ Input: query
    ↓ Output: Documentos similares via embedding

Fluxo em Totum-Chat:
  1. User pergunta algo
  2. SEMPRE consulta /discover PRIMEIRO
  3. Se skill_discovery relevance > 0.8: lê skill antes de responder
  4. Depois faz RAG search como contexto adicional
  5. Responde com conhecimento da Alexandria integrado

Integração:
  • discoverRelevantSkills() - consultar skills
  • enhanceWithRAG() - RAG search + Skill Discovery
  • processMessageWithAlexandria() - orquestração
```

#### 3.3 - Testes End-to-End
```
1. Health checks (Alexandria + Totum-Chat)
2. Teste de Skill Discovery
3. Teste de RAG search
4. Teste full integration (chat com Alexandria)
5. Validação de relevância e recomendações
```

---

## 📍 Outputs do Script

Após execução, você terá:

```
/tmp/totum-migration/
├── Alexandria/                          # Repositório Alexandria
│   ├── src/
│   ├── scripts/
│   │   └── migrate-supabase.js         # Criar tabelas
│   ├── tests/
│   │   └── test-rag.js                 # Validar pipeline
│   ├── package.json
│   └── .env.alexandria
├── FASE2-3-STATUS.md                   # Relatório de status
└── fase2-3-TIMESTAMP.log               # Logs detalhados
```

---

## ✨ Alexandria Skill Discovery (Integrado em Fase 3)

### O que é?

Sistema que OBRIGA todo agente/chat a **sempre consultar** a Alexandria ANTES de executar qualquer tarefa:

```
Tarefa Recebida
    ↓
[OBRIGATÓRIO] Consultar Alexandria.discover()
    ↓
Descobrir: Skills, POPs, Documentação, Contexto
    ↓
Se relevance > 0.8: LER ANTES DE AGIR
    ↓
Se relevance 0.5-0.8: USAR COMO CONTEXTO
    ↓
Se relevance < 0.5: PROSSEGUIR COM CAUTION
```

### Endpoints Automáticos

```bash
# Descobrir skills relevantes
POST http://localhost:5000/discover
{
  "query": "como criar um agente",
  "context": "desenvolvimento",
  "types": ["skill", "pop", "doc"],
  "limit": 5
}

Response:
{
  "discovered": [
    {
      "type": "pop",
      "name": "POP-001-CRIACAO-AGENTES",
      "relevance": 0.98,
      "path": "planos/POP-001.md",
      "summary": "..."
    }
  ],
  "recommended_action": "read_skill_first",
  "primary_skill": {...}
}
```

### Integração em Totum-Chat

**Automático!** Quando você pergunta algo em Totum-Chat:

1. Sistema chama `discoverRelevantSkills()`
2. Retorna skills/POPs relevantes com scores
3. Se score > 0.8: prepara conhecimento antes de responder
4. Resposta vem com contexto da Alexandria

**Exemplo:**
```
You: "Como criar um novo agente?"
    ↓
Alexandria.discover() → Encontra POP-001-CRIACAO-AGENTES (0.98)
    ↓
Sistema: "⚠️ Encontrei procedimento relevante. Consultando..."
    ↓
Resposta alinhada com o procedimento oficial
```

### Benefícios

- ✅ **Consistência**: Todos os agentes seguem mesmos procedimentos
- ✅ **Governança**: Nada executa contra as POPs
- ✅ **Aprendizado**: Alexandria cresce com cada tarefa
- ✅ **Segurança**: Validação automática de contexto
- ✅ **Rastreabilidade**: Cada ação é baseada em documentação

---

## ✨ Próximos Passos

Após o script executar com sucesso:

```bash
# 1. Entrar no diretório Alexandria
cd /tmp/totum-migration/Alexandria

# 2. Instalar dependências
npm install

# 3. Migrar Supabase
node scripts/migrate-supabase.js

# 4. Testar RAG pipeline
node tests/test-rag.js

# 5. Deploy Alexandria na VPS (em git push)
cd /opt/Alexandria  # na VPS
npm install
npm run start       # start Alexandria server :5000
```

---

## 🔍 Se algo der errado

### **Problema: SSH falha**
```bash
# Verificar chave
ssh -i ~/.ssh/totum_vps_ed25519 root@187.127.4.140 "echo ok"

# Se falhar, regenerar
ssh-copy-id -i ~/.ssh/totum_vps_ed25519.pub root@187.127.4.140
```

### **Problema: Credenciais faltando**
```bash
# Verificar .env.local
cat ~/.env.local

# Deve ter: GROQ_API_KEY, GOOGLE_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY
```

### **Problema: Supabase connection falha**
```bash
# Testar conexão Supabase
curl -X GET \
  "https://YOUR_PROJECT.supabase.co/rest/v1/" \
  -H "apikey: YOUR_ANON_KEY"
```

---

## 📝 Rollback (se necessário)

Se algo der errado e você quiser voltar:

```bash
# 1. Limpar trabalho parcial
rm -rf /tmp/totum-migration/Alexandria
rm -rf /opt/Alexandria  # na VPS

# 2. Voltar git tag
git checkout v1.0-pre-migration

# 3. Restaurar Supabase (você tem backup de Fase 0)
# Use dashboard Supabase → Backups → Restore
```

---

## 🎯 Estimativa de Tempo

| Etapa | Tempo | Status |
|-------|-------|--------|
| Setup local | 5 min | Automático |
| Fase 2 setup | 30 min | Automático |
| Supabase config | 15 min | Automático |
| Fase 3 integração | 20 min | Automático |
| Testes | 10 min | Manual |
| **Total** | **~1.5h** | ✅ |

Depois (deploy na VPS): ~1h adicional

---

## ❓ Dúvidas?

Se algo não rodar como esperado:
1. Cole o log: `cat /tmp/totum-migration/fase2-3-*.log`
2. Mostra qual fase falhou
3. Fazemos debug + refazemos só aquela parte

Quer executar agora? 👇
