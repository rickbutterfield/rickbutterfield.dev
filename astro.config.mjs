import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import lit from '@astrojs/lit';
import robotsTxt from "astro-robots-txt";
import tailwind from "@astrojs/tailwind";
import serviceWorker from "astrojs-service-worker";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// https://astro.build/config
export default defineConfig({
  site: 'https://rickbutterfield.dev',
  integrations: [mdx(), sitemap(), robotsTxt(), lit(), tailwind(), serviceWorker()],
  prefetch: true,
  image: {
    domains: ["api.rickbutterfield.dev"]
  },
  trailingSlash: 'never'
});