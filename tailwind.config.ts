import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5ECD7",
        surface: "#FDFAF4",
        border: "#1A1208",
        brutal: {
          primary: "#C75B2D",
          secondary: "#E8A838",
          accent: "#4A7C59",
          muted: "#6B5744",
          ink: "#1A1208",
          paper: "#FDFAF4",
          parchment: "#F5ECD7",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        brutal: ["Space Grotesk", "sans-serif"],
      },
      borderWidth: {
        brutal: "2px",
      },
      borderRadius: {
        brutal: "6px",
      },
      boxShadow: {
        "brutal-sm": "2px 2px 0px #1A1208",
        "brutal":    "4px 4px 0px #1A1208",
        "brutal-lg": "6px 6px 0px #1A1208",
        "brutal-primary": "4px 4px 0px #C75B2D",
        "brutal-secondary": "4px 4px 0px #E8A838",
        "brutal-accent": "4px 4px 0px #4A7C59",
      },
      animation: {
        vibrate: "vibrate 0.3s linear infinite",
      },
      keyframes: {
        vibrate: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-1px) translateY(1px)" },
          "50%": { transform: "translateX(1px) translateY(-1px)" },
          "75%": { transform: "translateX(-1px) translateY(-1px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;