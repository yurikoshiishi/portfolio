import { extendTheme, ThemeConfig } from "@chakra-ui/react";

export const googleFonts: string[] = ["Montserrat", "Noto Sans JP"];

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: `"Montserrat", "Noto Sans JP", -apple-system, "Helvetica Neue",
    Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif`,
    body: `"Montserrat", "Noto Sans JP", -apple-system, "Helvetica Neue",
    Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif`,
  },
});

export const breakpoints = {
  sm: "480px",
  md: "768px",
  lg: "992px",
  xl: "1280px",
  "2xl": "1536px",
} as const;
