import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import lit from '@astrojs/lit';
import robotsTxt from "astro-robots-txt";
import serviceWorker from "astrojs-service-worker";
import expressiveCode from 'astro-expressive-code';
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerMetaHighlight
} from '@shikijs/transformers'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

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
    lit(),
    serviceWorker()
  ],
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