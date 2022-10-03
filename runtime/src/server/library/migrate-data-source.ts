import { Context } from '@loopback/context';
import { Bindings } from '../bindings';
import { WorkerEntity } from '../models/workers.entity';

export const migrateDataSource = async (ctx: Context) => {
  const dataSource = await ctx.get(Bindings.DataSource);
  // Count the workers, if 0 then install the demo worker.
  const workerCount = await dataSource.manager.count(WorkerEntity);

  if (workerCount === 0) {
    // Install the demo worker.
    const worker = new WorkerEntity();

    worker.name = 'Demo Worker';
    worker.path = 'demo';
    worker.code = `addEventListener('fetch', event => {
      event.respondWith(
        new Response('Demo OpWorker! Current time is: ' + new Date().toISOString()),
      );
    });`;

    await dataSource.manager.save(worker);
  }
};
