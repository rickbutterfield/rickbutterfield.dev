export const onRequest = async (context, next) => {
  const response = await next();

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Headers', '*');
  response.headers.set('Access-Control-Allow-Methods', '*');
  response.headers.set('Access-Control-Expose-Headers','Content-Length,Content-Type,Server-Timing,Timing-Allow-Origin');
  response.headers.set('Timing-Allow-Origin', '*');

  return response;
};