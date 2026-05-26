import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Suisse Intl", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Suisse Intl", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "Suisse Intl Mono",
          "Fira Mono",
          "ui-monospace",
          "monospace",
        ],
      },
      colors: {
        brand: {
          DEFAULT: "hsl(var(--primary))",
        },
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
        surface: {
          DEFAULT: "hsl(var(--surface))",
          container: "hsl(var(--surface-container))",
          high: "hsl(var(--surface-container-high))",
          inverted: "hsl(var(--surface-inverted))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontSize: {
        "display-hero": ["4rem", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "500" }],
        "display-large": ["3rem", { lineHeight: "1.10", letterSpacing: "-0.03em", fontWeight: "500" }],
        "section-heading": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "500" }],
        "subheading-large": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "500" }],
        "subheading": ["1.25rem", { lineHeight: "1.30", letterSpacing: "-0.01em", fontWeight: "500" }],
        "body-large": ["1.125rem", { lineHeight: "1.50", letterSpacing: "-0.005em", fontWeight: "400" }],
        "body": ["1rem", { lineHeight: "1.55", letterSpacing: "0em", fontWeight: "400" }],
        "body-small": ["0.875rem", { lineHeight: "1.50", letterSpacing: "0em", fontWeight: "400" }],
        "button": ["0.875rem", { lineHeight: "1.25", letterSpacing: "-0.005em", fontWeight: "500" }],
        "link": ["0.875rem", { lineHeight: "1.25", letterSpacing: "0em", fontWeight: "500" }],
        "caption": ["0.8125rem", { lineHeight: "1.45", letterSpacing: "0em", fontWeight: "400" }],
        "caption-small": ["0.75rem", { lineHeight: "1.40", letterSpacing: "0.01em", fontWeight: "400" }],
        "micro": ["0.6875rem", { lineHeight: "1.30", letterSpacing: "0.04em", fontWeight: "500" }],
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        md: "8px",
        lg: "10px",
        xl: "14px",
        full: "9999px",
      },
      backdropBlur: {
        "28": "28px",
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
      maxWidth: {
        editorial: "920px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
