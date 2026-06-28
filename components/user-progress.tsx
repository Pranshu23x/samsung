"use client";

import { InfinityIcon, Target, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import type { Course } from "@/db/schema";
import { cn } from "@/lib/utils";

type UserProgressProps = {
  activeCourse: Course;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const UserProgress = ({
  activeCourse,
  hearts,
  points,
  hasActiveSubscription,
}: UserProgressProps) => {
  return (
    <motion.div 
      className="flex w-full items-center justify-between gap-x-2 rounded-2xl bg-white p-3 shadow-card border border-gray-100"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Course Flag */}
      <Link href="/courses">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" className="h-12 w-12 rounded-xl p-0 overflow-hidden border-2 border-emerald-100 hover:border-emerald-300 bg-emerald-50/50 transition-colors">
            <Image
              src={activeCourse.imageSrc}
              alt={activeCourse.title}
              width={32}
              height={32}
              className="drop-shadow-sm"
            />
          </Button>
        </motion.div>
      </Link>

      {/* Points */}
      <Link href="/shop" className="flex-1">
        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="ghost" 
            className="w-full h-12 rounded-xl justify-center font-bold text-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            <Image
              src="/points.svg"
              height={26}
              width={26}
              alt="Points"
              className="mr-2 drop-shadow-sm"
            />
            {points}
          </Button>
        </motion.div>
      </Link>

      {/* Hearts */}
      <Link href="/shop" className="flex-1">
        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="ghost" 
            className="w-full h-12 rounded-xl justify-center font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <Image
              src="/heart.svg"
              height={24}
              width={24}
              alt="Hearts"
              className="mr-2 drop-shadow-sm"
            />
            {hasActiveSubscription ? (
              <InfinityIcon className="stroke-3 h-5 w-5" />
            ) : (
              hearts
            )}
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  );
};
