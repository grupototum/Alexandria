-- M134 — Observabilidade de embedding em giles_knowledge.
--
-- Contexto: text-embedding-004 foi deprecado pelo Google (404). Esta é a 2ª
-- "morte de modelo" (D-079 obsoleta). Estas colunas permitem detectar drift de
-- modelo, re-index seletivo e migração dual-model futura sem downtime (M134.2).
--
-- Idempotente (ADD COLUMN IF NOT EXISTS). NÃO altera a coluna `embedding`
-- (vector(768) mantido; o teto de índice HNSW do pgvector é 2000 dims).
--
-- IMPORTANTE — sequenciamento:
--   O DEFAULT abaixo é 'text-embedding-004' porque, no momento em que esta
--   migration roda, os 657 embeddings existentes AINDA foram gerados por esse
--   modelo. O script de re-index (tools/alexandria-claude-mcp/scripts/reindex-giles.ts)
--   atualiza cada linha para 'gemini-embedding-001' conforme re-embeda.
--   Só DEPOIS do re-index completo é que o default deve virar gemini (ver rodapé).

ALTER TABLE public.giles_knowledge
  ADD COLUMN IF NOT EXISTS embedding_model text        NOT NULL DEFAULT 'text-embedding-004',
  ADD COLUMN IF NOT EXISTS embedding_dim   integer     NOT NULL DEFAULT 768,
  ADD COLUMN IF NOT EXISTS embedded_at     timestamptz NOT NULL DEFAULT now();

COMMENT ON COLUMN public.giles_knowledge.embedding_model IS
  'Modelo que gerou o embedding. M134: 657 existentes = text-embedding-004; re-index atualiza p/ gemini-embedding-001.';
COMMENT ON COLUMN public.giles_knowledge.embedding_dim IS
  'Dimensão do vetor de embedding (768; gemini-embedding-001 @ outputDimensionality=768).';
COMMENT ON COLUMN public.giles_knowledge.embedded_at IS
  'Timestamp da geração do embedding. Bump no re-index para auditar drift.';

-- ─────────────────────────────────────────────────────────────────────────────
-- PÓS-RE-INDEX (rodar SOMENTE após reindex-giles.ts concluir e validar):
--   ALTER TABLE public.giles_knowledge
--     ALTER COLUMN embedding_model SET DEFAULT 'gemini-embedding-001';
-- A ingestão (alexandriaIngestion.ts) deve passar a setar embedding_model
-- explicitamente no insert — o default é só rede de segurança.
-- ─────────────────────────────────────────────────────────────────────────────
