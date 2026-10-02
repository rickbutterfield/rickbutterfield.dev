# CLAUDE.md — rickbutterfield.dev (Astro frontend)

The public-facing personal site at https://rickbutterfield.dev. It is the **frontend half** of a headless setup: this Astro app renders content sourced at build time from a separate Umbraco Cloud instance (the `rick-butterfield` repo) via the Umbraco **Delivery API**.

## 1. Architecture

- **Runtime:** Node `>=22.12.0` (`.nvmrc` pins `22.22.0`; Astro's `unifont` → `undici@8` needs Node `>=22.19.0`). ESM only (`"type": "module"`).
- **Framework:** Astro 6 (`astro.config.mjs`). TypeScript, extends `astro/tsconfigs/base`.
- **Rendering:** Static site generation. Content is fetched from the headless Umbraco Delivery API during `astro build` — there is no runtime database call from this app. No SSR adapter is installed; the production output is static (`dist/`).
- **Web components:** Lit (`@astrojs/lit`) for any client-side islands.
- **Styling:** SCSS using an ITCSS layering convention under `src/styles/` (`02-settings`, `03-generic`, `04-base`, `05-objects`, `06-components`, `08-trumps`), entry `src/styles/style.scss`.
- **Path alias:** `@/*` → `src/*` (see `tsconfig.json`).

### Content pipeline (the most important concept)

`src/content.config.ts` defines Astro content collections whose `loader`s call the generated Umbraco Delivery API client (`ContentService.queryV20`) and map responses into typed entries. Collections: `blog`, `projects`, `speaking`, `homePage`, `blogsPage`, `projectsPage`, `speakingPage`, `contentPages`, `navigation`. Each filters by Umbraco `contentType` and uses `expand`/`sort`/`fetch` query params.

- The API client base URL comes from the `PUBLIC_BASE_URL` env var (`client.setConfig({ baseUrl: ... })`).
- `navigation` is special: it first queries the `homePage` to get its id, then fetches `children:<id>` to build the nav.

> ⚠️ There is also a legacy `src/content/config.ts` and Markdown files under `src/content/blog/` and `src/content/speaking/`. The **active** config is `src/content.config.ts` (Astro's current convention, repo root of `src/`), which loads from the API. Treat the `src/content/*.md` files and `src/content/config.ts` as legacy unless you confirm otherwise before editing.

### Project structure

```
src/
├── api/                 # GENERATED Umbraco Delivery API client — do not hand-edit
│   ├── client.gen.ts    #   (regenerate with `npm run generate`)
│   ├── sdk.gen.ts        #   ContentService etc.
│   ├── types.gen.ts      #   *ContentModel types
│   └── index.ts
├── components/          # .astro components; blocks/ = Umbraco block grid components
├── content.config.ts   # ACTIVE content collections (load from Delivery API)
├── content/            # legacy markdown + legacy config.ts
├── layouts/            # Layout.astro
├── pages/              # routes — see below
├── scripts/            # readingTime.ts, site.ts
├── styles/             # ITCSS-layered SCSS
├── consts.ts           # SITE_TITLE / SITE_DESCRIPTION
└── middleware.ts       # sets Timing-Allow-Origin header
```

### Routes (`src/pages/`)

- `index.astro` — home, `[slug].astro` — top-level content pages
- `blog/[...page].astro` — paginated blog list, `blog/[slug].astro` — post
- `projects/index.astro`, `speaking/index.astro`
- `og/[...route].ts` — dynamic OG images (`astro-og-canvas`)
- `feed.xml.ts` — RSS (`@astrojs/rss`), `manifest.json.ts` — PWA manifest

## 2. Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server with `--host` (LAN-accessible) |
| `npm start` | Dev server (no `--host`) |
| `npm run build` | Build to `dist/` (fetches content from the Delivery API) |
| `npm run preview` | Preview the production build |
| `npm run generate` | **Regenerate the API client** from the Delivery API OpenAPI spec |
| `npm run astro -- <cmd>` | Astro CLI (`astro add`, `astro check`, …) |

**API client generation** (`openapi-ts.config.ts`): input is the live Delivery API swagger at `http://localhost:20625/umbraco/swagger/delivery/swagger.json`. The local Umbraco backend (`rick-butterfield` repo) **must be running** on that port before `npm run generate`. Output lands in `src/api/`. Plugins: `@hey-api/client-fetch` (with `throwOnError: true`), typescript (enums), sdk (`asClass`, `ContentService`-style names, `responseStyle: "fields"`).

## 3. Build-time integration gotchas

- `astro.config.mjs` sets `process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0` so build-time fetches against the local Umbraco HTTPS dev cert don't fail. This is intentional for local dev — be aware it disables TLS verification for the build process.
- `image.domains` is `["api.rickbutterfield.dev"]` — remote Umbraco media must be served from that host for Astro's image optimization to accept it.
- `redirects["/umbraco"]` 301s to the backoffice: prod → `https://api.rickbutterfield.dev/umbraco`, dev → `https://localhost:44389/umbraco`.
- `site` is `https://rickbutterfield.dev` in production, `http://localhost:4321` otherwise (drives sitemap/canonical URLs).

## 4. Environment variables

Defined in `.env.local` locally (note: currently tracked in git, not gitignored) and as Workers Builds variables in production (see §7). Public (client-exposed) vars use the `PUBLIC_` prefix per Astro convention.

- `PUBLIC_BASE_URL` — base URL of the Umbraco Delivery API; consumed in `content.config.ts` to configure the API client.
- `PUBLIC_BASE_URL_HTTPS` — HTTPS base URL used to build absolute media/image URLs in pages and block components (`index.astro`, `feed.xml.ts`, `projects`/`speaking` index pages, `ImageGallery`/`ImageWithCaption`).

## 5. Integrations (astro.config.mjs)

`expressiveCode` + Shiki (`github-dark` theme, mono font var) for code blocks; `mdx`; `sitemap` (custom `serialize`: main pages priority 0.9, blog posts 0.8/monthly); `astro-robots-txt`; `lit`; `astrojs-service-worker`. Markdown also configured with Shiki transformers (notation diff/focus/meta highlight). `prefetch: true`, `trailingSlash: 'ignore'`, dev toolbar disabled.

## 6. Conventions & gotchas

- **Never hand-edit `src/api/*.gen.ts`** — regenerate via `npm run generate`.
- Collection schemas use `z.any() as ZodType<...ContentModel>` to keep the rich Umbraco model typed without re-declaring every field. The real shape comes from `types.gen.ts`.
- Block components in `src/components/blocks/` mirror the Umbraco block grid component types (`RichText`, `ImageGallery`, `ImageWithCaption`, `YouTubeVideo`, `EmploymentHistory`, `UpdateAlert`) — they correspond to the `.cshtml` partials in the Umbraco repo.
- `middleware.ts` only sets a `Timing-Allow-Origin` header (also set in `server.headers`) for performance-measurement CORS.

## 7. Deployment (Cloudflare Workers)

The site is an assets-only Cloudflare **Worker** named `rickbutterfield` (`wrangler.jsonc`, `assets.directory: ./dist`), built by **Workers Builds** from this repo. `rickbutterfield.dev` and `www.rickbutterfield.dev` are Worker custom domains. It moved off Cloudflare Pages on 01-10-2026; the old `rickbutterfield-dev` Pages project is disconnected from Git and kept only as a rollback until it is deleted.

Build settings live in the Cloudflare dashboard, not the repo (Worker → Settings → Build). Both triggers ("Deploy default branch" → `npx wrangler deploy`, "Deploy non-production branches" → `npx wrangler versions upload`) use:

- **Build variables:** `PUBLIC_BASE_URL` and `PUBLIC_BASE_URL_HTTPS` = `https://api.rickbutterfield.dev` (**no trailing slash**, or media URLs become `//media/...`), and `SKIP_DEPENDENCY_INSTALL=1`.
- **Build command:**
  ```
  (mv node_modules/.astro /tmp/astro-cache 2>/dev/null || true) && npm ci --no-audit --no-fund && (mv /tmp/astro-cache node_modules/.astro 2>/dev/null || true) && npm run build
  ```
  Workers Builds restores Astro's cache (`node_modules/.astro`) *before* its automatic `npm clean-install`, which wipes `node_modules` and with it every optimised image. Skipping the automatic install and moving the cache aside around `npm ci` keeps it, which took builds from ~91 s to ~44 s.

Other deploy facts:

- **Node** comes from `.nvmrc` (no `NODE_VERSION` variable on the Worker). Keep it at `>=22.19.0` for `undici@8`.
- **Wrangler** is a dev dependency so the deploy step doesn't download it every build.
- **Umbraco publish → rebuild:** a Workers Builds deploy hook ("Umbraco publish", branch `main`) is configured as a webhook in the Umbraco Cloud backoffice (Settings → Webhooks). Treat the hook URL as a secret; it is not stored in this repo.
- **Headers** come from `public/_headers` (Workers static assets supports it like Pages did). Unknown URLs return a real 404; Pages used to serve the home page with a 200.

## Quick Reference

- **Dev:** `npm run dev` → http://localhost:4321
- **Build:** `npm run build` (requires the Delivery API reachable at `PUBLIC_BASE_URL`)
- **Regenerate API types:** start the Umbraco backend, then `npm run generate`
- **Key files:** `astro.config.mjs`, `src/content.config.ts`, `src/api/`, `openapi-ts.config.ts`, `.env.local`
- **Backend repo:** `../rick-butterfield` (Umbraco Cloud — supplies all content)

