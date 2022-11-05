const colors = require("tailwindcss/colors");

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/{pages,components}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Helvetica Neue",
        "Arial",
        "Hiragino Kaku Gothic ProN",
        "Hiragino Sans",
        "Meiryo",
        "sans-serif",
      ],
    },
    colors: {
      white: colors.white,
      gray: {
        50: "#F7FAFC",
        100: " #EDF2F7",
        200: " #E2E8F0",
        300: " #CBD5E0",
        400: " #A0AEC0",
        500: " #718096",
        600: " #4A5568",
        700: " #2D3748",
        800: " #1A202C",
        900: " #171923",
      },
      whiteAlpha: {
        50: `rgba(255, 255, 255, 0.04)`,
        100: `rgba(255, 255, 255, 0.06)`,
        200: `rgba(255, 255, 255, 0.08)`,
        300: `rgba(255, 255, 255, 0.16)`,
        400: `rgba(255, 255, 255, 0.24)`,
        500: `rgba(255, 255, 255, 0.36)`,
        600: `rgba(255, 255, 255, 0.48)`,
        700: `rgba(255, 255, 255, 0.64)`,
        800: `rgba(255, 255, 255, 0.80)`,
        900: `rgba(255, 255, 255, 0.92)`,
      },
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
  plugins: [require("@tailwindcss/typography")],
};
