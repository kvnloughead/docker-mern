import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // base is necessary for deployment to gh pages.
  // The canonical isn't deployed.
  base: "/",
  plugins: [react()],
  server: {
    port: 3000,
  },
});
