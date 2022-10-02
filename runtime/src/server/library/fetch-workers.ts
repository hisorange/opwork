import { WorkerEntity } from '../models/workers.entity';
import { IWorker } from '../types/worker.interface';
import { AppDataSource } from './create-data-source';

export const fetchWorkers = async (): Promise<IWorker[]> => {
  let port = 10_000;

  const workers = await AppDataSource.manager.find(WorkerEntity, {
    order: {
      createdAt: 'ASC',
    },
  });

  return workers.map(worker => ({
    ...worker,
    port: port++,
  }));
};
