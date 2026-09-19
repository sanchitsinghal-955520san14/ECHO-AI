import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "embed.ts"),
      name: "RelayWidget",
      fileName: "widget",
      formats: ["iife"],
    },
    rolldownOptions: {
      output: {
        extend: true,
      },
    },
  },

  server: {
    port: 3002,
    open: "/demo.html",
  },
});
