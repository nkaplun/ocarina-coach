import type { Note } from "@/lib/notes";

export type HoleId =
  | "L-thumb"
  | "L-index"
  | "L-middle"
  | "L-ring"
  | "L-pinky"
  | "L-sub"
  | "R-thumb"
  | "R-index"
  | "R-middle"
  | "R-ring"
  | "R-pinky"
  | "R-sub";

export type Hole = { id: HoleId; name: string };

export const HOLES: readonly Hole[] = [];

export const FINGERINGS: Readonly<Record<Note, readonly HoleId[]>> = {};

export function getFingering(note: Note): readonly HoleId[] | undefined {
  return FINGERINGS[note];
}
