import { Context } from '@loopback/context';
import axios from 'axios';
import { FastifyRequest } from 'fastify';
import signale from 'signale';
import { Bindings } from '../bindings.js';
import { fetchWorkers } from './fetch-workers.js';

export const registerUpstreams = async (ctx: Context) => {
  const server = await ctx.get(Bindings.Server);
  const workers = await fetchWorkers(ctx);
  const portMap = await ctx.get(Bindings.PortMap);

  for (const worker of workers) {
    portMap.set(worker.path, worker.port);
    signale.info(`Registering upstream ${worker.path} -> ${worker.port}`);
  }

  server.all(
    '/worker/:workerPath',
    {},
    async (
      request: FastifyRequest<{ Params: { workerPath: string } }>,
      reply,
    ) => {
      if (!portMap.has(request.params.workerPath)) {
        signale.warn(`Worker ${request.params.workerPath} not found`);

        return reply.status(404).send();
      }

      const port = portMap.get(request.params.workerPath);
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
