# Ocarina Coach

Learn the ocarina with live pitch feedback. Ocarina Coach shows which holes to cover for each note, listens to you play through the microphone, and tells you whether you hit the right note and whether it was in tune.

Built for CS6983 AI Coding (Northeastern, Fall 2026): HW4 (Claude Code workflow + TDD) and a candidate idea for Project 3.

## Why

Ocarina pitch depends on breath pressure, so a correct fingering can still sound flat or sharp. Beginners without a teacher can't hear the difference, and they flip between a fingering chart, sheet music and a tuner app. Full requirements: [docs/PRD.md](docs/PRD.md).

## Status

| Feature | Status |
|---|---|
| F1 Fingering chart (`/chart`) | Done: 12-hole Alto C, A4 to F6, SVG drawn from data |
| F2 Note detection (`src/lib/pitch/`) | Done: frequency to note, cents offset, in-tune check, target match |
| F3 Live practice (microphone) | Planned |
| F4 Song lessons (public-domain tunes) | Planned |
| F5 Accounts and progress (Auth.js + Postgres) | Planned (P3) |

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind, Vitest + Testing Library. P3 adds Postgres, Auth.js and Vercel.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000/chart
npm test           # all unit tests
npm run coverage   # coverage report
npm run lint && npm run typecheck
```

## How this repo is built

- `CLAUDE.md` holds the project rules for Claude Code (stack, conventions, TDD commit format) and imports the PRD.
- `.claude/settings.json` sets Claude Code permissions (tests and commits allowed, push and installs ask first, `.env` reads and force-pushes blocked).
- Features are built test-first. Commit messages mark each step as red, green or refactor (format in `CLAUDE.md`).
- HW4 evidence (explore notes, plans, /init output, screenshots, session logs, reflection) lives in [docs/hw4/](docs/hw4/).

## Layout

```
src/app/chart/        fingering chart page
src/components/       OcarinaChart (SVG), NotePicker, FingeringPanel
src/lib/notes.ts      note numbers, names, parsing (A4 to F6)
src/lib/fingerings.ts holes and per-note fingerings (data, not images)
src/lib/pitch/        frequency to note, cents, tuning status, checkNote
docs/                 PRD and HW4 write-ups
```
