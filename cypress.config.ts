import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173/nppf-raffle-display",
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
  },
});
