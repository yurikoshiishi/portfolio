import { VFC } from "react";

interface ChevronDownIconProps {}

const ChevronDownIcon: VFC<ChevronDownIconProps> = ({ ...props }) => {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
      ></path>
    </svg>
  );
};

export default ChevronDownIcon;
