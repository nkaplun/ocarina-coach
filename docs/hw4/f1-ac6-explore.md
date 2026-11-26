# F1 AC6 Target Hz: Explore Findings

Date: 2026-11-25. Explore step only, no code written. Branch: `feature/f1-ac6-target-hz`.

Feature (from `docs/hw4/HANDOFF.md`): the chart shows each note's target pitch in Hz, for example "C5 · 523.3 Hz", so learners know what the tuner should read.

## 1. Before planning

- **AC6 is not in the PRD yet.** `docs/PRD.md` F1 stops at AC5. The Plan step adds AC6, so tests can't cite it until then.
- **Branch renamed.** The work started on `feat/note-hz-labels`. It was renamed to `feature/f1-ac6-target-hz` to match the handoff. It had not been pushed, so nothing on the remote changed.

## 2. Relevant files

**Route** (wiring only)

- `src/app/chart/page.tsx`: the `/chart` page. A sync Server Component with a `<Suspense>` boundary, because `cacheComponents: true` is set in `next.config.ts`.
- `src/app/page.tsx`: still the `create-next-app` starter page. Nothing links from it to the chart.

**Components**

- `src/components/FingeringPanel.tsx`: parses the note text and shows either an error alert, or an `<h2>` with the note name plus the chart. This is where the Hz label would go (around line 28).
- `src/components/OcarinaChart.tsx`: the SVG. Draws 12 circles and builds the accessible label (F1 AC3) in `chartLabel()`.
- `src/components/NotePicker.tsx`: one link per note, pointing to `/chart?note=<name>`.

**Note data** (`src/lib/notes.ts`)

- A note is its MIDI number, e.g. 69 for A4 (`type Note = number`).
- Defines `LOWEST_NOTE` (69), `HIGHEST_NOTE` (89) and `ALTO_C_NOTES`, the 21 notes in order.
- Text conversion happens only at the edges:
  - `parseNote()` turns text into a note, or returns an error.
  - `noteName()` gives the sharp spelling used in URLs.
  - `noteLabel()` gives the display name, e.g. "A#4 / Bb4".

**Fingering data**

- `src/lib/fingerings.ts` holds `HOLES` (12 holes, each with a plain name) and `FINGERINGS`, keyed by MIDI number.
- `getFingering()` looks up one note.
- The source chart is cited in the file header.

**Frequencies**

- There is no frequency table. Frequencies are computed when needed.
- `src/lib/pitch/scale.ts` has `frequencyHzAt(note, cents = 0)`, which works from `A4_HZ = 440` and `A4_NOTE = 69` in `src/lib/pitch/constants.ts`.
- Its only caller today is `src/lib/pitch/frequencyToNote.ts:18-20`, which uses it for the min/max accepted range.
- The same file already rounds to one decimal with `.toFixed(1)` (lines 36 and 42), so there is a pattern to follow for "523.3 Hz".
- `scale.ts` has no test file of its own.

## 3. Data flow, note data to chart

```
/chart?note=Bb4
  → ChartPage (Server Component) → <Suspense>
    → SelectedNote: await searchParams, take the first value, or "C5" if missing
        ├─ parseNote(text) → NotePicker current={note}   (highlights the active link)
        └─ FingeringPanel noteText={text}
             → parseNote(text)                           (parses again, by itself)
                ├─ error → <p role="alert">{message}</p>
                └─ ok    → <h2>{noteLabel(note)}</h2>
                           <OcarinaChart note={note}>
                             → getFingering(note) → Set<HoleId>
                             → 12 <circle data-covered> + aria-label from chartLabel()
```

`NotePicker` builds its links from `ALTO_C_NOTES` and `noteName()`.

## 4. Existing tests

Tests sit next to the code they test, and every `describe` name includes its AC.

| File                                                             | Covers                                                                        |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `src/lib/notes.test.ts`                                          | F1 AC1                                                                        |
| `src/lib/parseNote.test.ts`                                      | F1 AC5, F1 AC1. Tests `parseNote` from `notes.ts`; there is no `parseNote.ts` |
| `src/lib/fingerings.test.ts`                                     | F1 AC4                                                                        |
| `src/components/NotePicker.test.tsx`                             | F1 AC1                                                                        |
| `src/components/OcarinaChart.test.tsx`                           | F1 AC2, F1 AC3                                                                |
| `src/components/FingeringPanel.test.tsx`                         | F1 AC5                                                                        |
| `src/lib/pitch/{frequencyToNote,cents,tuning,checkNote}.test.ts` | F2 AC1 to AC5                                                                 |

**Where the label can go:** `FingeringPanel.test.tsx:9` finds the heading by its exact name `"A#4 / Bb4"`. Putting the Hz text inside the `<h2>` would break that test, so a separate element next to it is the safer spot. The chart's label test matches with `^… fingering`, so adding text after it would not break anything.

## 5. Test command

Tests run on Vitest with jsdom. `vitest.config.mts` picks up `src/**/*.test.{ts,tsx}`, maps the `@/` alias, and loads jest-dom plus cleanup from `vitest.setup.ts`.

```bash
npm test                                               # vitest run --passWithNoTests
npx vitest run src/components/FingeringPanel.test.tsx  # one file
npx vitest run -t "F1 AC6"                             # by name
npm run typecheck && npm run lint                      # required before green/refactor commits
```
