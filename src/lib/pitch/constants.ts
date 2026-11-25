/**
 * Every tuning number the pitch code uses lives here (CLAUDE.md rule 2).
 * Pitches are sounding pitch, equal temperament.
 */

/** Concert pitch: the A above middle C. */
export const A4_HZ = 440;
/** MIDI number of A4. */
export const A4_NOTE = 69;
/** Equal temperament: 12 semitones per octave. */
export const SEMITONES_PER_OCTAVE = 12;
/** 100 cents = one semitone. */
export const CENTS_PER_SEMITONE = 100;
/** Cents readings are clamped to -MAX_CENTS..+MAX_CENTS (half a semitone). */
export const MAX_CENTS = 50;
/** A pitch is "in tune" when it is within ±IN_TUNE_CENTS of the note. */
export const IN_TUNE_CENTS = 15;
