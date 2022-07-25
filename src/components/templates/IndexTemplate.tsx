import Background from "@/components/Background";
import { GAUNTLET_IMAGE_PATHS } from "@/components/Gauntlet";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LoadingIcon from "@/components/icons/LoadingIcon";
import { BASE_URL } from "@/constants";
import { socialLinks } from "@/data";
import { useFontLoaded } from "@/hooks/useFontLoaded";
import { googleFonts } from "@/theme";
import Head from "next/head";
import React from "react";

interface IndexTemplateProps {
  iconNames: string[];
}

const IndexTemplate: React.VFC<IndexTemplateProps> = ({ iconNames }) => {
  const isFontLoaded = useFontLoaded(googleFonts);

  return (
    <>
      <Head>
        <title>Yuri Koshiishi | Portfolio</title>
        <meta
          name="description"
          content="Thank you for visiting Yuri Koshiishi Portfolio. Please feel free to contact me anytime."
        />
        {Object.values(GAUNTLET_IMAGE_PATHS).map((path) => (
          <link key={path} rel="preload" as="image" href={path} />
        ))}
        <link rel="canonical" href={`${BASE_URL}/`} />
      </Head>
      <div className="h-full relative z-[1]">
        {isFontLoaded ? (
          <div className="h-full flex flex-col items-center">
            <Header />
            <div className="flex-1">
              <Hero links={socialLinks} />
            </div>
          </div>
        ) : (
          <div className="w-screen h-screen flex items-center justify-center text-gray-900 dark:text-white">
            <LoadingIcon />
          </div>
        )}
      </div>
      <Background iconNames={iconNames} />
    </>
  );
};

export default IndexTemplate;
