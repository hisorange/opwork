import 'reflect-metadata';
import signale from 'signale';
import { Bindings } from './bindings.js';
import { createContext } from './context.js';
import { createWorkerdProcess } from './library/create-workerd.js';
import { migrateDataSource } from './library/migrate-data-source.js';
import { registerAdmin } from './library/register-admin.js';
import { registerRestApi } from './library/register-rest-api.js';
import { registerUpstreams } from './library/register-upstreams.js';

export const main = async () => {
  const ctx = createContext();

  await migrateDataSource(ctx);
  await registerRestApi(ctx);
  await registerAdmin(ctx);
  await createWorkerdProcess(ctx);
  await registerUpstreams(ctx);

  const server = await ctx.get(Bindings.Server);

  await server.listen({ port: 3000, host: '0.0.0.0' });

  signale.info('Server listening on http://0.0.0.0:3000');
};

main();
