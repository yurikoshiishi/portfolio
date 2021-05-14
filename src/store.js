import {useMemo} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

let store;

const initialState = {
  lang: 'en',
  theme: 'light',
};

const SET_LANGUAGE = 'SET_LANGUAGE';
const SET_THEME = 'SET_THEME';

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE: {
      const {language, force} = action.payload;
      return {
        ...state,
        lang: {language, force},
      };
    }
    case SET_THEME: {
      return {
        ...state,
        mode: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

// ACTIONS
export const setLanguage = ({language, force}) => ({
  type: SET_LANGUAGE,
  payload: {language, force},
});

export const setMode = (theme) => ({type: SET_THEME, payload: theme});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['lang', 'theme'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

function makeStore(state = initialState) {
  return createStore(
    persistedReducer,
    state,
    composeWithDevTools(applyMiddleware())
  );
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
