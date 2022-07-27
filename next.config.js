const { i18n } = require("./next-i18next.config");

/** @type {import("next").NextConfig} */
const config = {
  rewrites: async () => {
    return [
      {
        source: "/en/",
        destination: "/",
        locale: false,
      },
    ];
  },
  i18n,
};

module.exports = config;
