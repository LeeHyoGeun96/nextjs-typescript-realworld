import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brand-primary": "#5CB85C",
        "brand-secondary": "#4CAF50",
        "brand-danger": "#B85C5C",
        dark: {
          "bg-primary": "#1a1a1a",
          "bg-secondary": "#242424",
          "text-primary": "#ffffff",
          "text-secondary": "#a0a0a0",
        },
      },
      fontFamily: {
        logo: ["Titillium Web", "sans-serif"],
        sans: ["Source Sans Pro", "sans-serif"],
        serif: ["Source Serif Pro", "serif"],
        heading: ["Merriweather Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".touch-scroll": {
          "-webkit-overflow-scrolling": "touch",
          // "scroll-behavior": "smooth",
        },
      });
    },
  ],
} satisfies Config;
