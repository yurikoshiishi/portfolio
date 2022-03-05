import { extendTheme } from "@chakra-ui/react";

export const googleFonts: string[] = ["Montserrat", "Noto Sans JP"];

export const theme = extendTheme({
  fonts: {
    heading: `"Montserrat", "Noto Sans JP", -apple-system, "Helvetica Neue",
    Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif`,
    body: `"Montserrat", "Noto Sans JP", -apple-system, "Helvetica Neue",
    Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif`,
  },
});