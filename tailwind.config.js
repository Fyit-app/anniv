/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      /* ═══════════════════════════════════════════════════════════════════════
         TYPOGRAPHY - Marrakech Design System
         ═══════════════════════════════════════════════════════════════════════ */
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },

      /* ═══════════════════════════════════════════════════════════════════════
         COLORS - Unified Moroccan Palette
         ═══════════════════════════════════════════════════════════════════════ */
      colors: {
        /* Base colors from CSS variables */
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

        /* ─── Sable Doré - Primary ───────────────────────────────────────────── */
        gold: {
          50: "hsl(var(--gold-50))",
          100: "hsl(var(--gold-100))",
          200: "hsl(var(--gold-200))",
          300: "hsl(var(--gold-300))",
          400: "hsl(var(--gold-400))",
          500: "hsl(var(--gold-500))",
          DEFAULT: "hsl(var(--gold))",
          600: "hsl(var(--gold-600))",
          700: "hsl(var(--gold-700))",
          800: "hsl(var(--gold-800))",
          900: "hsl(var(--gold-900))",
        },

        /* ─── Terracotta - Warm Accent ───────────────────────────────────────── */
        terracotta: {
          50: "hsl(var(--terracotta-50))",
          100: "hsl(var(--terracotta-100))",
          200: "hsl(var(--terracotta-200))",
          300: "hsl(var(--terracotta-300))",
          400: "hsl(var(--terracotta-400))",
          DEFAULT: "hsl(var(--terracotta))",
          500: "hsl(var(--terracotta-500))",
          600: "hsl(var(--terracotta-600))",
          700: "hsl(var(--terracotta-700))",
        },

        /* ─── Oasis - Fresh Accent ───────────────────────────────────────────── */
        oasis: {
          50: "hsl(var(--oasis-50))",
          100: "hsl(var(--oasis-100))",
          200: "hsl(var(--oasis-200))",
          300: "hsl(var(--oasis-300))",
          400: "hsl(var(--oasis-400))",
          DEFAULT: "hsl(var(--oasis))",
          500: "hsl(var(--oasis-500))",
          600: "hsl(var(--oasis-600))",
          700: "hsl(var(--oasis-700))",
        },

        /* ─── Night - Dark Tones ─────────────────────────────────────────────── */
        night: {
          50: "hsl(var(--night-50))",
          100: "hsl(var(--night-100))",
          200: "hsl(var(--night-200))",
          DEFAULT: "hsl(var(--night))",
          700: "hsl(var(--night-700))",
          800: "hsl(var(--night-800))",
          900: "hsl(var(--night-900))",
        },

        /* ─── Neutrals ───────────────────────────────────────────────────────── */
        sand: "hsl(var(--sand))",
        cream: "hsl(var(--cream))",
        midnight: "hsl(var(--night-800))",
      },

      /* ═══════════════════════════════════════════════════════════════════════
         BORDER RADIUS
         ═══════════════════════════════════════════════════════════════════════ */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      /* ═══════════════════════════════════════════════════════════════════════
         ANIMATIONS
         ═══════════════════════════════════════════════════════════════════════ */
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "fade-in-down": "fadeInDown 0.8s ease-out forwards",
        "fade-in-left": "fadeInLeft 0.8s ease-out forwards",
        "fade-in-right": "fadeInRight 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-down": "slideDown 0.5s ease-out forwards",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(5px, -10px) rotate(1deg)" },
          "50%": { transform: "translate(0, -15px) rotate(0deg)" },
          "75%": { transform: "translate(-5px, -8px) rotate(-1deg)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(217, 119, 6, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(217, 119, 6, 0.5), 0 0 60px rgba(217, 119, 6, 0.2)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      /* ═══════════════════════════════════════════════════════════════════════
         BACKGROUND IMAGES
         ═══════════════════════════════════════════════════════════════════════ */
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "moroccan-tile": `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='none' stroke='%23d97706' stroke-opacity='0.1' stroke-width='1'/%3E%3C/svg%3E")`,
        "gradient-gold": "linear-gradient(135deg, hsl(var(--gold-400)), hsl(var(--terracotta-400)))",
        "gradient-gold-to-terracotta": "linear-gradient(to right, hsl(var(--gold-500)), hsl(var(--terracotta-500)))",
      },

      /* ═══════════════════════════════════════════════════════════════════════
         BOX SHADOWS
         ═══════════════════════════════════════════════════════════════════════ */
      boxShadow: {
        "premium": "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        "premium-lg": "0 35px 60px -15px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        "glow-gold": "0 0 40px rgba(217, 119, 6, 0.35)",
        "glow-oasis": "0 0 40px rgba(16, 185, 129, 0.3)",
        "glow-terracotta": "0 0 40px rgba(194, 65, 12, 0.3)",
        "inner-glow": "inset 0 2px 20px rgba(255, 255, 255, 0.1)",
        "card-hover": "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
      },

      /* ═══════════════════════════════════════════════════════════════════════
         TRANSITION TIMING
         ═══════════════════════════════════════════════════════════════════════ */
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
