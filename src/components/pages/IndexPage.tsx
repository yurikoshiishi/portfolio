import Background from "@/components/Background";
import IndexTemplate from "@/components/templates/IndexTemplate";
import { technologyIcons } from "@/data";
import { Box, useColorMode } from "@chakra-ui/react";

interface IndexPageProps {
  children: React.ReactNode;
}

const IndexPage: React.VFC<IndexPageProps> = ({ children }) => {
  const { colorMode } = useColorMode();

  return (
    <IndexTemplate>
      <Box
        height="100%"
        position="relative"
        zIndex={1}
        // NOTE: setting bg here to override body bg, in order to prevent a bug in safari
        // https://github.com/chakra-ui/chakra-ui/issues/5641
        background={colorMode === "dark" ? "gray.800" : "white"}
      >
        {children}
        <Background icons={technologyIcons} />
      </Box>
    </IndexTemplate>
  );
};

export default IndexPage;
