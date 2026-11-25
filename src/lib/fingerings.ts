/**
 * Fingerings for a 12-hole Alto C ocarina, A4 to F6 (sounding pitch).
 *
 * Source of truth: Imperial City Ocarina, "12-Hole Alto, Key of C — Complete
 * Fingering Chart", https://www.imperialcityocarina.com/images/cache/ac-12-hole-fingering-chart.pdf
 * The chart is written one octave below sounding pitch, so its written low C
 * is C5 here. Taiwanese sub-hole layout (one sub-hole beside each middle
 * finger) and the Asian high-octave system (E6 = left pinky only).
 * Transcription notes: docs/hw4/f1-explore.md.
 */
import type { Note } from "@/lib/notes";

export type HoleId =
  | "L-thumb"
  | "L-index"
  | "L-middle"
  | "L-ring"
  | "L-pinky"
  | "L-sub"
  | "R-thumb"
  | "R-index"
  | "R-middle"
  | "R-ring"
  | "R-pinky"
  | "R-sub";

export type Hole = { id: HoleId; name: string };

export const HOLES: readonly Hole[] = [
  { id: "L-thumb", name: "left thumb" },
  { id: "L-index", name: "left index" },
  { id: "L-middle", name: "left middle" },
  { id: "L-ring", name: "left ring" },
  { id: "L-pinky", name: "left pinky" },
  { id: "L-sub", name: "left sub-hole" },
  { id: "R-thumb", name: "right thumb" },
  { id: "R-index", name: "right index" },
  { id: "R-middle", name: "right middle" },
  { id: "R-ring", name: "right ring" },
  { id: "R-pinky", name: "right pinky" },
  { id: "R-sub", name: "right sub-hole" },
];

const LEFT_HAND: readonly HoleId[] = [
  "L-thumb",
  "L-index",
  "L-middle",
  "L-ring",
  "L-pinky",
];
const RIGHT_HAND: readonly HoleId[] = [
  "R-thumb",
  "R-index",
  "R-middle",
  "R-ring",
  "R-pinky",
];
const ALL_MAIN: readonly HoleId[] = [...LEFT_HAND, ...RIGHT_HAND];

/** Covered holes per note, keyed by MIDI number. Holes not listed are open. */
export const FINGERINGS: Readonly<Record<Note, readonly HoleId[]>> = {
  69: [...ALL_MAIN, "L-sub", "R-sub"], // A4
  70: [...ALL_MAIN, "L-sub"], // A#4 / Bb4
  71: [...ALL_MAIN, "R-sub"], // B4
  72: ALL_MAIN, // C5
  73: [...LEFT_HAND, "R-thumb", "R-index", "R-middle", "R-ring", "R-sub"], // C#5 / Db5
  74: [...LEFT_HAND, "R-thumb", "R-index", "R-middle", "R-ring"], // D5
  75: [...LEFT_HAND, "R-thumb", "R-index", "R-middle", "R-pinky"], // D#5 / Eb5
  76: [...LEFT_HAND, "R-thumb", "R-index", "R-middle"], // E5
  77: [...LEFT_HAND, "R-thumb", "R-index"], // F5
  78: [...LEFT_HAND, "R-thumb", "R-ring"], // F#5 / Gb5
  79: [...LEFT_HAND, "R-thumb"], // G5
  80: ["L-thumb", "L-index", "L-middle", "L-pinky", "R-thumb", "R-ring"], // G#5 / Ab5
  81: ["L-thumb", "L-index", "L-middle", "L-pinky", "R-thumb"], // A5
  82: ["L-thumb", "L-index", "L-pinky", "R-thumb", "R-ring"], // A#5 / Bb5
  83: ["L-thumb", "L-index", "L-pinky", "R-thumb"], // B5
  84: ["L-thumb", "L-pinky", "R-thumb"], // C6
  85: ["L-pinky", "R-thumb", "R-ring"], // C#6 / Db6
  86: ["L-pinky", "R-thumb"], // D6
  87: ["L-pinky", "R-ring"], // D#6 / Eb6
  88: ["L-pinky"], // E6
  89: [], // F6
};

/** Covered holes for a note, or undefined if the ocarina can't play it. */
export function getFingering(note: Note): readonly HoleId[] | undefined {
  return FINGERINGS[note];
}
