import { defineConfig, type Plugin } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";
import sirv from "sirv";
import react from "@vitejs/plugin-react";

/**
 * Serves the root-level /assets directory at /assets/* in dev,
 * and copies it into dist/assets/ on build. Keeps /public/ for OG,
 * favicon, robots, sitemap.
 */
function rootAssets(): Plugin {
  const assetsDir = path.resolve(__dirname, "assets");

  return {
    name: "rg-root-assets",
    apply: () => true,
    configureServer(server) {
      server.middlewares.use("/assets", sirv(assetsDir, { dev: true, etag: true }));
    },
    configurePreviewServer(server) {
      server.middlewares.use("/assets", sirv(assetsDir, { etag: true }));
    },
    async closeBundle() {
      const outDir = path.resolve(__dirname, "dist", "assets");
      await copyDir(assetsDir, outDir);
    },
  };
}

async function copyDir(src: string, dest: string): Promise<void> {
  let entries;
  try {
    entries = await fs.readdir(src, { withFileTypes: true });
  } catch {
    return; // src doesn't exist — nothing to copy
  }
  await fs.mkdir(dest, { recursive: true });
  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(s, d);
    } else {
      await fs.copyFile(s, d);
    }
  }
}

export default defineConfig({
  plugins: [rootAssets(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2022",
    assetsDir: "_app",
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["gsap"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
});
