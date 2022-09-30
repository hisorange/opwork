import { FastifyInstance } from "fastify";
import { fetchServices } from "./fetch-services";

export const registerRestApi = async (server: FastifyInstance) => {
  server.get("/api/services", async () => {
    return fetchServices();
  });
};
