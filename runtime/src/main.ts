import { exec } from "child_process";
import Fastify from "fastify";
import { lstat, readdir, writeFile } from "fs/promises";

interface IWorker {
  name: string; // hello
  port: number; // 8080
}

const getServices = async (): Promise<IWorker[]> => {
  const services = [];
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

const startHttpServer = async () => {
  const server = Fastify();
  const services = await getServices();

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

startHttpServer();
