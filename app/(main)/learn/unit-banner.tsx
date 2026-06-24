"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, NotebookText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type UnitBannerProps = {
  title: string;
  description: string;
};

export const UnitBanner = ({ title, description }: UnitBannerProps) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 p-6 text-white shadow-glow-green"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-6 bottom-0 h-28 w-28 rounded-full bg-white/10 blur-xl" />
      </div>

      <div className="relative flex w-full items-center justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5 fill-white/70" />
            Current Unit
          </div>
          <h3 className="font-poppins text-2xl font-extrabold">{title}</h3>
          <p className="text-white/80 text-sm leading-relaxed max-w-xs">{description}</p>
        </div>

        <Link href="/lesson" className="hidden xl:block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="gap-2 rounded-2xl bg-white text-emerald-600 font-bold hover:bg-white/95 shadow-lg border-0 transition-all duration-200"
            >
              <NotebookText className="h-4 w-4" />
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};
