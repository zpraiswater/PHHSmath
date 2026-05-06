import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mastery: {
          notStarted: "#94a3b8",
          developing: "#f97316",
          almostThere: "#facc15",
          mastered: "#22c55e"
        }
      }
    },
  },
  plugins: [],
};

export default config;
