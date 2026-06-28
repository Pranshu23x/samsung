# Reading Buddy

> 🏆 **Samsung Innovation Challenge — Health & Education Track**
>
> *An on-device AI reading-fluency companion for India's government schools.*

A fresh repository — built from scratch for the Samsung Innovation Challenge. Reading Buddy tackles the literacy crisis in India's government schools, where students fall behind grade-level reading fluency and teachers have no scalable way to give individualized support.

---

## The Problem

Millions of children in Indian government schools fall behind grade-level reading fluency. Teachers managing **40+ students per class** have no scalable way to give each child individualized reading practice or catch specific errors — mispronunciation, skipped words, hesitation — early enough to matter.

According to **ASER 2024**, only 1 in 4 Class 3 students can read a Class 2 level text fluently. This gap compounds every year and remains one of the most documented, government-acknowledged failures in foundational literacy.

Individual reading assessment is logistically impossible at scale, so struggling students go unnoticed until the gap is too wide to close.

---

## Target User

Government school students in **grades 3–8** (and their teachers) across India, particularly in:
- Regional-language-medium schools
- Low-connectivity rural areas
- Classrooms where individual reading support is least available today

---

## Our Solution

An **AI reading-fluency companion** that runs on Samsung Galaxy tablets and phones.

A child reads a passage aloud on a Galaxy device. The app captures the audio, processes it through on-device speech recognition tuned for Indian regional languages, compares it word-by-word against the target text, and flags specific errors — mispronunciation, skipped or repeated words, pacing — giving the child instant, encouraging feedback in their own language.

Teachers get a simple dashboard showing fluency trends across the whole class, so they know exactly which students and which sounds need attention — without manually listening to every child read.

### On-Device AI (The Samsung Advantage)

The core capture-score-feedback loop runs **entirely on-device** using Samsung's **Exynos AI Studio** toolchain:

- **No constant internet required** — works in low-connectivity rural schools
- **No child's voice data leaves the device** — privacy by design
- **Real-time feedback** — zero latency for the student

Cloud sync for teacher dashboards and long-term tracking happens **opportunistically** when connectivity is available.

Samsung already places Galaxy Tab fleets in schools through its education and CSR programs. This isn't a hardware ask — it deploys on infrastructure that may already exist in the target schools.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  On-Device (Galaxy)                   │
│                                                      │
│  ┌──────────────┐    ┌──────────────────────────┐    │
│  │  Browser /    │───▶│  Exynos AI Studio WASM   │    │
│  │  MediaRecorder│    │  (STT + Align + Score)   │    │
│  └──────┬───────┘    └────────────┬─────────────┘    │
│         │                         │                   │
│         │  Audio capture          │ Error feedback    │
│         │                         ▼                   │
│         │                  ┌──────────────┐          │
│         │                  │  Student sees │          │
│         │                  │  color-coded  │          │
│         │                  │  word results │          │
│         │                  └──────────────┘          │
└─────────┼───────────────────────────────────────────┘
          │
          │  Opportunistic sync (when online)
          ▼
┌─────────────────────────────────────────────────────┐
│                    Cloud                            │
│                                                      │
│  ┌──────────────┐    ┌──────────────────────────┐    │
│  │  Next.js 16   │────▶│  Teacher Dashboard      │    │
│  │  API Routes   │    │  (trends, summaries,     │    │
│  │               │    │   most-missed words)      │    │
│  └──────────────┘    └──────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### How It Works (Step by Step)

1. A child reads a passage aloud into a Samsung Galaxy device
2. Audio is captured via the browser MediaRecorder API and encoded as WAV
3. The transcript is generated — **on-device via Exynos AI Studio** (primary path) or cloud STT (fallback)
4. The **Needleman-Wunsch alignment engine** matches every spoken word against the passage, classifying each as `correct`, `mispronounced`, or `skipped`
5. The **scoring engine** computes accuracy %, WCPM (Words Correct Per Minute), pacing, and a star rating
6. Results display instantly with green/amber/red color-coded word feedback
7. Teacher dashboard syncs when connectivity is available — no internet required during the assessment

### Language Support

Speech recognition tuned for **Indian regional languages** — Hindi, Bengali, Marathi, Tamil, Telugu, and more — so students practice reading in their mother tongue, which is the medium of instruction in most government schools.

---

## Technical Background

The developer has hands-on experience building real-time, low-latency audio pipelines — including a production WebSocket-based speech pipeline using Sarvam STT and Groq inference for a live voice-AI assistant, and multi-agent orchestration (CrewAI / LangGraph) for structured decision and feedback systems.

The reading-fluency scoring and feedback-generation layer extends that same architecture directly.

---

## Features

- **Read Aloud Challenges** — Students record themselves reading grade-appropriate passages on Galaxy devices
- **On-Device Processing** — STT, alignment, and scoring via Exynos AI Studio; no internet required
- **Needleman-Wunsch Word Alignment** — Classifies every target word as `correct`, `mispronounced`, or `skipped`; surfaces insertion errors
- **Fluency Scoring** — Accuracy %, WCPM, pacing flag (too-slow / good / too-fast), 1–3 star rating
- **Visual Color-Coded Feedback** — Green (correct), amber (misread), red (skipped) with hover tooltips showing "You said: ..."
- **AI Encouragement** — Personalized, constructive feedback tailored to the student's errors
- **Gamified Progression** — XP, hearts, quests, leaderboard, shop — keeps students motivated
- **Interactive Quizzes** — Multiple-choice and "select the correct meaning" challenges alongside reading tasks
- **Teacher Dashboard** — Per-student summaries, average accuracy/WCPM, most-missed words, attention flags, attempt history
- **Privacy by Design** — Voice data stays on-device; only anonymized scores sync to the cloud
- **Opportunistic Cloud Sync** — Teacher dashboards update when connectivity is available

---

## Tech Stack

| Layer | Primary (On-Device) | Fallback (Cloud) |
|-------|---------------------|-------------------|
| Framework | — | [Next.js 16](https://nextjs.org/) (Turbopack) |
| Language | [TypeScript](https://www.typescriptlang.org/) | TypeScript |
| AI Runtime | [Exynos AI Studio](https://developer.samsung.com/galaxy-ai) (WASM) | Cloud STT |
| Speech-to-Text | On-device model (regional languages) | [Sarvam AI](https://sarvam.ai) |
| Encouragement | On-device model | [Groq](https://groq.com) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + shadcn/ui | Same |
| Database | IndexedDB / local storage | JSON file / PostgreSQL |
| State | [Zustand](https://github.com/pmundst/zustand) | Same |

---

## Quick Start

```bash
# Install dependencies
npm install

# Create your environment file
cp .env.example .env

# Add your API keys to .env
# SARVAM_API_KEY=sk_...     (cloud STT fallback)
# GROQ_API_KEY=gsk_...      (cloud AI encouragement)

# Seed the database with sample courses, lessons, and passages
npm run db:prod

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click **English Reading** → start a lesson → press **Record** and read aloud.

---

## Project Structure

```
├── app/
│   ├── (main)/           # Authenticated routes (learn, shop, leaderboard, teacher)
│   ├── (marketing)/      # Landing page
│   ├── api/              # Cloud API routes (transcribe, feedback)
│   └── lesson/           # Lesson/challenge UI
├── components/           # Reusable UI components (shadcn/ui)
├── config/               # Site config and metadata
├── db/                   # TypeScript types and query functions
├── lib/
│   ├── align.ts          # Needleman-Wunsch word alignment engine
│   ├── scoring.ts        # Fluency scoring (accuracy, WCPM, stars, pacing)
│   ├── audio.ts          # Audio capture and WAV encoding
│   ├── db.ts             # Database abstraction layer
│   └── auth.ts           # Authentication layer
├── scripts/prod.ts       # Database seed script
├── store/                # Zustand state stores
└── .data/db.json         # Local database (replace with PostgreSQL/SQLite)
```

---

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Lint all files |
| `npm test` | Run scoring engine unit tests |
| `npm run db:prod` | Reset and seed the database |

---

## Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1** | ✅ Done | Cloud STT prototype + alignment engine + teacher dashboard |
| **Phase 2** | 🔜 Next | **On-device STT via Exynos AI Studio WASM runtime** |
| **Phase 3** | 📋 Planned | WASM word alignment + scoring (zero server calls) |
| **Phase 4** | 📋 Planned | Full offline PWA + opportunistic cloud sync |
| | 🔜 Next | Real database (PostgreSQL / SQLite) |
| | 🔜 Next | Authentication (Clerk / NextAuth) |
| | 📋 Planned | Additional regional language models (Hindi, Bengali, etc.) |
| | 📋 Planned | Audio waveform visualizer for students |
| | 📋 Planned | Per-student detail charts and fluency trends |

---

## License

MIT
