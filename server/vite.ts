import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  try {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server,
          port: 24678, // تأكد من أن هذا المنفذ متاح
        },
      },
      appType: 'spa',
      root: path.resolve(__dirname, '../../client'), // المسار الصحيح لمجلد العميل
      base: '/',
      logLevel: 'info',
      customLogger: viteLogger
    });

    // استخدم middleware Vite
    app.use(vite.middlewares);

    // تعامل مع جميع الطلبات الأخرى
    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const templatePath = path.resolve(__dirname, '../../client/index.html');

        let template = await fs.promises.readFile(templatePath, 'utf-8');

        // حقن علامة إصدار فريدة لمنع التخزين المؤقت
        template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`
        );

        // تحويل HTML باستخدام Vite
        const transformed = await vite.transformIndexHtml(url, template);

        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformed);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });

    log('Vite development server configured successfully');
  } catch (err) {
    log(`Failed to setup Vite: ${err.message}`, 'error');
    process.exit(1);
  }
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, '../../dist'); // المسار الصحيح لمجلد البناء

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find build directory at: ${distPath}\n` +
      'Please run "npm run build" in the client directory first.'
    );
  }

  // تقديم الملفات الثابتة
  app.use(express.static(distPath));

  // التعامل مع تطبيق SPA (إعادة توجيه جميع الطلبات إلى index.html)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  log(`Serving static files from: ${distPath}`);
}