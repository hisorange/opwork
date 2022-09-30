addEventListener("fetch", (event) => {
  event.respondWith(new Response("Hello, OpWork: " + new Date().toISOString()));
});
