import { OcarinaChart } from "@/components/OcarinaChart";
import { noteLabel, parseNote } from "@/lib/notes";

/** Shown when the URL has no note, since it's the "all main holes" home position. */
export const DEFAULT_NOTE_TEXT = "C5";

type FingeringPanelProps = { noteText?: string };

/** Shows the fingering for a note typed in the URL, or why it can't. */
export function FingeringPanel({
  noteText = DEFAULT_NOTE_TEXT,
}: FingeringPanelProps) {
  const result = parseNote(noteText);

  if (!result.ok) {
    return (
      <p
        role="alert"
        className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
      >
        {result.error}
      </p>
    );
  }

  return (
    <section className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-semibold">{noteLabel(result.value)}</h2>
      <OcarinaChart note={result.value} />
    </section>
  );
}
