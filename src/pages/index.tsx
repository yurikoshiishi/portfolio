import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import { useFontLoaded } from "../hooks/useFontLoaded";
import { googleFonts } from "../theme";
import { socialLinks } from "../data";

const IndexPage = () => {
  const isFontLoaded = useFontLoaded(googleFonts);

  if (!isFontLoaded) {
    return null;
  }

  return (
    <Flex height="100%" direction="column" alignItems="center">
      <Header />
      <Box flex={1}>
        <Hero links={socialLinks} />
      </Box>
    </Flex>
  );
};

export default IndexPage;
