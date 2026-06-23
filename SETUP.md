# Reading Buddy — Setup Guide

## Prerequisites

- **Node.js** v20+ (with `npm`)
- **Git**
- A **Sarvam AI** API key ([docs.sarvam.ai](https://docs.sarvam.ai))
- (Optional) A **Groq** API key for encouragement feedback

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Pranshu23x/samsung.git
cd samsung

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
```

Edit `.env` and add your keys:

```env
SARVAM_API_KEY=your_sarvam_key_here
GROQ_API_KEY=your_groq_key_here   # optional
```

```bash
# 4. Seed the database
npm run db:prod

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
Click **English Reading** → start a lesson → press **Record** and read aloud.

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm test` | Run scoring engine tests |
| `npm run db:prod` | Reset & seed database |
| `npm run lint` | Lint all files |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SARVAM_API_KEY` | Yes | Speech-to-text API key |
| `GROQ_API_KEY` | No | Encouragement feedback (optional) |

---

## Project Structure (Key Files)

```
├── app/
│   ├── api/
│   │   ├── transcribe/route.ts    # Sarvam STT proxy
│   │   └── feedback/route.ts      # Groq encouragement
│   ├── lesson/
│   │   ├── reading-challenge.tsx   # Reading recording UI
│   │   └── quiz.tsx                # Lesson flow dispatcher
│   └── (main)/teacher/
│       └── page.tsx                # Teacher dashboard
├── lib/
│   ├── align.ts                    # Word alignment engine
│   ├── scoring.ts                  # Accuracy/WCPM scoring
│   ├── db.ts                       # JSON file store
│   └── auth.ts                     # Demo auth
├── db/
│   ├── schema.ts                   # TypeScript types
│   ├── queries.ts                  # Query functions
│   └── drizzle.ts                  # Drizzle-like adapter
├── scripts/
│   └── prod.ts                     # Seed script (20 passages)
└── .data/
    └── db.json                     # Local database file
```

---

## How It Works

1. Student sees a passage and presses **Record**
2. Browser captures audio (MediaRecorder + WAV encoding)
3. Audio sent to `/api/transcribe` → Sarvam STT → returns transcript
4. `lib/align.ts` aligns transcript words to passage words (Needleman–Wunsch)
5. `lib/scoring.ts` computes accuracy %, WCPM, and star rating
6. Results displayed: green/correct, red/misread, yellow/skipped
7. Attempt saved to JSON store → visible on teacher dashboard

---

## Authentication

MVP uses a hardcoded demo user (`demo-user-1`).  
No sign-in required. Teacher dashboard checks `?admin=1` in URL.

---

## Troubleshooting

**STT returns 502 / timeout**
- Check `SARVAM_API_KEY` is set in `.env`
- Ensure audio recording isn't too long (>30s)

**Database errors**
- Delete `.data/db.json` and re-run `npm run db:prod`

**Port conflict**
- Use `npm run dev -- -p 3001` to change port
