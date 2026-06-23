"use server";

import { getUserId } from "@/lib/auth";

import { getUserSubscription } from "@/db/queries";

export const createStripeUrl = async () => {
  const userId = getUserId();

  if (!userId) throw new Error("Unauthorized.");

  const userSubscription = await getUserSubscription(userId);

  if (userSubscription && userSubscription.stripeCustomerId) {
    return { data: "/shop" };
  }

  return { data: "/shop" };
};
