import {
  Box,
  Flex,
  Button,
  useColorMode,
  Container,
  Menu,
  MenuButton,
  MenuList,
  Text,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/react";
import { ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import useTranslation from "next-translate/useTranslation";
import i18nConfig from "../../../i18n";

interface HeaderProps {}

const localeToLangMap: { [key: string]: string } = {
  en: "English",
  ja: "日本語",
};

const Header: React.VFC<HeaderProps> = () => {
  const { lang } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxWidth="container.xl">
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
              <Text fontSize="sm">Language: {localeToLangMap[lang]}</Text>
            </MenuButton>
            <MenuList>
              <MenuOptionGroup value={lang}>
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
