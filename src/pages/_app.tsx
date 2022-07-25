import "@fontsource/montserrat";
import "@fontsource/noto-sans-jp";
import "react-typist/dist/Typist.css";
import "../styles/index.css";

import { ColorModeProvider } from "@/contexts/color-mode";
import { LanguageProvider } from "@/contexts/language";
import Head from "next/head";

function App({ Component, pageProps }: any) {
  return (
    <LanguageProvider>
      <ColorModeProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </ColorModeProvider>
    </LanguageProvider>
  );
}

export default App;
