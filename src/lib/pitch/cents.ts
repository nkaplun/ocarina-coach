import type { Note } from "@/lib/notes";
import { A4_NOTE, CENTS_PER_SEMITONE, MAX_CENTS } from "@/lib/pitch/constants";
import { semitonesFromA4 } from "@/lib/pitch/scale";

/**
 * How far a frequency is from a note, in cents (100 cents = 1 semitone).
 * Positive is sharp, negative is flat. Clamped to -50..+50.
 */
export function centsFromNote(frequencyHz: number, note: Note): number {
  const semitonesOff = semitonesFromA4(frequencyHz) - (note - A4_NOTE);
  const cents = CENTS_PER_SEMITONE * semitonesOff;
  return Math.min(MAX_CENTS, Math.max(-MAX_CENTS, cents));
}
