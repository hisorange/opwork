const { join } = require('path');
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

const plugins = [react()];

// vite.config.js
module.exports = defineConfig({
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
  root: join(__dirname, 'src/view/'),
  publicDir: 'assets',
  base: '/admin/',
  build: {
    outDir: join(__dirname, './dist/view/'),
    emptyOutDir: true,
  },
});
