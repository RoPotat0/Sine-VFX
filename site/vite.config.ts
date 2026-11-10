import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// config.js is the one file you edit for links and numbers. The landing page
// bundles it (so a change ships with a new hashed filename), and this plugin
// also publishes it as /config.js for the plain connect/callback pages.
const CONFIG_FILE = fileURLToPath(new URL("./config.js", import.meta.url));

function publishConfig(): Plugin {
  return {
    name: "svfx-publish-config",
    configureServer(server) {
      server.middlewares.use("/config.js", (_req, res) => {
        res.setHeader("Content-Type", "text/javascript");
        res.end(readFileSync(CONFIG_FILE));
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "config.js", source: readFileSync(CONFIG_FILE, "utf8") });
    },
  };
}

export default defineConfig({
  plugins: [react(), publishConfig()],
  build: {
    // Every JS, CSS and imported image lands in /assets with a content hash in
    // its name, so it can be cached forever (see public/sw.js).
    assetsDir: "assets",
    target: "es2020",
  },
});
