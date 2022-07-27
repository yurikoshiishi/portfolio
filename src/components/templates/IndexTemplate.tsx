import Background from "@/components/Background";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StaticContent from "@/components/StaticContent";
import { BASE_URL } from "@/constants";
import { socialLinks } from "@/data";
import Head from "next/head";
import React from "react";

interface IndexTemplateProps {
  iconNames: string[];
}

const IndexTemplate: React.VFC<IndexTemplateProps> = ({ iconNames }) => {
  return (
    <>
      <Head>
        <title>Yuri Koshiishi | Portfolio</title>
        <meta
          name="description"
          content="Thank you for visiting Yuri Koshiishi Portfolio. Please feel free to contact me anytime."
        />
        <link rel="preload" href="/assets/avatar.jpg" as="image" />
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
        <Background iconNames={iconNames} />
      </StaticContent>
    </>
  );
};

export default IndexTemplate;
