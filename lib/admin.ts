import { getUserId, isAdmin } from "./auth";

export const getIsAdmin = async () => {
  const userId = getUserId();
  return isAdmin(userId);
};
