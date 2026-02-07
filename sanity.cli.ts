import { defineCliConfig } from "sanity/cli";
import path from "path";

export default defineCliConfig({
  api: {
    projectId: process.env["NEXT_PUBLIC_SANITY_PROJECT_ID"] as string,
    dataset: process.env["NEXT_PUBLIC_SANITY_DATASET"] as string,
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
  },
});
