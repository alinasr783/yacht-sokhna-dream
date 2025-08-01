import { createServer as createViteServer } from "vite";
import express from "express";
import fs from "fs";
import path from "path";
import { Server } from "http";
import { nanoid } from "nanoid";

export async function setupVite(app: express.Express, server: Server) {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: {
        server: server,
        port: 24678
      }
    },
    appType: 'spa',
    root: path.resolve(__dirname, '../../client'),
    base: '/'
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const templatePath = path.resolve(__dirname, '../../client/index.html');
      let template = await fs.promises.readFile(templatePath, 'utf-8');

      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const transformed = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(transformed);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
