# Sulit Assistant — AI shopping chat

A floating chat widget (bottom-right, every page) that recommends real catalog deals in English or Taglish, backed by `/api/assistant` calling Claude Haiku 4.5 (`claude-haiku-4-5`).

## How it works

1. The widget (`src/components/assistant/SulitAssistant.tsx`, mounted in `src/app/layout.tsx`) POSTs `{ message, history }` to `/api/assistant`.
2. The route (`src/app/api/assistant/route.ts`) validates input, rate-limits per IP, then **filters the catalog server-side** (`src/lib/assistant/deal-search.ts`): keyword + Taglish-synonym matching, hard price constraints ("under 500", "hanggang 1,000 pababa"), suspicious-discount exclusion — and passes only the **top 10 matches** to the model, never the whole catalog.
3. The system prompt hard-rules the model: only deals from the provided list, links only via each deal's `url`, reference-price framing with a live-price reminder, honest "nothing matches" + category-page suggestion, shopping-topics only.
4. The widget renders replies as text, linkifying **internal links only** (`/deals/...`, `/categories/...`); anything else stays plain text, so a model mistake can never emit an external link.

## Cost & abuse protections

- Model: `claude-haiku-4-5` ($1/$5 per MTok), `max_tokens: 600`.
- Per-IP sliding window: 10 requests/minute (`src/lib/assistant/rate-limit.ts`; in-memory, per-instance on serverless — the hard backstop is your Anthropic account spend limit).
- Message cap 400 chars; history cap 16 entries; conversation cap 8 user turns (enforced server- and client-side).
- Graceful degradation: typed error handling returns a friendly bilingual message on any upstream failure.

## Local testing

```bash
npm run dev
```

- **Without a key** (no `.env.local`): the route returns a deterministic demo reply built from the real filtered matches, marked "(Demo reply - no ANTHROPIC_API_KEY configured.)" — the whole widget flow is testable offline.
- **With a key**: create `.env.local` in the repo root (gitignored via `.env*`):

  ```
  ANTHROPIC_API_KEY=sk-ant-...
  ```

- cURL check:

  ```bash
  curl -s -X POST localhost:3000/api/assistant -H 'Content-Type: application/json' \
    -d '{"message":"gift for mom under 500 pesos"}'
  ```

- Tests: `npm run test:assistant` (also wired into `npm run check`).

## Before deploying

1. Get an API key at <https://console.anthropic.com> → API Keys. Set a **monthly spend limit** in Console → Billing → Limits (Haiku is cheap, but set one anyway).
2. Add the env var on your host (Vercel: Project → Settings → Environment Variables → `ANTHROPIC_API_KEY`, Production + Preview) and redeploy. The key is read only server-side; it never reaches client code (contract-tested in `tests/assistant.node.mjs`).
3. Optional: watch usage in Anthropic Console → Usage after launch; 10 req/min/IP and 600 max output tokens keep the worst case bounded.
