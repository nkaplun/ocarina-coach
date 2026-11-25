import { noteName, octaveOf, type Note } from "@/lib/notes";
import { A4_HZ, A4_NOTE, SEMITONES_PER_OCTAVE } from "@/lib/pitch/constants";

/** The nearest note to a measured frequency. */
export type NoteReading = { note: Note; name: string; octave: number };

export type FrequencyResult =
  { ok: true; value: NoteReading } | { ok: false; error: string };

/** Finds the nearest note to a frequency (A4 = 440 Hz, equal temperament). */
export function frequencyToNote(frequencyHz: number): FrequencyResult {
  const semitonesFromA4 = SEMITONES_PER_OCTAVE * Math.log2(frequencyHz / A4_HZ);
  const note = A4_NOTE + Math.round(semitonesFromA4);
  return {
    ok: true,
    value: { note, name: noteName(note), octave: octaveOf(note) },
  };
}
