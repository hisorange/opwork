import Fastify from 'fastify';
import 'reflect-metadata';
import signale from 'signale';
import { AppDataSource } from './library/create-data-source';
import { createWorkerdProcess } from './library/create-workerd';
import { fetchWorkers } from './library/fetch-workers';
import { migrateDataSource } from './library/migrate-data-source';
import { registerAdmin } from './library/register-admin';
import { registerRestApi } from './library/register-rest-api';
import { registerUpstreams } from './library/register-upstreams';

export const main = async () => {
  const server = Fastify({
    logger: true,
    disableRequestLogging: true,
  });

  server.get('/_/health', () => {
    return {
      status: 'ok',
    };
  });

  await AppDataSource.initialize();
  await migrateDataSource();
  const workers = await fetchWorkers();

  await registerRestApi(server);
  await registerAdmin(server);

  await createWorkerdProcess();
  await registerUpstreams(workers, server);

  await server.listen({ port: 3000, host: '0.0.0.0' });

  signale.info('Server listening on http://0.0.0.0:3000');
};

if (require.main === module) {
  main();
}
