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
    // Workers static assets reads _headers and _redirects as config and never serves them,
    // and one 404 in the precache list makes the service worker fail to install
    serviceWorker({
      workbox: {
        globIgnores: ['_headers', '_redirects']
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