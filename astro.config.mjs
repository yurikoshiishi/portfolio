import react from "@astrojs/react"; // eslint-disable-next-line import/no-anonymous-default-export

import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
});
