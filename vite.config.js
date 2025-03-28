import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://qareservas.ucompensar.edu.co',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  optimizeDeps: {
    include: ['@tremor/react'],
  },
  build: {
    commonjsOptions: {
      include: [/@tremor\/react/, /node_modules/],
    },
  },
});