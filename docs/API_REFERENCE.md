# API Reference

Base URL:

`https://alexandria.grupototum.com`

## GET `/health`

Returns service health.

Example:

```json
{
  "status": "ok",
  "service": "alexandria-api",
  "ts": "2026-05-12T23:33:31.531Z"
}
```

## POST `/alexandria/discover`

Discovers relevant skills, POPs and documents for a query.

Request:

```json
{
  "query": "onboarding de cliente",
  "context": "Totum",
  "types": ["skill", "pop", "doc"],
  "limit": 5
}
```

Response:

```json
{
  "discovered": [],
  "recommended_action": "proceed_with_base_knowledge",
  "primary_skill": null,
  "query_used": "onboarding de cliente Totum"
}
```

## POST `/alexandria/rag/search`

Runs semantic search for a single document type.

Request:

```json
{
  "query": "POP de briefing",
  "doc_type": "pop",
  "threshold": 0.7,
  "limit": 5
}
```

## POST `/alexandria/ingest`

Ingests or updates one document in `alexandria_documents`.

Request:

```json
{
  "title": "POP — Onboarding",
  "content": "Conteudo do documento",
  "doc_type": "pop",
  "path": "pops/onboarding.md",
  "metadata": {
    "source": "manual"
  }
}
```

## POST `/alexandria/ingest/batch`

Batch variant of `/alexandria/ingest`.

Request:

```json
{
  "documents": [
    {
      "title": "Skill — SEO",
      "content": "Conteudo",
      "doc_type": "skill",
      "path": "skills/seo.md"
    }
  ]
}
```

## Dependencies

The API expects Supabase RPC functions:

- `search_skills`
- `search_pops`
- `search_docs`

It also expects the table:

- `alexandria_documents`
