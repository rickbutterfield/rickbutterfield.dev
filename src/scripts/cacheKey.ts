// Cache keys for Astro's incremental builds (experimental.incrementalBuild in astro.config.mjs).
// A page is copied from the last build when its cacheKey and its code are unchanged, so the key
// must cover every piece of data the page renders. Astro only tracks code, not Delivery API data.
import { getCollection } from 'astro:content';

async function hash(value: unknown): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(value)));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Data every page renders through Layout: the nav (Header), the site settings on the Home node
// (consts.ts), the media host and the footer's copyright year
let sharedData: Promise<unknown> | undefined;

function getSharedData() {
  sharedData ??= Promise.all([getCollection('navigation'), getCollection('homePage')]).then(
    ([navigation, [homePage]]) => {
      const { siteTitle, siteTitleMobile, siteDescription } = homePage?.data.content.properties ?? {};
      return {
        navigation: navigation.map((item) => item.data),
        site: { siteTitle, siteTitleMobile, siteDescription },
        mediaHost: import.meta.env.PUBLIC_BASE_URL_HTTPS,
        year: new Date().getFullYear(),
      };
    }
  );
  return sharedData;
}

/** A key for a page inside Layout that renders `data` */
export async function pageCacheKey(data: unknown): Promise<string> {
  return hash({ shared: await getSharedData(), data });
}

/** A key for output outside Layout (such as an OG image) that renders `data` */
export const dataCacheKey = (data: unknown): Promise<string> => hash(data);
