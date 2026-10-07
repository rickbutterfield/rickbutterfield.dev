import { defineConfig } from 'astro/config';
import { stat } from 'node:fs/promises';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import robotsTxt from "astro-robots-txt";
import serviceWorker from "astrojs-service-worker";
import expressiveCode from 'astro-expressive-code';
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerMetaHighlight
} from '@shikijs/transformers'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// Dev only: lets a local Umbraco webhook (Content Published/Unpublished/Deleted)
// POST to http://localhost:4321/_refresh-content to reload the content collections
const DATA_STORE_FILE = new URL('./.astro/data-store.json', import.meta.url);
const DATA_STORE_MODULE = '\0astro:data-layer-content';

const lastModified = () => stat(DATA_STORE_FILE).then((file) => file.mtimeMs, () => 0);

const umbracoContentRefresh = () => ({
  name: 'umbraco-content-refresh',
  hooks: {
    'astro:server:setup': ({ server, refreshContent, logger }) => {
      server.middlewares.use('/_refresh-content', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end();
        }
        try {
          const before = await lastModified();
          await refreshContent?.({ context: { source: 'umbraco-webhook' } });

          // Astro saves the data store on a short debounce; wait (up to 5s) for the new file
          for (let i = 0; i < 50 && (await lastModified()) === before; i++) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          // With the Cloudflare adapter, pages render in workerd. Astro only invalidates the content
          // module in its own `ssr` environment, so invalidate it everywhere and tell the server
          // environments to reload, which makes workerd's module runner fetch it again.
          for (const environment of Object.values(server.environments)) {
            const module = environment.moduleGraph.getModuleById(DATA_STORE_MODULE);
            if (module) environment.moduleGraph.invalidateModule(module);
            if (environment.name !== 'client') environment.hot.send({ type: 'full-reload' });
          }

          logger.info('Content refreshed from Umbraco');
          res.statusCode = 200;
          res.end('ok');
        } catch (err) {
          logger.error(`Content refresh failed: ${err}`);
          res.statusCode = 500;
          res.end('error');
        }
      });
    }
  }
});

// Chunks that are only loaded on demand (dynamic import()), such as Mermaid's ~5 MB of diagram code in
// scripts/mermaid.ts. The service worker leaves these out of its precache, so a first visit only
// downloads the scripts pages load straight away; on-demand chunks are cached when they're used.
const lazyChunks = new Set();

const trackLazyChunks = () => ({
  name: 'track-lazy-chunks',
  apply: 'build',
  generateBundle(_, bundle) {
    const chunks = Object.values(bundle).filter((output) => output.type === 'chunk');
    const byFileName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
    const eager = new Set();
    const visit = (fileName) => {
      if (eager.has(fileName)) return;
      eager.add(fileName);
      byFileName.get(fileName)?.imports.forEach(visit);
    };
    chunks.filter((chunk) => chunk.isEntry).forEach((chunk) => visit(chunk.fileName));
    for (const chunk of chunks) {
      if (!eager.has(chunk.fileName)) lazyChunks.add(chunk.fileName);
    }
  },
});

// https://astro.build/config
export default defineConfig({
 site: process.env.NODE_ENV === 'production' 
    ? 'https://rickbutterfield.dev' 
    : 'http://localhost:4321',
  integrations: [
    expressiveCode({
      theme: 'github-dark',
      styleOverrides: {
        borderRadius: '0.5rem',
        codeFontFamily: 'var(--font-stack-mono)',
      },
      shiki: {
        transformers: [
          // transformerNotationDiff(),
          // transformerNotationFocus(),
          // transformerMetaHighlight(),
        ]
      }
    }),
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // Higher priority for main pages
        if (item.url.endsWith('/') || item.url.endsWith('/blog/') || item.url.endsWith('/projects/') || item.url.endsWith('/speaking/')) {
          item.priority = 0.9;
        }
        // Blog posts get moderate priority
        if (item.url.includes('/blog/') && !item.url.endsWith('/blog/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        }
        return item;
      }
    }),
    robotsTxt(),
    // lit() removed: no Lit components are used, and its server renderer touches `document`,
    // which crashes the Worker that serves server islands. Re-add with care if Lit islands return.
    // Precache only pages, styles and scripts so a first visit doesn't download every image
    // and font; images and fonts are cached as they're used. The patterns also keep out
    // _headers and _redirects, which Workers never serves: one 404 here fails the install.
    serviceWorker({
      workbox: {
        globPatterns: ['**/*.{html,css,js,json}'],
        manifestTransforms: [
          async (entries) => ({
            manifest: entries.filter((entry) => !lazyChunks.has(entry.url.replace(/^\//, ''))),
            warnings: [],
          }),
        ],
        runtimeCaching: [
          {
            // On-demand chunks left out of the precache (see lazyChunks above)
            urlPattern: ({ request, url }) => request.destination === 'script' && url.pathname.startsWith('/_astro/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'scripts',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    }),
    umbracoContentRefresh()
  ],
  // Pages stay prerendered; the adapter only serves server islands (the /now activity cards)
  adapter: cloudflare({
    // Keep optimising images at build time, as before the adapter
    imageService: 'compile',
    // The build relies on Node (Sharp, astro-og-canvas, NODE_TLS_REJECT_UNAUTHORIZED above)
    prerenderEnvironment: 'node',
  }),
  // No sessions are used; without this the adapter adds a SESSION KV binding to the Worker
  session: false,
  vite: {
    plugins: [trackLazyChunks()],
  },
  prefetch: true,
  image: {
    domains: ["api.rickbutterfield.dev"],
    // Required to rasterize favicon.svg into the PNG favicons/manifest icons
    dangerouslyProcessSVG: true
  },
  trailingSlash: 'ignore',
  devToolbar: {
    enabled: false
  },
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
      transformers: [
        transformerNotationDiff(),
        transformerNotationFocus(),
        transformerMetaHighlight(),
      ],
    },
  },
  redirects: {
    "/umbraco": {
      status: 301,
      destination: process.env.NODE_ENV === 'production' ? "https://api.rickbutterfield.dev/umbraco" : 'https://localhost:44389/umbraco',
    }
  },
  server: {
    headers: {
      'Timing-Allow-Origin': '*'
    }
  }
});