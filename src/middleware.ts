import type { MiddlewareNext, APIContext } from 'astro';

export const onRequest = async (_context: APIContext, next: MiddlewareNext) => {
  const response = await next();

  response.headers.set('Timing-Allow-Origin', '*');

  return response;
};