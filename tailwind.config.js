import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["JetBrains Mono", "sans-serif", ...fontFamily.sans],
    },
    extend: {
      screens: {
        tall: { raw: "(min-height: 800px)" },
      },
      animation: {
        fade: "fadeIn .25s ease-in-out",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
};
