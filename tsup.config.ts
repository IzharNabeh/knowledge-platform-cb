import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      browser: "src/browser.ts"
    },
    format: ["esm", "cjs", "iife"],
    globalName: "ChatWidgetLibrary",
    clean: true,
    dts: true,
    sourcemap: true,
    minify: true,
    target: "es2020",
    outDir: "dist",
    outExtension({ format }) {
      if (format === "cjs") {
        return { js: ".cjs" };
      }

      if (format === "iife") {
        return { js: ".iife.js" };
      }

      return { js: ".js" };
    },
    esbuildOptions(options, context) {
      if (context.format === "iife") {
        options.globalName = "ChatWidget";
      }
    }
  }
]);
