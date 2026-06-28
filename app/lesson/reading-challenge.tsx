"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mic, MicOff, RotateCcw, CheckCircle, XCircle, TrendingUp, Clock, Zap, Star, ArrowRight } from "lucide-react";

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

// Waveform animation bars
function WaveformBars() {
  return (
    <div className="flex items-end gap-1 h-10">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-white"
          animate={{
            scaleY: [0.3, 1, 0.5, 0.8, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.07,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "bottom", height: "100%" }}
        />
      ))}
    </div>
  );
}

// Circular progress indicator
function CircularStat({ value, max = 100, label, color, icon: Icon }: {
  value: number;
  max?: number;
  label: string;
  color: string;
  icon: React.ElementType;
}) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="absolute inset-0 -rotate-90" width="96" height="96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="h-3.5 w-3.5 mb-0.5" style={{ color }} />
          <motion.span
            className="text-xl font-black font-poppins"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {value}
          </motion.span>
        </div>
      </div>
      <span className="text-xs font-semibold text-gray-500">{label}</span>
    </div>
  );
}

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
          durationMs: 0,
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
        return "text-emerald-700 bg-emerald-50 border-emerald-300";
      case "mispronounced":
        return "text-amber-700 bg-amber-50 border-amber-300";
      case "skipped":
        return "text-rose-600 bg-rose-50 border-rose-300 line-through";
    }
  };

  const pacingLabel = (pacing: string) => {
    switch (pacing) {
      case "too-slow": return "Try reading a bit faster to improve your fluency!";
      case "too-fast": return "Slow down slightly to improve your accuracy.";
      default: return "Great pace! Keep it up!";
    }
  };

  const getFeedbackMessage = (accuracy: number) => {
    if (accuracy >= 95) return { emoji: "🌟", title: "Outstanding!", message: "You read with near-perfect accuracy. You're a reading star!" };
    if (accuracy >= 85) return { emoji: "🎉", title: "Great effort!", message: `You read ${accuracy}% of the passage correctly. Try slowing down slightly to improve even further.` };
    if (accuracy >= 70) return { emoji: "👍", title: "Good work!", message: `You got ${accuracy}% accuracy. Keep practicing — you're building great skills!` };
    return { emoji: "💪", title: "Keep going!", message: "Reading takes practice. Try again and focus on each word carefully." };
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Passage Card ── */}
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-3xl border-2 bg-white p-6 shadow-card transition-all duration-500",
          phase === "recording"
            ? "border-emerald-400 animate-pulse-glow-green shadow-glow-green"
            : "border-gray-100"
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Decorative gradient top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-lime-400 to-sky-400" />

        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
            <span className="text-sm">📖</span>
          </div>
          <span className="text-sm font-semibold text-gray-500">Read this passage aloud</span>
        </div>

        <p className="text-lg leading-[1.9] tracking-wide text-gray-800 font-inter">
          {words
            ? words.map((w) => (
                <motion.span
                  key={w.index}
                  className={cn(
                    "mr-1 inline-block rounded-lg border border-transparent px-1 py-0.5 transition-all duration-300",
                    wordColor(w.status)
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: w.index * 0.02 }}
                  title={
                    w.status !== "correct" && w.spoken
                      ? `You said: "${w.spoken}"`
                      : undefined
                  }
                >
                  {w.target}
                </motion.span>
              ))
            : passage.split(/\s+/).map((word, i) => (
                <span key={i} className="mr-1 inline-block">
                  {word}
                </span>
              ))}
        </p>
      </motion.div>

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <XCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Controls ── */}
      <AnimatePresence mode="wait">
        {/* IDLE */}
        {phase === "idle" && (
          <motion.div
            key="idle"
            className="flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.button
              onClick={startRecording}
              className="group relative flex items-center gap-3 rounded-3xl bg-gradient-to-r from-emerald-500 to-lime-500 px-8 py-4 text-base font-bold text-white shadow-glow-green transition-all duration-300 hover:shadow-xl hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Mic className="h-4 w-4" />
              </div>
              <span>Start Reading</span>
              <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </motion.div>
        )}

        {/* RECORDING */}
        {phase === "recording" && (
          <motion.div
            key="recording"
            className="flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Waveform pill */}
            <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-6 py-3 shadow-glow-green">
              <div className="flex h-5 w-5 items-center justify-center">
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-white" />
                </span>
              </div>
              <WaveformBars />
              <span className="text-sm font-bold text-white">Recording...</span>
            </div>

            <motion.button
              onClick={stopRecording}
              className="flex items-center gap-2 rounded-2xl bg-rose-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-rose-600 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <MicOff className="h-4 w-4" />
              Stop Recording
            </motion.button>
          </motion.div>
        )}

        {/* PROCESSING */}
        {phase === "processing" && (
          <motion.div
            key="processing"
            className="flex flex-col items-center gap-3 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <Loader2 className="h-7 w-7 animate-spin text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-gray-600">Analyzing your reading...</p>
            <p className="text-xs text-gray-400">This takes just a moment ✨</p>
          </motion.div>
        )}

        {/* RESULT */}
        {phase === "result" && score && (
          <motion.div
            key="result"
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Results card */}
            <div className={cn(
              "overflow-hidden rounded-3xl border-2 bg-white shadow-card",
              score.passed ? "border-emerald-100" : "border-amber-100"
            )}>
              {/* Header */}
              <div className={cn(
                "p-5 text-center",
                score.passed
                  ? "bg-gradient-to-br from-emerald-50 to-lime-50"
                  : "bg-gradient-to-br from-amber-50 to-orange-50"
              )}>
                {/* Stars */}
                <div className="mb-3 flex justify-center gap-2">
                  {Array.from({ length: 3 }, (_, i) => (
                    <motion.span
                      key={i}
                      className={cn("text-3xl", i < starsFor(score.accuracy) ? "" : "opacity-20 grayscale")}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 300 }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>

                {/* Feedback */}
                {(() => {
                  const fb = getFeedbackMessage(score.accuracy);
                  return (
                    <>
                      <motion.p
                        className="text-2xl mb-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        {fb.emoji}
                      </motion.p>
                      <h3 className="font-poppins text-xl font-bold text-gray-800">{fb.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">{fb.message}</p>
                    </>
                  );
                })()}
              </div>

              {/* Circular Stats */}
              <div className="flex items-center justify-around p-6 border-t border-gray-50">
                <CircularStat
                  value={score.accuracy}
                  label="Accuracy"
                  color="#22C55E"
                  icon={CheckCircle}
                />
                <div className="h-16 w-px bg-gray-100" />
                <CircularStat
                  value={score.wcpm}
                  max={200}
                  label="Words/min"
                  color="#38BDF8"
                  icon={TrendingUp}
                />
                <div className="h-16 w-px bg-gray-100" />
                <CircularStat
                  value={score.counts.mispronounced + score.counts.skipped}
                  max={20}
                  label="Words missed"
                  color="#F59E0B"
                  icon={Zap}
                />
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-0 border-t border-gray-50 divide-x divide-gray-50 text-center">
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-400 mb-0.5">Pacing</p>
                  <p className="text-sm font-semibold text-gray-700">{pacingLabel(score.pacing).split(" ").slice(0, 2).join(" ")}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-400 mb-0.5">Skipped</p>
                  <p className="text-sm font-semibold text-rose-500">{score.counts.skipped} words</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-400 mb-0.5">Status</p>
                  <p className={cn("text-sm font-semibold", score.passed ? "text-emerald-600" : "text-amber-600")}>
                    {score.passed ? "✅ Passed" : "⏳ Try again"}
                  </p>
                </div>
              </div>

              {/* XP reward */}
              {score.passed && (
                <motion.div
                  className="mx-4 mb-4 mt-2 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-4 py-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  <Star className="h-5 w-5 fill-white text-white" />
                  <p className="text-sm font-bold text-white">
                    +{score.accuracy >= 95 ? 20 : 10} XP earned! Keep it up 🚀
                  </p>
                </motion.div>
              )}

              {/* Feedback quote */}
              {feedback && (
                <div className="mx-4 mb-4 rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
                  <p className="text-sm italic text-gray-600 leading-relaxed">
                    &ldquo;{feedback}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-center">
              {!score.passed && (
                <motion.button
                  onClick={retry}
                  className="flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-all"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </motion.button>
              )}
              <motion.button
                onClick={continueLesson}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-6 py-3 text-sm font-bold text-white shadow-glow-green hover:shadow-xl transition-all"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                {score.passed ? "Continue" : "Skip"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
