import TechIconSprite from "@/components/icons/TechIconSprite";
import React, { VFC } from "react";

interface BackgroundProps {
  iconNames: string[];
}

const Background: VFC<BackgroundProps> = ({ iconNames }) => {
  return (
    <div id="bg-container" className="fixed inset-0 flex flex-wrap z-[-1]">
      <TechIconSprite />
      {iconNames.map((name, i) => {
        return (
          <div
            className="w-1/4 md:w-1/5 h-1/5 md:h-1/4 flex items-center justify-center"
            key={i}
          >
            <svg
              className={`bg-icon-${i} w-[30px] h-[30px] md:w-[37.5px] md:h-[37.5px] lg:w-[45px] lg:h-[45px] opacity-10`}
            >
              <use xlinkHref={`#${name}`}></use>
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(Background);
