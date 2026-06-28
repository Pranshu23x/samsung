"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Mic, BarChart3, Award, ArrowRight, Play, Star, Zap, Heart, Trophy, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    const el = document.getElementById(`counter-${target}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span id={`counter-${target}`}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ── Floating Decorative Element ──────────────────────────────────────────────
function FloatingBadge({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={cn(
        "absolute flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold shadow-premium glass",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      style={{
        animation: `float ${3 + delay}s ease-in-out ${delay}s infinite`,
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  glowColor,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  glowColor: string;
  delay: number;
}) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2 border border-white/50"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300", glowColor)} />
      <div
        className={cn("mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl", gradient)}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-gray-900 font-poppins">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
      <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:gap-2 transition-all">
        Learn more <ChevronRight className="h-4 w-4" />
      </div>
    </motion.div>
  );
}

// ── Testimonial Card ─────────────────────────────────────────────────────────
function TestimonialCard({ name, role, quote, rating, avatar, delay }: {
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
  delay: number;
}) {
  return (
    <motion.div
      className="glass-card rounded-3xl p-6 border border-white/60"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-gray-700 leading-relaxed mb-5 italic">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-lime-400 flex items-center justify-center text-white font-bold text-sm">
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Step Card ──────────────────────────────────────────────────────────────
function StepCard({ number, icon: Icon, title, description, delay }: {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      className="relative flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center shadow-glow-green">
          <Icon className="h-9 w-9 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-white shadow-card flex items-center justify-center text-xs font-bold text-emerald-600 border-2 border-emerald-100">
          {number}
        </div>
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900 font-poppins">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">{description}</p>
    </motion.div>
  );
}

// ── Main Landing Page ────────────────────────────────────────────────────────
export default function MarketingPage() {
  return (
    <div className="relative overflow-hidden bg-mesh-gradient">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-lime-400/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
            {/* Left content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <motion.div
                className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Zap className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                <span>AI-Powered Reading Practice</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="mb-6 font-poppins text-5xl font-black leading-[1.1] tracking-tight text-gray-900 lg:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7 }}
              >
                Build{" "}
                <span className="gradient-text">Reading</span>
                <br />
                Confidence
                <br />
                <span className="gradient-text">Every Day</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                className="mb-10 max-w-[520px] text-lg leading-relaxed text-gray-500 lg:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Practice reading aloud, improve fluency, earn rewards, and climb the leaderboard with Reading Buddy — your AI reading coach.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <Button
                  size="lg"
                  className="group relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-8 text-base font-semibold text-white shadow-glow-green transition-all duration-300 hover:shadow-glow-green hover:scale-105 border-0"
                  asChild
                >
                  <Link href="/learn" className="flex items-center gap-2">
                    <span>Start Learning</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="primaryOutline"
                  className="h-14 rounded-2xl border-2 border-gray-200 bg-white/80 px-8 text-base font-semibold text-gray-700 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  asChild
                >
                  <Link href="/learn" className="flex items-center gap-2">
                    <Play className="h-4 w-4 fill-current" />
                    <span>Watch Demo</span>
                  </Link>
                </Button>
              </motion.div>

              {/* Mini stats */}
              <motion.div
                className="mt-10 flex items-center gap-6 justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <div className="flex -space-x-2">
                  {["🧒", "👦", "👧", "🧒"].map((emoji, i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-lime-400 border-2 border-white flex items-center justify-center text-xs">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">500+</span> students learning today
                </div>
              </motion.div>
            </div>

            {/* Right — Hero Illustration */}
            <motion.div
              className="relative flex-1 flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="relative h-[400px] w-[400px] lg:h-[520px] lg:w-[520px]">
                {/* Glowing background circle */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-emerald-100 to-lime-50 shadow-glow-green animate-pulse-glow" />

                {/* Main mascot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <Image src="/mascot.svg" alt="Reading Buddy Mascot" width={220} height={220} className="drop-shadow-2xl" />
                  </motion.div>
                </div>

                {/* Floating badges */}
                <FloatingBadge className="top-4 right-0 bg-white/90 border border-amber-100" delay={0.5}>
                  <span className="text-lg">⭐</span>
                  <span className="text-amber-600">+25 XP earned!</span>
                </FloatingBadge>

                <FloatingBadge className="bottom-10 left-0 bg-white/90 border border-emerald-100" delay={0.8}>
                  <span className="text-lg">🔥</span>
                  <span className="text-orange-600">7 Day Streak!</span>
                </FloatingBadge>

                <FloatingBadge className="top-1/3 -left-4 bg-white/90 border border-sky-100" delay={1.1}>
                  <span className="text-lg">📖</span>
                  <span className="text-sky-600">Lesson 3/10</span>
                </FloatingBadge>

                <FloatingBadge className="bottom-1/3 -right-4 bg-white/90 border border-indigo-100" delay={0.6}>
                  <span className="text-lg">🏅</span>
                  <span className="text-indigo-600">Badge Unlocked!</span>
                </FloatingBadge>

                {/* Orbiting elements */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  style={{ transformOrigin: "50% 260px" }}
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg flex items-center justify-center text-lg">
                    📚
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  style={{ transformOrigin: "50% -260px" }}
                >
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg flex items-center justify-center text-base">
                    🌟
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Social Proof Section ── */}
      <section className="relative py-16">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            className="glass-card rounded-3xl p-8 border border-white/60"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                { icon: "📖", target: 10000, suffix: "+", label: "Reading Sessions" },
                { icon: "📈", target: 95, suffix: "%", label: "Fluency Improvement" },
                { icon: "👥", target: 500, suffix: "+", label: "Active Learners" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center py-6 sm:px-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <span className="mb-2 text-3xl">{stat.icon}</span>
                  <div className="text-4xl font-black font-poppins gradient-text-green">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              ✨ Everything you need
            </div>
            <h2 className="text-4xl font-black font-poppins text-gray-900 lg:text-5xl">
              Built for <span className="gradient-text">Young Readers</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Our platform combines the best of gamification, AI feedback, and structured learning to build lasting reading habits.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            <FeatureCard
              icon={Mic}
              title="Read Aloud Practice"
              description="Microphone-powered reading sessions with real-time AI transcription and instant word-by-word feedback."
              gradient="bg-gradient-to-br from-emerald-500 to-green-600"
              glowColor="bg-gradient-to-br from-emerald-50 to-transparent"
              delay={0}
            />
            <FeatureCard
              icon={BarChart3}
              title="Track Your Progress"
              description="Detailed analytics showing accuracy, words per minute, and reading grade level growth over time."
              gradient="bg-gradient-to-br from-sky-500 to-blue-600"
              glowColor="bg-gradient-to-br from-sky-50 to-transparent"
              delay={0.1}
            />
            <FeatureCard
              icon={Award}
              title="Earn Rewards"
              description="Collect hearts, XP, badges, and achievements as you complete lessons and maintain your reading streak."
              gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
              glowColor="bg-gradient-to-br from-indigo-50 to-transparent"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-emerald-50/40">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-lime-50 border border-lime-100 px-4 py-2 text-sm font-semibold text-lime-700">
              🚀 Simple &amp; Effective
            </div>
            <h2 className="text-4xl font-black font-poppins text-gray-900 lg:text-5xl">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">Three simple steps to reading mastery.</p>
          </motion.div>

          <div className="relative grid grid-cols-1 gap-12 sm:grid-cols-3">
            {/* Connecting line */}
            <div className="absolute top-10 left-1/6 hidden h-0.5 w-2/3 bg-gradient-to-r from-emerald-200 via-lime-300 to-emerald-200 sm:block" />

            <StepCard
              number="1"
              icon={BookOpen}
              title="Read the Passage"
              description="Pick a lesson, press record, and read the passage aloud clearly and naturally."
              delay={0}
            />
            <StepCard
              number="2"
              icon={Zap}
              title="Get Instant Feedback"
              description="Our AI analyzes your reading in seconds, highlighting correct, skipped, and mispronounced words."
              delay={0.15}
            />
            <StepCard
              number="3"
              icon={Trophy}
              title="Earn Your Rewards"
              description="Collect XP, unlock badges, maintain streaks, and climb to the top of the leaderboard."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
              💬 What Students Say
            </div>
            <h2 className="text-4xl font-black font-poppins text-gray-900 lg:text-5xl">
              Loved by <span className="gradient-text">Young Readers</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            <TestimonialCard
              name="Aanya Sharma"
              role="Grade 3 Student"
              quote="I love earning stars and badges! Reading used to be hard but now I practice every day because it's so fun!"
              rating={5}
              avatar="A"
              delay={0}
            />
            <TestimonialCard
              name="Rahul Gupta"
              role="Parent"
              quote="My son's reading fluency improved dramatically in just 3 weeks. The progress tracking helps us see exactly where he's growing."
              rating={5}
              avatar="R"
              delay={0.1}
            />
            <TestimonialCard
              name="Priya Nair"
              role="Grade 4 Student"
              quote="The leaderboard makes me want to practice more every day. I went from rank 10 to rank 2 this month!"
              rating={5}
              avatar="P"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500 p-12 text-center shadow-premium"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Decorative elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            </div>

            <div className="relative">
              <motion.div
                className="mb-4 text-5xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                📚
              </motion.div>
              <h2 className="mb-4 text-4xl font-black font-poppins text-white lg:text-5xl">
                Ready to Become a Better Reader?
              </h2>
              <p className="mb-8 text-lg text-white/80">
                Join 500+ students already building their reading confidence with Reading Buddy.
              </p>
              <Button
                size="lg"
                className="h-14 rounded-2xl bg-white px-10 text-base font-bold text-emerald-600 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-white/95"
                asChild
              >
                <Link href="/learn" className="flex items-center gap-2">
                  <span>Start Learning Today</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-4 text-sm text-white/60">Free to use · No credit card required</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
