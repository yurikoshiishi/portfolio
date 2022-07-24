import { VFC } from "react";

interface MoonIconProps {}

const MoonIcon: VFC<MoonIconProps> = ({}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
      <path
        d="M24.86,15.53a.5.5,0,0,0-.57,0A10.71,10.71,0,0,1,9.57.79.5.5,0,0,0,9,0,12.77,12.77,0,1,0,25,16,.5.5,0,0,0,24.86,15.53Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default MoonIcon;
