-- ════════════════════════════════════════════════════════════════════
-- M54 PR-2 — Backfill agents_config.metadata.type (D-052)
-- ════════════════════════════════════════════════════════════════════
-- Categorias D-052: pesquisador | criativo | consultivo | execucao | orquestrador
-- Escape hatch do contract v3: campo sem coluna dedicada vai no jsonb `metadata`.
-- Idempotente: só preenche quando metadata->>'type' ainda é nulo — re-rodar é no-op.
--
-- ⚠️ NÃO aplicada automaticamente (No-Fly Zone: dados em produção).
--    Aplicar via mcp__supabase__apply_migration após revisão do Rael.
--    Revisar o resultado com o SELECT de auditoria no fim do arquivo:
--    a heurística por keywords deve ser conferida agente a agente (18 rows).

DO $mig$
BEGIN
  -- 1. Orquestradores: tier 1, flag explícita ou naming de orquestração
  UPDATE public.agents_config
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('type', 'orquestrador')
  WHERE (metadata ->> 'type') IS NULL
    AND (
      tier = 1
      OR COALESCE(metadata ->> 'is_orchestrator', 'false') = 'true'
      OR name ~* '(orquestr|orchestr|maestro)'
    );

  -- 2. Pesquisadores: pesquisa, análise, monitoramento, dados
  UPDATE public.agents_config
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('type', 'pesquisador')
  WHERE (metadata ->> 'type') IS NULL
    AND (
      name ~* '(pesquis|research|anali|radar|monitor|scout|data|seo)'
      OR system_prompt ~* '(pesquisador|researcher|analista de dados|monitoramento)'
    );

  -- 3. Criativos: conteúdo, design, copy, vídeo, social
  UPDATE public.agents_config
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('type', 'criativo')
  WHERE (metadata ->> 'type') IS NULL
    AND (
      name ~* '(criat|creative|design|copy|video|roteir|content|social|imagem|arte)'
      OR system_prompt ~* '(criativo|copywriter|designer|roteirista|criação de conteúdo)'
    );

  -- 4. Consultivos: estratégia, consultoria, planejamento
  UPDATE public.agents_config
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('type', 'consultivo')
  WHERE (metadata ->> 'type') IS NULL
    AND (
      name ~* '(consult|estrateg|advis|mentor|planej|hermione)'
      OR system_prompt ~* '(consultor|estrategista|advisory|planejamento)'
    );

  -- 5. Execução: fallback para todos os restantes
  UPDATE public.agents_config
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('type', 'execucao')
  WHERE (metadata ->> 'type') IS NULL;
END
$mig$;

-- Auditoria pós-aplicação (rodar manualmente e conferir com o Rael):
-- SELECT agent_id, name, tier, metadata->>'type' AS type FROM public.agents_config ORDER BY name;
