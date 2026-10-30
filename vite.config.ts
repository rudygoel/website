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

/**
 * Dev only: serves the Vercel functions in api/*.ts at /api/* so `npm run dev`
 * runs pages and functions together. Each file's exported GET/POST gets a Web
 * Request and its Response is streamed back. Env comes from the shell.
 */
function apiRoutes(): Plugin {
  return {
    name: "rg-api-routes",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const name = req.url?.match(/^\/api\/([a-z0-9-]+)(?:\?|$)/)?.[1];
        if (!name) return next();
        try {
          const mod = await server.ssrLoadModule(`/api/${name}.ts`);
          const handler = mod[req.method || "GET"];
          if (typeof handler !== "function") {
            res.statusCode = 405;
            return res.end();
          }
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") headers.set(k, v);
          const request = new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers,
            body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks),
          });
          const response: Response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          if (!response.body) return res.end();
          const reader = response.body.getReader();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        } catch (e) {
          server.config.logger.error(`api/${name}: ${(e as Error).stack || e}`);
          res.statusCode = 500;
          res.end();
        }
      });
    },
  };
}

export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/website/" : "/",
  plugins: [
    rootAssets(),
    apiRoutes(),
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
        roast: path.resolve(__dirname, "roast/index.html"),
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
