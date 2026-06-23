// Simple demo auth — hardcoded user "demo-user-1" for the MVP.
// Replace with real auth in production.

export const DEMO_USER_ID = "demo-user-1";

export function getUserId(): string {
  return DEMO_USER_ID;
}

export const ADMIN_IDS = [DEMO_USER_ID];

export function isAdmin(userId: string): boolean {
  return ADMIN_IDS.includes(userId);
}
