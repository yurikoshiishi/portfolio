import "@fontsource/montserrat";
import "@fontsource/noto-sans-jp";
import "react-typist/dist/Typist.css";
import "../styles/index.css";

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme";

function App({ children }: any) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

export default App;
