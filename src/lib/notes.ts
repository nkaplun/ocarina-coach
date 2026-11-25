/** A note is its MIDI number (A4 = 69). Convert to text only at the edges. */
export type Note = number;

export const LOWEST_NOTE: Note = 69;
export const HIGHEST_NOTE: Note = 89;

export const ALTO_C_NOTES: readonly Note[] = [];

export function noteLabel(note: Note): string {
  return String(note);
}
