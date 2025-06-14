import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mochaPlugins } from "@getmocha/vite-plugins";

// ...existing code...
declare module '@getmocha/vite-plugins';
// ...existing code...
export default defineConfig({
  plugins: [
    ...mochaPlugins({}),
    react(),
  ],
  server: {
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
});
// ...existing code...
// ...existing code...


