import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {AppProps} from 'next/dist/next-server/lib/router/router';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {useStore} from '../store';
import {theme} from '../theme';
import '../styles/index.css';
import LanguageProvider from '../components/LanguageProvider';
import {appWithTranslation} from 'next-i18next';

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
          <CssBaseline />
          <Component {...pageProps} />
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default appWithTranslation(App);
