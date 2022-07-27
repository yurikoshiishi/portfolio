import MoonIcon from "@/components/icons/MoonIcon";
import SunIcon from "@/components/icons/SunIcon";
import Button from "@/components/ui/Button";
import Menu from "@/components/ui/Menu";
import { useColorMode } from "@/contexts/color-mode";
import { useTranslation } from "@/hooks/useTranslation";
import { MdLanguage } from "react-icons/md";

interface HeaderProps {}

const langMap: { [key: string]: string } = {
  en: "English",
  ja: "日本語",
};

const Header: React.VFC<HeaderProps> = () => {
  const { languages, language, changeLanguage } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className="max-w-7xl w-full px-4 h-16 py-4 z-10 relative">
      <div className="flex items-center justify-between">
        <Menu
          buttonVariant="outline"
          items={languages.map((lang) => ({
            text: langMap[lang],
            onClick: () => changeLanguage(lang),
          }))}
        >
          <MdLanguage size={24} /> {langMap[language]}
        </Menu>
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
