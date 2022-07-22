import Hero from "@/components/Hero";
import { socialLinks } from "@/data";
import { useFontLoaded } from "@/hooks/useFontLoaded";
import { googleFonts } from "@/theme";
import { Box, Flex } from "@chakra-ui/react";
import { VFC } from "react";

interface MainProps {}

const Main: VFC<MainProps> = ({}) => {
  const isFontLoaded = useFontLoaded(googleFonts);

  if (!isFontLoaded) {
    return null;
  }

  return (
    <Flex height="100%" direction="column" alignItems="center">
      {/* <Header /> */}
      <Box flex={1}>
        <Hero links={socialLinks} />
      </Box>
    </Flex>
  );
};

export default Main;
