import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {AppProps} from 'next/dist/next-server/lib/router/router';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {useStore} from '../store';
import {theme} from '../theme';
import '../styles/index.css';
import LanguageProvider from '../components/LanguageProvider';
import {appWithTranslation} from 'next-i18next';
import Head from 'next/head';

function App({Component, pageProps}: AppProps) {
  const store = useStore(pageProps.initialReduxState);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LanguageProvider>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>Yuri Koshiishi | Portfolio</title>
            <meta
              name="description"
              content="Thank you for visiting Yuri Koshiishi Portfolio. Please feel free to contact me anytime."
            />
          </Head>
          <CssBaseline />
          <Component {...pageProps} />
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default appWithTranslation(App);
