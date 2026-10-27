import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1F33",
        brand: { DEFAULT: "#0E7A4F", dark: "#0A5C3B", soft: "#E7F5EE" },
        warn: { DEFAULT: "#B45309", soft: "#FEF3C7" },
        danger: { DEFAULT: "#B91C1C", soft: "#FEE2E2" },
        line: "#E2E8F0",
        page: "#F6F8F7",
      },
      fontFamily: {
        urdu: ["var(--font-urdu)", "Noto Nastaliq Urdu", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
