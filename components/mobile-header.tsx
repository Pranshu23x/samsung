"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen, Trophy, Target, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Learn", href: "/learn", emoji: "📖" },
  { label: "Leaderboard", href: "/leaderboard", emoji: "🏆" },
  { label: "Quests", href: "/quests", emoji: "🎯" },
  { label: "Shop", href: "/shop", emoji: "🛒" },
];

export const MobileHeader = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-0 z-50 flex h-[56px] w-full items-center justify-between border-b border-white/20 bg-gradient-to-r from-emerald-500 to-lime-500 px-4 lg:hidden shadow-md">
        <Link href="/learn" className="flex items-center gap-2">
          <Image src="/mascot.svg" alt="Reading Buddy" height={30} width={30} />
          <span className="font-poppins text-base font-extrabold text-white">Reading Buddy</span>
        </Link>

        <motion.button
          className="rounded-xl bg-white/20 p-2 text-white"
          onClick={() => setOpen(!open)}
          whileTap={{ scale: 0.9 }}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              {/* Header */}
              <div className="flex h-[56px] items-center justify-between bg-gradient-to-r from-emerald-500 to-lime-500 px-4">
                <span className="font-poppins text-base font-bold text-white">Menu</span>
                <motion.button
                  className="rounded-xl bg-white/20 p-2 text-white"
                  onClick={() => setOpen(false)}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Nav Items */}
              <div className="p-4 space-y-2">
                {navItems.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all",
                          isActive
                            ? "bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <span className="text-xl">{item.emoji}</span>
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
