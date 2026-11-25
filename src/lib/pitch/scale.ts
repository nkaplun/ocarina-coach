import type { Note } from "@/lib/notes";
import {
  A4_HZ,
  A4_NOTE,
  CENTS_PER_SEMITONE,
  SEMITONES_PER_OCTAVE,
} from "@/lib/pitch/constants";

/** Equal-temperament math shared by the pitch functions. */

/** Semitones above A4 (negative below), not rounded. */
export function semitonesFromA4(frequencyHz: number): number {
  return SEMITONES_PER_OCTAVE * Math.log2(frequencyHz / A4_HZ);
}

/** The in-tune frequency of a note, shifted by `cents` (default 0). */
export function frequencyHzAt(note: Note, cents = 0): number {
  const semitones = note - A4_NOTE + cents / CENTS_PER_SEMITONE;
  return A4_HZ * 2 ** (semitones / SEMITONES_PER_OCTAVE);
}
