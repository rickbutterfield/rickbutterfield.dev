// The Worker entry. Static files are served before the Worker runs, so it only sees the backoffice preview, server
// islands and URLs with no page. For those it asks Umbraco whether the URL was redirected (Umbraco records the old
// URL when a page is renamed or moved), and otherwise serves the 404 page.
import { handle } from "@astrojs/cloudflare/handler";

type HandleArgs = Parameters<typeof handle>;

// Routes rendered by Astro on request; keep in step with run_worker_first in wrangler.jsonc
const isAstroRoute = (pathname: string) => pathname === "/preview" || pathname.startsWith("/_server-islands/");

// Paths with a file extension are assets or bots probing for /wp-login.php, never Umbraco pages
const hasFileExtension = (pathname: string) => /\.[a-z0-9]+$/i.test(pathname);

// The Delivery API answers an old URL with a 301 to the page's current path. Resolves to that path, or undefined.
const findRedirect = async (url: URL) => {
  if (hasFileExtension(url.pathname)) return;

  try {
    const response = await fetch(`${import.meta.env.PUBLIC_BASE_URL}/umbraco/delivery/api/v2/content/item${url.pathname}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(3000),
    });
    const location = response.status === 301 ? response.headers.get("Location") : null;
    if (!location?.startsWith("/")) return;

    // Pages are folders (blog/post/index.html), so go straight to the trailing-slash URL instead of via a second redirect
    return location.endsWith("/") ? location : `${location}/`;
  } catch (err) {
    // A slow or failing Umbraco shouldn't break the 404 page
    console.error(`Redirect lookup failed for ${url.pathname}: ${err}`);
  }
};

const notFound = async (url: URL, env: HandleArgs[1]) => {
  const page = await env.ASSETS.fetch(new URL("/404", url));
  return new Response(page.body, { status: 404, headers: page.headers });
};

export default {
  async fetch(request: Request, env: HandleArgs[1], context: HandleArgs[2]) {
    const url = new URL(request.url);
    if (isAstroRoute(url.pathname)) return handle(request, env, context);

    if (request.method === "GET" || request.method === "HEAD") {
      const location = await findRedirect(url);
      if (location) return Response.redirect(new URL(location + url.search, url), 301);
    }

    return notFound(url, env);
  },
};
