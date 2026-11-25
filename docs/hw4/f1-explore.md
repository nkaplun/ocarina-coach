# F1 Fingering Chart: Explore Findings

Date: 2026-11-24. Explore step only, no code written.

## 1. Current app state

- The app is still the `create-next-app` starter. `src/` has only `src/app/` (`layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico`). There is no `src/lib/`, no `src/components/`, and no tests yet.
- Tooling is ready: Vitest 4 + jsdom + Testing Library (`vitest.config.mts`, `vitest.setup.ts`), `npm test` runs with `--passWithNoTests`, and Tailwind v4 is configured in `globals.css`.
- Nothing from F1 exists yet. Per CLAUDE.md the planned files are:
  - `src/lib/notes.ts`: note type, the 21-note range A4 to F6, sharp/flat handling (A#4 = Bb4)
  - `src/lib/fingerings.ts`: typed table of note → covered hole IDs, with the source recorded in the file
  - `src/components/FingeringChart.tsx`: SVG drawn from the table, with an accessible label
  - `src/app/page.tsx` (or a `/chart` route): note picker that wires the two together

## 2. F1 acceptance criteria (from docs/PRD.md)

| AC | Requirement | Where it gets tested |
|---|---|---|
| AC1 | Lists all 21 notes A4 to F6, in order, naturals and sharps/flats | `lib` (note list) + component (rendered list) |
| AC2 | Drawing has 12 holes; covered = filled, open = empty | component |
| AC3 | Accessible text label naming the note and the covered holes | component (`getByRole("img", { name })`) |
| AC4 | Fingerings stored as data, one list of covered holes per note | `lib` (table has 21 entries, valid hole IDs) |
| AC5 | Notes outside the range rejected with a clear message | `lib` (`{ ok: false, error }`) + component |

## 3. Decisions (confirmed by Nicholas, 2026-11-24)

| Question | Decision |
|---|---|
| Instrument | 12-hole Alto C (AC) only |
| Source of truth | [Imperial City Ocarina, "12-Hole Alto, Key of C — Complete Fingering Chart"](https://www.imperialcityocarina.com/images/cache/ac-12-hole-fingering-chart.pdf) (2 pages, © Imperial City Ocarina) |
| Sub-hole layout | Taiwanese: one sub-hole next to each middle finger |
| High-octave system | Asian (E6 = left pinky only) |

The chart PDF is copyrighted, so it is linked rather than committed. The fingering data in this repo is a transcription of it.

## 4. Octave: settled by the chart

The chart footer says: **"Notes are written one octave lower than actual pitch."** The chart's written range is A3 to F5. It sounds A4 to F6, so the lowest C sounds as **C5 (≈523 Hz)**. This matches the PRD range and the F2 test values. The app uses **sounding pitch** everywhere.

## 5. Hole layout and IDs

12 holes: 2 thumbs, 8 main finger holes, and 2 sub-holes.

| Proposed ID | Hole | Position in the chart drawing |
|---|---|---|
| `L-thumb` | Left thumb | Dot floating left of the body |
| `L-index` | Left index | Lowest-left body hole |
| `L-middle` | Left middle | Second left hole |
| `L-ring` | Left ring | Third left hole |
| `L-pinky` | Left pinky | Top left hole, near the upper edge |
| `L-sub` | Left sub-hole | Small hole beside left middle |
| `R-thumb` | Right thumb | Dot floating below-right of the body |
| `R-index` | Right index | Lowest right body hole |
| `R-middle` | Right middle | Second right hole |
| `R-ring` | Right ring | Third right hole |
| `R-pinky` | Right pinky | Hole at the narrow tip |
| `R-sub` | Right sub-hole | Small hole beside right middle |

**Caveat:** the chart draws holes but doesn't label fingers. I worked out the finger names from the hole positions and from where the chart agrees with the Pure Ocarinas fingerings. The mapping is consistent across all 21 notes. The left-hand order (index lowest, pinky top) is the one inferred part.

## 6. Fingering table (transcribed from the source of truth)

Holes not listed are open. Filled dot = covered, white/outline = open.

| # | Sounding note | Covered holes |
|---|---|---|
| 1 | A4 | all 10 main + `L-sub` + `R-sub` (all 12) |
| 2 | A#4 / Bb4 | all 10 main + `L-sub` |
| 3 | B4 | all 10 main + `R-sub` |
| 4 | C5 | all 10 main (both subs open) |
| 5 | C#5 / Db5 | L-thumb, L-index, L-middle, L-ring, L-pinky, R-thumb, R-index, R-middle, R-ring, `R-sub` |
| 6 | D5 | L-thumb, L-index, L-middle, L-ring, L-pinky, R-thumb, R-index, R-middle, R-ring |
| 7 | D#5 / Eb5 | L-thumb, L-index, L-middle, L-ring, L-pinky, R-thumb, R-index, R-middle, R-pinky |
| 8 | E5 | L-thumb, L-index, L-middle, L-ring, L-pinky, R-thumb, R-index, R-middle |
| 9 | F5 | L-thumb, L-index, L-middle, L-ring, L-pinky, R-thumb, R-index |
| 10 | F#5 / Gb5 | L-thumb, L-index, L-middle, L-ring, L-pinky, R-thumb, R-ring |
| 11 | G5 | L-thumb, L-index, L-middle, L-ring, L-pinky, R-thumb |
| 12 | G#5 / Ab5 | L-thumb, L-index, L-middle, L-pinky, R-thumb, R-ring |
| 13 | A5 | L-thumb, L-index, L-middle, L-pinky, R-thumb |
| 14 | A#5 / Bb5 | L-thumb, L-index, L-pinky, R-thumb, R-ring |
| 15 | B5 | L-thumb, L-index, L-pinky, R-thumb |
| 16 | C6 | L-thumb, L-pinky, R-thumb |
| 17 | C#6 / Db6 | L-pinky, R-thumb, R-ring |
| 18 | D6 | L-pinky, R-thumb |
| 19 | D#6 / Eb6 | L-pinky, R-ring |
| 20 | E6 | L-pinky |
| 21 | F6 | none (all open) |

Quick sanity checks that should become tests:
- Exactly 21 entries, one per chromatic note A4 to F6.
- Sub-holes are covered only for A4, A#4, B4, and C#5.
- Every hole ID used is one of the 12 IDs above.

## 7. Where the earlier sources disagreed (now resolved)

The first pass used Pure Ocarinas and other web charts. Where they differ, the Imperial City chart wins:

| Note | Earlier source said | Source of truth says |
|---|---|---|
| A#4 | (missing) | 10 main + left sub |
| C#5 | uses a split right-pinky hole | 10 main minus right pinky, plus right sub |
| F#5 | Rt Rm + split pinky | Rt Rr |
| A5 | right index + middle covered | right hand open except thumb |
| B5 / C6 | two Pure Ocarinas pages disagreed | B5: Lt Li Lp Rt. C6: Lt Lp Rt |
| D#6 | Lm Lp | Lp Rr |

## Sources

- **Source of truth:** [Imperial City Ocarina, 12-Hole Alto C fingering chart (PDF)](https://www.imperialcityocarina.com/images/cache/ac-12-hole-fingering-chart.pdf). Read by rendering both pages at 300 dpi and checking each of the 21 diagrams.
- Background only:
  - [Pure Ocarinas, "The ocarina's fingering system"](https://pureocarinas.com/ocarina-fingering-system): Taiwanese vs Japanese sub-holes, Asian vs Italian high notes.
  - [Pure Ocarinas, "Learning the ocarina's fingerings"](https://pureocarinas.com/learning-ocarina-fingerings): used to cross-check which finger is which.
  - [Ocarina Making chart generator](https://ocarinamaking.com/chartgen/): confirms fingerings vary by maker.
