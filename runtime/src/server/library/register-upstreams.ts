import proxy from '@fastify/http-proxy';
import { FastifyInstance } from 'fastify';
import signale from 'signale';
import { IWorker } from '../types/worker.interface';

export const registerUpstreams = async (
  workers: IWorker[],
  server: FastifyInstance,
) => {
  const upstreams = workers.map(worker => {
    signale.debug(`Registering worker [${worker.name}] to [${worker.port}]`);

    return {
      upstream: `http://localhost:${worker.port}`,
      prefix: `/worker/${worker.path}`,
      http2: false,
    };
  });

  await Promise.all(
    upstreams.map(upstream => server.register(proxy, upstream)),
  );

  signale.success('Upstreams registered');
};
