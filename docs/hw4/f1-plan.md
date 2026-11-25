# F1 Fingering Chart: Implementation Plan

## Context

F1 is the first feature of Ocarina Coach. A learner picks a note and sees which of the 12 holes on an Alto C ocarina to cover. The explore step (`docs/hw4/f1-explore.md`) settled the inputs:
- **Source of truth:** the Imperial City Ocarina 12-hole Alto C chart.
- **Layout:** Taiwanese sub-holes and the Asian system for high notes.
- **Range:** sounding pitch A4 to F6.
- **Fingerings:** all 21 are transcribed in the explore doc.

The app is still the Next.js starter, so every file below is new. The work follows the repo's TDD rule: one red, green and (optional) refactor commit per acceptance criterion.

## What the user sees

- `/chart` shows a row of 21 note buttons (A4 … F6). Sharps are labelled "A#4 / Bb4".
- Clicking one goes to `/chart?note=A%234`. The page shows that note's ocarina drawing, with covered holes filled and open holes empty.
- No note picked: C5 is shown, since it's the "all main holes covered" home position.
- A bad note in the URL (`?note=G6`, `?note=H2`) shows a plain message instead of a drawing: "G6 is outside the Alto C range (A4 to F6)."
- No client-side JavaScript is needed. The picker is plain links and the page is a Server Component.

## Files to create

| File | What it holds | ACs |
|---|---|---|
| `src/lib/notes.ts` | Note type (MIDI number, A4 = 69 … F6 = 89), the ordered list of 21 notes, `noteLabel()` ("A#4 / Bb4"), `parseNote(text)` returning `{ ok: true, value } \| { ok: false, error }` | AC1, AC5 |
| `src/lib/notes.test.ts` | Tests for the above | AC1, AC5 |
| `src/lib/fingerings.ts` | The 12 hole IDs (`L-thumb` … `R-sub`) with plain names ("left thumb"), the 21-row fingering table, `getFingering(note)`. Header comment cites the chart URL. | AC4 |
| `src/lib/fingerings.test.ts` | Checks all 21 rows against the chart, and that only valid hole IDs are used | AC4 |
| `src/components/OcarinaChart.tsx` | SVG drawing: our own simple ocarina outline, 12 circles (thumbs drawn beside the body), filled = covered. `role="img"` with a text label. | AC2, AC3 |
| `src/components/OcarinaChart.test.tsx` | 12 holes, correct filled/empty set, accessible label | AC2, AC3 |
| `src/components/NotePicker.tsx` | 21 links in order, current one marked `aria-current` | AC1 |
| `src/components/NotePicker.test.tsx` | Renders 21 links in order with correct labels | AC1 |
| `src/components/FingeringPanel.tsx` | Takes the raw `note` text from the URL, runs `parseNote`, shows the chart or the error message (`role="alert"`) | AC5 |
| `src/components/FingeringPanel.test.tsx` | Valid note shows chart; out-of-range and junk show the message | AC5 |
| `src/app/chart/page.tsx` | Thin route: awaits `searchParams` (a Promise in Next 16), renders `NotePicker` + `FingeringPanel` | wiring only |

Key choices:
- **One note representation:** a MIDI number, converted to text only at the edges. Parsing "A#4" and "Bb4" gives the same number (70). F2 will reuse it.
- **Accessible label format (AC3):** "C5 fingering. Covered: left thumb, left index, … right ring." For F6: "F6 fingering. All holes open."
- **The error path lives in a component, not the route file,** because coverage only measures `src/lib` and `src/components`.
- **The drawing doesn't copy the Imperial City image.** It's our own outline, and only the hole pattern comes from the chart.
- **Each `<circle>` gets `data-hole` and `data-covered`,** so tests check the drawing without depending on pixel positions.

## Commit sequence

Each red commit has a test that fails for the expected reason. Each green and refactor commit passes `npm test`, `npm run typecheck` and `npm run lint`.

| # | Commit |
|---|---|
| 1 | `test(F1): AC1 note list covers A4 to F6 in order [red]` |
| 2 | `feat(F1): AC1 note list covers A4 to F6 in order [green]` |
| 3 | `test(F1): AC5 parseNote rejects out-of-range and invalid notes [red]` |
| 4 | `feat(F1): AC5 parseNote rejects out-of-range and invalid notes [green]` |
| 5 | `test(F1): AC4 fingerings stored as data for all 21 notes [red]` |
| 6 | `feat(F1): AC4 fingerings stored as data for all 21 notes [green]` |
| 7 | `test(F1): AC2 chart draws 12 holes, covered filled [red]` |
| 8 | `feat(F1): AC2 chart draws 12 holes, covered filled [green]` |
| 9 | `test(F1): AC3 chart has accessible label [red]` |
| 10 | `feat(F1): AC3 chart has accessible label [green]` |
| 11 | `test(F1): AC1 note picker lists 21 notes in order [red]` |
| 12 | `feat(F1): AC1 note picker lists 21 notes in order [green]` |
| 13 | `test(F1): AC5 panel shows message for out-of-range note [red]` |
| 14 | `feat(F1): AC5 panel shows message for out-of-range note [green]` |
| 15 | `feat(F1): add /chart page wiring picker and panel` |
| 16 | `refactor(F1): …` (only if something needs cleanup, e.g. shared label helpers) |

## Test details per AC

- **AC1:** the list has 21 notes. The first is A4 (69), the last F6 (89), and each is one semitone above the previous. Labels: "C5", "A#4 / Bb4". The picker renders 21 links in that order.
- **AC2:** exactly 12 `circle[data-hole]` elements. For a few notes (A4 all covered, C5 subs open, F6 none covered, C#5 with `R-sub`), the covered set equals the table.
- **AC3:** `getByRole("img", { name: /C5 fingering/ })`. The label lists covered holes in plain words. F6 says all holes open.
- **AC4:** the table has 21 keys, one per note. Every hole ID is one of the 12. All 21 rows equal the explore-doc table. Sub-holes are used only on A4, A#4, B4 and C#5.
- **AC5:** `parseNote` tests:
  - accepts "A4", "a#4", "Bb4", "F6"
  - rejects "G#4" and "F#6" as out of range, with a message naming the range
  - rejects "", "H2", "C", "C#" and "5" as not a note
  - Messages are plain sentences.
  - The panel shows that message in `role="alert"` and no drawing.

## Verification

1. `npm test`, `npm run typecheck` and `npm run lint` are all green after each green commit.
2. `npm run coverage`: `src/lib` and `src/components` near 100% for F1 files.
3. `npm run dev`, open `/chart`:
   - Click through all 21 notes and compare each against the Imperial City PDF.
   - Try `?note=G6` and `?note=xyz` and check the message appears.
   - Check that a screen reader / accessibility tree shows the label.

## After approval

Save this plan to `docs/hw4/f1-plan.md` and commit as `docs(plan): F1 fingering chart plan` before commit 1.
