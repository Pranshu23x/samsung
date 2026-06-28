"use client";

import { InfinityIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ResultCardProps = {
  value: number;
  variant: "points" | "hearts";
};

export const ResultCard = ({ value, variant }: ResultCardProps) => {
  const isPoints = variant === "points";
  const imageSrc = isPoints ? "/points.svg" : "/heart.svg";
  
  return (
    <motion.div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border-2 p-1 shadow-card transition-all",
        isPoints 
          ? "border-amber-400 bg-amber-400/10 shadow-glow-lime" 
          : "border-rose-400 bg-rose-400/10 shadow-glow-indigo"
      )}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
    >
      <div
        className={cn(
          "rounded-2xl p-4 text-center",
          isPoints ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-gradient-to-br from-rose-400 to-rose-600"
        )}
      >
        <p className="mb-2 text-xs font-black uppercase tracking-wider text-white/90">
          {isPoints ? "XP Earned" : "Hearts Left"}
        </p>

        <div className="flex items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-inner">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: [10, -10, 0] }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeInOut" }}
          >
            <Image
              src={imageSrc}
              alt={variant}
              height={32}
              width={32}
              className="drop-shadow-md"
            />
          </motion.div>

          <span
            className={cn(
              "font-poppins text-2xl font-black",
              isPoints ? "text-orange-500" : "text-rose-500"
            )}
          >
            {value === Infinity ? (
              <InfinityIcon className="h-6 w-6 stroke-[3]" />
            ) : (
              value
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
