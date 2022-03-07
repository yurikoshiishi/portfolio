import React from "react";
import { Box, Flex } from "@chakra-ui/react";
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

  if (!isFontLoaded) {
    return null;
  }

  return (
    <>
      <Head>
        <link rel="canonical" href={`${BASE_URL}/`} />
      </Head>
      <Flex height="100%" direction="column" alignItems="center">
        <Header />
        <Box flex={1}>
          <Hero links={socialLinks} />
        </Box>
      </Flex>
      <Background icons={technologyIcons} />
    </>
  );
};

export default IndexPage;
