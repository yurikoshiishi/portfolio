import "@fontsource/montserrat";
import "@fontsource/noto-sans-jp";
import "react-typist/dist/Typist.css";
import "../styles/index.css";

import { ColorModeProvider } from "@/contexts/color-mode";
import { LanguageProvider } from "@/contexts/language";

function App({ Component, pageProps }: any) {
  return (
    <LanguageProvider>
      <ColorModeProvider>
        <Component {...pageProps} />
      </ColorModeProvider>
    </LanguageProvider>
  );
}

export default App;
