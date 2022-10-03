import { Context } from '@loopback/context';
import { Bindings } from '../bindings';
import { WorkerEntity } from '../models/workers.entity';

type IWorker = WorkerEntity & { port: number };

export const fetchWorkers = async (ctx: Context): Promise<IWorker[]> => {
  let port = 10_000;

  const workers = await (
    await ctx.get(Bindings.DataSource)
  ).manager.find(WorkerEntity, {
    order: {
      createdAt: 'ASC',
    },
  });

  return workers.map(worker => ({
    ...worker,
    port: port++,
  }));
};
