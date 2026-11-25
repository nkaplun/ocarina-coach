import { describe, expect, it } from "vitest";
import { checkNote } from "@/lib/pitch/checkNote";

const A4 = 69;
const C5 = 72;
const F6 = 89;

describe("F2 AC5 checks the played note against the target", () => {
  it.each([
    [A4, 440],
    [C5, 523.25],
    [F6, 1396.91],
  ])("note %i at %d Hz is the right note, in tune", (target, frequencyHz) => {
    expect(checkNote(target, frequencyHz)).toMatchObject({
      ok: true,
      value: { isRightNote: true, status: "in tune" },
    });
  });

  it("counts the right note even when it is out of tune", () => {
    const result = checkNote(A4, 450); // +39 cents
    expect(result).toMatchObject({
      ok: true,
      value: { isRightNote: true, status: "sharp" },
    });
    if (result.ok) expect(result.value.cents).toBeCloseTo(38.9, 1);
  });

  it("reports a wrong note and what was played instead", () => {
    const result = checkNote(C5, 440);
    expect(result).toMatchObject({
      ok: true,
      value: {
        isRightNote: false,
        played: { note: A4, name: "A4", octave: 4 },
        status: "flat",
        cents: -50,
      },
    });
  });

  it("treats the same letter in the wrong octave as a wrong note", () => {
    expect(checkNote(A4, 880)).toMatchObject({
      ok: true,
      value: { isRightNote: false, played: { name: "A5" } },
    });
  });

  it("measures cents against the target, not the nearest note", () => {
    // 455 Hz is nearest A#4 (-42 cents from it), but +58 above A4.
    const result = checkNote(A4, 455);
    expect(result).toMatchObject({
      ok: true,
      value: { isRightNote: false, played: { name: "A#4" }, cents: 50 },
    });
  });

  it.each([NaN, 0, -440, 100, 5000])(
    "passes on the reason %d Hz can't be checked",
    (frequencyHz) => {
      const result = checkNote(A4, frequencyHz);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).not.toBe("");
    },
  );
});
