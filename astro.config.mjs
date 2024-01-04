import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import lit from '@astrojs/lit';
import robotsTxt from "astro-robots-txt";

export default defineConfig({
  site: 'https://rickbutterfield.dev',
  integrations: [mdx(), sitemap(), robotsTxt(), lit()],
  prefetch: true
});