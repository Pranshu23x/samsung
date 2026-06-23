# Reading Buddy — Reading Fluency Assessment

A reading-fluency MVP built on a forked duolingo-clone. Students read aloud, cloud STT scores accuracy & WCPM, and a teacher dashboard shows trends.

Built for **Samsung** — runs in the browser today, targets on-device inference via **Exynos AI Studio** in future phases.

---

## Features

- **Reading Challenges** — Students see a passage, press record, and read aloud
- **STT Transcription** — Sarvam AI (en-IN) converts speech to text
- **Word Alignment** — Needleman–Wunsch algorithm matches transcript to passage
- **Fluency Scoring** — Accuracy %, Words Correct Per Minute (WCPM), star rating
- **Visual Results** — Green (correct), red (misread), yellow (skipped) word highlighting
- **Teacher Dashboard** — Student summaries, attempt history, and trends
- **Demo Ready** — Hardcoded demo user, JSON file store, no external DB setup

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | [Next.js 16](https://nextjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| STT | [Sarvam AI](https://sarvam.ai) |
| Encouragement | Groq (optional) |
| Database | JSON file store (`.data/db.json`) |
| Auth | Hardcoded demo user |

---

## Quick Start

```bash
npm install
cp .env.example .env   # add SARVAM_API_KEY
npm run db:prod
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

See [SETUP.md](./SETUP.md) for detailed instructions.

---

## Product Roadmap

- [x] English reading fluency MVP
- [x] Scoring engine (accuracy, WCPM, stars)
- [x] Teacher dashboard
- [ ] Real database (SQLite / PostgreSQL)
- [ ] Authentication (Clerk / NextAuth)
- [ ] Audio waveform visualiser
- [ ] Per-student detail charts
- [ ] Multi-language support
- [ ] On-device inference (Exynos AI Studio)
- [ ] Full offline PWA

---

## Project Structure

```
├── app/api/transcribe/   # Sarvam STT proxy
├── app/lesson/           # Reading challenge UI
├── app/(main)/teacher/   # Teacher dashboard
├── lib/
│   ├── align.ts          # Word alignment engine
│   ├── scoring.ts        # Accuracy/WCPM scoring
│   ├── db.ts             # JSON file store
│   └── auth.ts           # Demo auth
├── db/
│   ├── schema.ts         # TypeScript types
│   ├── queries.ts        # Query functions
│   └── drizzle.ts        # DB adapter
├── scripts/prod.ts       # Seed script
└── .data/db.json         # Local database
```

---

## License

MIT
