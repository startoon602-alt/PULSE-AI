import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import storyRoutes from './server/story';
import voiceRoutes from './server/voice';
import subscriptionRoutes from './server/subscriptions';
import imageRoutes from './server/image';
import sfxRoutes from './server/sfx';
import subtitleRoutes from './server/subtitle';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  app.use(express.json());

  // API Routes - Mount BEFORE Vite middleware
  app.use('/api/story', storyRoutes);
  app.use('/api/voice', voiceRoutes);
  app.use('/api/subscriptions', subscriptionRoutes);
  app.use('/api/image', imageRoutes);
  app.use('/api/sfx', sfxRoutes);
  app.use('/api/subtitle', subtitleRoutes);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    
    // Use vite's connect instance as middleware
    app.use(vite.middlewares);

    // Root / and catch-all for SPA
    app.get('*', async (req, res, next) => {
      // If it's an API route that reached here, it means it doesn't exist
      if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }

      const url = req.originalUrl;
      try {
        let template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer();

