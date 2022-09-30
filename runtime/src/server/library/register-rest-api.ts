import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import signale from 'signale';
import { IService } from '../types/service.interface';
import { fetchServices } from './fetch-services';

export const registerRestApi = async (server: FastifyInstance) => {
  server.get('/api/services', async () => {
    return fetchServices();
  });

  server.get(
    '/api/services/:id',
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const services = await fetchServices();
      const service = services.find(service => service.name === req.params.id);

      if (service) {
        const code = await readFile(
          join(__dirname, '../../../services/', service.name, 'entry.js'),
          'utf-8',
        );

        return {
          name: service.name,
          code,
        };
      }

      reply.status(404);

      return { error: 'Service not found' };
    },
  );

  server.patch(
    '/api/services/:id',
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: IService }>,
      reply: FastifyReply,
    ) => {
      const path = join(
        __dirname,
        '../../../services/',
        req.params.id,
        'entry.js',
      );

      await writeFile(path, req.body.code);

      return {
        status: 'ok',
      };
    },
  );

  signale.success('REST API registered');
};
