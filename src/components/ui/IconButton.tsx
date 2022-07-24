import { buttonBaseClassNames, ButtonProps } from "@/components/ui/Button";
import { joinClassNames } from "@/lib/style-helper";
import { VFC } from "react";

export interface IconButtonProps
  extends Omit<ButtonProps<"button">, "rightIcon"> {}

const IconButton: VFC<IconButtonProps> = ({
  variant = "solid",
  as: TagName = "button",
  children,
  ...props
}) => {
  return (
    //@ts-ignore TODO: how to resolve warning
    <TagName
      {...props}
      className={joinClassNames(
        buttonBaseClassNames(variant),
        "min-h-[48px] min-w-[48px]"
      )}
    >
      <span key="IconButton-icon" className="text-[24px] w-6 h-6">
        {children}
      </span>
    </TagName>
  );
};

export default IconButton;
