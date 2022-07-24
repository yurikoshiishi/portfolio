const colors = require("tailwindcss/colors");

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/{pages,components}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      white: colors.white,
      gray: colors.gray,
      primary: colors.sky,
    },
    breakpoints: {
      sm: "480px",
      md: "768px",
      lg: "992px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      ringWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
