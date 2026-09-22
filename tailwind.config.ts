import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      /*
       * Слои интерфейса. Числовые z-10/20/30 используем только ВНУТРИ блока,
       * который сам создаёт контекст наложения (класс `isolate`) — тогда они
       * ни с чем снаружи не спорят. Всё, что всплывает над страницей, берёт
       * имя отсюда, а не случайное число:
       *
       *   z-sticky  — прилипающие полосы под шапкой (чипы эпох)
       *   z-dock    — плавающий плеер у нижнего края
       *   z-header  — шапка сайта
       *   z-popover — выпадающие меню, поверх всего
       *
       * Правило: новый всплывающий слой — сначала имя здесь, потом класс.
       */
      zIndex: {
        sticky: "20",
        dock: "30",
        header: "40",
        popover: "50",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        plate: {
          DEFAULT: "hsl(var(--plate))",
          edge: "hsl(var(--plate-edge))",
        },
        track: "hsl(var(--track))",
        ink: "hsl(var(--ink))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        paper: "0 1px 0 hsl(28 30% 30% / .08)",
        plate: "0 10px 24px -14px hsl(28 30% 25% / .4)",
        dock: "0 -12px 26px -22px hsl(28 30% 25% / .6)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
