import React from "react";
import { Box, Flex, useColorMode } from "@chakra-ui/react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import { useFontLoaded } from "../hooks/useFontLoaded";
import { googleFonts } from "../theme";
import { socialLinks, technologyIcons } from "../data";
import Background from "../components/Background";
import Head from "next/head";
import { BASE_URL } from "../constants";

const IndexPage = () => {
  const isFontLoaded = useFontLoaded(googleFonts);
  const { colorMode } = useColorMode();

  if (!isFontLoaded) {
    return null;
  }

  return (
    <>
      <Head>
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
        <Flex height="100%" direction="column" alignItems="center">
          <Header />
          <Box flex={1}>
            <Hero links={socialLinks} />
          </Box>
        </Flex>
        <Background icons={technologyIcons} />
      </Box>
    </>
  );
};

export default IndexPage;
