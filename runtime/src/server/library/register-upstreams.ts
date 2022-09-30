import { FastifyInstance } from "fastify";
import { IWorker } from "../types/worker.interface";

export const registerUpstreams = async (
  services: IWorker[],
  server: FastifyInstance
) => {
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
};
