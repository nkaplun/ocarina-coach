import type { Note } from "@/lib/notes";
import { centsFromNote } from "@/lib/pitch/cents";
import { frequencyToNote, type NoteReading } from "@/lib/pitch/frequencyToNote";
import { tuningStatus, type TuningStatus } from "@/lib/pitch/tuning";

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
  const reading = frequencyToNote(frequencyHz);
  if (!reading.ok) return reading;
  const cents = centsFromNote(frequencyHz, target);
  return {
    ok: true,
    value: {
      isRightNote: reading.value.note === target,
      played: reading.value,
      cents,
      status: tuningStatus(cents),
    },
  };
}
