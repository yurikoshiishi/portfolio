module.exports = {
  defaultLocale: 'en',
  locales: ['en', 'ja'],
  fallbackLng: 'en',
  returnEmptyString: false,
  keySeparator: false, // we do not use keys in form messages.welcome
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  pages: {
    '*': ['common'],
  },
  loadLocaleFrom: (lang, ns) => {
    return import(`./locales/${lang}/${ns}.json`).then((m) => {
      return m.default;
    });
  },
};
