import { joinClassNames } from "@/lib/style-helper";
import React, { forwardRef, HTMLProps } from "react";

export type ButtonVariant = "outline" | "solid";

export type ButtonAs = keyof Pick<JSX.IntrinsicElements, "a" | "button">;

export type ButtonProps<As extends ButtonAs> = HTMLProps<
  JSX.LibraryManagedAttributes<As, React.ComponentProps<As>>
> & {
  variant?: ButtonVariant;
  rightIcon?: React.ReactNode;
  as?: As;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps<"button">>(
  (
    {
      variant = "solid",
      children,
      rightIcon,
      as: TagName = "button",
      ...props
    },
    ref
  ) => {
    return (
      //@ts-ignore TODO: how to resolve warning
      <TagName
        {...props}
        {...(ref ? { ref: ref } : null)}
        className={joinClassNames(
          buttonBaseClassNames(variant),
          "min-h-[40px] min-w-[48px]"
        )}
      >
        {children}
        {rightIcon && <span className="w-4 h-4 text-base">{rightIcon}</span>}
      </TagName>
    );
  }
);

Button.displayName = "Button";

export function buttonBaseClassNames(variant: ButtonVariant) {
  const base: string[] = [
    "inline-flex items-center gap-2 px-3 justify-center text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-3 focus:ring-primary-200 font-medium rounded-lg text-sm dark:text-white  dark:focus:ring-primary-70",
  ];

  switch (variant) {
    case "outline":
      base.push(
        "border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-600 dark:hover:bg-gray-800"
      );
      break;
    case "solid":
      base.push(
        "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
      );
      break;
  }

  return joinClassNames(...base);
}

export default Button;
