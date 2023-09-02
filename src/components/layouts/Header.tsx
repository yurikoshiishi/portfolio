import MoonIcon from "@/components/icons/MoonIcon";
import SunIcon from "@/components/icons/SunIcon";
import Button from "@/components/ui/Button";
import Menu from "@/components/ui/Menu";
import { useColorMode } from "@/contexts/color-mode";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { MdLanguage } from "react-icons/md";

interface HeaderProps {
  showLangMenu?: boolean;
}

const langMap: { [key: string]: string } = {
  en: "English",
  ja: "日本語",
};

const Header: React.VFC<HeaderProps> = ({ showLangMenu = false }) => {
  const { languages, language, changeLanguage } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className="max-w-7xl w-full px-4 h-16 py-4 z-10 relative">
      <div className="flex items-center justify-between">
        {showLangMenu ? (
          <Menu
            buttonVariant="outline"
            items={languages.map((lang) => ({
              text: langMap[lang],
              onClick: () => changeLanguage(lang),
            }))}
          >
            <MdLanguage size={24} /> {langMap[language]}
          </Menu>
        ) : (
          <Link href="/" passHref>
            <a>
              <div className="font-bold text-lg text-black dark:text-white">
                Yuri Koshiishi
              </div>
            </a>
          </Link>
        )}
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
