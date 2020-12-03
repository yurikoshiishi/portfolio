const SET_LANGUAGE = 'SET_LANGUAGE';
const SET_THEME = 'SET_THEME';

const INITIAL_STATE = {
  language: 'ja',
  theme: 'light',
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_LANGUAGE: {
      return {
        ...state,
        language: action.payload,
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

export default reducer;

export const setLanguage = (language) => ({
  type: SET_LANGUAGE,
  payload: language,
});

export const setMode = (theme) => ({type: SET_THEME, payload: theme});
