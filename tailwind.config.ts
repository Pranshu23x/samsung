import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand palette
        brand: {
          emerald: "#22C55E",
          lime: "#84CC16",
          sky: "#38BDF8",
          indigo: "#6366F1",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)",
        "glow-blue": "0 0 20px rgba(56, 189, 248, 0.4), 0 0 40px rgba(56, 189, 248, 0.2)",
        "glow-indigo": "0 0 20px rgba(99, 102, 241, 0.35), 0 0 40px rgba(99, 102, 241, 0.15)",
        "glow-lime": "0 0 20px rgba(132, 204, 22, 0.4), 0 0 40px rgba(132, 204, 22, 0.2)",
        card: "0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)",
        premium: "0 20px 60px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.06)",
        "premium-hover": "0 30px 80px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient": "radial-gradient(ellipse at 70% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(56, 189, 248, 0.12) 0%, transparent 50%), linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)",
        "brand-gradient": "linear-gradient(135deg, #22C55E 0%, #84CC16 100%)",
        "brand-gradient-v": "linear-gradient(180deg, #22C55E 0%, #16a34a 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(132, 204, 22, 0.04) 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(1deg)" },
          "66%": { transform: "translateY(-5px) rotate(-1deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(34, 197, 94, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(34, 197, 94, 0.6), 0 0 50px rgba(34, 197, 94, 0.3)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% center" },
          to: { backgroundPosition: "200% center" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0) rotate(-10deg)", opacity: "0" },
          "60%": { transform: "scale(1.1) rotate(2deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        waveform: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "spin-slow": "spin-slow 8s linear infinite",
        waveform: "waveform 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config;

export default config;
