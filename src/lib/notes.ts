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

export type ParseNoteResult =
  { ok: true; value: Note } | { ok: false; error: string };

/** Turns text like "A#4" or "Bb4" into a playable note, or explains why not. */
export function parseNote(text: string): ParseNoteResult {
  const trimmed = text.trim();
  const match = NOTE_PATTERN.exec(trimmed);
  if (!match) {
    return {
      ok: false,
      error: `"${trimmed}" is not a note name. Use a letter A to G, an optional # or b, and an octave, like C5 or Bb4.`,
    };
  }
  const [, letter, accidental, octaveText] = match;
  const pitchClass = LETTER_PITCH_CLASS[letter.toUpperCase()];
  const shift = accidental === "#" ? 1 : accidental === "b" ? -1 : 0;
  const note = (Number(octaveText) + 1) * 12 + pitchClass + shift;
  if (note < LOWEST_NOTE || note > HIGHEST_NOTE) {
    return {
      ok: false,
      error: `${trimmed} is outside the Alto C range (A4 to F6).`,
    };
  }
  return { ok: true, value: note };
}

/** Letter, optional sharp (#) or flat (b), one-digit octave. */
const NOTE_PATTERN = /^([A-Ga-g])([#b]?)(\d)$/;

const LETTER_PITCH_CLASS: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/** "C5" for naturals, "A#4 / Bb4" for sharps and flats. */
export function noteLabel(note: Note): string {
  const pitchClass = note % 12;
  const octave = octaveOf(note);
  const sharp = `${SHARP_NAMES[pitchClass]}${octave}`;
  const flat = `${FLAT_NAMES[pitchClass]}${octave}`;
  return sharp === flat ? sharp : `${sharp} / ${flat}`;
}
