import { useMediaQuery, useTheme } from "@chakra-ui/react";
import React, { useMemo, VFC } from "react";

interface BackgroundProps {
  icons: React.FunctionComponent[];
}

const iconSize = 30;
const translate = 100;

const Background: VFC<BackgroundProps> = ({ icons }) => {
  const theme = useTheme();
  const [isMedium, isLarge] = useMediaQuery([
    `(min-width: ${theme.breakpoints.md})`,
    `(min-width: ${theme.breakpoints.lg})`,
  ]);

  const shuffledIcons = useMemo(() => shuffle(icons), [icons]);

  const numberOfColumns = !isLarge && !isMedium ? 4 : 5;
  const numberOfRows = Math.ceil(icons.length / numberOfColumns);

  const windowSize = isLarge ? "lg" : isMedium ? "md" : "base";
  const responsiveIconSize = calculateIconSize(iconSize, windowSize);
  const responsiveTranslate = calculateTranslate(translate, windowSize);

  return (
    <div className="bg-container">
      <style jsx>
        {`
          .bg-container {
            position: fixed;
            inset: 0;
            display: flex;
            flex-wrap: wrap;
            z-index: -1;
            width: 100%;
          }

          .grid-item {
            width: calc(100% / ${numberOfColumns});
            height: calc(100% / ${numberOfRows});
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .icon {
            width: ${responsiveIconSize}px;
            height: ${responsiveIconSize}px;
            opacity: 0.15;
          }
        `}
      </style>
      {shuffledIcons.map((icon, i) => {
        return (
          <div className="grid-item" key={i}>
            <div
              className="icon"
              style={{
                transform: `rotate(${getRandomNumber(
                  -30,
                  30
                )}deg) translate(${getRandomNumber(
                  -responsiveTranslate,
                  responsiveTranslate
                )}%, ${getRandomNumber(
                  -responsiveTranslate,
                  responsiveTranslate
                )}%)`,
              }}
            >
              {React.createElement(icon)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function calculateIconSize(baseSize: number, size: "base" | "md" | "lg") {
  switch (size) {
    case "base":
      return baseSize;
    case "md":
      return baseSize * 1.25;
    case "lg":
      return baseSize * 1.5;
  }
}

function calculateTranslate(base: number, size: "base" | "md" | "lg") {
  switch (size) {
    case "base":
      return base;
    case "md":
      return base * 1.25;
    case "lg":
      return base * 1.5;
  }
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export default Background;
