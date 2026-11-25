import type { Note } from "@/lib/notes";
import {
  A4_HZ,
  A4_NOTE,
  CENTS_PER_SEMITONE,
  MAX_CENTS,
  SEMITONES_PER_OCTAVE,
} from "@/lib/pitch/constants";

/**
 * How far a frequency is from a note, in cents (100 cents = 1 semitone).
 * Positive is sharp, negative is flat. Clamped to -50..+50.
 */
export function centsFromNote(frequencyHz: number, note: Note): number {
  const noteHz = A4_HZ * 2 ** ((note - A4_NOTE) / SEMITONES_PER_OCTAVE);
  const cents =
    CENTS_PER_SEMITONE * SEMITONES_PER_OCTAVE * Math.log2(frequencyHz / noteHz);
  return Math.min(MAX_CENTS, Math.max(-MAX_CENTS, cents));
}
