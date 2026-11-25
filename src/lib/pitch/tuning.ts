export type TuningStatus = "flat" | "in tune" | "sharp";

/** "in tune" within ±15 cents, otherwise "flat" or "sharp". */
export function tuningStatus(cents: number): TuningStatus {
  throw new Error(`Not implemented yet (F2 AC3): ${cents} cents`);
}
