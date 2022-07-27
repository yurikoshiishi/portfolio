import "react-typist/dist/Typist.css";
import "../styles/Background.scss";
import "../styles/index.css";

import { ColorModeProvider } from "@/contexts/color-mode";
import { appWithTranslation } from "next-i18next";
import Head from "next/head";

function App({ Component, pageProps }: any) {
  return (
    <ColorModeProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </ColorModeProvider>
  );
}

export default appWithTranslation(App);
