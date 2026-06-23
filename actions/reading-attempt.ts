"use server";

import { revalidatePath } from "next/cache";

import { getUserId } from "@/lib/auth";
import db from "@/db/drizzle";

type SaveAttemptInput = {
  challengeId: number;
  lessonId: number;
  accuracy: number;
  wcpm: number;
  durationMs: number;
  transcript: string | null;
  errors: { target: string; status: string; spoken: string | null }[];
};

export async function saveReadingAttempt(input: SaveAttemptInput) {
  const userId = getUserId();

  db.insert("readingAttempts", [{
    id: 0,
    userId,
    challengeId: input.challengeId,
    lessonId: input.lessonId,
    accuracy: input.accuracy,
    wcpm: input.wcpm,
    durationMs: input.durationMs,
    transcript: input.transcript ?? null,
    errorsJson: JSON.stringify(input.errors),
    createdAt: new Date().toISOString(),
  }]);

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/teacher");

  return { success: true };
}
