const SET_LANGUAGE = 'SET_LANGUAGE';
const SET_THEME = 'SET_THEME';

const INITIAL_STATE = {
  lang: 'en',
  theme: 'light',
};

const reducer = (state = INITIAL_STATE, action) => {
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

export default reducer;

export const setLanguage = ({language, force}) => ({
  type: SET_LANGUAGE,
  payload: {language, force},
});

export const setMode = (theme) => ({type: SET_THEME, payload: theme});
