import {
  Box,
  Flex,
  Button,
  Stack,
  useColorMode,
  Container,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

interface HeaderProps {}

const Header: React.VFC<HeaderProps> = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxWidth="container.xl">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box></Box>
        <Flex alignItems="center">
          <Stack direction="row" spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Header;
