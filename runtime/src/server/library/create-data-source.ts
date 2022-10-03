import { join } from 'path';
import { DataSource } from 'typeorm';
import { WorkerEntity } from '../models/workers.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: join(process.cwd(), 'temp/database.sqlite'),
  synchronize: true,
  logging: 'all',
  entities: [WorkerEntity],
});
