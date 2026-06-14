import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
      colors: {
        background: "#E8EDE6",
        surface: "#F5F8F4",
        brutal: {
          primary:   "#3B6B4A",
          secondary: "#D4A843",
          accent:    "#8B4A2B",
          muted:     "#5A6E5A",
          ink:       "#0F1A0F",
          paper:     "#F5F8F4",
          parchment: "#E8EDE6",
        },
      },
      fontFamily: {
        sans:   ["var(--font-space-grotesk)", "sans-serif"],
        brutal: ["var(--font-space-grotesk)", "sans-serif"],
      },
      fontSize: {
        tiny: "10px",
      },
      borderWidth: {
        brutal: "2px",
      },
      borderRadius: {
        brutal: "6px",
      },
      letterSpacing: {
        brutal: "0.3em",
      },
      boxShadow: {
        "brutal-sm":        "2px 2px 0px #0F1A0F",
        "brutal":           "4px 4px 0px #0F1A0F",
        "brutal-lg":        "6px 6px 0px #0F1A0F",
        "brutal-primary":   "4px 4px 0px #3B6B4A",
        "brutal-secondary": "4px 4px 0px #D4A843",
        "brutal-accent":    "4px 4px 0px #8B4A2B",
      },
      animation: {
        vibrate: "vibrate 0.3s linear infinite",
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        vibrate: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%":  { transform: "translateX(-1px) translateY(1px)" },
          "50%":  { transform: "translateX(1px) translateY(-1px)" },
          "75%":  { transform: "translateX(-1px) translateY(-1px)" },
        },
        shimmer: {
          "0%" : { transform: "translateX(-100%)" },
          "100%" : { transform: "translateX(200%)" }
        }
      },
    },
  },
  plugins: [],
};

export default config;