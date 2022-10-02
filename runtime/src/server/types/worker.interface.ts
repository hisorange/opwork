import { WorkerEntity } from '../models/workers.entity';

export interface IWorker extends WorkerEntity {
  port: number; // 10000
}
