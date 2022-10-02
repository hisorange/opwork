import axios from 'axios';
import { FastifyInstance, FastifyRequest } from 'fastify';
import signale from 'signale';
import { fetchWorkers } from './fetch-workers';
import { pathPortMap } from './port-map';

export const registerUpstreams = async (server: FastifyInstance) => {
  const workers = await fetchWorkers();

  for (const worker of workers) {
    pathPortMap.set(worker.path, worker.port);
    signale.info(`Registering upstream ${worker.path} -> ${worker.port}`);
  }

  server.all(
    '/worker/:workerPath',
    {},
    async (
      request: FastifyRequest<{ Params: { workerPath: string } }>,
      reply,
    ) => {
      if (!pathPortMap.has(request.params.workerPath)) {
        signale.warn(`Worker ${request.params.workerPath} not found`);

        return reply.status(404).send();
      }

      const port = pathPortMap.get(request.params.workerPath);
      const path = request.raw
        .url!.toString()
        .replace(`/worker/${request.params.workerPath}`, '');

      signale.debug(`Proxying request to http://localhost:${port}${path}`);

      const response = await axios(`http://localhost:${port}${path}`, {
        method: request.raw.method,
      });

      reply.statusCode = response.status;

      return response.data;
    },
  );

  signale.success('Upstreams registered');
};
