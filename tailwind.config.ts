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
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["geomanist", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["geomanist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
        book: ["geomanist-book", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#ee4f27",
          "orange-bright": "#fd8925",
          "red-hot": "#ff0c00",
          amber: "#ff9b26",
          "purple-bright": "#a06ff6",
        },
        navy: {
          deep: "#0e0918",
          card: "#1b1728",
          elevated: "#1f192a",
          hover: "#272333",
        },
        warm: {
          rust: "#432d33",
        },
        cool: {
          graphite: "#191422",
        },
        border: "#1f192a",
        input: "#1f192a",
        ring: "#ee4f27",
        background: "#0e0918",
        foreground: "#d1cece",
        primary: {
          DEFAULT: "#ee4f27",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#077ac7",
          foreground: "#ffffff",
        },
        tertiary: {
          DEFAULT: "#6b21ef",
        },
        destructive: {
          DEFAULT: "#d91616",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#9ca3af",
          foreground: "#9ca3af",
        },
        accent: {
          DEFAULT: "#ee4f27",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#1f192a",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#1b1728",
          foreground: "#d1cece",
        },
        surface: {
          DEFAULT: "#0e0918",
          container: "#1b1728",
          high: "#1f192a",
          inverted: "#ffffff",
        },
        chart: {
          blue: "#2563eb",
          emerald: "#10b981",
          amber: "#f59e0b",
          violet: "#8b5cf6",
          rose: "#f43f5e",
        },
        sidebar: {
          DEFAULT: "#1b1728",
          foreground: "#d1cece",
          primary: "#ee4f27",
          "primary-foreground": "#ffffff",
          accent: "#1f192a",
          "accent-foreground": "#ffffff",
          border: "#1f192a",
          ring: "#ee4f27",
        },
      },
      fontSize: {
        "display-hero": ["72px", { lineHeight: "100%", letterSpacing: "-0.02em", fontWeight: "300" }],
        "display-large": ["54px", { lineHeight: "100%", letterSpacing: "-0.02em", fontWeight: "300" }],
        "section-heading": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "300" }],
        "subheading-large": ["38px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "300" }],
        "subheading": ["32px", { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "300" }],
        "body-large": ["20px", { lineHeight: "1.25", letterSpacing: "0em", fontWeight: "300" }],
        "body": ["16px", { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
        "body-small": ["15px", { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
        "button": ["16px", { lineHeight: "1", letterSpacing: "0em", fontWeight: "400" }],
        "button-small": ["14px", { lineHeight: "1", letterSpacing: "0em", fontWeight: "400" }],
        "link": ["16px", { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
        "caption": ["14px", { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
        "caption-small": ["12px", { lineHeight: "1.4", letterSpacing: "0em", fontWeight: "400" }],
        "emphasis-book": ["16px", { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
        "code-body": ["16px", { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        md: "8px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },
      backdropBlur: {
        "24": "24px",
        "150": "150px",
        "200": "200px",
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
        "modal-default": "800px",
        "modal-wide": "1120px",
        "modal-widest": "1440px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
