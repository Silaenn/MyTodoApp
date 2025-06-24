import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        form: "rgba(17, 24, 39, 0.85)",
      },
    },
  },
  plugins: [],
};

export default config;
