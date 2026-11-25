import type { Note } from "@/lib/notes";

/** How far a frequency is from a note, in cents (100 cents = 1 semitone). */
export function centsFromNote(frequencyHz: number, note: Note): number {
  throw new Error(`Not implemented yet (F2 AC2): ${frequencyHz} Hz, ${note}`);
}
