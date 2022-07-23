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
    extend: {
      ringWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
