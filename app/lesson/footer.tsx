"use client";

import { CheckCircle, XCircle, ArrowRight, RotateCcw, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useKey, useMedia } from "react-use";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FooterProps = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
};

export const Footer = ({
  onCheck,
  status,
  disabled,
  lessonId,
}: FooterProps) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");

  return (
    <AnimatePresence mode="wait">
      <motion.footer
        key={status}
        className={cn(
          "border-t-2 transition-all duration-300",
          status === "correct"
            ? "border-transparent bg-gradient-to-r from-emerald-50 to-lime-50"
            : status === "wrong"
            ? "border-transparent bg-rose-50"
            : "border-gray-100 bg-white/80 backdrop-blur-sm"
        )}
        style={{ minHeight: isMobile ? 90 : 130 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-6 py-4 lg:px-10">
          {/* Status messages */}
          {status === "correct" && (
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-poppins text-base font-bold text-emerald-600 lg:text-xl">
                  Nicely done! 🎉
                </p>
                <p className="text-xs text-emerald-500">+10 XP earned</p>
              </div>
            </motion.div>
          )}

          {status === "wrong" && (
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                <XCircle className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <p className="font-poppins text-base font-bold text-rose-500 lg:text-xl">
                  Try again! 💪
                </p>
                <p className="text-xs text-rose-400">Review the answer and retry</p>
              </div>
            </motion.div>
          )}

          {status === "completed" && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="default"
                size={isMobile ? "sm" : "lg"}
                onClick={() => (window.location.href = `/lesson/${lessonId}`)}
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 text-white border-0 shadow-glow-green gap-2 font-semibold"
              >
                <RotateCcw className="h-4 w-4" />
                Practice again
              </Button>
            </motion.div>
          )}

          {/* Action button */}
          <motion.div
            className="ml-auto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              disabled={disabled}
              aria-disabled={disabled}
              onClick={onCheck}
              size={isMobile ? "sm" : "lg"}
              className={cn(
                "rounded-2xl font-semibold gap-2 min-w-[120px] border-0 transition-all duration-200",
                status === "none"
                  ? "bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-glow-green hover:shadow-glow-green disabled:opacity-50 disabled:shadow-none"
                  : status === "correct"
                  ? "bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-glow-green"
                  : status === "wrong"
                  ? "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-md"
                  : "bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-glow-green"
              )}
            >
              {status === "none" && (
                <>Check <ArrowRight className="h-4 w-4" /></>
              )}
              {status === "correct" && (
                <>Next <ArrowRight className="h-4 w-4" /></>
              )}
              {status === "wrong" && (
                <>Retry <RotateCcw className="h-4 w-4" /></>
              )}
              {status === "completed" && (
                <>Continue <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.footer>
    </AnimatePresence>
  );
};
