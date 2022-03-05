import { useEffect, useState } from "react";
import FontFaceObserver from "fontfaceobserver";

export function useFontLoaded(fontFamilyNames: string[], timeout = 3000) {
  const [loadedCount, setLoadedCount] = useState<number>(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoadedCount(fontFamilyNames.length);
    }, timeout);

    try {
      fontFamilyNames.forEach((fontFamilyName) => {
        const observer = new FontFaceObserver(fontFamilyName);

        observer.load().then(() => {
          setLoadedCount((prevCount) => {
            const nextCount = prevCount + 1;

            if (nextCount === fontFamilyNames.length) {
              clearTimeout(timeoutId);
            }

            return nextCount;
          });
        });
      });
    } catch (error) {
      setLoadedCount(fontFamilyNames.length);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [fontFamilyNames, timeout]);

  return loadedCount === fontFamilyNames.length;
}
