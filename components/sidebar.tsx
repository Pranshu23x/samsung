"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Trophy, Target, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Learn", href: "/learn", icon: BookOpen, emoji: "📖" },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy, emoji: "🏆" },
  { label: "Quests", href: "/quests", icon: Target, emoji: "🎯" },
  { label: "Shop", href: "/shop", icon: ShoppingBag, emoji: "🛒" },
];

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "left-0 top-0 flex h-full flex-col border-r border-gray-100/80 bg-white/95 backdrop-blur-sm px-4 lg:fixed lg:w-[256px]",
        className
      )}
    >
      {/* Logo */}
      <Link href="/learn" className="block">
        <div className="flex items-center gap-3 px-3 py-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image src="/mascot.svg" alt="Reading Buddy" height={40} width={40} />
          </motion.div>
          <div>
            <h1 className="font-poppins text-lg font-extrabold gradient-text-green leading-tight">
              Reading Buddy
            </h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
              Learning Platform
            </p>
          </div>
        </div>
      </Link>

      {/* Gradient divider */}
      <div className="mx-3 mb-4 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

      {/* Nav Label */}
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        Navigation
      </p>

      {/* Nav Items */}
      <div className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  "relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-glow-green"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                whileHover={{ x: isActive ? 0 : 4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-white/20"
                    layoutId="activeNavHighlight"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="text-lg">{item.emoji}</span>
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <Sparkles className="ml-auto h-3.5 w-3.5 text-white/70 relative z-10" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Bottom accent */}
      <div className="mb-6 mx-3 mt-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-lime-50 border border-emerald-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🌟</span>
          <span className="text-xs font-bold text-emerald-700">Daily Goal</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Complete 3 lessons today to earn your daily bonus XP!
        </p>
        <div className="mt-3 h-1.5 rounded-full bg-emerald-100">
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-emerald-400 to-lime-400" />
        </div>
        <p className="mt-1 text-[10px] text-gray-400">1 / 3 lessons done</p>
      </div>
    </div>
  );
};
