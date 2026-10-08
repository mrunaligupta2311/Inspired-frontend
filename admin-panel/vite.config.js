
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "/admin/",
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@institute-assets": fileURLToPath(
        new URL(
          "../frontend/src/assets",
          import.meta.url
        )
      ),
    },
  },

  server: {
    fs: {
      allow: [
        "..",
      ],
    },
  },
});
