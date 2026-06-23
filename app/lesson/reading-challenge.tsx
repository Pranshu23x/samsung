"use client";

import { useCallback, useRef, useState } from "react";

import { Loader2, Mic, MicOff, RotateCcw } from "lucide-react";

import type { Challenge } from "@/db/schema";
import { alignWords, type WordResult } from "@/lib/align";
import { createRecorder, recordAudio, type AudioCapture } from "@/lib/audio";
import { scoreAttempt, starsFor, type FluencyScore } from "@/lib/scoring";
import { cn } from "@/lib/utils";

import { saveReadingAttempt } from "@/actions/reading-attempt";
import { Button } from "@/components/ui/button";

type ReadingChallengeProps = {
  challenge: Challenge & { completed: boolean };
  lessonId: number;
  onComplete: (passed: boolean) => void;
  onPointsAwarded: (accuracy: number) => void;
};

type Phase = "idle" | "recording" | "processing" | "result";

export function ReadingChallenge({
  challenge,
  lessonId,
  onComplete,
  onPointsAwarded,
}: ReadingChallengeProps) {
  const passage = challenge.question;
  const recorderRef = useRef<MediaRecorder | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<FluencyScore | null>(null);
  const [words, setWords] = useState<WordResult[] | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const recorder = await createRecorder();
      recorderRef.current = recorder;
      const recording = recordAudio(recorder, 60_000);
      stopRef.current = recording.stop;
      setPhase("recording");

      const { blob, durationMs } = await recording;

      setPhase("processing");

      const formData = new FormData();
      formData.append("audio", blob, "recording.wav");
      formData.append("passage", passage);

      const transRes = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transRes.ok) {
        const errData = await transRes.json();
        throw new Error(errData.error || "Transcription failed");
      }

      const { transcript } = await transRes.json();

      const alignment = alignWords(passage, transcript || "");
      const fluency = scoreAttempt(alignment, { durationMs });

      setWords(alignment.words);
      setScore(fluency);

      if (fluency.passed) {
        onPointsAwarded(fluency.accuracy);
      }

      // Fetch encouragement
      try {
        const errors = alignment.words
          .filter((w) => w.status !== "correct")
          .map((w) => ({ word: w.target, status: w.status }));
        const fbRes = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accuracy: fluency.accuracy,
            wcpm: fluency.wcpm,
            errors,
          }),
        });
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          setFeedback(fbData.message);
        }
      } catch {
        // Fallback feedback is fine
      }

      setPhase("result");
    } catch (err) {
      console.error("Recording/transcription error:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
      setPhase("idle");
    }
  }, [passage, onPointsAwarded]);

  const stopRecording = useCallback(() => {
    stopRef.current?.();
  }, []);

  const retry = useCallback(() => {
    setPhase("idle");
    setScore(null);
    setWords(null);
    setError(null);
    setFeedback(null);
  }, []);

  const continueLesson = useCallback(async () => {
    if (score) {
      try {
        await saveReadingAttempt({
          challengeId: challenge.id,
          lessonId,
          accuracy: score.accuracy,
          wcpm: score.wcpm,
          durationMs: 0, // duration is tracked in the audio capture but not exposed
          transcript: null,
          errors: words
            ? words
                .filter((w) => w.status !== "correct")
                .map((w) => ({
                  target: w.target,
                  status: w.status,
                  spoken: w.spoken,
                }))
            : [],
        });
      } catch (err) {
        console.error("Failed to save reading attempt:", err);
      }
    }
    onComplete(score?.passed ?? false);
  }, [score, words, challenge.id, lessonId, onComplete]);

  const wordColor = (status: WordResult["status"]) => {
    switch (status) {
      case "correct":
        return "text-green-600 bg-green-50 border-green-300";
      case "mispronounced":
        return "text-amber-700 bg-amber-50 border-amber-300";
      case "skipped":
        return "text-red-600 bg-red-50 border-red-300 line-through";
    }
  };

  const pacingLabel = (pacing: string) => {
    switch (pacing) {
      case "too-slow":
        return "Try reading a bit faster";
      case "too-fast":
        return "Try reading a bit slower";
      default:
        return "Good pace!";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Passage display */}
      <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <p className="text-lg leading-relaxed">
          {words
            ? words.map((w) => (
                <span
                  key={w.index}
                  className={cn(
                    "mr-1 inline-block rounded border border-transparent px-0.5 transition-colors",
                    wordColor(w.status)
                  )}
                  title={
                    w.status !== "correct" && w.spoken
                      ? `You said: "${w.spoken}"`
                      : undefined
                  }
                >
                  {w.target}
                </span>
              ))
            : passage.split(/\s+/).map((word, i) => (
                <span key={i} className="mr-1 inline-block">
                  {word}
                </span>
              ))}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Controls */}
      {phase === "idle" && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={startRecording}
            className="gap-2"
          >
            <Mic className="h-5 w-5" />
            Start Reading
          </Button>
        </div>
      )}

      {phase === "recording" && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-red-500">
            <span className="relative flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500" />
            </span>
            <span className="font-medium">Recording...</span>
          </div>
          <Button
            size="lg"
            variant="destructive"
            onClick={stopRecording}
            className="gap-2"
          >
            <MicOff className="h-5 w-5" />
            Stop Recording
          </Button>
        </div>
      )}

      {phase === "processing" && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Checking your reading...</span>
        </div>
      )}

      {/* Results */}
      {phase === "result" && score && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="mb-4 text-center text-lg font-bold">Your Results</h3>

            <div className="mb-4 flex items-center justify-center gap-1">
              {Array.from({ length: starsFor(score.accuracy) }, (_, i) => (
                <span key={i} className="text-3xl">⭐</span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-green-50 p-3">
                <div className="text-2xl font-bold text-green-700">
                  {score.accuracy}%
                </div>
                <div className="text-xs text-green-600">Accuracy</div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="text-2xl font-bold text-blue-700">
                  {score.wcpm}
                </div>
                <div className="text-xs text-blue-600">Words/min</div>
              </div>
            </div>

            <div className="mt-3 text-center text-sm text-muted-foreground">
              {pacingLabel(score.pacing)}
            </div>

            {score.counts.mispronounced > 0 && (
              <div className="mt-3 text-center text-sm text-amber-600">
                {score.counts.mispronounced} word
                {score.counts.mispronounced !== 1 ? "s" : ""} to practice
              </div>
            )}

            {score.counts.skipped > 0 && (
              <div className="text-center text-sm text-red-600">
                {score.counts.skipped} word
                {score.counts.skipped !== 1 ? "s" : ""} skipped
              </div>
            )}

            {feedback && (
              <div className="mt-4 text-center text-sm italic text-muted-foreground">
                &ldquo;{feedback}&rdquo;
              </div>
            )}
          </div>

          {score.passed && (
            <p className="text-center text-lg font-bold text-green-600">
              Passed! +{score.accuracy >= 95 ? 20 : 10} points
            </p>
          )}

          <div className="flex justify-center gap-3">
            {!score.passed && (
              <Button variant="outline" onClick={retry} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            <Button onClick={continueLesson}>
              {score.passed ? "Continue" : "Skip"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
