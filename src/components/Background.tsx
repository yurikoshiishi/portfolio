import TechIconSprite from "@/components/icons/TechIconSprite";
import { breakpoints } from "@/theme";
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
            <style jsx global>
              {`
                #bg-container .bg-icon-${i} {
                  transform: rotate(${getRandomNumber(-30, 30)}deg)
                    translate(
                      ${getRandomNumber(-100, 100)}%,
                      ${getRandomNumber(-100, 100)}%
                    );
                }

                @media (min-width: ${breakpoints.md}) {
                  #bg-container .bg-icon-${i} {
                    transform: rotate(${getRandomNumber(-37.5, 37.5)}deg)
                      translate(
                        ${getRandomNumber(-125, 125)}%,
                        ${getRandomNumber(-125, 125)}%
                      );
                  }
                }
                @media (min-width: ${breakpoints.lg}) {
                  #bg-container .bg-icon-${i} {
                    transform: rotate(${getRandomNumber(-45, 45)}deg)
                      translate(
                        ${getRandomNumber(-150, 150)}%,
                        ${getRandomNumber(-150, 150)}%
                      );
                  }
                }
              `}
            </style>
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

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export default React.memo(Background);
