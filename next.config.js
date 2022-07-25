/** @type {import("next").NextConfig} */

const languages = ["en", "ja"];

const config = {
  redirects: () => {
    return languages.map((lang) => ({
      source: `/${lang}`,
      destination: "/",
      permanent: true,
    }));
  },
};

module.exports = config;
