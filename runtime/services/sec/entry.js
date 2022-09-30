addEventListener("fetch", (event) => {
  event.respondWith(
    new Response("Second, OpWork! " + new Date().toISOString())
  );
});
