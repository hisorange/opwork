import { writeFile } from 'fs/promises';
import { join } from 'path';
import signale from 'signale';
import { fetchServices } from './fetch-services';

export const generateWorkerdConfig = async () => {
  const services = await fetchServices();
  const template = `using Workerd = import "/workerd/workerd.capnp";

  const config :Workerd.Config = (
    services = [
      ${services
        .map(
          worker =>
            `(name = "${worker.name}", worker = .${worker.name}Worker),`,
        )
        .join('\n')}
    ],

    sockets = [
      ${services
        .map(
          worker =>
            `(
              name = "${worker.name}",
              address = "localhost:${worker.port}",
              http=(),
              service="${worker.name}"
            ),`,
        )
        .join('\n')}
    ]
  );

  ${services
    .map(
      worker => `
  const ${worker.name}Worker :Workerd.Worker = (
    serviceWorkerScript = embed "services/${worker.name}/entry.js",
    compatibilityDate = "2022-09-16",
  );`,
    )
    .join('\n')}`;
  signale.success('Workerd config generated');

  await writeFile(join(__dirname, '../../../workerd.capnp'), template);
  signale.success('Workerd config materialized');
};
