// Fluency metrics derived from a word alignment: accuracy, words-correct-per-
// minute (WCPM) and a pacing flag. Pure functions, safe to use on client or
// server.

import type { AlignmentResult } from "./align";

export type Pacing = "too-slow" | "good" | "too-fast";

export type FluencyScore = {
  /** Percentage of target words read correctly (0–100). */
  accuracy: number;
  /** Words correct per minute. */
  wcpm: number;
  pacing: Pacing;
  /** Whether the attempt passes the lesson threshold. */
  passed: boolean;
  counts: AlignmentResult["counts"];
};

export type ScoreOptions = {
  /** Recording duration in milliseconds (from the mic capture). */
  durationMs: number;
  /** Minimum accuracy % to pass the challenge. Defaults to 80. */
  passThreshold?: number;
  /** Grade-appropriate WCPM band [min, max] for the pacing flag. */
  wcpmBand?: [number, number];
};

const DEFAULT_THRESHOLD = 80;
// A gentle default band for grades 3–8 reading aloud.
const DEFAULT_WCPM_BAND: [number, number] = [40, 150];

export function scoreAttempt(
  alignment: AlignmentResult,
  { durationMs, passThreshold = DEFAULT_THRESHOLD, wcpmBand = DEFAULT_WCPM_BAND }: ScoreOptions
): FluencyScore {
  const { counts } = alignment;
  const total = counts.total || 1;
  const accuracy = Math.round((counts.correct / total) * 100);

  const minutes = durationMs > 0 ? durationMs / 60_000 : 0;
  const wcpm = minutes > 0 ? Math.round(counts.correct / minutes) : 0;

  const [minWcpm, maxWcpm] = wcpmBand;
  let pacing: Pacing = "good";
  if (wcpm > 0 && wcpm < minWcpm) pacing = "too-slow";
  else if (wcpm > maxWcpm) pacing = "too-fast";

  return {
    accuracy,
    wcpm,
    pacing,
    passed: accuracy >= passThreshold,
    counts,
  };
}

/** Star rating (1–3) for gamified feedback, based on accuracy. */
export function starsFor(accuracy: number): 1 | 2 | 3 {
  if (accuracy >= 95) return 3;
  if (accuracy >= 80) return 2;
  return 1;
}
