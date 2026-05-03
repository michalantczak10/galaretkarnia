import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        terms: path.resolve(__dirname, 'terms.html'),
        privacy: path.resolve(__dirname, 'privacy.html'),
      },
    },
  },
});
