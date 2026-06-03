import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        form: "rgba(17, 24, 39, 0.85)",
        brutal: {
          neon: "#14B8A6",
          pink: "#F97316",
          yellow: "#F59E0B",
          blue: "#2563EB",
          white: "#FFFFFF",
          black: "#000000",
          gray: "#0F172A",
        }
      },
      boxShadow: {
        'brutal-sm': '0 10px 30px rgba(15, 23, 42, 0.18)',
        'brutal': '0 16px 40px rgba(15, 23, 42, 0.24)',
        'brutal-lg': '0 24px 60px rgba(15, 23, 42, 0.28)',
        'brutal-neon': '0 16px 40px rgba(20, 184, 166, 0.35)',
        'brutal-pink': '0 16px 40px rgba(249, 115, 22, 0.28)',
      },
      animation: {
        'vibrate': 'vibrate 0.3s linear infinite',
      },
      keyframes: {
        vibrate: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-1px) translateY(1px)' },
          '50%': { transform: 'translateX(1px) translateY(-1px)' },
          '75%': { transform: 'translateX(-1px) translateY(-1px)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
