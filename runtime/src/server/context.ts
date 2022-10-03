import { BindingScope, Context } from '@loopback/context';
import { Bindings } from './bindings';
import { DataSourceProvider } from './providers/data-source.provider';
import { HttpServerProvider } from './providers/http-server.provider';
import { PortMapProvider } from './providers/port-map.provider';

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
