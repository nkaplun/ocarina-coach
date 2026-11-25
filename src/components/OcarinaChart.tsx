import type { Note } from "@/lib/notes";

type OcarinaChartProps = { note: Note };

export function OcarinaChart({ note }: OcarinaChartProps) {
  return <svg data-note={note} />;
}
