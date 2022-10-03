import { randomUUID } from 'crypto';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import signale from 'signale';
import { WorkerEntity } from '../models/workers.entity';
import { AppDataSource } from './create-data-source';
import { generateWorkerdConfig } from './generate-workerd-config';
import { pathPortMap } from './port-map';

export const registerRestApi = async (server: FastifyInstance) => {
  server.get('/api/workers', async () => {
    return await AppDataSource.manager.find(WorkerEntity);
  });

  server.get(
    '/api/workers/:id',
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const worker = await AppDataSource.manager.findOne(WorkerEntity, {
        where: {
          id: req.params.id,
        },
      });

      if (worker) {
        return worker;
      }

      reply.status(404);

      return { error: 'Worker not found' };
    },
  );

  server.patch(
    '/api/workers/:id',
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: WorkerEntity }>,
    ) => {
      const worker = await AppDataSource.manager.findOne(WorkerEntity, {
        where: {
          id: req.params.id,
        },
      });

      const previousPort = pathPortMap.get(worker!.path)!;
      pathPortMap.delete(worker!.path);
      pathPortMap.set(req.body.path, previousPort);

      signale.info(
        `Updating worker ${worker!.path} -> ${
          req.body.path
        } on port ${previousPort}`,
      );

      await AppDataSource.manager.update(WorkerEntity, req.params.id, {
        ...req.body,
      });

      await generateWorkerdConfig();
    },
  );

  server.post('/api/workers', async () => {
    try {
      const id = randomUUID();
      const code = `addEventListener('fetch', event => {
        event.respondWith(
          new Response('My Worker // ${id}'),
        );
      });`;

      const body = {
        id,
        name: 'My Worker',
        path: id,
        code,
      };

      await AppDataSource.manager.save(WorkerEntity, body);
      signale.success(`Worker ${id} created`);

      await generateWorkerdConfig();

      pathPortMap.set(id, 10_000 + pathPortMap.size);

      return body;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  signale.success('REST API registered');
};
