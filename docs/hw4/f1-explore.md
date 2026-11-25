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

## 3. How a 12-hole Alto C is laid out

- **10 main holes**: 4 fingers + thumb on each hand (left index, middle, ring, pinky, thumb; same on the right).
- **2 sub-holes**: small extra holes used only for the two lowest notes (A4, B4).
  - **Taiwanese layout**: sub-holes next to the left and right middle fingers.
  - **Japanese layout**: both sub-holes on the right hand (next to right index and right middle).
- **Range**: A4 to F6 (21 chromatic notes). The lowest C is C5 (about 523 Hz). This matches the PRD and the F2 test values (523.25 Hz → C5).
  - Note: pureocarinas.com writes the lowest C as "C4" (the written note on the staff). fingeringcharts.pages.dev calls it C5. This app should use **sounding pitch**, so C5. I did not find a source that states this outright; it should be checked against a tuner on a real Alto C.

## 4. Draft fingering table (needs verification)

Abbreviations: L/R = left/right hand. t = thumb, i = index, m = middle, r = ring, p = pinky. "sub" = sub-hole. Holes not listed are open.

| Note | Covered holes | Source | Confidence |
|---|---|---|---|
| A4 | all 10 main + both subs | P1 | Medium |
| A#4 / Bb4 | not found | none | **Missing** |
| B4 | all 10 main + one sub ("right" sub) | P1 | Medium |
| C5 | all 10 main | P1, P2 | High |
| C#5 / Db5 | Lt Li Lm Lr Lp, Rt Ri Rm Rr + "Rp1" | P2 | Low (see 5.2) |
| D5 | Lt Li Lm Lr Lp, Rt Ri Rm Rr | P1, P2 | High |
| D#5 / Eb5 | Lt Li Lm Lr Lp, Rt Ri Rm + "Rp1 Rp2" | P2 | Low (see 5.2) |
| E5 | Lt Li Lm Lr Lp, Rt Ri Rm | P2 | High |
| F5 | Lt Li Lm Lr Lp, Rt Ri | P2 | High |
| F#5 / Gb5 | Lt Li Lm Lr Lp, Rt Rm + "Rp1" | P2 | Low |
| G5 | Lt Li Lm Lr Lp, Rt | P1, P2 | High |
| G#5 / Ab5 | Lt Li Lm Lp, Rt Rr | P2 | Medium |
| A5 | Lt Li Lm Lp, Rt Ri Rm | P1, P2 | Medium |
| A#5 / Bb5 | Lt Li Lp, Rt Rr | P2 | Medium |
| B5 | Lt Lp, Rt (P2) vs Lt Li Lp (P1) | P1, P2 | **Sources disagree** |
| C6 | Lp, Rt (P2) vs Lt only (P1 list) | P1, P2 | **Sources disagree** |
| C#6 / Db6 | Lp, Rt Rr | P2 | Medium |
| D6 | Lp, Rt | P1, P2 | High |
| D#6 / Eb6 | Lm Lp | P2 | Low |
| E6 | Lp (Asian system) | P1 | Medium |
| F6 | none (all open) | P1, P2 | High |

The pureocarinas hole lists came from image alt text, not from looking at the diagrams themselves.

## 5. Problems found

1. **Fingerings vary by maker.** Every source says sharps/flats and sub-hole use depend on the instrument, and tells players to use the chart from their own ocarina's maker. A single "standard" chart does not fully exist.
2. **"Rp1 / Rp2" doesn't fit a 12-hole model.** P2's sharp fingerings use a split right-pinky hole (two small holes). That reads like a 13th hole, or a half-covered pinky. PRD F1 AC2 says exactly 12 holes, so these three fingerings (C#5, D#5, F#5) need a different source.
3. **A#4 is missing** from every readable source.
4. **B5 and C6 disagree** between the two pureocarinas pages.
5. **fingeringcharts.pages.dev is unreliable.** Its hole numbering doesn't match its own table (it says all 12 holes covered for C5, which would also close the sub-holes). Not used.
6. **Two high-octave systems exist** (Asian vs Italian). They differ only at E6. Asian is the common default.

## 6. Decisions needed before writing tests

1. **Which instrument's chart is the source of truth?** Best option: the printed chart from a specific maker's 12-hole Alto C (for example the one that came with Nicholas's ocarina), recorded in `fingerings.ts`.
2. **Sub-hole layout**: Taiwanese (both middle fingers) or Japanese (both right hand)? This changes where the SVG draws the 2 small holes.
3. **High-octave system**: Asian (assumed) or Italian?
4. **Hole IDs**: suggest stable string IDs like `L-thumb`, `L-index`, …, `L-sub`, `R-sub`, so the accessible label (AC3) can read them out directly.

## Sources

- P1: [Pure Ocarinas, "The ocarina's fingering system"](https://pureocarinas.com/ocarina-fingering-system) — hole layout, sub-holes, Taiwanese vs Japanese, Asian vs Italian, A4/B4/C5/D5/G5/D6/E6/F6.
- P2: [Pure Ocarinas, "Learning the ocarina's fingerings"](https://pureocarinas.com/learning-ocarina-fingerings) — natural and accidental fingerings (from image alt text).
- S3: [Ocarina Making, fingering chart generator](https://ocarinamaking.com/chartgen/) and its [12-hole Japanese chart in C](https://ocarinamaking.com/chartgen/display/12h_jap/c) — confirms the Japanese/Taiwanese split; chart is image-only, so no hole data was read. States its charts are generic, not any one maker's.
- S4: [fingeringcharts.pages.dev](https://fingeringcharts.pages.dev/pages/ocarina-fingering-chart) — calls the lowest note C5; otherwise inconsistent, not used.
- Not used: several "12 hole ocarina finger chart" pages in search results were copied spam pages on unrelated university/company domains.
