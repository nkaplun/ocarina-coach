import {
  HIGHEST_NOTE,
  LOWEST_NOTE,
  noteName,
  octaveOf,
  type Note,
} from "@/lib/notes";
import {
  A4_HZ,
  A4_NOTE,
  CENTS_PER_SEMITONE,
  RANGE_MARGIN_CENTS,
  SEMITONES_PER_OCTAVE,
} from "@/lib/pitch/constants";
import { semitonesFromA4 } from "@/lib/pitch/scale";

/** The nearest note to a measured frequency. */
export type NoteReading = { note: Note; name: string; octave: number };

export type FrequencyResult =
  { ok: true; value: NoteReading } | { ok: false; error: string };

/** The in-tune frequency of a note, shifted by `cents`. */
function frequencyHzAt(note: Note, cents: number): number {
  const semitones = note - A4_NOTE + cents / CENTS_PER_SEMITONE;
  return A4_HZ * 2 ** (semitones / SEMITONES_PER_OCTAVE);
}

/** Lowest frequency accepted: one margin below A4. */
export const MIN_FREQUENCY_HZ = frequencyHzAt(LOWEST_NOTE, -RANGE_MARGIN_CENTS);
/** Highest frequency accepted: one margin above F6. */
export const MAX_FREQUENCY_HZ = frequencyHzAt(HIGHEST_NOTE, RANGE_MARGIN_CENTS);

/** Finds the nearest note to a frequency (A4 = 440 Hz, equal temperament). */
export function frequencyToNote(frequencyHz: number): FrequencyResult {
  if (!Number.isFinite(frequencyHz)) {
    return { ok: false, error: "That frequency is not a number." };
  }
  if (frequencyHz <= 0) {
    return {
      ok: false,
      error: `A frequency must be above 0 Hz (got ${frequencyHz} Hz).`,
    };
  }
  if (frequencyHz < MIN_FREQUENCY_HZ) {
    return {
      ok: false,
      error: `${frequencyHz} Hz is too low for an Alto C ocarina (lowest is about ${MIN_FREQUENCY_HZ.toFixed(1)} Hz).`,
    };
  }
  if (frequencyHz > MAX_FREQUENCY_HZ) {
    return {
      ok: false,
      error: `${frequencyHz} Hz is too high for an Alto C ocarina (highest is about ${MAX_FREQUENCY_HZ.toFixed(1)} Hz).`,
    };
  }
  const note = A4_NOTE + Math.round(semitonesFromA4(frequencyHz));
  return {
    ok: true,
    value: { note, name: noteName(note), octave: octaveOf(note) },
  };
}
