# F1 AC6 Target Hz: Plan

Date: 2026-11-25. Plan step, approved. Branch: `feature/f1-ac6-target-hz`. Builds on `docs/hw4/f1-ac6-explore.md`.

Goal: the fingering panel shows the selected note's target pitch in Hz, rounded to one decimal, so learners know what the tuner should read.

## Decision: where the Hz goes

| Option                                                                   | Pros                                                                                                         | Cons                                                                                                  |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **A. Separate `<p>` under the `<h2>` (chosen)**                          | Heading keeps its accessible name "A#4 / Bb4"; no F1 AC5 test changes; the AC6 test checks the Hz on its own | Doesn't look exactly like the handoff's "C5 · 523.3 Hz" on one line                                   |
| B. Put "· 466.2 Hz" in the `<h2>` and change `FingeringPanel.test.tsx:9` | Matches the handoff example word for word                                                                    | Edits an F1 AC5 test to do AC6 work, and screen readers would read a number inside every note heading |

## Steps

### 1. PRD

Add one line under F1 in `docs/PRD.md`:

> AC6: Shows the selected note's target pitch in Hz, rounded to one decimal (for example C5 shows 523.3 Hz), so learners know what the tuner should read. An invalid note shows no pitch, only the AC5 message.

### 2. Red

Add a new `describe("F1 AC6 panel shows the target pitch in Hz")` block to `src/components/FingeringPanel.test.tsx`:

- `it.each` for `A4` → `"440.0 Hz"`, `Bb4` → `"466.2 Hz"` and `C5` → `"523.3 Hz"`, each checked with `screen.getByText(...)`.
- `G6` (out of range) and `"H2"` (not a note): the alert shows, and `queryByText(/Hz/)` is null.
- No stub is needed, because `FingeringPanel` already exists.
- Expected result: the three value cases fail with "Unable to find an element with the text…". The two invalid-note cases already pass at red; they are there to catch the Hz showing up on error screens later.

The values were checked with node: 440.0000, 466.1638 and 523.2511 round to the expected strings. None of the 21 notes lands on an awkward `.x5` rounding edge.

### 3. Green

Smallest change to `src/components/FingeringPanel.tsx`:

```tsx
<div className="flex flex-col items-center gap-1">
  <h2 className="text-2xl font-semibold">{noteLabel(result.value)}</h2>
  <p className="text-zinc-600 dark:text-zinc-400">
    {`${frequencyHzAt(result.value).toFixed(1)} Hz`}
  </p>
</div>
```

The error branch returns before this code runs, so an invalid note never shows a pitch. Everything here is pure, so it stays a Server Component.

### 4. Refactor

- Add `formatFrequencyHz(frequencyHz): string` to a new file, `src/lib/pitch/format.ts`. It returns `` `${frequencyHz.toFixed(1)} Hz` ``.
- Use it in `FingeringPanel` and in the two range-error messages in `frequencyToNote.ts` (lines 36 and 42), which already do the same `.toFixed(1)} Hz` by hand.
- Formatting then lives in `lib` (CLAUDE.md architecture rule 1) and is defined in one place.
- The output stays identical ("lowest is about 415.3 Hz"). The F2 AC4 tests only match `/too low/` and `/too high/`, so they won't catch a change in that text; compare those strings by hand.

## Is a `scale.test.ts` worth adding?

Not for this PR:

- **It wouldn't add much coverage.** `frequencyHzAt` is already exercised indirectly. The F2 AC4 tests (415.29 Hz rejected, 415.31 Hz accepted) pin the cents path to within 0.01 Hz, and the new AC6 tests pin three notes to within 0.05 Hz. `docs/hw4/coverage.txt` already shows 100% line coverage.
- **It can't go red.** The function already works, so a new test would pass immediately, which doesn't fit a red/green cycle.

If one is wanted later, it would be its own `test(F2): ...` commit.

## Commits

Every commit ends with the Co-Authored-By line.

1. `docs(plan): F1 AC6 target Hz`: this file
2. `docs(prd): add F1 AC6 target pitch in Hz`
3. `test(F1): AC6 panel shows target pitch in Hz [red]`: typecheck and lint pass, and `npm test` fails only on the three value cases
4. `feat(F1): AC6 panel shows target pitch in Hz [green]`: `npm test`, `npm run typecheck` and `npm run lint` all pass
5. `refactor(F1): extract formatFrequencyHz into lib/pitch`: all three still pass

## Notes

- **Dependencies.** `node_modules` was missing at planning time. Run `npm ci` (lockfile versions, no new packages) and take a baseline before the PRD and red commits.
- **Formatting.** CLAUDE.md says to run `npm run format`, but that would rewrite 11 Markdown files nobody touched, including `CLAUDE.md` and `PRD.md`. Only touched files get `npx prettier --write`, and `PRD.md` is left alone so its diff stays at one line. Approved by Kishan.
