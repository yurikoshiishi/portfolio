import MoonIcon from "@/components/icons/MoonIcon";
import SunIcon from "@/components/icons/SunIcon";
import Button from "@/components/ui/Button";
import Menu from "@/components/ui/Menu";
import { useColorMode } from "@/contexts/color-mode";
import { LANGUAGES, useLanguage } from "@/contexts/language";

interface HeaderProps {}

const langMap: { [key: string]: string } = {
  en: "English",
  ja: "日本語",
};

const Header: React.VFC<HeaderProps> = () => {
  const { lang, setLanguage } = useLanguage();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className="max-w-7xl w-full px-4 h-16 py-4 z-10 relative">
      <div className="flex items-center justify-between">
        <Menu
          text={`Language: ${langMap[lang]}`}
          buttonVariant="outline"
          items={LANGUAGES.map((lang) => ({
            text: langMap[lang],
            onClick: () => setLanguage(lang),
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
