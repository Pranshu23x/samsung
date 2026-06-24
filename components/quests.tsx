"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Target, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QUESTS } from "@/constants";

type QuestsProps = { points: number };

export const Quests = ({ points }: QuestsProps) => {
  return (
    <motion.div 
      className="mt-6 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex w-full items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100">
            <Target className="h-4 w-4 text-orange-500" />
          </div>
          <h3 className="font-poppins text-lg font-bold text-gray-800">Quests</h3>
        </div>

        <Link href="/quests">
          <Button size="sm" variant="ghost" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 text-xs font-bold rounded-xl px-3 transition-colors">
            View all
          </Button>
        </Link>
      </div>

      <ul className="w-full space-y-4 pt-2">
        {QUESTS.map((quest, i) => {
          const progress = Math.min((points / quest.value) * 100, 100);
          const isCompleted = progress >= 100;

          return (
            <motion.div
              key={quest.title}
              className="flex w-full items-center gap-x-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="relative">
                <Image src="/points.svg" alt="Points" width={40} height={40} className="drop-shadow-sm" />
                {isCompleted && (
                  <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white shadow-sm ring-2 ring-white">
                    ✓
                  </div>
                )}
              </div>

              <div className="flex w-full flex-col gap-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-700">
                    {quest.title}
                  </p>
                  <span className="text-xs font-bold text-gray-400">
                    {Math.min(points, quest.value)}/{quest.value}
                  </span>
                </div>

                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${isCompleted ? 'bg-gradient-to-r from-emerald-400 to-lime-400' : 'bg-gradient-to-r from-orange-400 to-yellow-400'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </ul>
      
      {/* View all button at bottom for mobile */}
      <Link href="/quests" className="mt-6 block">
        <Button variant="primaryOutline" className="w-full rounded-xl border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 gap-2 h-11 text-sm transition-all hover:shadow-sm">
          See all Quests
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </motion.div>
  );
};
