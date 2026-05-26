# Alexandria Knowledge Canon — Pepper Expansion Layer

Status: proposta canônica V1, criada em 2026-05-23.
Dona do conhecimento: Hermione.
Operadora principal: Pepper.
Decisor: Rael.

## 1. Objetivo

Transformar a Alexandria na camada durável de conhecimento da Totum e na expansão cognitiva da Pepper.

A Alexandria deve guardar todo conhecimento que precisa sobreviver a uma conversa e ser reutilizado por agentes.

## 2. O que a Alexandria deve guardar

### Conhecimento institucional

- Quem é a Totum.
- História.
- Posicionamento.
- Ofertas.
- Processos.
- Playbooks.
- POPs.
- SLAs.
- Estratégias validadas.

### Conhecimento dos agentes

- Soul/DNA.
- Função.
- Ferramentas.
- Permissões.
- POP/SLA.
- Exemplos de uso.
- Critérios de qualidade.
- Histórico validado.

### Conhecimento comercial

- Objeções.
- Scripts.
- SPIN Selling.
- Qualificação.
- Follow-up.
- ICP.
- Clientes.
- Briefings.

### Conhecimento técnico

- Arquitetura dos sistemas.
- APIs.
- Deploys.
- Repositórios.
- Migrations.
- Incidentes.
- Decisões técnicas.

### Skills

- Skills de agentes.
- Prompts canônicos.
- Templates.
- Checklists.
- Frameworks de execução.

## 3. O que NÃO deve ir para Alexandria

- Segredos.
- Senhas.
- Tokens.
- Service role keys.
- Dados bancários.
- Informações pessoais desnecessárias.
- Estado transitório do dia.
- Rascunhos sem valor futuro.
- Conversas soltas sem curadoria.

## 4. Relação Pepper × Alexandria

Pepper tem memória operacional.
Alexandria tem memória institucional.

Pepper usa Alexandria para:

- recuperar contexto confiável;
- montar context packs;
- orientar agentes;
- reduzir invenção;
- manter continuidade entre sessões;
- transformar decisões em patrimônio operacional.

Alexandria usa Pepper para:

- receber prioridade;
- entender o que importa agora;
- receber curadoria operacional;
- transformar caos em estrutura.

## 5. Relação Hermione × Alexandria

Hermione é a Rainha de Alexandria.

Ela decide:

- onde cada conhecimento entra;
- qual status cada fonte recebe;
- o que é oficial;
- o que é legado;
- o que precisa de validação;
- o que deve ser bloqueado por risco.

## 6. Estados de conhecimento

### draft

Rascunho útil, ainda não validado.

### review

Material aguardando curadoria/validação.

### approved

Fonte confiável. Pode ser usada por agentes.

### superseded

Substituído por versão mais nova.

### deprecated

Não deve ser usado em operação atual.

### blocked

Não entra na Alexandria por risco de segurança, privacidade ou baixa qualidade.

## 7. Modelo canônico recomendado

Usar `hermione_*` como base canônica:

- `hermione_sources` guarda origem.
- `hermione_artifacts` guarda artefato curado.
- `hermione_artifact_versions` guarda histórico.
- `hermione_artifact_sources` liga artefato a fonte.
- `hermione_consultations` registra consultas.

Complementos necessários:

- embeddings 768D;
- campo ou tabela de domínio/taxonomia;
- score de confiabilidade;
- owner/responsável;
- status claro;
- log de escrita.

## 8. Taxonomia inicial

Domínios:

1. `totum_institucional`
2. `ofertas_produtos`
3. `processo_comercial`
4. `operacao_pop_sla`
5. `marketing`
6. `agentes_ia`
7. `sistemas_totum`
8. `clientes`
9. `skills_prompts`
10. `decisoes`

## 9. Context pack

Context pack é o formato padrão para agentes consumirem Alexandria.

Cada context pack deve conter:

```markdown
# Context Pack

Tarefa:
Agente:
Domínio:
Data:
Fontes consultadas:

## Instruções relevantes

## Conhecimento recuperado

## POP/SLA aplicável

## Restrições

## Lacunas
```

## 10. Fluxo de consulta

```txt
Pepper ou agente recebe tarefa
  -> define domínio e intenção
  -> chama Alexandria MCP/context pack
  -> Alexandria busca semanticamente
  -> retorna fontes aprovadas + rascunhos sinalizados
  -> agente executa com base rastreável
  -> lacunas voltam para Hermione
```

## 11. Fluxo de ingestão

```txt
Documento/conversa/skill/brief
  -> captura
  -> sanitização
  -> classificação
  -> embedding
  -> status review
  -> Hermione revisa
  -> approved ou blocked/deprecated
  -> disponível para context pack
```

## 12. Como isso expande a Pepper

Pepper deixa de depender só do contexto carregado na sessão.

Com Alexandria:

- Pepper recupera conhecimento institucional sob demanda.
- Pepper recebe contexto escopado para cada tarefa.
- Pepper consegue coordenar agentes com a mesma fonte.
- Pepper transforma decisões do Rael em sistema durável.
- Pepper identifica lacunas de conhecimento e manda Hermione corrigir.
- Pepper usa Alexandria como memória de longo prazo da agência.

## 13. Critério de sucesso

A fusão Pepper + Alexandria funciona quando:

1. Pepper consegue pedir um context pack antes de uma tarefa.
2. O context pack retorna fontes corretas e rastreáveis.
3. Hermione consegue promover/rejeitar conhecimento.
4. Agentes recebem contexto por domínio.
5. Novos conhecimentos entram com embedding.
6. Consultas sem resultado viram lacunas.
7. Nenhum segredo entra como conhecimento.

## 14. Primeira implantação recomendada

Prioridade:

1. Corrigir documentação divergente.
2. Proteger riscos críticos.
3. Definir `hermione_*` como canônico.
4. Migrar/espelhar `giles_knowledge` para `hermione_*`.
5. Backfill de embeddings.
6. Alterar MCP para busca semântica.
7. Criar primeiro context pack da Pepper.

## 15. Decisão canônica

A Alexandria não é apenas um app.

Ela é:

> A biblioteca viva da Totum, governada pela Hermione, consumida pela Pepper e pelos agentes, com Supabase/pgvector como base durável e MCP/context pack como interface operacional.
