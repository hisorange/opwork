import { BindingScope, Context } from '@loopback/context';
import { Bindings } from './bindings.js';
import { DataSourceProvider } from './providers/data-source.provider.js';
import { HttpServerProvider } from './providers/http-server.provider.js';
import { PortMapProvider } from './providers/port-map.provider.js';

export const createContext = () => {
  const ctx = new Context();

  ctx
    .bind(Bindings.Server)
    .toProvider(HttpServerProvider)
    .inScope(BindingScope.SINGLETON);

  ctx
    .bind(Bindings.DataSource)
    .toProvider(DataSourceProvider)
    .inScope(BindingScope.SINGLETON);

  ctx
    .bind(Bindings.PortMap)
    .toProvider(PortMapProvider)
    .inScope(BindingScope.SINGLETON);

  return ctx;
};
