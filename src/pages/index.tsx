import Background from "@/components/Background";
import { GAUNTLET_IMAGE_PATHS } from "@/components/Gauntlet";
import Hero from "@/components/Hero";
import Header from "@/components/layouts/Header";
import StaticContent from "@/components/StaticContent";
import { BASE_URL, LANGUAGES } from "@/constants";
import { socialLinks } from "@/data";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <>
      <Head>
        <title>Yuri Koshiishi | Portfolio</title>
        <meta
          name="description"
          content="Thank you for visiting Yuri Koshiishi Portfolio. Please feel free to contact me anytime."
        />
        <link rel="preload" href="/assets/avatar.jpg" as="image" />
        <link rel="preload" href={GAUNTLET_IMAGE_PATHS.idle} as="image" />
        <link rel="canonical" href={`${BASE_URL}/`} />
      </Head>
      <div className="h-full relative z-[1]">
        <div className="h-full flex flex-col items-center">
          <Header />
          <div className="flex-1">
            <Hero links={socialLinks} />
          </div>
        </div>
      </div>
      <StaticContent>
        <Background />
      </StaticContent>
    </>
  );
}

export const getStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(locale
        ? await serverSideTranslations(locale, ["common"], null, LANGUAGES)
        : {}),
    },
  };
};
