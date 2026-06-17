import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#15323F",
        "brand-gold": "#C8A45D",
        "brand-white": "#FFFFFF",
        "brand-dark-light": "#1e4a5c",
        "brand-gold-light": "#d4b67a",
        "brand-gold-dark": "#a8833d",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        serif: ["var(--font-playfair)", ...fontFamily.serif],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #15323F 0%, #1e4a5c 100%)",
        "gradient-gold": "linear-gradient(135deg, #C8A45D 0%, #d4b67a 100%)",
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
  plugins: [require("@tailwindcss/typography")],
};

export default config;
