"use client";

import { Check, Crown, Star, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { cn } from "@/lib/utils";

import "react-circular-progressbar/dist/styles.css";

type LessonButtonProps = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
}: LessonButtonProps) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 40;

  const isFirst = index === 0;
  const isLast = index === totalCount;
  const isCompleted = !current && !locked;

  const href = isCompleted ? `/lesson/${id}` : "/lesson";

  return (
    <Link
      href={href}
      aria-disabled={locked}
      style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          <div className="relative h-[108px] w-[108px]">
            {/* "Start" tooltip */}
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-3 py-1.5 text-xs font-bold text-white shadow-glow-green whitespace-nowrap"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              🌟 Start
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-0 w-0 border-x-4 border-t-6 border-x-transparent border-t-emerald-500" />
            </motion.div>

            {/* Circular progress */}
            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: { stroke: "#22C55E" },
                trail: { stroke: "#d1fae5" },
              }}
            >
              <motion.button
                className={cn(
                  "flex h-[70px] w-[70px] items-center justify-center rounded-full border-b-4 shadow-lg transition-all",
                  "bg-gradient-to-br from-emerald-500 to-lime-500 border-emerald-700 shadow-glow-green"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="h-9 w-9 fill-white text-white drop-shadow" />
              </motion.button>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          <motion.button
            className={cn(
              "flex h-[70px] w-[70px] items-center justify-center rounded-full border-b-4 shadow-md transition-all",
              isCompleted
                ? "bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-600 hover:shadow-glow-green"
                : locked
                ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                : "bg-gradient-to-br from-emerald-500 to-lime-500 border-emerald-700 shadow-glow-green"
            )}
            whileHover={!locked ? { scale: 1.08, y: -2 } : undefined}
            whileTap={!locked ? { scale: 0.95 } : undefined}
          >
            {isCompleted ? (
              <Check className="h-8 w-8 stroke-[3] text-white drop-shadow" />
            ) : isLast ? (
              <Crown className={cn("h-8 w-8", locked ? "text-gray-400 fill-gray-400" : "text-white fill-white drop-shadow")} />
            ) : locked ? (
              <Lock className="h-7 w-7 text-gray-400" />
            ) : (
              <Star className="h-8 w-8 fill-white text-white drop-shadow" />
            )}
          </motion.button>
        )}
      </div>
    </Link>
  );
};
