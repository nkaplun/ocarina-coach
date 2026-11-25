import { describe, expect, it } from "vitest";
import { centsFromNote } from "@/lib/pitch/cents";
import { frequencyToNote } from "@/lib/pitch/frequencyToNote";

/** The frequency that is `cents` away from MIDI note `note`. */
function frequencyAt(note: number, cents: number): number {
  return 440 * 2 ** ((note - 69 + cents / 100) / 12);
}

describe("F2 AC2 cents offset from -50 to +50", () => {
  it("is 0 at the exact pitch", () => {
    expect(centsFromNote(440, 69)).toBeCloseTo(0, 6);
    expect(centsFromNote(523.25, 72)).toBeCloseTo(0, 1);
  });

  it.each([10, -10, 15, -15, 30, -30, 49.9, -49.9])(
    "reads %d cents off A4",
    (cents) => {
      expect(centsFromNote(frequencyAt(69, cents), 69)).toBeCloseTo(cents, 6);
    },
  );

  it("is positive when sharp and negative when flat", () => {
    expect(centsFromNote(445, 69)).toBeGreaterThan(0);
    expect(centsFromNote(435, 69)).toBeLessThan(0);
  });

  it.each([
    [50, 50],
    [-50, -50],
    [80, 50],
    [-80, -50],
    [100, 50],
    [-1200, -50],
  ])("clamps %d cents to %d", (cents, expected) => {
    expect(centsFromNote(frequencyAt(69, cents), 69)).toBe(expected);
  });

  it("stays within -50..+50 against the nearest note", () => {
    for (let frequencyHz = 415.5; frequencyHz <= 1479.5; frequencyHz += 0.5) {
      const result = frequencyToNote(frequencyHz);
      if (!result.ok) throw new Error(result.error);
      const cents = centsFromNote(frequencyHz, result.value.note);
      expect(Math.abs(cents)).toBeLessThanOrEqual(50);
    }
  });
});
