// Word-level alignment for reading-fluency scoring.
//
// Compares the words a child actually said (from speech-to-text) against the
// target passage and classifies every target word as correct, mispronounced,
// or skipped, while also surfacing extra/repeated words. This is the core of
// the "Read aloud" challenge and is intentionally free of any framework or
// network code so it can be unit-tested in isolation.

export type WordStatus = "correct" | "mispronounced" | "skipped";

export type WordResult = {
  /** The target word as written in the passage (original casing/punctuation). */
  target: string;
  /** The spoken word matched to this target, or null when the word was skipped. */
  spoken: string | null;
  status: WordStatus;
  /** Index of this word within the target passage. */
  index: number;
};

export type AlignmentResult = {
  /** One entry per target word, in passage order. */
  words: WordResult[];
  /** Extra spoken words not present in the target (repeats / insertions). */
  insertions: string[];
  counts: {
    correct: number;
    mispronounced: number;
    skipped: number;
    inserted: number;
    total: number;
  };
};

/**
 * Normalize a chunk of text into comparable lowercase tokens.
 * Strips punctuation and collapses whitespace. Keeps apostrophes inside words
 * (e.g. "don't") and digits.
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

/** Split a passage into display tokens that preserve the original text. */
export function displayTokens(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

type Op = "match" | "sub" | "del" | "ins";

/**
 * Align spoken words against the target passage using Needleman–Wunsch
 * (global alignment / edit distance with backtrace).
 *
 * Costs: match 0, substitution 1, insertion 1, deletion 1.
 */
export function alignWords(target: string, spoken: string): AlignmentResult {
  const targetDisplay = displayTokens(target);
  const targetNorm = tokenize(target);
  const spokenNorm = tokenize(spoken);

  // Defensive: if normalization and display tokenization disagree on length
  // (rare, e.g. punctuation-only display tokens), fall back to normalized text
  // for display so indexes stay aligned.
  const display =
    targetDisplay.length === targetNorm.length ? targetDisplay : targetNorm;

  const m = targetNorm.length;
  const n = spokenNorm.length;

  // dp[i][j] = min cost to align target[0..i) with spoken[0..j)
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const isMatch = targetNorm[i - 1] === spokenNorm[j - 1];
      const subCost = dp[i - 1][j - 1] + (isMatch ? 0 : 1);
      const delCost = dp[i - 1][j] + 1; // target word skipped
      const insCost = dp[i][j - 1] + 1; // extra spoken word
      dp[i][j] = Math.min(subCost, delCost, insCost);
    }
  }

  // Backtrace from (m, n) to (0, 0), recording operations.
  const ops: { op: Op; ti: number; sj: number }[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const isMatch = targetNorm[i - 1] === spokenNorm[j - 1];
      if (dp[i][j] === dp[i - 1][j - 1] + (isMatch ? 0 : 1)) {
        ops.push({ op: isMatch ? "match" : "sub", ti: i - 1, sj: j - 1 });
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.push({ op: "del", ti: i - 1, sj: -1 });
      i--;
      continue;
    }
    // insertion
    ops.push({ op: "ins", ti: -1, sj: j - 1 });
    j--;
  }
  ops.reverse();

  const words: WordResult[] = display.map((w, idx) => ({
    target: w,
    spoken: null,
    status: "skipped" as WordStatus,
    index: idx,
  }));
  const insertions: string[] = [];

  for (const { op, ti, sj } of ops) {
    if (op === "match") {
      words[ti].status = "correct";
      words[ti].spoken = spokenNorm[sj];
    } else if (op === "sub") {
      words[ti].status = "mispronounced";
      words[ti].spoken = spokenNorm[sj];
    } else if (op === "del") {
      words[ti].status = "skipped";
      words[ti].spoken = null;
    } else {
      insertions.push(spokenNorm[sj]);
    }
  }

  const counts = {
    correct: words.filter((w) => w.status === "correct").length,
    mispronounced: words.filter((w) => w.status === "mispronounced").length,
    skipped: words.filter((w) => w.status === "skipped").length,
    inserted: insertions.length,
    total: words.length,
  };

  return { words, insertions, counts };
}
