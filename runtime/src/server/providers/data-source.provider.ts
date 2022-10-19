import { Provider } from '@loopback/context';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { WorkerEntity } from '../models/workers.entity.js';

export class DataSourceProvider implements Provider<DataSource> {
  async value(): Promise<DataSource> {
    const dataSource = new DataSource({
      type: 'sqlite',
      database: join(process.cwd(), 'temp/database.sqlite'),
      synchronize: true,
      logging: 'all',
      entities: [WorkerEntity],
    });

    await dataSource.initialize();

    return dataSource;
  }
}
