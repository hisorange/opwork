import react from '@vitejs/plugin-react';
import { join } from 'path';
import { defineConfig } from 'vite';

const plugins = [react()];

// vite.config.js
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins,
  clearScreen: false,
  server: {
    middlewareMode: true,
    base: '/admin/',
    hmr: true,
  },
  logLevel: 'info',
  root: join(process.cwd(), 'src/view/'),
  publicDir: 'assets',
  base: '/admin/',
  build: {
    outDir: join(process.cwd(), './dist/view/'),
    emptyOutDir: true,
  },
});
