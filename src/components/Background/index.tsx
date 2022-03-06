import { useMediaQuery, useTheme } from "@chakra-ui/react";
import React, { useMemo, VFC } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";

interface BackgroundProps {
  icons: React.FunctionComponent[];
}

const iconSize = 30;
const gridPadding = 10;

const Background: VFC<BackgroundProps> = ({ icons }) => {
  const { height, width } = useWindowSize();
  const theme = useTheme();
  const [isMedium, isLarge] = useMediaQuery([
    `(min-width: ${theme.breakpoints.md})`,
    `(min-width: ${theme.breakpoints.lg})`,
  ]);

  const shuffledIcons = useMemo(() => shuffle(icons), [icons]);

  if (!height || !width) {
    return null;
  }

  const numberOfColumns = !isLarge && !isMedium ? 4 : 5;
  const numberOfRows = Math.ceil(icons.length / numberOfColumns);

  const windowSize = isLarge ? "lg" : isMedium ? "md" : "base";
  const responsivePadding = calculatePadding(gridPadding, windowSize);
  const responsiveIconSize = calculateIconSize(iconSize, windowSize);

  return (
    <div>
      <style jsx>
        {`
          .container {
            position: fixed;
            inset: 0;
          }

          .icon {
            position: fixed;
            width: ${responsiveIconSize}px;
            height: ${responsiveIconSize}px;
            opacity: 0.15;
            z-index: -1;
          }
        `}
      </style>
      {shuffledIcons.map((icon, i) => {
        const column = (i % numberOfColumns) + 1;
        const row = Math.ceil((i + 1) / numberOfColumns);

        const minLeft =
          Math.floor((width / numberOfColumns) * (column - 1)) +
          responsivePadding;
        const maxLeft =
          Math.floor((width / numberOfColumns) * column) -
          responsivePadding -
          responsiveIconSize;
        const minTop =
          Math.floor((height / numberOfRows) * (row - 1)) + responsivePadding;
        const maxTop =
          Math.floor((height / numberOfRows) * row) -
          responsivePadding -
          responsiveIconSize;

        return (
          <div
            key={i}
            className="icon"
            style={{
              left: getRandomNumber(minLeft, maxLeft),
              top: getRandomNumber(minTop, maxTop),
              transform: `rotate(${getRandomNumber(-30, 30)}deg)`,
            }}
          >
            {React.createElement(icon)}
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

function calculatePadding(basePadding: number, size: "base" | "md" | "lg") {
  switch (size) {
    case "base":
      return basePadding;
    case "md":
      return basePadding * 1.5;
    case "lg":
      return basePadding * 2;
  }
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export default Background;
