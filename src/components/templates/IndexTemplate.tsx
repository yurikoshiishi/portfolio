import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LoadingIcon from "@/components/icons/LoadingIcon";
import { socialLinks } from "@/data";
import { useFontLoaded } from "@/hooks/useFontLoaded";
import { googleFonts } from "@/theme";
import React from "react";

interface IndexTemplateProps {
  iconNames: string[];
}

const IndexTemplate: React.VFC<IndexTemplateProps> = ({ iconNames }) => {
  const isFontLoaded = useFontLoaded(googleFonts);

  return (
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
  );
};

export default IndexTemplate;
