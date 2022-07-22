import "../styles/index.css";
import "@fontsource/montserrat";
import "@fontsource/noto-sans-jp";
import "react-typist/dist/Typist.css";

import React from "react";
import Head from "next/head";
import I18nProvider from "next-translate/I18nProvider";
import { useRouter } from "next/router";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme";

function App({ Component, pageProps }: any) {
  const router = useRouter();

  return (
    <I18nProvider lang={router.locale} namespaces={pageProps._ns}>
      <ChakraProvider theme={theme}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Yuri Koshiishi | Portfolio</title>
          <meta
            name="description"
            content="Thank you for visiting Yuri Koshiishi Portfolio. Please feel free to contact me anytime."
          />
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </I18nProvider>
  );
}

export default App;
