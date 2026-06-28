"use client";

import { InfinityIcon, X, Zap, Flame } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";
import { cn } from "@/lib/utils";

type HeaderProps = {
  hearts: number;
  percentage: number;
  hasActiveSubscription: boolean;
};

export const Header = ({
  hearts,
  percentage,
  hasActiveSubscription,
}: HeaderProps) => {
  const { open } = useExitModal();

  const xp = Math.floor(percentage * 0.5);
  const isLowHearts = !hasActiveSubscription && hearts <= 1;

  return (
    <header className="mx-auto flex w-full max-w-[1140px] items-center gap-x-4 px-6 pt-5 lg:pt-8">
      {/* Exit button */}
      <motion.button
        onClick={open}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-gray-400 transition-all hover:bg-rose-50 hover:text-rose-500"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="h-5 w-5 stroke-2" />
      </motion.button>

      {/* Progress bar */}
      <div className="flex-1">
        <div className="relative h-4 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-lime-400"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* Shine effect */}
          <div className="absolute inset-y-0 left-0 w-full overflow-hidden rounded-full">
            <div
              className="absolute inset-y-0 w-1/3 bg-white/30 blur-sm"
              style={{ left: `${Math.max(0, percentage - 20)}%` }}
            />
          </div>
        </div>
        <div className="mt-1.5 flex items-center justify-between px-0.5 text-[10px] font-semibold text-gray-400">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-emerald-500 fill-emerald-500" />
            {xp} XP
          </span>
          <span>{Math.round(percentage)}%</span>
        </div>
      </div>

      {/* Hearts / Streak */}
      <motion.div
        className={cn(
          "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-bold",
          isLowHearts
            ? "bg-rose-50 text-rose-500 animate-pulse"
            : "bg-rose-50/60 text-rose-500"
        )}
        whileHover={{ scale: 1.05 }}
      >
        <Image
          src="/heart.svg"
          height={20}
          width={20}
          alt="Hearts"
        />
        {hasActiveSubscription ? (
          <InfinityIcon className="h-4 w-4 stroke-[3]" />
        ) : (
          hearts
        )}
      </motion.div>
    </header>
  );
};
