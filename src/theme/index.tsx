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
