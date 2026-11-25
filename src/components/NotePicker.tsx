import Link from "next/link";
import { ALTO_C_NOTES, noteLabel, noteName, type Note } from "@/lib/notes";

type NotePickerProps = { current?: Note };

/** Links to every playable note, A4 to F6. Plain links, no client JS. */
export function NotePicker({ current }: NotePickerProps) {
  return (
    <nav aria-label="Pick a note">
      <ul className="flex flex-wrap gap-2">
        {ALTO_C_NOTES.map((note) => {
          const isCurrent = note === current;
          return (
            <li key={note}>
              <Link
                href={`/chart?note=${encodeURIComponent(noteName(note))}`}
                aria-current={isCurrent ? "page" : undefined}
                className={`block rounded-md border px-3 py-1.5 text-sm font-medium ${
                  isCurrent
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                    : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                }`}
              >
                {noteLabel(note)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
