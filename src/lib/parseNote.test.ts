import { describe, expect, it } from "vitest";
import { parseNote } from "@/lib/notes";

describe("F1 AC5 parseNote rejects out-of-range and invalid notes", () => {
  it.each([
    ["A4", 69],
    ["a#4", 70],
    ["Bb4", 70],
    ["C5", 72],
    [" f6 ", 89],
  ])("accepts %j as MIDI %i", (text, midi) => {
    expect(parseNote(text)).toEqual({ ok: true, value: midi });
  });

  it("treats a sharp and its flat as the same note", () => {
    expect(parseNote("A#4")).toEqual(parseNote("Bb4"));
    expect(parseNote("D#6")).toEqual(parseNote("Eb6"));
  });

  it.each(["G#4", "G4", "F#6", "C7", "C4"])(
    "rejects %j as outside the Alto C range",
    (text) => {
      const result = parseNote(text);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(
          `${text} is outside the Alto C range (A4 to F6).`,
        );
      }
    },
  );

  it.each(["", "H2", "C", "C#", "5", "A##4", "<script>"])(
    "rejects %j as not a note name",
    (text) => {
      const result = parseNote(text);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toMatch(/is not a note name/);
      }
    },
  );
});
