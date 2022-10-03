import staticMiddleware from '@fastify/static';
import { FastifyInstance } from 'fastify';
import { readFile } from 'fs/promises';
import { join } from 'path';
import signale from 'signale';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const registerAdmin = async (server: FastifyInstance) => {
  server.get('/', (req, rep) => {
    rep.redirect('/admin');
  });

  signale.success('Admin redirection registered');

  if (process.env.NODE_ENV === 'production') {
    // Static files
    const STATIC_DIR = join(__dirname, '../../view/');
    const INDEX_BUFFER = await readFile(join(STATIC_DIR, 'index.html'));

    // Serve the assets
    await server.register(staticMiddleware, {
      root: join(STATIC_DIR, 'assets'),
      prefix: '/admin/assets/',
      decorateReply: false,
    });
    signale.info('Static directory [/admin] registered');

    await server.register(
      (instance, options, done) => {
        instance.setNotFoundHandler((req, reply) => {
          signale.debug('Serving the index on 404 of [%s]', req.url);

          reply.statusCode = 200;
          reply.headers({
            'content-type': 'text/html',
          });
          reply.send(INDEX_BUFFER);
        });

        done();
      },
      {
        prefix: '/admin',
      },
    );

    signale.success('Admin registered at [GET][/admin]');
  } else {
    const dir = join(__dirname, '../../../');

    const viteConfig = await import(join(dir, 'vite.config.js'));

    const vite = await import('vite');
    const viteServer = await vite.createServer(viteConfig);
    const middie = await import('@fastify/middie');
    const middlewares = viteServer.middlewares;

    await server.register(middie as any);

    (server as any).use('/admin', middlewares);

    signale.success('Vite build for admin registered at [GET][/admin]');
  }
};
