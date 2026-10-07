import { defineConfig, type Plugin } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";
import sirv from "sirv";
import react from "@vitejs/plugin-react";
import { portfolioPages } from "./scripts/portfolio-pages";

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
  base: process.env.GITHUB_PAGES ? "/website/" : "/",
  plugins: [
    rootAssets(),
    react(),
    portfolioPages([
      { slug: "anti-resume", pdf: "public/portfolio/rudy-goel-anti-resume.pdf", title: "Rudy Goel, anti-resume", blend: "#FAF7F1" },
      { slug: "results", pdf: "public/portfolio/rudy-goel-results.pdf", title: "Rudy Goel, creative strategy results" },
    ]),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2022",
    assetsDir: "_app",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        portfolio: path.resolve(__dirname, "portfolio/index.html"),
        "portfolio-anti-resume": path.resolve(__dirname, "portfolio/anti-resume/index.html"),
        "portfolio-results": path.resolve(__dirname, "portfolio/results/index.html"),
      },
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
