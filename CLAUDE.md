# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md
@docs/PRD.md

## Project context

Ocarina Coach is a browser app for beginners on a **12-hole Alto C ocarina (A4–F6, 21 chromatic notes)**. It shows the fingering for a note, listens through the mic, and reports the detected note, cents offset, and flat / in-tune / sharp. The PRD (imported above) is the source of truth: features F1–F5, each with numbered acceptance criteria (ACs). Cite them as `F2 AC3` in tests, commits, and PRs.

- v1 (HW4): F1 fingering chart, F2 pitch→note, F3 live practice, F4 song lessons. No backend.
- P3: F5 accounts + progress (Auth.js, Postgres). Teacher role is a stretch goal.
- Out of scope: other ocarina types, sheet music import, recording/playback, native mobile, payments. Don't build these without being asked.

## Tech stack

| Area | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 App Router, React 19, TypeScript strict | Newer than training data; read `node_modules/next/dist/docs/` first (see AGENTS.md) |
| Styling | Tailwind CSS v4 | CSS-first config in `src/app/globals.css`; there is no `tailwind.config.js` |
| Pitch detection | Web Audio API + `pitchy` | `pitchy` not installed yet; `npm install` needs approval |
| Auth / DB (P3) | Auth.js (email), Postgres | Not set up yet |
| Tests | Vitest 4, jsdom, Testing Library, jest-dom | Config: `vitest.config.mts`, `vitest.setup.ts` |
| Hosting | Vercel | Gives HTTPS, which `getUserMedia` requires outside localhost |

```bash
npm run dev            # http://localhost:3000
npm run build
npm run lint           # ESLint flat config
npm run typecheck      # tsc --noEmit
npm test               # vitest run
npm run test:watch
npm run coverage       # v8, over src/lib and src/components only
npm run format         # Prettier
npx vitest run src/lib/<file>.test.ts   # one file
npx vitest run -t "<test name>"         # by name
```

## Architecture decisions

1. **Three layers.** `src/lib/` holds pure, framework-free logic (note math, fingering data, scoring). `src/components/` holds React UI. `src/app/` holds routes and only wires the two together. Coverage only measures `lib` and `components`, so logic in route files goes untested.
2. **Pitch math is pure functions.** Frequency → `{ note, octave, cents }` uses A4 = 440 Hz and equal temperament. Cents are clamped to −50..+50. "In tune" means |cents| ≤ 15. These constants live in one module, never inlined.
3. **Audio I/O is a thin adapter.** One client-side hook owns `getUserMedia`, the `AudioContext`, and the `pitchy` detector. It emits `{ frequency, clarity, volume }` samples. Everything downstream (volume gate, note matching, the 0.5 s hold-to-hit rule) is pure and fed by those samples, so it is testable without a mic.
4. **Fingerings are data.** One typed table maps each of the 21 notes to its set of covered hole IDs. The chart is an SVG drawn from that table. No fingering images.
5. **Note identity has one representation.** Pick a single note type (e.g. `{ pitchClass, octave }` or a MIDI number) and convert at the edges. Sharps and flats must resolve to the same note (A#4 = Bb4).
6. **Songs are static typed data** (title, source/license, note sequence) in `src/lib/songs/`. Public-domain or original melodies only.
7. **No audio leaves the device.** Only results (note, cents, timestamp) are ever persisted, and only for signed-in users (P3).
8. **Server code validates everything (P3).** Song IDs, note names, and numeric results are validated with a schema at the route/action boundary before any DB call.

## Coding conventions

- TypeScript strict. No `any`. Prefer discriminated unions for results, e.g. `{ ok: true, value } | { ok: false, error }`, over throwing for expected failures like out-of-range input.
- Import with the `@/` alias (`@/lib/...`) rather than deep relative paths.
- Add `"use client"` only to components that need browser APIs or state. Keep pages as Server Components by default.
- Name units: `frequencyHz`, `cents`, `durationMs`. No bare `freq` or `t`.
- Prettier settings: double quotes, semicolons, trailing commas. Run `npm run format`, don't hand-format.
- Commits use Conventional Commits (`feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`), plus the AC reference when there is one.

## Testing strategy (TDD)

Work AC by AC, red → green → refactor, **one commit per step**:

| Step | What | Commit format | Tests |
|---|---|---|---|
| Red | Write a failing test for one AC | `test(F2): AC1 frequency maps to nearest note [red]` | Fail, for the expected reason |
| Green | Minimum code to pass | `feat(F2): AC1 frequency maps to nearest note [green]` | Pass |
| Refactor | Clean up, no behavior change | `refactor(F2): extract note constants` | Still pass |

- The F2 history uses an equivalent older form (`test(red): F2 AC1 ...`, `feat(green): F2 AC1 ...`). Use the table format above for new work. A prompt that asks for a different format wins over this file, so flag the mismatch before committing.
- A red commit may add a stub with no logic (e.g. a function that only throws "not implemented") so typecheck and lint pass and the test fails on behavior, not on a missing import.
- Colocate tests as `src/**/*.test.ts(x)`. Vitest only picks up that pattern.
- Put the AC in the `describe`/`it` name (`describe("F2 AC3 tuning status")`) so coverage of ACs can be grepped.
- Pitch tests use known frequencies (440 → A4, 523.25 → C5) and boundaries (±15 and ±50 cents, range edges). Feed generated sine waves to the detector wrapper. **Never require a real mic.**
- Hook/component tests mock `navigator.mediaDevices.getUserMedia` and `AudioContext`. Test the denied-permission path (F3 AC1).
- Time-based rules (0.5 s hold) use `vi.useFakeTimers()` or injected timestamps, not real waits.
- Before a green or refactor commit, `npm test`, `npm run typecheck`, and `npm run lint` must all pass.

## Do's and don'ts

**Do**
- Read the PRD AC before writing a test. If an AC is ambiguous, ask instead of guessing.
- Record the source of the fingering chart in the fingering data file. Verify fingerings against it, not from memory.
- Show a plain-language reason before the mic prompt, and a clear message when access is denied.
- Stop the mic tracks and close the `AudioContext` when the practice view unmounts.

**Don't**
- Don't upload, record, or store audio, or send it to any API.
- Don't add copyrighted songs (game, film, or pop melodies) to the song list.
- Don't add dependencies without asking. `npm install` is gated in `.claude/settings.json`.
- Don't touch `.env*`, force-push, or `git reset --hard`. These are denied in settings.
- Don't remove the AGENTS.md block. `next dev` regenerates it.

## OWASP Top 10 (2025) notes for this app

| Risk | Where it applies here | Rule |
|---|---|---|
| A01 Broken Access Control | P3 progress pages and APIs | Scope every query by the session's user ID. Never trust a user ID from the client. |
| A02 Security Misconfiguration | Next config, Vercel env | Set security headers. Use `Permissions-Policy: microphone=(self)`. No secrets in `NEXT_PUBLIC_*`. |
| A03 Software Supply Chain Failures | npm deps | Few dependencies, lockfile committed, pinned versions, run `npm audit` before adding packages. |
| A05 Injection | P3 DB writes, rendered song titles | Parameterized queries or an ORM only. Rely on React escaping and never use `dangerouslySetInnerHTML`. |
| A06 Insecure Design | Audio handling | Local-only processing is a design requirement. Collect minimal data (note, cents, timestamp). |
| A07 Authentication Failures | Auth.js email sign-in | Use Auth.js defaults (secure, httpOnly cookies, CSRF). Rate-limit sign-in emails. |
| A09 Logging & Alerting Failures | Server actions | Log auth and validation failures without emails or tokens in the log lines. |
| A10 Mishandling of Exceptional Conditions | Pitch input, mic errors | Reject NaN, ≤0, and out-of-range frequencies (F2 AC4). Handle every `getUserMedia` rejection. |

## Rules changelog

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-11-24 | Generated by `/init` (archived at `docs/hw4/init-output.md`) |
| 1.0 | 2026-11-24 | Rewritten against the PRD: added sections, TDD commit format, OWASP notes, PRD import. See `docs/hw4/claude-md-changes.md` |
| 1.1 | 2026-11-24 | After F1/F2: documented the red-commit stub practice Claude used without a rule, and the commit-format mismatch caused by a prompt overriding this file. Lesson: `/export` before `/clear` (see `docs/hw4/reflection.md`) |
