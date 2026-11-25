import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FingeringPanel } from "@/components/FingeringPanel";

describe("F1 AC5 panel shows message for out-of-range note", () => {
  it("shows the chart and note heading for a valid note", () => {
    render(<FingeringPanel noteText="Bb4" />);
    expect(
      screen.getByRole("heading", { name: "A#4 / Bb4" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /^A#4 \/ Bb4 fingering/ }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows C5 when no note is given", () => {
    render(<FingeringPanel />);
    expect(
      screen.getByRole("img", { name: /^C5 fingering/ }),
    ).toBeInTheDocument();
  });

  it("explains an out-of-range note and draws nothing", () => {
    render(<FingeringPanel noteText="G6" />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "G6 is outside the Alto C range (A4 to F6).",
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("explains text that isn't a note, without running it as markup", () => {
    render(<FingeringPanel noteText="<b>H2</b>" />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      /"<b>H2<\/b>" is not a note name/,
    );
    expect(document.querySelector("b")).toBeNull();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
