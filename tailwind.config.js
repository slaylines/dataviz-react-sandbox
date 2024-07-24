/** @type {import('tailwindcss').Config} */
import { fluidity, palettes } from "./src/tailwind";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    fluidity({
      minScreenWidth: 428,
      maxScreenWidth: 1440,
    }),
  ],
  important: true,
  theme: {
    extend: {},
    screens: {
      sm: "576px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
    fontSize: {},
    fluidFontSize: {
      sm: "10px-12px",
      base: "12px-14px",
      md: "14px-18px",
      lg: "20px-24px",
      xl: "30px-36px",
    },
    lineHeight: {
      inherit: "inherit",
      none: 0,
      1: 1.33,
      2: 1.6,
    },
    colors: {
      canvas: {
        DEFAULT: palettes.white,
      },
      "on-canvas": {
        DEFAULT: palettes.gray[800],
      },
      primary: {
        DEFAULT: palettes.primary,
      },
      muted: {
        DEFAULT: palettes.gray[600],
      },
      outline: {
        DEFAULT: palettes.gray[300],
      },
      transparent: palettes.transparent,
      inherit: palettes.inherit,
      current: palettes.current,
    },
    borderRadius: {
      none: "0px",
      DEFAULT: "4px",
    },
  },
};
