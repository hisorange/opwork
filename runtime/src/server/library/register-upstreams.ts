import proxy from '@fastify/http-proxy';
import { FastifyInstance } from 'fastify';
import signale from 'signale';
import { IWorker } from '../types/worker.interface';

export const registerUpstreams = async (
  services: IWorker[],
  server: FastifyInstance,
) => {
  const upstreams = services.map(service => {
    signale.debug(`Registering service [${service.name}] to [${service.port}]`);

    return {
      upstream: `http://localhost:${service.port}`,
      prefix: `/service/${service.name}`,
      http2: false,
    };
  });

  await Promise.all(
    upstreams.map(upstream => server.register(proxy, upstream)),
  );

  signale.success('Upstreams registered');
};
