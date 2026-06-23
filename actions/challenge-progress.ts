"use server";

import { revalidatePath } from "next/cache";

import { MAX_HEARTS } from "@/constants";
import { getUserId } from "@/lib/auth";
import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";

export const upsertChallengeProgress = async (challengeId: number) => {
  const userId = getUserId();

  const currentUserProgress = await getUserProgress(userId);
  const userSubscription = await getUserSubscription(userId);

  if (!currentUserProgress) throw new Error("User progress not found.");

  const challenge = db.findFirst<any>("challenges", {
    where: { id: challengeId },
  });

  if (!challenge) throw new Error("Challenge not found.");

  const lessonId = challenge.lessonId;

  const existingChallengeProgress = db.findFirst<any>("challengeProgress", {
    where: { userId, challengeId },
  });

  const isPractice = !!existingChallengeProgress;

  if (
    currentUserProgress.hearts === 0 &&
    !isPractice &&
    !userSubscription?.isActive
  )
    return { error: "hearts" };

  if (isPractice) {
    db.update("challengeProgress", { id: existingChallengeProgress.id }, { completed: true });

    db.update("userProgress", { userId }, {
      hearts: Math.min(currentUserProgress.hearts + 1, MAX_HEARTS),
      points: currentUserProgress.points + 10,
    });

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
    return;
  }

  db.insert("challengeProgress", [{
    id: 0,
    challengeId: challengeId,
    userId,
    completed: true,
  }]);

  db.update("userProgress", { userId }, {
    points: currentUserProgress.points + 10,
  });

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
};
