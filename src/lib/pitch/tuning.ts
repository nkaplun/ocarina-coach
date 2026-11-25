import { IN_TUNE_CENTS } from "@/lib/pitch/constants";

export type TuningStatus = "flat" | "in tune" | "sharp";

/** "in tune" within ±15 cents, otherwise "flat" or "sharp". */
export function tuningStatus(cents: number): TuningStatus {
  if (cents > IN_TUNE_CENTS) return "sharp";
  if (cents < -IN_TUNE_CENTS) return "flat";
  return "in tune";
}
