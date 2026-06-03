import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        form: "rgba(17, 24, 39, 0.85)",
        brutal: {
          neon: "#00FF94",
          pink: "#FF2E63",
          yellow: "#FFE400",
          blue: "#2E4CEE",
          white: "#FFFFFF",
          black: "#000000",
          gray: "#121212",
        }
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px rgba(255, 255, 255, 1)',
        'brutal': '4px 4px 0px 0px rgba(255, 255, 255, 1)',
        'brutal-lg': '8px 8px 0px 0px rgba(255, 255, 255, 1)',
        'brutal-neon': '4px 4px 0px 0px #00FF94',
        'brutal-pink': '4px 4px 0px 0px #FF2E63',
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
