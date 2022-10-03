import 'reflect-metadata';
import signale from 'signale';
import { AppDataSource } from './library/create-data-source';
import { createHttpServer } from './library/create-http-server';
import { createWorkerdProcess } from './library/create-workerd';
import { migrateDataSource } from './library/migrate-data-source';
import { registerAdmin } from './library/register-admin';
import { registerRestApi } from './library/register-rest-api';
import { registerUpstreams } from './library/register-upstreams';

export const main = async () => {
  const server = await createHttpServer();

  await AppDataSource.initialize();
  await migrateDataSource();

  await registerRestApi(server);
  await registerAdmin(server);

  await createWorkerdProcess();
  await registerUpstreams(server);

  await server.listen({ port: 3000, host: '0.0.0.0' });

  signale.info('Server listening on http://0.0.0.0:3000');
};

main();
