addEventListener("fetch", (event) => {
  event.respondWith(
    new Response("Second, OpWorker! " + new Date().toISOString())
  );
});
