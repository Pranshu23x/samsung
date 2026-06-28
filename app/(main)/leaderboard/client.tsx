"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Sparkles, Star, Medal } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type LeaderboardClientProps = {
  leaderboard: any[];
};

export const LeaderboardClient = ({ leaderboard }: LeaderboardClientProps) => {
  const topThree = leaderboard.slice(0, 3);
  const restOfUsers = leaderboard.slice(3);

  // Reorder for podium: 2nd, 1st, 3rd
  const podiumOrder = topThree.length === 3 
    ? [topThree[1], topThree[0], topThree[2]] 
    : topThree;

  return (
    <div className="flex w-full flex-col items-center pb-10">
      {/* Hero Section */}
      <motion.div 
        className="relative mb-12 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 p-8 text-center text-white shadow-glow-green"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        </div>
        
        <div className="relative flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 shadow-inner backdrop-blur-sm">
            <Image src="/leaderboard.svg" alt="Leaderboard" height={50} width={50} className="drop-shadow-lg" />
          </div>
          <h1 className="font-poppins text-3xl font-black tracking-tight lg:text-4xl">
            Hall of Fame
          </h1>
          <p className="mt-2 text-white/80 font-medium">
            See where you stand among the top readers!
          </p>
        </div>
      </motion.div>

      {/* Podium for Top 3 */}
      {topThree.length >= 3 && (
        <div className="mb-16 mt-8 flex w-full max-w-2xl items-end justify-center gap-2 sm:gap-6">
          {podiumOrder.map((user, idx) => {
            // idx 0 = 2nd place, idx 1 = 1st place, idx 2 = 3rd place
            const isFirst = idx === 1;
            const isSecond = idx === 0;
            const isThird = idx === 2;
            
            const heightClass = isFirst ? "h-40" : isSecond ? "h-32" : "h-24";
            const bgClass = isFirst 
              ? "bg-gradient-to-t from-amber-200 to-yellow-400" 
              : isSecond 
              ? "bg-gradient-to-t from-gray-200 to-gray-300" 
              : "bg-gradient-to-t from-orange-200 to-orange-300";
              
            const rank = isFirst ? 1 : isSecond ? 2 : 3;
            const medalColor = isFirst ? "text-yellow-100" : isSecond ? "text-gray-100" : "text-orange-100";

            return (
              <motion.div 
                key={user.userId} 
                className="flex flex-1 flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (isFirst ? 0 : isSecond ? 0.2 : 0.4), type: "spring", bounce: 0.4 }}
              >
                {/* Avatar */}
                <div className="relative mb-3 flex flex-col items-center">
                  {isFirst && (
                    <motion.div 
                      className="absolute -top-6 z-10 text-3xl drop-shadow-lg"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      👑
                    </motion.div>
                  )}
                  <Avatar className={cn(
                    "border-4 shadow-lg", 
                    isFirst ? "h-20 w-20 border-yellow-400 z-10" : "h-16 w-16 border-gray-200"
                  )}>
                    <AvatarImage src={user.userImageSrc} className="object-cover" />
                  </Avatar>
                  <div className="mt-2 text-center">
                    <p className="font-poppins text-sm font-bold text-gray-800 truncate w-20">{user.userName}</p>
                    <p className="text-xs font-bold text-emerald-500">{user.points} XP</p>
                  </div>
                </div>

                {/* Podium block */}
                <div className={cn(
                  "w-full rounded-t-xl shadow-inner relative flex justify-center items-start pt-4 border-t-2 border-white/50",
                  heightClass,
                  bgClass
                )}>
                  <span className={cn("text-5xl font-black opacity-40 font-poppins drop-shadow-md", medalColor)}>
                    {rank}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Separator className="mb-8 w-full max-w-2xl bg-gray-100" />

      {/* Rankings Table */}
      <div className="w-full max-w-2xl space-y-3">
        {restOfUsers.length === 0 && topThree.length < 3 && (
          // If not enough users for podium, just show them as list
          topThree.map((user, i) => (
            <motion.div
              key={user.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center rounded-2xl bg-white p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:scale-[1.01]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 font-poppins font-bold text-emerald-600">
                {i + 1}
              </div>
              <Avatar className="ml-4 mr-4 h-12 w-12 border-2 border-emerald-100">
                <AvatarImage src={user.userImageSrc} className="object-cover" />
              </Avatar>
              <p className="flex-1 font-poppins font-bold text-gray-800">
                {user.userName}
              </p>
              <div className="flex items-center gap-1 font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-sm">
                <Sparkles className="h-3 w-3" />
                {user.points} XP
              </div>
            </motion.div>
          ))
        )}

        {restOfUsers.map((user, i) => {
          const rank = i + 4; // Because top 3 are on podium
          return (
            <motion.div
              key={user.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (i * 0.05) }}
              className="group flex items-center rounded-2xl bg-white p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:scale-[1.01]"
            >
              <div className="flex w-8 justify-center font-poppins font-bold text-gray-400 group-hover:text-emerald-500">
                {rank}
              </div>
              <Avatar className="ml-4 mr-4 h-12 w-12 border border-gray-200">
                <AvatarImage src={user.userImageSrc} className="object-cover" />
              </Avatar>
              <p className="flex-1 font-poppins font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                {user.userName}
              </p>
              <div className="flex items-center gap-1 font-bold text-gray-500 group-hover:text-emerald-500 transition-colors">
                {user.points} XP
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
