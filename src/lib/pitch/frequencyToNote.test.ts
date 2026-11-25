import { describe, expect, it } from "vitest";
import { ALTO_C_NOTES, noteName } from "@/lib/notes";
import { frequencyToNote } from "@/lib/pitch/frequencyToNote";

describe("F2 AC1 frequency maps to nearest note", () => {
  it.each([
    [440, 69, "A4", 4],
    [523.25, 72, "C5", 5],
    [466.16, 70, "A#4", 4],
    [880, 81, "A5", 5],
    [1396.91, 89, "F6", 6],
  ])("%d Hz is MIDI %i (%s)", (frequencyHz, note, name, octave) => {
    expect(frequencyToNote(frequencyHz)).toEqual({
      ok: true,
      value: { note, name, octave },
    });
  });

  it("picks the nearest note when the pitch is off", () => {
    // 450 Hz is 39 cents above A4; 455 Hz is 58 cents above A4, so nearer A#4.
    expect(frequencyToNote(450)).toMatchObject({ value: { name: "A4" } });
    expect(frequencyToNote(455)).toMatchObject({ value: { name: "A#4" } });
  });

  it("maps the exact pitch of every Alto C note back to that note", () => {
    ALTO_C_NOTES.forEach((note) => {
      const frequencyHz = 440 * 2 ** ((note - 69) / 12);
      expect(frequencyToNote(frequencyHz)).toMatchObject({
        ok: true,
        value: { note, name: noteName(note) },
      });
    });
  });
});
