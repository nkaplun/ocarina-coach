import type { Note } from "@/lib/notes";
import type { NoteReading } from "@/lib/pitch/frequencyToNote";
import type { TuningStatus } from "@/lib/pitch/tuning";

/** What the learner played, compared with the note they were asked for. */
export type NoteCheck = {
  isRightNote: boolean;
  played: NoteReading;
  /** Cents from the target note, clamped to -50..+50. */
  cents: number;
  status: TuningStatus;
};

export type NoteCheckResult =
  { ok: true; value: NoteCheck } | { ok: false; error: string };

/** Says whether a measured frequency is the target note, and how in tune. */
export function checkNote(target: Note, frequencyHz: number): NoteCheckResult {
  throw new Error(`Not implemented yet (F2 AC5): ${target}, ${frequencyHz} Hz`);
}
