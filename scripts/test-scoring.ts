// Unit tests for the reading-fluency scoring engine.
// Run with:  npx tsx scripts/test-scoring.ts
//
// No test framework needed — uses node:assert and exits non-zero on failure.

import assert from "node:assert/strict";

import { alignWords, tokenize } from "../lib/align";
import { scoreAttempt, starsFor } from "../lib/scoring";

let passed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
}

const PASSAGE = "The quick brown fox jumps over the lazy dog";

console.log("tokenize");
test("lowercases and strips punctuation", () => {
  assert.deepEqual(tokenize("Hello, World!"), ["hello", "world"]);
});
test("keeps apostrophes inside words", () => {
  assert.deepEqual(tokenize("Don't stop."), ["don't", "stop"]);
});

console.log("alignWords — perfect read");
test("all words correct, no insertions", () => {
  const r = alignWords(PASSAGE, PASSAGE);
  assert.equal(r.counts.correct, 9);
  assert.equal(r.counts.skipped, 0);
  assert.equal(r.counts.mispronounced, 0);
  assert.equal(r.counts.inserted, 0);
  assert.ok(r.words.every((w) => w.status === "correct"));
});

console.log("alignWords — skipped word");
test("detects a single skipped word", () => {
  // "brown" omitted
  const r = alignWords(PASSAGE, "the quick fox jumps over the lazy dog");
  assert.equal(r.counts.skipped, 1);
  const skipped = r.words.find((w) => w.status === "skipped");
  assert.equal(skipped?.target.toLowerCase(), "brown");
  assert.equal(skipped?.spoken, null);
});

console.log("alignWords — mispronounced word");
test("detects a substitution", () => {
  // "fox" -> "box"
  const r = alignWords(PASSAGE, "the quick brown box jumps over the lazy dog");
  assert.equal(r.counts.mispronounced, 1);
  const mis = r.words.find((w) => w.status === "mispronounced");
  assert.equal(mis?.target.toLowerCase(), "fox");
  assert.equal(mis?.spoken, "box");
  assert.equal(r.counts.correct, 8);
});

console.log("alignWords — repeated / inserted word");
test("captures an extra spoken word as an insertion", () => {
  // "quick" said twice
  const r = alignWords(PASSAGE, "the quick quick brown fox jumps over the lazy dog");
  assert.equal(r.counts.inserted, 1);
  assert.equal(r.insertions[0], "quick");
  assert.equal(r.counts.correct, 9); // all target words still matched
});

console.log("scoreAttempt");
test("accuracy and WCPM compute correctly", () => {
  const r = alignWords(PASSAGE, "the quick brown box jumps over the lazy dog"); // 8/9 correct
  // 8 correct words over 60s => 8 wcpm
  const s = scoreAttempt(r, { durationMs: 60_000, passThreshold: 80 });
  assert.equal(s.accuracy, 89);
  assert.equal(s.wcpm, 8);
  assert.equal(s.passed, true);
});

test("fails below threshold", () => {
  // only 2 of 9 correct
  const r = alignWords(PASSAGE, "the quick");
  const s = scoreAttempt(r, { durationMs: 30_000, passThreshold: 80 });
  assert.equal(s.passed, false);
  assert.ok(s.accuracy < 80);
});

test("pacing flags too-slow and too-fast", () => {
  const r = alignWords(PASSAGE, PASSAGE); // 9 correct
  const slow = scoreAttempt(r, { durationMs: 60_000, wcpmBand: [40, 150] }); // 9 wcpm
  assert.equal(slow.pacing, "too-slow");
  const fast = scoreAttempt(r, { durationMs: 1_000, wcpmBand: [40, 150] }); // 540 wcpm
  assert.equal(fast.pacing, "too-fast");
});

test("zero duration does not divide by zero", () => {
  const r = alignWords(PASSAGE, PASSAGE);
  const s = scoreAttempt(r, { durationMs: 0 });
  assert.equal(s.wcpm, 0);
});

console.log("starsFor");
test("star thresholds", () => {
  assert.equal(starsFor(100), 3);
  assert.equal(starsFor(95), 3);
  assert.equal(starsFor(85), 2);
  assert.equal(starsFor(50), 1);
});

console.log(`\n${passed} checks passed${process.exitCode ? " (with failures)" : ""}.`);
