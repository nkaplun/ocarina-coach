# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

Ocarina Coach: a web app that shows learners which holes to cover on a 12-hole Alto C ocarina (range A4–F6), listens through the microphone, and reports whether they played the right note and whether it was in tune. **`docs/PRD.md` is the source of truth** for features (F1–F5) and their acceptance criteria — read it before implementing a feature, and reference AC numbers (e.g. "F2 AC3") in tests and commits.

Current state: Create Next App scaffold plus test tooling. No feature code yet.

## Commands

```bash
npm run dev          # Next dev server, http://localhost:3000
npm run build        # production build
npm run lint         # ESLint (flat config, eslint.config.mjs)
npm run typecheck    # tsc --noEmit
npm test             # Vitest, single run
npm run test:watch   # Vitest watch mode
npm run coverage     # Vitest + v8 coverage
npm run format       # Prettier (double quotes, semicolons, trailing commas)

npx vitest run src/lib/pitch.test.ts      # one test file (example path)
npx vitest run -t "returns A4 for 440"    # tests matching a name
```

## Stack and versions

- **Next.js 16 (App Router) + React 19** — newer than most training data. Per `AGENTS.md`, check `node_modules/next/dist/docs/` before using Next APIs.
- **Tailwind CSS v4** (CSS-first config in `src/app/globals.css`, no `tailwind.config.js`).
- **Vitest 4 + jsdom + Testing Library**; `vitest.setup.ts` loads jest-dom matchers.
- Path alias `@/*` → `src/*` (configured in both `tsconfig.json` and `vitest.config.mts`).
- Planned but not yet installed: `pitchy` (pitch detection), Postgres, Auth.js, Vercel deploy.

## Architecture (intended, from the PRD)

- **Pure logic in `src/lib/`, UI in `src/components/`, routes in `src/app/`.** Coverage is only measured over `src/lib/**` and `src/components/**`, so put testable logic there, not in route files.
- **Pitch math is pure functions** (frequency → nearest note, cents offset, in-tune/flat/sharp at ±15 cents, A4 = 440 Hz). Test them with known frequencies and generated sine waves — tests must never need a real microphone.
- **Fingerings are data**, one list of covered holes per note, rendered as a drawing (SVG). No fingering image files.
- **Audio never leaves the browser.** Mic capture and pitch detection run client-side (Web Audio API). Only results (note, cents off, timestamp) are persisted, and only for signed-in users. Mic access requires HTTPS outside localhost.
- Server-side code must validate song IDs and note names before any database access.

## Test file convention

Vitest only picks up `src/**/*.test.{ts,tsx}` — colocate tests next to the code they cover.

## Permissions

`.claude/settings.json` pre-allows npm test/lint/typecheck/build/format and local git commands; `git push`, `npm install`, and `gh pr create` prompt for approval; force-push, `reset --hard`, `rm -rf`, and reading `.env*` are denied.
