import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import istanbul from "vite-plugin-istanbul";
import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";

const execAsync = promisify(exec);

// Custom plugin to generate sample data during build
function generateSampleDataPlugin(): Plugin {
  return {
    name: 'generate-sample-data',
    buildStart: async () => {
      console.log(chalk.blue('Generating fresh sample data...'));
      try {
        const { stdout } = await execAsync('node generateSampleData.js');
        console.log(chalk.green(stdout));
      } catch (error) {
        console.error(chalk.red('Failed to generate sample data:'), error);
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: "/nppf-raffle-display",
  plugins: [
    react(),
    generateSampleDataPlugin(),
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
