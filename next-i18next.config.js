module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    fallbackLng: 'en',
    returnEmptyString: false,
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  },
};
