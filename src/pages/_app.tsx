import { CssBaseline, ThemeProvider } from "@material-ui/core";
import React, { useEffect } from "react";
import { theme } from "../theme";
import "../styles/index.css";
import Head from "next/head";
import I18nProvider from "next-translate/I18nProvider";
import { useRouter } from "next/router";

function App({ Component, pageProps }: any) {
  const router = useRouter();

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <I18nProvider lang={router.locale} namespaces={pageProps._ns}>
      <ThemeProvider theme={theme}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Yuri Koshiishi | Portfolio</title>
          <meta
            name="description"
            content="Thank you for visiting Yuri Koshiishi Portfolio. Please feel free to contact me anytime."
          />
        </Head>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
