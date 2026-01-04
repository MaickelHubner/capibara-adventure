import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 7777,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
