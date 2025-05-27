export const onRequest = async (context, next) => {
  const response = await next();

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Timing-Allow-Origin', '*');

  return response;
};