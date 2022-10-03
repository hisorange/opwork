import { BindingKey } from '@loopback/context';
import { FastifyInstance } from 'fastify';
import { DataSource } from 'typeorm';

export const Bindings = {
  Server: BindingKey.create<FastifyInstance>('server'),
  DataSource: BindingKey.create<DataSource>('datasource'),
  PortMap: BindingKey.create<Map<string, number>>('portmap'),
};
