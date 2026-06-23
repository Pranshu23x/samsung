// Plain TypeScript types — mirrors the original Drizzle schema.
// No ORM, just data shapes.

export type Course = {
  id: number;
  title: string;
  imageSrc: string;
};

export type Unit = {
  id: number;
  title: string;
  description: string;
  courseId: number;
  order: number;
};

export type Lesson = {
  id: number;
  title: string;
  unitId: number;
  order: number;
};

export type Challenge = {
  id: number;
  lessonId: number;
  type: "SELECT" | "ASSIST" | "READ";
  question: string;
  order: number;
  // runtime — joined in queries
  completed?: boolean;
  challengeOptions?: ChallengeOption[];
  challengeProgress?: ChallengeProgress[];
};

export type ChallengeOption = {
  id: number;
  challengeId: number;
  text: string;
  correct: boolean;
  imageSrc?: string | null;
  audioSrc?: string | null;
};

export type ChallengeProgress = {
  id: number;
  userId: string;
  challengeId: number;
  completed: boolean;
};

export type ReadingAttempt = {
  id: number;
  userId: string;
  challengeId: number;
  lessonId: number;
  accuracy: number;
  wcpm: number;
  durationMs: number;
  transcript?: string | null;
  errorsJson?: string | null;
  createdAt: string;
  // runtime
  challenge?: Challenge;
  lesson?: Lesson;
};

export type UserProgress = {
  userId: string;
  userName: string;
  userImageSrc: string;
  activeCourseId?: number | null;
  hearts: number;
  points: number;
  activeCourse?: Course;
};

export type UserSubscription = {
  id: number;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: string;
};
