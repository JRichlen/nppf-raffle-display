import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import istanbul from "vite-plugin-istanbul";
import "chalk";

// https://vite.dev/config/
export default defineConfig({
  base: "/nppf-raffle-display",
  plugins: [
    react(),
    istanbul({
      include: "src/*",
      exclude: ["node_modules", "test/"],
      cypress: true,
    }),
  ],
  server: {
    watch: {
      ignored: ["**/cypress/**", "**/coverage/**", "**/dist/**"],
    },
  },
});
