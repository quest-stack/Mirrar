import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src/renderer',
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@engine': path.resolve(__dirname, 'src/engine'),
      '@parser': path.resolve(__dirname, 'src/parser'),
      '@plugins': path.resolve(__dirname, 'src/plugins'),
      '@storage': path.resolve(__dirname, 'src/storage'),
      '@templates': path.resolve(__dirname, 'src/templates'),
    },
  },
  server: {
    port: 5173,
  },
});
