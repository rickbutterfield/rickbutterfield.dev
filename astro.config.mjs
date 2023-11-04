import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import lit from '@astrojs/lit'

// https://astro.build/config

// https://astro.build/config
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  site: 'https://rickbutterfield.dev',
  integrations: [mdx(), sitemap(), prefetch(), robotsTxt(), lit()]
});