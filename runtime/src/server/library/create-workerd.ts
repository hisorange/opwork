import { exec } from 'child_process';
import signale from 'signale';
import { IWorker } from '../types/worker.interface';
import { generateWorkerdConfig } from './generate-workerd-config';

export const createWorkerdProcess = async (services: IWorker[]) => {
  await generateWorkerdConfig(services);

  signale.info('Workderd starting');

  return exec('workerd serve workerd.capnp');
};
