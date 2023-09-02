import Background from "@/components/Background";
import { GAUNTLET_IMAGE_PATHS } from "@/components/Gauntlet";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StaticContent from "@/components/StaticContent";
import { BASE_URL, LANGUAGES } from "@/constants";
import { iconNames, socialLinks } from "@/data";
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
        <Background iconNames={props.iconNames} />
      </StaticContent>
    </>
  );
}

export const getStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      iconNames: shuffle(iconNames),
      ...(locale
        ? await serverSideTranslations(locale, ["common"], null, LANGUAGES)
        : {}),
    },
  };
};

function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
