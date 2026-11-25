import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OcarinaChart } from "@/components/OcarinaChart";
import { getFingering } from "@/lib/fingerings";

function holesOf(container: HTMLElement) {
  return Array.from(container.querySelectorAll("circle[data-hole]"));
}

function coveredIds(container: HTMLElement): string[] {
  return holesOf(container)
    .filter((hole) => hole.getAttribute("data-covered") === "true")
    .map((hole) => hole.getAttribute("data-hole") ?? "")
    .sort();
}

describe("F1 AC2 chart draws 12 holes, covered filled", () => {
  it("draws exactly 12 holes", () => {
    const { container } = render(<OcarinaChart note={72} />);
    expect(holesOf(container)).toHaveLength(12);
  });

  it.each([
    ["A4 (all covered)", 69, 12],
    ["C5 (subs open)", 72, 10],
    ["C#5 (right sub)", 73, 10],
    ["F6 (all open)", 89, 0],
  ])("%s marks the chart's covered holes", (_, note, count) => {
    const { container } = render(<OcarinaChart note={note} />);
    expect(coveredIds(container)).toEqual(
      [...(getFingering(note) ?? [])].sort(),
    );
    expect(coveredIds(container)).toHaveLength(count);
  });

  it("fills covered holes and leaves open holes empty", () => {
    const { container } = render(<OcarinaChart note={72} />);
    const fills = holesOf(container).map((hole) => [
      hole.getAttribute("data-covered"),
      hole.getAttribute("fill"),
    ]);
    const coveredFills = new Set(
      fills.filter(([covered]) => covered === "true").map(([, fill]) => fill),
    );
    const openFills = new Set(
      fills.filter(([covered]) => covered === "false").map(([, fill]) => fill),
    );
    expect(coveredFills.size).toBe(1);
    expect(openFills.size).toBe(1);
    expect([...coveredFills][0]).not.toBe([...openFills][0]);
  });
});

describe("F1 AC3 chart has accessible label", () => {
  it("names the note and every covered hole in plain words", () => {
    render(<OcarinaChart note={72} />);
    expect(
      screen.getByRole("img", {
        name: "C5 fingering. Covered: left thumb, left index, left middle, left ring, left pinky, right thumb, right index, right middle, right ring, right pinky.",
      }),
    ).toBeInTheDocument();
  });

  it("includes sub-holes and both spellings of a sharp", () => {
    render(<OcarinaChart note={70} />);
    expect(
      screen.getByRole("img", { name: /^A#4 \/ Bb4 fingering\./ }),
    ).toHaveAccessibleName(/left sub-hole/);
  });

  it("says all holes are open when none are covered", () => {
    render(<OcarinaChart note={89} />);
    expect(
      screen.getByRole("img", { name: "F6 fingering. All holes open." }),
    ).toBeInTheDocument();
  });
});
