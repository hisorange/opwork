import { exec } from 'child_process';
import signale from 'signale';
import { generateWorkerdConfig } from './generate-workerd-config';

export const createWorkerdProcess = async () => {
  await generateWorkerdConfig();

  signale.info('Workderd starting');

  return exec(
    'workerd serve workerd.capnp --watch --verbose',
    (error, stdout, stderr) => {
      if (error) {
        signale.error(error);
        return;
      }

      if (stderr) {
        signale.error(stderr);
        return;
      }

      signale.info(stdout);
    },
  );
};
