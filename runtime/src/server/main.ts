import Fastify from "fastify";
import { createWorkerdProcess } from "./library/create-workerd";
import { fetchServices } from "./library/fetch-services";
import { registerAdmin } from "./library/register-admin";
import { registerRestApi } from "./library/register-rest-api";
import { registerUpstreams } from "./library/register-upstreams";

export const main = async () => {
  const server = Fastify();
  const services = await fetchServices();

  server.get("/_/health", () => {
    return {
      status: "ok",
    };
  });

  await registerRestApi(server);
  await registerAdmin(server);

  await createWorkerdProcess(services);
  await registerUpstreams(services, server);

  await server.listen({ port: 3000, host: "0.0.0.0" });

  console.log("Server listening on port 3000");
};

if (require.main === module) {
  main();
}
