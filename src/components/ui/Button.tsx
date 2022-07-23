import { joinClassNames } from "@/lib/style-helper";
import React, { HTMLProps, VFC } from "react";

type ButtonVariant = "outline" | "solid";

export interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  variant?: ButtonVariant;
  rightIcon?: React.ReactNode;
}

const Button: VFC<ButtonProps> = ({
  variant = "solid",
  children,
  rightIcon,
  ...props
}) => {
  return (
    <button
      {...props}
      type="button"
      className={joinClassNames(
        "min-h-[40px] min-w-[48px] inline-flex items-center gap-2 px-3 justify-center text-gray-900 transition-colors duration-200  focus:outline-none focus:ring-3 focus:ring-primary-200 font-medium rounded-lg text-sm dark:text-white  dark:focus:ring-primary-700",
        bgColor(variant),
        border(variant)
      )}
    >
      {children}
      {rightIcon && rightIcon}
    </button>
  );
};

function border(variant: ButtonVariant) {
  switch (variant) {
    case "outline":
      return "border border-gray-300 dark:border-gray-600 dark:hover:border-gray-600";
    default:
      return "";
  }
}

function bgColor(variant: ButtonVariant) {
  const base = "dark:hover:bg-gray-700 hover:bg-gray-100";

  switch (variant) {
    case "solid":
      return base + "bg-white dark:bg-gray-800";
    default:
      return base;
  }
}

export default Button;
