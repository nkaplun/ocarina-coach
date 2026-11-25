import { A4_HZ, SEMITONES_PER_OCTAVE } from "@/lib/pitch/constants";

/** Equal-temperament math shared by the pitch functions. */

/** Semitones above A4 (negative below), not rounded. */
export function semitonesFromA4(frequencyHz: number): number {
  return SEMITONES_PER_OCTAVE * Math.log2(frequencyHz / A4_HZ);
}
