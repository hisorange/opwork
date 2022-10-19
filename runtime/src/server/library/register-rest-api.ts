import { Context } from '@loopback/context';
import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import signale from 'signale';
import { Bindings } from '../bindings.js';
import { WorkerEntity } from '../models/workers.entity.js';
import { generateWorkerdConfig } from './generate-workerd-config.js';

export const registerRestApi = async (ctx: Context) => {
  const server = await ctx.get(Bindings.Server);
  const dataSource = await ctx.get(Bindings.DataSource);
  const portMap = await ctx.get(Bindings.PortMap);

  server.get('/api/workers', async () => {
    return await dataSource.manager.find(WorkerEntity);
  });

  server.get(
    '/api/workers/:id',
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const worker = await dataSource.manager.findOne(WorkerEntity, {
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
      const worker = await dataSource.manager.findOne(WorkerEntity, {
        where: {
          id: req.params.id,
        },
      });

      const previousPort = portMap.get(worker!.path)!;
      portMap.delete(worker!.path);
      portMap.set(req.body.path, previousPort);

      signale.info(
        `Updating worker ${worker!.path} -> ${
          req.body.path
        } on port ${previousPort}`,
      );

      await dataSource.manager.update(WorkerEntity, req.params.id, {
        ...req.body,
      });

      await generateWorkerdConfig(ctx);
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

      await dataSource.manager.save(WorkerEntity, body);
      signale.success(`Worker ${id} created`);

      await generateWorkerdConfig(ctx);

      portMap.set(id, 10_000 + portMap.size);

      return body;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  signale.success('REST API registered');
};
