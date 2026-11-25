import type { Metadata } from "next";
import { Suspense } from "react";
import { DEFAULT_NOTE_TEXT, FingeringPanel } from "@/components/FingeringPanel";
import { NotePicker } from "@/components/NotePicker";
import { parseNote } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Fingering chart · Ocarina Coach",
  description:
    "Which holes to cover for every note on a 12-hole Alto C ocarina.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Not async: the header is prerendered, and only the part that reads
// ?note= waits for the request (cacheComponents is on in next.config.ts).
export default function ChartPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Fingering chart</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          12-hole Alto C ocarina. Filled holes are covered, empty holes are
          open. Thumb holes are on the back, drawn below the body.
        </p>
      </header>
      <Suspense fallback={<p>Loading chart…</p>}>
        <SelectedNote searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function SelectedNote({ searchParams }: { searchParams: SearchParams }) {
  const { note } = await searchParams;
  const noteText = (Array.isArray(note) ? note[0] : note) ?? DEFAULT_NOTE_TEXT;
  const parsed = parseNote(noteText);

  return (
    <>
      <NotePicker current={parsed.ok ? parsed.value : undefined} />
      <FingeringPanel noteText={noteText} />
    </>
  );
}
