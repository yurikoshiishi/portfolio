import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import reducer from './modules';
import {ThemeProvider} from '@material-ui/core/styles';
import {theme} from './theme';
import App from './App';
import './i18n';
import LanguageProvider from './components/LanguageProvider';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['lang', 'theme'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const persistor = persistStore(store);

if (process.env.NODE_ENV === 'development') {
  console.log(theme);
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>,
  document.querySelector('#root')
);
