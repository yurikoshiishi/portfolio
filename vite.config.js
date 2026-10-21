import { createRequire } from "module";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    host: true, // This makes the server accessible on your network
  },
  plugins: [
    createHtmlPlugin({
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
  ],
  css: {
    minify: true,
    postcss: {
      plugins: [
        require("cssnano")({
          preset: [
            "default",
            {
              discardComments: {
                removeAll: true,
              },
              normalizeWhitespace: true,
              minifySelectors: true,
              minifyParams: true,
              normalizeTimingFunctions: false,
            },
          ],
        }),
      ],
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      /* the film, and the flat card it falls back to */
      input: {
        main: resolve(__dirname, "index.html"),
        card: resolve(__dirname, "card.html"),
      },
      output: {
        assetFileNames: "[name].[ext]",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
    },
    target: "es2020",
  },
  worker: {
    format: "es",
  },
});
