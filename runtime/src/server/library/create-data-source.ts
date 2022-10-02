import { join } from 'path';
import { DataSource } from 'typeorm';
import { WorkerEntity } from '../models/workers.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: join(__dirname, '../../../database.sqlite'),
  synchronize: true,
  logging: 'all',
  entities: [WorkerEntity],
});
