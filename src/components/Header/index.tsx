import { ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import i18nConfig from "../../../i18n";

interface HeaderProps {}

const localeToLangMap: { [key: string]: string } = {
  en: "English",
  ja: "日本語",
};

const Header: React.VFC<HeaderProps> = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxWidth="container.xl" zIndex="sticky">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              cursor="pointer"
              minW={0}
              rightIcon={<ChevronDownIcon />}
            >
              {/* TODO: lang */}
              <Text fontSize="sm">Language: {localeToLangMap["en"]}</Text>
            </MenuButton>
            <MenuList>
              <MenuOptionGroup value="en">
                {i18nConfig.locales.map((locale) => (
                  <MenuItemOption
                    value={locale}
                    key={locale}
                    as="a"
                    href={`/${locale}`}
                  >
                    {localeToLangMap[locale]}
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </Box>
        <Flex alignItems="center">
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Header;
