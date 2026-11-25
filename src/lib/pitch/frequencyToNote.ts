import { noteName, octaveOf, type Note } from "@/lib/notes";
import { A4_NOTE } from "@/lib/pitch/constants";
import { semitonesFromA4 } from "@/lib/pitch/scale";

/** The nearest note to a measured frequency. */
export type NoteReading = { note: Note; name: string; octave: number };

export type FrequencyResult =
  { ok: true; value: NoteReading } | { ok: false; error: string };

/** Finds the nearest note to a frequency (A4 = 440 Hz, equal temperament). */
export function frequencyToNote(frequencyHz: number): FrequencyResult {
  const note = A4_NOTE + Math.round(semitonesFromA4(frequencyHz));
  return {
    ok: true,
    value: { note, name: noteName(note), octave: octaveOf(note) },
  };
}
