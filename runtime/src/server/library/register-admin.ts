import staticMiddleware from "@fastify/static";

import { FastifyInstance } from "fastify";
import { readFile } from "fs/promises";
import { join } from "path";

export const registerAdmin = async (server: FastifyInstance) => {
  server.get("/", (req, rep) => {
    rep.redirect("/admin");
  });

  if (process.env.NODE_ENV === "production") {
    // Static files
    const STATIC_DIR = join(__dirname, "../../view/");
    const INDEX_BUFFER = await readFile(join(STATIC_DIR, "index.html"));

    // Serve the assets
    await server.register(staticMiddleware, {
      root: join(STATIC_DIR, "assets"),
      prefix: "/admin/assets/",
      decorateReply: false,
    });
    console.info("Static directory [/admin] registered");

    await server.register(
      (instance, options, done) => {
        instance.setNotFoundHandler((req, reply) => {
          console.debug("Serving the index on 404 of [%s]", req.url);

          reply.statusCode = 200;
          reply.headers({
            "content-type": "text/html",
          });
          reply.send(INDEX_BUFFER);
        });

        done();
      },
      {
        prefix: "/admin",
      }
    );
    console.info("Page [Admin] registered at [GET][/admin]");
  } else {
    const dir = join(__dirname, "../../../");

    const viteConfig = require(join(dir, "vite.config.js"));
    // viteConfig.root = join(dir, "assets");

    const vite = require("vite");
    const viteServer = await vite.createServer(viteConfig);
    const middie = require("middie");
    const middlewares = viteServer.middlewares;

    await server.register(middie as any);

    (server as any).use("/admin", middlewares);

    console.info("Vite build [Admin] registered at [GET][/admin]");
  }
};
