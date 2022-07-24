import MoonIcon from "@/components/icons/MoonIcon";
import SunIcon from "@/components/icons/SunIcon";
import Button from "@/components/ui/Button";
import Menu from "@/components/ui/Menu";
import { useColorMode } from "@/contexts/color-mode";

interface HeaderProps {}

const localeToLangMap: { [key: string]: string } = {
  en: "English",
  ja: "日本語",
};

const Header: React.VFC<HeaderProps> = () => {
  const lang = "en";
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className="max-w-7xl w-full px-4 h-16 py-4 z-10 relative">
      <div className="flex items-center justify-between">
        <Menu
          text={`Language: ${localeToLangMap[lang]}`}
          buttonVariant="outline"
          items={["en", "ja"].map((locale) => ({
            text: localeToLangMap[locale],
            onClick: () => console.log(`/${locale}`),
          }))}
        />
        <Button onClick={toggleColorMode}>
          <span className="w-4 h-4">
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
