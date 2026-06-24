"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Leaderboard", href: "/leaderboard" },
  ];

  return (
    <motion.header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm"
          : "bg-transparent"
      )}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image src="/mascot.svg" alt="Reading Buddy" height={40} width={40} />
          </motion.div>
          <span className="font-poppins text-xl font-extrabold gradient-text-green">
            Reading Buddy
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-gray-600 rounded-xl transition-all duration-200 hover:text-emerald-600 hover:bg-emerald-50 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-emerald-500 rounded-full transition-all duration-200 group-hover:w-4/5" />
            </Link>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl font-medium text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
            asChild
          >
            <Link href="/learn">Sign In</Link>
          </Button>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              size="sm"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-semibold shadow-md hover:shadow-glow-green border-0 transition-all duration-300"
              asChild
            >
              <Link href="/learn" className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 fill-white" />
                Start Learning
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.div
          className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 px-6 py-4 space-y-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block py-2 text-sm font-medium text-gray-700 hover:text-emerald-600"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Button
              size="sm"
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-semibold border-0"
              asChild
            >
              <Link href="/learn">Start Learning</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};
