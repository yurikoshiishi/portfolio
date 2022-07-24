import { StringStorage } from "@/lib/local-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type ColorMode = "light" | "dark";

export const colorModeStorageKey = "yk-color-mode";

type ColorModeValue = {
  colorMode: ColorMode;
  toggleColorMode: () => void;
};

const ColorModeContext = createContext<ColorModeValue>({
  colorMode: "light",
  toggleColorMode: () => {},
});

const colorModeStorage = new StringStorage<ColorMode>(
  colorModeStorageKey,
  isValidColorMode
);

function isValidColorMode(color: any): color is ColorMode {
  if (!color) {
    return false;
  }
  return ["dark", "light"].includes(color);
}

export const ColorModeProvider: React.FC = ({ children }) => {
  const [colorMode, setColorMode] = useState<ColorMode>("light");

  useEffect(() => {
    if (!window.localStorage) {
      return;
    }

    const data = colorModeStorage.get();

    if (!data) {
      const color = window?.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      setAndStoreColorMode(color);
      return;
    }

    setColorMode(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorMode);
  }, [colorMode]);

  const setAndStoreColorMode = (color: ColorMode) => {
    setColorMode(color);
    colorModeStorage.set(color);
  };

  const toggleColorMode = () => {
    const next = colorMode === "dark" ? "light" : "dark";
    setAndStoreColorMode(next);
  };

  return (
    <ColorModeContext.Provider
      value={{
        colorMode,
        toggleColorMode,
      }}
    >
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);
