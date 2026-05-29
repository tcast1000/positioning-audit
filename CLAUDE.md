@AGENTS.md

# Positioning Audit Tool

## What this is
A public AI tool at `tools.teddycastro.me` that takes a B2B SaaS company's URL and returns a positioning audit using April Dunford's framework with an opinionated diagnosis layer. Built by Teddy Castro, an AI-native full-stack PMM.

## Tech stack
- Next.js 16 (App Router), TypeScript, Tailwind v4
- Vercel hosting, Upstash Redis for BYOK run persistence (30-day TTL)
- `@anthropic-ai/sdk` for synthesis, `cheerio` for scraping
- Fonts: Inter (body), JetBrains Mono (labels/metadata), Instrument Serif (display headings)

## Architecture

### Three surfaces
1. **Landing page** (`/`) — Hero + showcase cards + "how it works" section
2. **Audit page** (`/audit/[slug]`) — Full audit renderer at shareable URL with dynamic OG images
3. **Run page** (`/run`) — BYOK input: user's API key + target URL, scrape-then-paste fallback

### API routes
- `POST /api/scrape` — Takes `{ url }`, returns `{ text, sufficient }`
- `POST /api/synthesize` — Takes `{ url, apiKey, pastedText }`, returns `{ slug }`. Rate limited 5 req/min per IP.

### Key directories
- `/app` — Next.js App Router pages, API routes, OG image generation
- `/components` — AuditView, AuditCard, Hero, Footer, ShareButton
- `/content/showcase/` — Pre-generated JSON audits (Linear, Notion, Vercel)
- `/lib` — scrape.ts, synthesize.ts, prompt.ts, store.ts, loadAudit.ts
- `/types/audit.ts` — The Audit type schema
- `/scripts/generate-showcase.ts` — One-off script to generate showcase JSONs

### Design system
- Background: `#F5F5F3`, foreground: `#1a1a1a`, accent: `#9E5F3E` (terracotta)
- Sentence-case headings only, no emojis
- Numbered sections (01, 02, 03, 04) in audit view
- Diagnosis items have warm background wash, regular list items have neutral borders
- Rewrite section uses strikethrough for current, accent border for sharper

### BYOK security
- API key held in React state only, sent over HTTPS for one call, never stored/logged
- Rate limiting on `/api/synthesize` by IP
- Security headers: X-Content-Type-Options, X-Frame-Options, XSS, Referrer-Policy, Permissions-Policy

## Environment variables
- `UPSTASH_REDIS_REST_URL` — Upstash Redis URL (optional, falls back to in-memory)
- `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis token (optional)
- `CLAUDE_MODEL` — Override model for synthesis (default: claude-sonnet-4-20250514)
- `ANTHROPIC_API_KEY` — Only needed for `generate:showcase` script
- `NEXT_PUBLIC_SITE_URL` — Base URL for OG tags (default: https://tools.teddycastro.me)

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run generate:showcase` — Generate showcase audit JSONs (requires ANTHROPIC_API_KEY in env)
