import { Context } from '@loopback/context';
import { spawn } from 'child_process';
import signale from 'signale';
import { generateWorkerdConfig } from './generate-workerd-config';

export const createWorkerdProcess = async (ctx: Context) => {
  await generateWorkerdConfig(ctx);

  const controller = new AbortController();
  const { signal } = controller;

  signale.info('Workderd starting');

  const p = spawn(
    'workerd',
    ['serve', 'temp/workerd.capnp', '--watch', '--verbose'],
    { signal },
  );

  p.stdout.on('data', data => {
    signale.info('workerd', data.toString());
  });

  p.stderr.on('data', data => {
    signale.info('workerd', data.toString());
  });

  process.on('SIGINT', () => {
    signale.info('Workderd stopping');
    controller.abort();
  });

  process.on('SIGTERM', () => {
    signale.info('Workderd stopping');
    controller.abort();
  });
};
