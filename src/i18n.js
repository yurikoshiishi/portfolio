import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import ja from './data/translations/ja/';
import en from './data/translations/en/';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {translation: en},
  ja: {translation: ja},
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    returnEmptyString: false,
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
