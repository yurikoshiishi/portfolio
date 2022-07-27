import { LANGUAGES } from "@/constants";
import { useTranslation as useNextTranslation } from "next-i18next";
import { useRouter } from "next/router";

type Language = typeof LANGUAGES[number];

export function useTranslation(
  ...params: Parameters<typeof useNextTranslation>
) {
  const { i18n, t } = useNextTranslation(...params);
  const router = useRouter();
  const { asPath, query, pathname } = router;

  const isValidLanguage = (language: string): language is Language => {
    return LANGUAGES.includes(language);
  };

  const changeLanguage = (language: string) => {
    if (!isValidLanguage(language)) {
      return;
    }

    i18n.changeLanguage(language);
    router.push({ pathname, query }, asPath, {
      locale: language,
      shallow: true,
    });
    setCookie({
      name: "NEXT_LOCALE",
      value: language,
      days: 365,
    });
  };

  return {
    ...i18n,
    changeLanguage,
    t,
    languages: LANGUAGES,
  };
}

function setCookie({
  name,
  value,
  days,
}: {
  name: string;
  value: string;
  days: number;
}) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${value}${expires};path=/`;
}
