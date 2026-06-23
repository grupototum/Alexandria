import { describe, expect, it } from 'vitest';
import { inferAgentType, isAgentType, resolveAgentType } from './agent-type';

describe('isAgentType', () => {
  it('aceita as 5 categorias D-052', () => {
    for (const t of ['pesquisador', 'criativo', 'consultivo', 'execucao', 'orquestrador']) {
      expect(isAgentType(t)).toBe(true);
    }
  });

  it('rejeita valores fora do enum (inclusive legados conversational/processing)', () => {
    expect(isAgentType('conversational')).toBe(false);
    expect(isAgentType('processing')).toBe(false);
    expect(isAgentType(null)).toBe(false);
    expect(isAgentType(undefined)).toBe(false);
    expect(isAgentType('Orquestrador')).toBe(false);
  });
});

describe('inferAgentType', () => {
  it('tier 1 ou flag de orquestrador → orquestrador', () => {
    expect(inferAgentType({ name: 'Tot', tier: 1 })).toBe('orquestrador');
    expect(inferAgentType({ name: 'Qualquer', isOrchestrator: true })).toBe('orquestrador');
    expect(inferAgentType({ name: 'Maestro Geral' })).toBe('orquestrador');
  });

  it('keywords de pesquisa → pesquisador', () => {
    expect(inferAgentType({ name: 'radar_seo' })).toBe('pesquisador');
    expect(inferAgentType({ name: 'Ana', role: 'Analista de mercado' })).toBe('pesquisador');
  });

  it('keywords criativas → criativo', () => {
    expect(inferAgentType({ name: 'copy_master' })).toBe('criativo');
    expect(inferAgentType({ name: 'Léo', role: 'Designer de social media' })).toBe('criativo');
  });

  it('keywords consultivas → consultivo', () => {
    expect(inferAgentType({ name: 'hermione' })).toBe('consultivo');
    expect(inferAgentType({ name: 'Bia', role: 'Estrategista de contas' })).toBe('consultivo');
  });

  it('sem match → execucao (fallback)', () => {
    expect(inferAgentType({ name: 'Bob' })).toBe('execucao');
  });

  it('ordem de precedência espelha a migration (orquestrador antes de pesquisador)', () => {
    expect(inferAgentType({ name: 'Orquestrador de Pesquisa' })).toBe('orquestrador');
  });
});

describe('resolveAgentType', () => {
  it('metadata.type do DB vence a heurística', () => {
    expect(resolveAgentType({ type: 'criativo' }, { name: 'radar_seo' })).toBe('criativo');
  });

  it('metadata ausente ou inválido cai na heurística', () => {
    expect(resolveAgentType(null, { name: 'radar_seo' })).toBe('pesquisador');
    expect(resolveAgentType({ type: 'invalido' }, { name: 'copy_master' })).toBe('criativo');
    expect(resolveAgentType({}, { name: 'Bob' })).toBe('execucao');
  });
});
