# Reading Buddy — Next Steps

## Current Status

Fully functional English reading-fluency MVP. Students record themselves reading aloud, Sarvam STT transcribes, our alignment engine scores accuracy & WCPM, and results persist to a JSON file store. A teacher dashboard shows student summaries and attempt history.

### Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| STT | Sarvam AI (en-IN) |
| Encouragement | Groq (optional, has fallback) |
| DB | JSON file (`lib/db.ts` / `.data/db.json`) |
| Auth | Hardcoded demo user |
| Hosting | Vercel / any Node host |

---

## 1. Switch to a Real Database

The JSON file store was a quick MVP choice — it won't scale.

**Options (choose one):**

| DB | Why |
|----|-----|
| **SQLite** (`turso` / `better-sqlite3`) | Zero infra, portable, good for single-region / small team |
| **PostgreSQL** (`neon` / `supabase`) | Production-grade, concurrent writes, row-level security |

**Steps:**
- Add `drizzle-orm` + driver (`@libsql/client` for Turso, `@neondatabase/serverless` for Neon)
- Define real Drizzle schema (we already have the types in `db/schema.ts`)
- Remove `db/drizzle.ts` adapter, use Drizzle queries directly
- Seed script already exists — point it at real DB
- Update `db/queries.ts` to use the real Drizzle client

---

## 2. Add Real Authentication

**Options:**
- **Clerk** (was in the original clone — easiest to re-enable)
- **NextAuth v5** (Auth.js) — more control, self-hosted

**Minimal approach:**
- Restore Clerk middleware + `<ClerkProvider>`
- Swap `lib/auth.ts` to use `auth()` from `@clerk/nextjs`
- Add sign-in / sign-up pages
- Map Clerk `userId` to our DB user records

---

## 3. UI Improvements

### High Priority
- [ ] Reading passage: highlight current sentence being read
- [ ] Animated word-by-word colour reveal (green/correct, red/misread, yellow/skipped)
- [ ] Audio waveform visualiser during recording
- [ ] WCPM gauge / speedometer after challenge

### Medium Priority
- [ ] Teacher dashboard: line chart for WCPM over time per student
- [ ] Teacher dashboard: accuracy heatmap by phoneme / word category
- [ ] Student profile page showing personal progress
- [ ] Global navigation: active lesson indicator, breadcrumbs

### Low Priority
- [ ] Dark mode toggle
- [ ] Mobile-responsive reading layout (larger tap targets)
- [ ] Confetti / celebration animation on streak milestones
- [ ] Accessibility: focus outlines, aria labels, screen reader support

---

## 4. Teacher Dashboard Enhancements

Current dashboard shows a summary table + recent attempts. Next:

- [ ] Per-student detail page (`/teacher/students/[id]`) with all attempts, charts
- [ ] Class-level aggregate stats (avg WCPM, avg accuracy)
- [ ] Export to CSV
- [ ] Assign specific lessons/passages to students
- [ ] Filter by date range, lesson, unit

---

## 5. Multi-Language Support

- Schema already has `languageCode` in courses — Hindi, Bengali, etc.
- Need to train / source passages for other languages
- Swap STT language code (`hi-IN`, `bn-IN`, etc.)
- UI translations (i18n — `next-intl` or similar)

---

## 6. Audio & STT Improvements

- [ ] Add `enable_preprocessing=true` to Sarvam API call for better noise handling
- [ ] Graceful degradation: if STT fails, show manual entry fallback
- [ ] Client-side audio compression before upload (Opus encoding)
- [ ] Support longer passages (>30s) via Sarvam async endpoint or chunked upload
- [ ] On-device fallback: use Web Speech API (lower accuracy but zero latency)

---

## 7. On-Device Inference (Samsung Exynos AI Studio)

The MVP pitch for Samsung:

- **Phase 1** (now): Runs in browser, cloud STT
- **Phase 2**: Migrate STT on-device via Exynos AI Studio WASM runtime
- **Phase 3**: Word alignment + scoring as WebAssembly module, zero server calls
- **Phase 4**: Full offline PWA — service worker cache, sync when online

---

## 8. Testing & CI

- [ ] Add Playwright e2e tests for core flow: login → pick course → complete reading challenge → check dashboard
- [ ] Add more unit tests for edge cases in `lib/align.ts` (empty input, partial matches, homophones)
- [ ] Add error boundary in reading-challenge.tsx (catch STT failure gracefully)
- [ ] Vercel preview deployments on PR

---

## 9. Deployment

**Vercel (easiest):**
- Set env vars: `SARVAM_API_KEY`, `GROQ_API_KEY`
- If using SQLite: Turso (hosted) or switch to Neon PostgreSQL
- Deploy: `vercel --prod`

**Docker:**
- Use `node:20-alpine`, copy `.next/standalone`
- Add `sharp` for image optimisation
- SQLite file works fine in single-container setup

---

## Quick Wins (Do These First)

1. Add `enable_preprocessing=true` to `/api/transcribe`
2. Delete `.data/db.json` and re-seed with `npm run db:prod`
3. Swap JSON store for Turso SQLite (Drizzle already supports it)
4. Deploy to Vercel preview to test in real network conditions
5. Add audio waveform visualiser to reading challenge

---

*Last updated: June 2026*
