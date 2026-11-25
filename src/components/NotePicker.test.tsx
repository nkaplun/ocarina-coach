import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotePicker } from "@/components/NotePicker";
import { ALTO_C_NOTES, noteLabel } from "@/lib/notes";

describe("F1 AC1 note picker lists 21 notes in order", () => {
  it("shows one link per note, A4 to F6, in order", () => {
    render(<NotePicker current={72} />);
    const nav = screen.getByRole("navigation", { name: "Pick a note" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(
      ALTO_C_NOTES.map(noteLabel),
    );
  });

  it("links each note to /chart with the note in the URL", () => {
    render(<NotePicker current={72} />);
    expect(screen.getByRole("link", { name: "C5" })).toHaveAttribute(
      "href",
      "/chart?note=C5",
    );
    expect(screen.getByRole("link", { name: "A#4 / Bb4" })).toHaveAttribute(
      "href",
      "/chart?note=A%234",
    );
  });

  it("marks only the current note", () => {
    render(<NotePicker current={70} />);
    expect(screen.getByRole("link", { current: "page" })).toHaveTextContent(
      "A#4 / Bb4",
    );
  });

  it("marks nothing when no valid note is selected", () => {
    render(<NotePicker />);
    expect(
      screen.queryByRole("link", { current: "page" }),
    ).not.toBeInTheDocument();
  });
});
