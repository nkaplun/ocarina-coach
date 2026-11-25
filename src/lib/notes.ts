/** A note is its MIDI number (A4 = 69). Convert to text only at the edges. */
export type Note = number;

/** Lowest note on a 12-hole Alto C ocarina (A4, sounding pitch). */
export const LOWEST_NOTE: Note = 69;
/** Highest note on a 12-hole Alto C ocarina (F6, sounding pitch). */
export const HIGHEST_NOTE: Note = 89;

/** Every playable note, lowest to highest, one semitone apart. */
export const ALTO_C_NOTES: readonly Note[] = Array.from(
  { length: HIGHEST_NOTE - LOWEST_NOTE + 1 },
  (_, index) => LOWEST_NOTE + index,
);

const SHARP_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

const FLAT_NAMES = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const;

function octaveOf(note: Note): number {
  return Math.floor(note / 12) - 1;
}

/** "C5" for naturals, "A#4 / Bb4" for sharps and flats. */
export function noteLabel(note: Note): string {
  const pitchClass = note % 12;
  const octave = octaveOf(note);
  const sharp = `${SHARP_NAMES[pitchClass]}${octave}`;
  const flat = `${FLAT_NAMES[pitchClass]}${octave}`;
  return sharp === flat ? sharp : `${sharp} / ${flat}`;
}
