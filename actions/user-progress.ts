"use server";

import { revalidatePath } from "next/cache";

import { MAX_HEARTS, POINTS_TO_REFILL } from "@/constants";
import { getUserId } from "@/lib/auth";
import db from "@/db/drizzle";
import { getCourseById, getUserProgress, getUserSubscription } from "@/db/queries";

export const upsertUserProgress = async (courseId: number) => {
  const userId = getUserId();

  const course = getCourseById(courseId);

  if (!course) throw new Error("Course not found.");

  if (!course.units.length || !course.units[0].lessons.length)
    throw new Error("Course is empty.");

  const existingUserProgress = await getUserProgress(userId);

  if (existingUserProgress) {
    db.update("userProgress", { userId }, {
      activeCourseId: courseId,
      userName: "Demo User",
      userImageSrc: "/mascot.svg",
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    return { redirect: "/learn" };
  }

  db.insert("userProgress", [{
    userId: userId,
    activeCourseId: courseId,
    userName: "Demo User",
    userImageSrc: "/mascot.svg",
    hearts: MAX_HEARTS,
    points: 0,
  }]);

  revalidatePath("/courses");
  revalidatePath("/learn");
  return { redirect: "/learn" };
};

export const reduceHearts = async (challengeId: number) => {
  const userId = getUserId();

  const currentUserProgress = await getUserProgress(userId);
  const userSubscription = await getUserSubscription(userId);

  const challenge = db.findFirst<any>("challenges", {
    where: { id: challengeId },
  });

  if (!challenge) throw new Error("Challenge not found.");

  const lessonId = challenge.lessonId;

  const existingChallengeProgress = db.findFirst<any>("challengeProgress", {
    where: { userId, challengeId },
  });

  const isPractice = !!existingChallengeProgress;

  if (isPractice) return { error: "practice" };

  if (!currentUserProgress) throw new Error("User progress not found.");

  if (userSubscription?.isActive) return { error: "subscription" };

  if (currentUserProgress.hearts === 0) return { error: "hearts" };

  db.update("userProgress", { userId }, {
    hearts: Math.max(currentUserProgress.hearts - 1, 0),
  });

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
};

export const refillHearts = async () => {
  const userId = getUserId();
  const currentUserProgress = await getUserProgress(userId);

  if (!currentUserProgress) throw new Error("User progress not found.");
  if (currentUserProgress.hearts === MAX_HEARTS)
    throw new Error("Hearts are already full.");
  if (currentUserProgress.points < POINTS_TO_REFILL)
    throw new Error("Not enough points.");

  db.update("userProgress", { userId }, {
    hearts: MAX_HEARTS,
    points: currentUserProgress.points - POINTS_TO_REFILL,
  });

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};
