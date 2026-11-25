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

describe("F2 AC4 rejects invalid and out-of-range frequencies", () => {
  function errorFor(frequencyHz: number): string {
    const result = frequencyToNote(frequencyHz);
    if (result.ok) throw new Error(`${frequencyHz} Hz was accepted`);
    return result.error;
  }

  it.each([NaN, Infinity, -Infinity])("rejects %d as not a number", (value) => {
    expect(errorFor(value)).toMatch(/not a number/);
  });

  it.each([0, -1, -440])("rejects %d Hz as not above 0", (frequencyHz) => {
    expect(errorFor(frequencyHz)).toMatch(/above 0 Hz/);
  });

  // Accepted range: one semitone past each end of A4..F6,
  // i.e. G#4 (415.30 Hz) to F#6 (1479.98 Hz).
  it.each([415.29, 400, 261.63, 1])(
    "rejects %d Hz as too low",
    (frequencyHz) => {
      expect(errorFor(frequencyHz)).toMatch(/too low/);
    },
  );

  it.each([1479.99, 1500, 2093, 20000])(
    "rejects %d Hz as too high",
    (frequencyHz) => {
      expect(errorFor(frequencyHz)).toMatch(/too high/);
    },
  );

  it.each([
    [415.31, "G#4"],
    [430, "A4"],
    [1396.91, "F6"],
    [1479.97, "F#6"],
  ])("accepts %d Hz inside the margin as %s", (frequencyHz, name) => {
    expect(frequencyToNote(frequencyHz)).toMatchObject({
      ok: true,
      value: { name },
    });
  });
});
