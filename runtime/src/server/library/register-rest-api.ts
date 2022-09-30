import { FastifyInstance } from 'fastify';
import signale from 'signale';
import { fetchServices } from './fetch-services';

export const registerRestApi = async (server: FastifyInstance) => {
  server.get('/api/services', async () => {
    return fetchServices();
  });

  signale.success('REST API registered');
};
