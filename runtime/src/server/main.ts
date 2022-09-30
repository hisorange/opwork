import staticMiddleware from "@fastify/static";
import { exec } from "child_process";
import Fastify from "fastify";
import { lstat, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { IWorker } from "./types/worker.interface";

const getServices = async (): Promise<IWorker[]> => {
  const services: IWorker[] = [];
  let port = 10000;

  for await (const record of await readdir("services")) {
    if (record.startsWith(".")) continue;

    // Check if the record is a directory.
    if ((await lstat(`services/${record}`)).isDirectory()) {
      services.push({ name: record, port: ++port });
    }
  }

  return services;
};

const generateWorkerConfig = async (services: IWorker[]) => {
  console.log("Generating config...");

  const template = `using Workerd = import "/workerd/workerd.capnp";

  const config :Workerd.Config = (
    services = [
      ${services
        .map(
          (worker) =>
            `(name = "${worker.name}", worker = .${worker.name}Worker),`
        )
        .join("\n")}
    ],

    sockets = [
      ${services
        .map(
          (worker) =>
            `(
              name = "${worker.name}",
              address = "localhost:${worker.port}",
              http=(),
              service="${worker.name}"
            ),`
        )
        .join("\n")}
    ]
  );

  ${services
    .map(
      (worker) => `
  const ${worker.name}Worker :Workerd.Worker = (
    serviceWorkerScript = embed "services/${worker.name}/entry.js",
    compatibilityDate = "2022-09-16",
  );`
    )
    .join("\n")}`;

  return writeFile("workerd.capnp", template);
};

const startWorkerService = async () => {
  console.log("Starting workerd");
  // Start the workerd with the generated config.
  return exec("workerd serve workerd.capnp");
};

const startserver = async () => {
  const server = Fastify();
  const services = await getServices();

  server.get("/_/health", () => {
    return {
      status: "ok",
    };
  });

  server.get("/_/services", async () => {
    return getServices();
  });

  server.get("/", (req, rep) => {
    rep.redirect("/admin");
  });

  if (process.env.NODE_ENV === "production") {
    // Static files
    const STATIC_DIR = join(__dirname, "../view/");
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
    const dir = join(__dirname, "../../");

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

  await generateWorkerConfig(services);
  const childWorker = startWorkerService();

  const upstreams = services.map((service) => ({
    upstream: `http://localhost:${service.port}`,
    prefix: `/service/${service.name}`,
    http2: false,
  }));

  console.log("Startup upstreams", upstreams);
  const proxy = require("@fastify/http-proxy");

  await Promise.all(
    upstreams.map((upstream) => server.register(proxy, upstream))
  );

  await server.listen({ port: 3000, host: "0.0.0.0" });

  console.log("Server listening on port 3000");
};

startserver();
