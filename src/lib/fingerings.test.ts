import { describe, expect, it } from "vitest";
import { FINGERINGS, HOLES, getFingering, type HoleId } from "@/lib/fingerings";
import { ALTO_C_NOTES, parseNote } from "@/lib/notes";

const MAIN: HoleId[] = [
  "L-thumb",
  "L-index",
  "L-middle",
  "L-ring",
  "L-pinky",
  "R-thumb",
  "R-index",
  "R-middle",
  "R-ring",
  "R-pinky",
];
const LEFT_ALL: HoleId[] = [
  "L-thumb",
  "L-index",
  "L-middle",
  "L-ring",
  "L-pinky",
];

// Transcribed from the Imperial City Ocarina 12-hole Alto C chart
// (see docs/hw4/f1-explore.md, section 6).
const EXPECTED: Record<string, HoleId[]> = {
  A4: [...MAIN, "L-sub", "R-sub"],
  "A#4": [...MAIN, "L-sub"],
  B4: [...MAIN, "R-sub"],
  C5: MAIN,
  "C#5": [...LEFT_ALL, "R-thumb", "R-index", "R-middle", "R-ring", "R-sub"],
  D5: [...LEFT_ALL, "R-thumb", "R-index", "R-middle", "R-ring"],
  "D#5": [...LEFT_ALL, "R-thumb", "R-index", "R-middle", "R-pinky"],
  E5: [...LEFT_ALL, "R-thumb", "R-index", "R-middle"],
  F5: [...LEFT_ALL, "R-thumb", "R-index"],
  "F#5": [...LEFT_ALL, "R-thumb", "R-ring"],
  G5: [...LEFT_ALL, "R-thumb"],
  "G#5": ["L-thumb", "L-index", "L-middle", "L-pinky", "R-thumb", "R-ring"],
  A5: ["L-thumb", "L-index", "L-middle", "L-pinky", "R-thumb"],
  "A#5": ["L-thumb", "L-index", "L-pinky", "R-thumb", "R-ring"],
  B5: ["L-thumb", "L-index", "L-pinky", "R-thumb"],
  C6: ["L-thumb", "L-pinky", "R-thumb"],
  "C#6": ["L-pinky", "R-thumb", "R-ring"],
  D6: ["L-pinky", "R-thumb"],
  "D#6": ["L-pinky", "R-ring"],
  E6: ["L-pinky"],
  F6: [],
};

function noteOf(text: string): number {
  const result = parseNote(text);
  if (!result.ok) throw new Error(result.error);
  return result.value;
}

describe("F1 AC4 fingerings stored as data for all 21 notes", () => {
  it("defines 12 distinct holes, each with a plain-language name", () => {
    expect(HOLES).toHaveLength(12);
    expect(new Set(HOLES.map((hole) => hole.id)).size).toBe(12);
    HOLES.forEach((hole) => expect(hole.name).toMatch(/^(left|right) /));
  });

  it("has exactly one fingering per playable note", () => {
    expect(Object.keys(FINGERINGS).map(Number).sort()).toEqual([
      ...ALTO_C_NOTES,
    ]);
  });

  it("only uses known hole IDs, with no duplicates", () => {
    const known = new Set(HOLES.map((hole) => hole.id));
    ALTO_C_NOTES.forEach((note) => {
      const covered = getFingering(note) ?? [];
      covered.forEach((id) => expect(known.has(id)).toBe(true));
      expect(new Set(covered).size).toBe(covered.length);
    });
  });

  it.each(Object.entries(EXPECTED))("%s matches the chart", (text, holes) => {
    expect([...(getFingering(noteOf(text)) ?? [])].sort()).toEqual(
      [...holes].sort(),
    );
  });

  it("uses the sub-holes only on A4, A#4, B4 and C#5", () => {
    const withSubs = ALTO_C_NOTES.filter((note) =>
      (getFingering(note) ?? []).some((id) => id.endsWith("-sub")),
    );
    expect(withSubs).toEqual(["A4", "A#4", "B4", "C#5"].map(noteOf));
  });

  it("returns undefined for a note the ocarina cannot play", () => {
    expect(getFingering(60)).toBeUndefined();
  });
});
