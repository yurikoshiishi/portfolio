import { CssBaseline, ThemeProvider } from "@material-ui/core";
import React, { useEffect } from "react";
import { theme } from "../theme";
import "../styles/index.css";
import Head from "next/head";

function App({ Component, pageProps }: any) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
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
  );
}

export default App;
