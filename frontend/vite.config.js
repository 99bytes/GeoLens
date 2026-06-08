import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite + React config. The dev server runs on port 5173 by default.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
