import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import Button, { ButtonProps } from "@/components/ui/Button";
import { joinClassNames } from "@/lib/style-helper";
import { useEffect, useRef, useState, VFC } from "react";

interface MenuProps {
  buttonVariant?: ButtonProps<"button">["variant"];
  text: string;
  items: MenuItem[];
}

type MenuItemAction = { onClick: () => void } | { href: string };

type MenuItem = MenuItemAction & {
  text: string;
};

const Menu: VFC<MenuProps> = ({ buttonVariant = "solid", text, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.addEventListener("click", isClickedOutside, true);

    function isClickedOutside(e: MouseEvent) {
      const clicked = e.target;

      if (!(clicked instanceof Node)) {
        setIsOpen(false);
        return;
      }

      //let the onClick handler on the button do the work
      if (buttonRef.current?.contains(clicked)) {
        return;
      }

      setIsOpen(false);
    }

    return () => {
      document.removeEventListener("click", isClickedOutside, true);
    };
  }, [isOpen]);

  const onClickButton = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant={buttonVariant}
        onClick={onClickButton}
        rightIcon={<ChevronDownIcon />}
      >
        {text}
      </Button>
      <div
        ref={menuRef}
        className={joinClassNames(
          " transition-all duration-200 origin-top-left absolute top-full left-0 mt-3 z-10 w-56 bg-white rounded-md divide-y divide-gray-100 shadow-xl dark:bg-gray-800 border border-gray-300 dark:border-gray-600 dark:hover:border-gray-600",
          isOpen
            ? "scale-100 visible opacity-100 "
            : "invisible opacity-0 scale-[0.8]"
        )}
      >
        <div className="py-1 text-sm text-gray-700 dark:text-gray-200">
          {items.map((item, i) => {
            const className =
              "block w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200 cursor-pointer";

            if ("href" in item) {
              return (
                <a key={i} className={className} href={item.href}>
                  {item.text}
                </a>
              );
            }

            if ("onClick" in item) {
              return (
                <button
                  key={i}
                  className={joinClassNames(className, "appearance-none")}
                  onClick={item.onClick}
                >
                  {item.text}
                </button>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default Menu;
