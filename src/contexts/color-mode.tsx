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

class Storage<T extends string> {
  key: string;
  validator: (data: any) => data is T;
  constructor(key: string, validator: (data: any) => data is T) {
    this.key = key;
    this.validator = validator;
  }

  set(data: T) {
    try {
      localStorage.setItem(this.key, data);
    } catch (error) {}
  }

  get(): T | null {
    try {
      const text = localStorage.getItem(this.key);

      if (!text) {
        return null;
      }

      if (this.validator(text)) {
        return text;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}

const colorModeStorage = new Storage<ColorMode>(
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
