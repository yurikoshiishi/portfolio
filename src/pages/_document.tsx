import { ColorMode, colorModeStorageKey } from "@/contexts/color-mode";
import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content="#000000" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <ColorModeScript
            initialColorMode="light"
            storageKey={colorModeStorageKey}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export type ColorModeScriptProps = {
  initialColorMode: ColorMode;
  storageKey: string;
};

export function getScriptSrc({
  initialColorMode: init,
  storageKey: key,
}: ColorModeScriptProps) {
  const localStorageScript = `(function(){try{var a=function(a){var c="(prefers-color-scheme: dark)",d=window.matchMedia(c).matches?"dark":"light",b="system"===a?d:a;return document.documentElement.dataset.theme=b,b},d="${init}",b="${key}",c=localStorage.getItem(b);c?a(c):localStorage.setItem(b,a(d))}catch(e){}})()`;

  return `!${localStorageScript}`.trim();
}

export function ColorModeScript(props: ColorModeScriptProps) {
  return (
    <script
      id="yk-color-mode-script"
      dangerouslySetInnerHTML={{ __html: getScriptSrc(props) }}
    />
  );
}
