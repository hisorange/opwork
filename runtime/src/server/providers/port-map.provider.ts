import { Provider } from '@loopback/context';

export class PortMapProvider implements Provider<Map<string, number>> {
  value(): Map<string, number> {
    return new Map<string, number>();
  }
}
