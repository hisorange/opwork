import { WorkerEntity } from '../models/workers.entity';
import { AppDataSource } from './create-data-source';

export const migrateDataSource = async () => {
  // Count the workers, if 0 then install the demo worker.
  const workerCount = await AppDataSource.manager.count(WorkerEntity);

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

    await AppDataSource.manager.save(worker);
  }
};
