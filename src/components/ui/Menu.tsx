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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.addEventListener("click", isClickedOutside, true);

    function isClickedOutside(e: MouseEvent) {
      e.preventDefault();

      const clicked = e.target;

      if (!(clicked instanceof Node)) {
        setIsOpen(false);
        return;
      }

      if (
        !wrapperRef.current?.contains(clicked) ||
        buttonRef.current?.contains(clicked)
      ) {
        setIsOpen(false);
      }
    }

    return () => {
      document.removeEventListener("click", isClickedOutside, true);
    };
  }, [isOpen]);

  const onClickButton = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={wrapperRef} className="relative">
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
        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
          {items.map((item, i) => {
            if ("href" in item) {
              return (
                <li key={i}>
                  <a
                    href={item.href}
                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    {item.text}
                  </a>
                </li>
              );
            }

            if ("onClick" in item) {
              <li key={i}>
                <button
                  onClick={item.onClick}
                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {item.text}
                </button>
              </li>;
            }

            return null;
          })}
        </ul>
      </div>
    </div>
  );
};

export default Menu;
