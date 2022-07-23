import Background from "@/components/Background";
import { GAUNTLET_IMAGE_PATHS } from "@/components/Gauntlet";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { BASE_URL } from "@/constants";
import { socialLinks, technologyIcons } from "@/data";
import { useFontLoaded } from "@/hooks/useFontLoaded";
import { googleFonts } from "@/theme";
import { Box, Flex, useColorMode } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";

interface IndexTemplateProps {}

const IndexTemplate: React.FC<IndexTemplateProps> = ({ children }) => {
  const isFontLoaded = useFontLoaded(googleFonts);
  const { colorMode } = useColorMode();

  return (
    <>
      <Head>
        {Object.values(GAUNTLET_IMAGE_PATHS).map((path) => (
          <link key={path} rel="preload" as="image" href={path} />
        ))}
        <link rel="canonical" href={`${BASE_URL}/`} />
      </Head>
      <Box
        height="100%"
        position="relative"
        zIndex={1}
        // NOTE: setting bg here to override body bg, in order to prevent a bug in safari
        // https://github.com/chakra-ui/chakra-ui/issues/5641
        background={colorMode === "dark" ? "gray.800" : "white"}
      >
        {isFontLoaded && (
          <Flex height="100%" direction="column" alignItems="center">
            <Header />
            <Box flex={1}>
              <Hero links={socialLinks} />
            </Box>
          </Flex>
        )}
        <Background icons={technologyIcons} />
      </Box>
    </>
  );
};

export default IndexTemplate;
