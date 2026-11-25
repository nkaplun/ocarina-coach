import type { Note } from "@/lib/notes";

type NotePickerProps = { current?: Note };

export function NotePicker({ current }: NotePickerProps) {
  return <nav data-current={current} />;
}
