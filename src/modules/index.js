const SET_LANGUAGE = 'SET_LANGUAGE';
const SET_MODE = 'SET_MODE';

const INITIAL_STATE = {
  language: 'ja',
  mode: 'light'
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_LANGUAGE: {
      return {
        ...state,
        language: action.payload
      };
    }
    case SET_MODE: {
      return {
        ...state,
        mode: action.payload
      };
    }
    default: {
     return state
    }
  }
};

export default reducer

export const setLanguage = language => ({type: SET_LANGUAGE, action: language});

export const setMode = mode => ({type: SET_MODE, action: mode});
