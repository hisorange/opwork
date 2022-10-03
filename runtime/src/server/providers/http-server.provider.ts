import fastifyPassport from '@fastify/passport';
import fastifySecureSession from '@fastify/secure-session';
import OpenAPIPlugin from '@fastify/swagger';
import { Provider } from '@loopback/context';
import Fastify, { FastifyInstance } from 'fastify';
import FastifyHttpErrorsEnhancedPlugin from 'fastify-http-errors-enhanced';
import signale from 'signale';

export class HttpServerProvider implements Provider<FastifyInstance> {
  async value() {
    const server = Fastify({
      logger: true,
      disableRequestLogging: true,
      trustProxy: true,
      ignoreTrailingSlash: true,
    });

    server.get('/_/health', () => {
      return {
        status: 'ok',
      };
    });

    await server.register(FastifyHttpErrorsEnhancedPlugin);

    await server.register(OpenAPIPlugin, {
      routePrefix: '/api/docs',
      mode: 'dynamic',

      uiConfig: {
        displayRequestDuration: true,
        docExpansion: 'none',
        syntaxHighlight: {
          theme: 'monokai',
        },
      },
      hideUntagged: false,
      exposeRoute: true,
    });

    server.register(fastifySecureSession, {
      key: Buffer.from([
        0x103, 0x132, 0x103, 0x010, 0x200, 0x017, 0x012, 0x345, 0x236, 0x235,
        0x202, 0x247, 0x357, 0x362, 0x074, 0x344, 0x016, 0x246, 0x004, 0x113,
        0x056, 0x000, 0x130, 0x125, 0x234, 0x022, 0x367, 0x210, 0x111, 0x100,
        0x374, 0x037,
      ]),
      cookieName: '__opwork_session',
    });

    server.addHook('onError', (req, rep, error, done) => {
      signale.error('Request [%s][%s] error [%s]', req.method, req.url, error);

      done();
    });

    await server.register(fastifyPassport.initialize());
    await server.register(fastifyPassport.secureSession());

    return server;
  }
}
