export const onRequest = async (context, next) => {
  const response = await next();

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Timing-Allow-Origin', '*');
  response.headers.set('Access-Control-Expose-Headers','Content-Length');

  return response;
};