import type { Note } from "@/lib/notes";

/** The nearest note to a measured frequency. */
export type NoteReading = { note: Note; name: string; octave: number };

export type FrequencyResult =
  { ok: true; value: NoteReading } | { ok: false; error: string };

/** Finds the nearest note to a frequency (A4 = 440 Hz, equal temperament). */
export function frequencyToNote(frequencyHz: number): FrequencyResult {
  throw new Error(`Not implemented yet (F2 AC1): ${frequencyHz} Hz`);
}
