import { Context } from '@loopback/context';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import signale from 'signale';
import { fetchWorkers } from './fetch-workers';

const clearId = (id: string) => 'w' + id.replace(/-/g, '');

export const generateWorkerdConfig = async (ctx: Context) => {
  const workers = await fetchWorkers(ctx);
  const template = `using Workerd = import "/workerd/workerd.capnp";

  const config :Workerd.Config = (
    services = [
      ${workers
        .map(
          worker =>
            `(name = "${clearId(worker.id)}", worker = .${clearId(
              worker.id,
            )}Worker),`,
        )
        .join('\n')}
    ],

    sockets = [
      ${workers
        .map(
          worker =>
            `(
              name = "${clearId(worker.id)}",
              address = "localhost:${worker.port}",
              http=(),
              service="${clearId(worker.id)}"
            ),`,
        )
        .join('\n')}
    ]
  );

  ${workers
    .map(
      worker => `
  const ${clearId(worker.id)}Worker :Workerd.Worker = (
    serviceWorkerScript = embed "${worker.id}/entry.js",
    compatibilityDate = "2022-09-16",
  );`,
    )
    .join('\n')}`;
  signale.success('Workerd config generated');

  for (const worker of workers) {
    const path = `temp/${worker.id}/entry.js`;
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, worker.code);
  }

  await writeFile(join(process.cwd(), 'temp/workerd.capnp'), template);
  signale.success('Workerd config materialized');
};
