/** A frequency for display: one decimal plus the unit, e.g. "523.3 Hz". */
export function formatFrequencyHz(frequencyHz: number): string {
  return `${frequencyHz.toFixed(1)} Hz`;
}
