import { describe, expect, it } from "vitest";
import {
  ALTO_C_NOTES,
  HIGHEST_NOTE,
  LOWEST_NOTE,
  noteLabel,
} from "@/lib/notes";

describe("F1 AC1 note list covers A4 to F6 in order", () => {
  it("has 21 notes", () => {
    expect(ALTO_C_NOTES).toHaveLength(21);
  });

  it("starts at A4 (MIDI 69) and ends at F6 (MIDI 89)", () => {
    expect(LOWEST_NOTE).toBe(69);
    expect(HIGHEST_NOTE).toBe(89);
    expect(ALTO_C_NOTES[0]).toBe(LOWEST_NOTE);
    expect(ALTO_C_NOTES[ALTO_C_NOTES.length - 1]).toBe(HIGHEST_NOTE);
  });

  it("goes up one semitone at a time", () => {
    ALTO_C_NOTES.slice(1).forEach((note, index) => {
      expect(note - ALTO_C_NOTES[index]).toBe(1);
    });
  });

  it("labels naturals by name and sharps with their flat", () => {
    expect(noteLabel(72)).toBe("C5");
    expect(noteLabel(70)).toBe("A#4 / Bb4");
    expect(noteLabel(89)).toBe("F6");
    expect(ALTO_C_NOTES.map(noteLabel)).toEqual([
      "A4",
      "A#4 / Bb4",
      "B4",
      "C5",
      "C#5 / Db5",
      "D5",
      "D#5 / Eb5",
      "E5",
      "F5",
      "F#5 / Gb5",
      "G5",
      "G#5 / Ab5",
      "A5",
      "A#5 / Bb5",
      "B5",
      "C6",
      "C#6 / Db6",
      "D6",
      "D#6 / Eb6",
      "E6",
      "F6",
    ]);
  });
});
