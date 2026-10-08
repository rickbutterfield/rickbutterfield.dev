import type { MiddlewareNext, APIContext } from 'astro';

export const onRequest = async (_context: APIContext, next: MiddlewareNext) => {
  const response = await next();

  try {
    response.headers.set('Timing-Allow-Origin', '*');
    return response;
  } catch {
    // Responses passed straight through from fetch() have immutable headers, such as the dev
    // /_image endpoint's remote images in workerd, so set the header on a copy instead
    const copy = new Response(response.body, response);
    copy.headers.set('Timing-Allow-Origin', '*');
    return copy;
  }
};
