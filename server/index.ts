import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware للتعامل مع السجلات
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = createServer(app);
  await registerRoutes(app);

  // Middleware للتعامل مع الأخطاء
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // تكوين Vite للتنمية أو الملفات الثابتة للإنتاج
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    // تأكد من أن المسار يشير إلى مجلد البناء الصحيح
    const staticPath = path.join(__dirname, '../../dist');
    app.use(express.static(staticPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(staticPath, 'index.html'));
    });
  }

  const port = 5000;
  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`Server running on port ${port}`);
    log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
})();