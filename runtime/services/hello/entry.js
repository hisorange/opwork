addEventListener('fetch', event => {
  event.respondWith(
    new Response('Hello, OpWorkerX! ' + new Date().toISOString()),
  );
});
