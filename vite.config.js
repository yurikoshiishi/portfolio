import { createRequire } from "module";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
const require = createRequire(import.meta.url);

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
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
        assetFileNames: "[name].[ext]",
        entryFileNames: "[name].js",
      },
    },
    target: "es2020",
  },
});
