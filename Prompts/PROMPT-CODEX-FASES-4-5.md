# 🚀 PROMPT para CODEX — Fases 4-5 TOTUM 3.0 Migration

**Para passar para Codex/próximo agente:**

---

```
TOTUM 3.0 Migration — Fases 4-5: Dashboard + Auto-Ingestão

═══════════════════════════════════════════════════════════════

CONTEXTO ATUAL:
───────────────
✅ Fases 1-3: 100% COMPLETAS
   - LobeHub rodando em chat.grupototum.com
   - Alexandria operacional em alexandria.grupototum.com
   - Skill Discovery ativo como SYSTEM_AGENT
   - Supabase pgvector com tabelas de RAG

Endpoints ativos:
   ✅ POST /discover (Skill Discovery)
   ✅ POST /rag/search (semantic search)
   ✅ POST /ingest (document ingestion)

Status: 🟢 PRODUÇÃO | Custo: R$ 0/mês | Uptime: 24/7

═══════════════════════════════════════════════════════════════

TAREFA GERAL:
─────────────
Completar Fases 4 e 5 do TOTUM 3.0 Migration
  - Fase 4: Dashboard + Plugin Manager (8h, Days 8-9)
  - Fase 5: Auto-Ingestão Logseq + Drive (8h, Days 10-11)

═══════════════════════════════════════════════════════════════

FASE 4: DASHBOARD + PLUGIN MANAGER
═══════════════════════════════════

Objetivo: Interface web para gerenciar Alexandria

A. Dashboard Front-end (React + Vite + Tailwind)
   ─────────────────────────────────────────
   Localização: /opt/Alexandria/frontend/ (criar)

   Componentes:

   1. Auth Module
      ├─ Login (email/senha ou OAuth Google)
      ├─ JWT token management
      └─ Session storage

   2. Document Management
      ├─ Upload documents (drag-drop)
      │  ├─ PDF, MD, TXT, DOCX
      │  ├─ Auto-extract text
      │  └─ Auto-generate embeddings
      ├─ Document list view
      │  ├─ Search by name/source
      │  ├─ Filter by date/type
      │  └─ Bulk actions (delete, re-embed)
      ├─ Document detail view
      │  ├─ Preview content
      │  ├─ Embedding status
      │  ├─ Vector metadata
      │  └─ Delete/Edit
      └─ Batch upload progress

   3. Skills/POPs Manager
      ├─ List all skills (discoverable)
      ├─ Create new skill
      │  ├─ Name, description, relevance tags
      │  ├─ Links para docs relacionados
      │  └─ Version control
      ├─ Edit skill
      └─ Delete skill

   4. Query History & Analytics
      ├─ Query history table
      │  ├─ timestamp, query, response
      │  ├─ Skill Discovery results
      │  └─ User feedback (useful/not useful)
      ├─ Analytics dashboard
      │  ├─ Queries per day
      │  ├─ Top discovered skills
      │  ├─ Average response time
      │  └─ User satisfaction rate
      └─ Export data (CSV/JSON)

   5. Settings & Configuration
      ├─ API keys management
      ├─ Rate limits config
      ├─ Cache settings
      ├─ Webhook configuration
      └─ Integration settings

B. Admin Panel Backend (Express endpoints)
   ──────────────────────────────────────

   Endpoints:

   POST /admin/documents/upload
      ├─ Input: FormData with file
      ├─ Auto-parse and embed
      └─ Return: document_id, embedding_status

   GET /admin/documents
      ├─ List all documents
      ├─ Query params: search, type, date_range, limit, offset
      └─ Return: paginated documents with metadata

   GET /admin/documents/:id
      ├─ Get document details
      └─ Return: content, embedding, metadata

   DELETE /admin/documents/:id
      ├─ Delete document + embeddings
      └─ Return: success confirmation

   POST /admin/skills
      ├─ Create new skill
      ├─ Input: { name, description, tags, related_docs }
      └─ Return: skill_id

   GET /admin/skills
      ├─ List all skills
      └─ Return: skills with metadata

   PUT /admin/skills/:id
      ├─ Update skill
      └─ Return: updated skill

   DELETE /admin/skills/:id
      ├─ Delete skill
      └─ Return: success

   GET /admin/analytics
      ├─ Query history
      ├─ Top skills discovered
      ├─ Usage metrics
      └─ Return: analytics data

   GET /admin/health
      ├─ API status
      ├─ DB connections
      ├─ Vector index health
      └─ Return: health status

C. Plugin System Architecture
   ─────────────────────────

   Plugin structure:
   ```
   /opt/Alexandria/plugins/
   ├── plugin-manifest.json
   ├── my-plugin/
   │   ├── plugin.js
   │   ├── config.json
   │   └── hooks.js
   ```

   Hooks available:
   - onBeforeDiscover(query, context)
   - onAfterDiscover(results)
   - onBeforeRag(query)
   - onAfterRag(results)
   - onBeforeIngest(documents)
   - onAfterIngest(result)
   - onBeforeResponse(response)
   - onAfterResponse(response)

   Plugin API:
   - register(name, config)
   - hook(event, callback)
   - config(key)
   - logger
   - cache
   - db

═══════════════════════════════════════════════════════════════

FASE 5: AUTO-INGESTÃO (LOGSEQ + GOOGLE DRIVE)
═════════════════════════════════════════════

Objetivo: Sincronização automática de documentos

A. Logseq Connector
   ────────────────

   Funcionalidade:
   ├─ Ler docs do Logseq via API
   ├─ Parser markdown com metadata
   ├─ Ingestão automática para Alexandria
   ├─ Sync incremental (apenas novos/modificados)
   └─ Versioning de docs

   Implementação:

   1. Logseq API Integration
      ├─ OAuth com Logseq
      ├─ Monitorar pasta específica
      │  └─ Exemplo: /pages/knowledge-base/
      └─ Puxar metadata de tags

   2. Document Parser
      ├─ Parse markdown
      ├─ Extract metadata (tags, dates, authors)
      ├─ Convert to plaintext
      └─ Preserve structure

   3. Auto-Ingest Flow
      ├─ Detect changes (timestamp)
      ├─ Download document
      ├─ Parse & clean
      ├─ Generate embeddings
      ├─ Store in Alexandria
      └─ Update sync log

   4. Scheduler
      ├─ Cron job: daily sync (configurável)
      ├─ Manual sync button
      ├─ Sync status page
      └─ Error handling & retry

B. Google Drive Connector
   ──────────────────────

   Funcionalidade:
   ├─ Monitorar pasta no Drive
   ├─ Suportar PDFs, Docs, Sheets, TXTs
   ├─ Auto-convert Docs para plaintext
   ├─ Ingestão automática
   └─ Versioning

   Implementação:

   1. Google Drive OAuth
      ├─ Setup OAuth 2.0
      ├─ Monitor specific folder
      │  └─ Exemplo: "TOTUM Knowledge Base" folder
      └─ Track file changes

   2. File Type Handlers
      ├─ PDF: pdfparse → text
      ├─ Google Docs: export as DOCX → parse
      ├─ Google Sheets: convert to CSV → parse
      ├─ TXT: direct ingest
      └─ MD: direct ingest

   3. Auto-Ingest Flow
      ├─ List files in folder
      ├─ Compare with local manifest
      ├─ Download new/modified files
      ├─ Parse content (type-specific)
      ├─ Generate embeddings
      ├─ Store in Alexandria
      └─ Update manifest

   4. Scheduler
      ├─ Cron job: hourly/daily sync (configurável)
      ├─ Manual sync trigger
      ├─ Incremental sync (apenas mudanças)
      └─ Conflict resolution (versioning)

C. Unified Scheduler
   ─────────────────

   Endpoints:

   POST /admin/connectors/logseq/sync
      ├─ Trigger Logseq sync manually
      └─ Return: sync results

   POST /admin/connectors/drive/sync
      ├─ Trigger Drive sync manually
      └─ Return: sync results

   GET /admin/connectors/status
      ├─ Logseq last sync time
      ├─ Drive last sync time
      ├─ Documents ingested
      └─ Next scheduled sync

   POST /admin/connectors/config
      ├─ Update sync schedule (cron)
      ├─ Set monitored folders
      └─ Configure file types

   GET /admin/connectors/logs
      ├─ Sync history
      ├─ Errors/warnings
      └─ Ingestion logs

═══════════════════════════════════════════════════════════════

TAREFAS DETALHADAS:

FASE 4 (Days 8-9, ~8 horas):
────────────────────────────

Day 8 (4h):
  1. Setup React frontend
     - npm create vite@latest alexandria-dashboard
     - Install deps: tailwind, react-router, axios
     - Create folder structure

  2. Build Dashboard UI
     - Login page
     - Navbar/sidebar navigation
     - Document upload form (drag-drop)
     - Document list view

  3. Connect to backend
     - POST /admin/documents/upload
     - GET /admin/documents
     - Implement error handling

Day 9 (4h):
  4. Complete remaining components
     - Skills/POPs manager
     - Query history & analytics
     - Settings page

  5. Admin panel endpoints
     - Implement all Express routes
     - Auth middleware
     - Input validation

  6. Testing & deployment
     - Test all features
     - Deploy to /opt/Alexandria/frontend
     - Nginx static file serving

FASE 5 (Days 10-11, ~8 horas):
──────────────────────────────

Day 10 (4h):
  1. Logseq Connector
     - OAuth setup
     - API integration
     - Markdown parser
     - Auto-ingest flow

  2. Google Drive Connector
     - OAuth setup
     - File type handlers (PDF, Docs, Sheets)
     - Auto-ingest flow

Day 11 (4h):
  3. Unified Scheduler
     - Cron job setup
     - Sync orchestration
     - Versioning & conflict resolution

  4. Testing & monitoring
     - Test both connectors
     - Setup sync logs
     - Deploy to production
     - Monitor first sync

═══════════════════════════════════════════════════════════════

ENTREGÁVEIS:

Fase 4:
  ✅ React Dashboard (running on :3000 locally, :5001 in prod)
  ✅ Admin panel endpoints (Express backend)
  ✅ Plugin system architecture
  ✅ Documentation

Fase 5:
  ✅ Logseq Connector (auto-sync working)
  ✅ Google Drive Connector (auto-sync working)
  ✅ Unified Scheduler (cron jobs active)
  ✅ Versioning & conflict resolution
  ✅ Monitoring & logging

═══════════════════════════════════════════════════════════════

VALIDAÇÕES:

Fase 4:
  ✅ Dashboard accessible at localhost:3000
  ✅ Upload documents successfully
  ✅ Query history displayed
  ✅ Analytics dashboard working
  ✅ Plugin system functional

Fase 5:
  ✅ Logseq docs auto-synced daily
  ✅ Drive docs auto-synced hourly
  ✅ Manual sync triggers working
  ✅ Versioning tracking changes
  ✅ Conflict resolution tested
  ✅ Logs show sync history

═══════════════════════════════════════════════════════════════

REFERÊNCIA:

Documentação: ~/Documents/Claude/Projects/Totum OS/
  - STATUS-TOTUM-3.0-COMPLETO.md (contexto atual)
  - ALEXANDRIA-SKILL-DISCOVERY.md (Skill Discovery spec)
  - GUIA-FASE2-3-UNIFICADO.md (implementação)

Endpoints ativos:
  - https://chat.grupototum.com (LobeHub)
  - https://alexandria.grupototum.com (API)

VPS: 187.127.4.140
Repo: https://github.com/grupototum/Alexandria

═══════════════════════════════════════════════════════════════

PRÓXIMA AÇÃO:

Escolher uma:
  A) Começar Fase 4 (Dashboard)
  B) Começar Fase 5 (Auto-Ingestão)
  C) Ambas em paralelo

Comando para começar:
  "Começa Fase 4: Dashboard + Plugin Manager"
  ou
  "Começa Fase 5: Auto-Ingestão Logseq + Drive"
```

---

## 📋 Como Usar

### **Opção 1: Passar para Codex via Mensagem**
Cole o prompt completo acima em uma conversa com Codex.

### **Opção 2: Salvar como Arquivo de Referência**
Arquivo salvo em:
```
~/Documents/Claude/Projects/Totum OS/PROMPT-CODEX-FASES-4-5.md
```

### **Opção 3: Resumo Rápido**
Se Codex pedir resumo, use:
```
TOTUM 3.0 Fases 4-5:

Fase 4 (8h): Dashboard React + Admin Panel + Plugin System
- Upload docs, manage skills, query history, analytics
- Express backend: /admin/documents, /admin/skills, /admin/analytics

Fase 5 (8h): Auto-Ingestão Logseq + Google Drive
- Logseq connector: OAuth + markdown parser + daily sync
- Drive connector: OAuth + file handlers (PDF/Docs/Sheets) + hourly sync
- Unified scheduler with versioning & conflict resolution

Context: Fases 1-3 completas, zero-cost architecture, production-ready
```

---

## 🚀 Próxima Ação

**Você quer:**
- A) Passar tudo isso para Codex agora?
- B) Escolher uma fase específica primeiro?
- C) Fazer ajustes no prompt?

👇 **O que faz?**
