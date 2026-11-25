import { describe, expect, it } from "vitest";
import { centsFromNote } from "@/lib/pitch/cents";
import { tuningStatus } from "@/lib/pitch/tuning";

describe("F2 AC3 tuning status", () => {
  it.each([0, 5, -5, 14.99, -14.99, 15, -15])(
    "%d cents is in tune",
    (cents) => {
      expect(tuningStatus(cents)).toBe("in tune");
    },
  );

  it.each([15.01, 20, 49.9, 50])("%d cents is sharp", (cents) => {
    expect(tuningStatus(cents)).toBe("sharp");
  });

  it.each([-15.01, -20, -49.9, -50])("%d cents is flat", (cents) => {
    expect(tuningStatus(cents)).toBe("flat");
  });

  it("reads real frequencies against the target note", () => {
    expect(tuningStatus(centsFromNote(440, 69))).toBe("in tune");
    expect(tuningStatus(centsFromNote(450, 69))).toBe("sharp"); // +39 cents
    expect(tuningStatus(centsFromNote(430, 69))).toBe("flat"); // -40 cents
    expect(tuningStatus(centsFromNote(523.25, 72))).toBe("in tune");
  });
});
