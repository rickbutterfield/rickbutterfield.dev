# rickbutterfield.dev

The frontend of my personal site, [rickbutterfield.dev](https://rickbutterfield.dev). It's built with [Astro](https://astro.build), and every page comes from a headless [Umbraco](https://umbraco.com) site on Umbraco Cloud through Umbraco's [Delivery API](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api). The Umbraco side lives in a separate Cloud repo.

## How it works

- **Content** is fetched from the Delivery API at build time. The content collections in `src/content.config.ts` call a TypeScript client generated from the API's OpenAPI spec (`src/api/`), so the site never talks to a database.
- **Pages** are prerendered to static HTML. URLs have no trailing slash (`/blog/my-post`), and the slashed version redirects to it.
- **Hosting** is a Cloudflare Worker with static assets, built by Workers Builds from `main`. Publishing in Umbraco calls a deploy hook, so a change goes live about a minute later.
- **On request**, the Worker (`src/worker.ts`) only handles the backoffice preview (`/preview`), the server islands on `/now`, and URLs with no page. For those it asks Umbraco whether the page moved and redirects there, or serves the 404 page.
- **Styles** are hand-written Sass in ITCSS layers under `src/styles/`.

The [colophon](https://rickbutterfield.dev/colophon) covers the rest.

## Running it locally

You need Node `22.23.4` or later (see `.nvmrc`), and either the local Umbraco site or the live API to read content from.

| Command | What it does |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `localhost:4321`, reachable from your network |
| `npm start` | Start the dev server on this machine only |
| `npm run build` | Build the site to `dist/` (needs the Delivery API) |
| `npm run preview` | Preview the built site |
| `npm run generate` | Regenerate the API client in `src/api/` (needs the local Umbraco site running on port 20625) |

Set these in `.env.local`:

- `PUBLIC_BASE_URL`: the Delivery API's base URL, with no trailing slash.
- `PUBLIC_BASE_URL_HTTPS`: the base URL used for media and image links.

The backoffice preview also needs `PREVIEW_SECRET` and `UMBRACO_DELIVERY_API_KEY`, set as Worker secrets (`.dev.vars` locally). Without them, `/preview` returns a 404.

Don't edit `src/api/*.gen.ts` by hand; run `npm run generate` instead.
