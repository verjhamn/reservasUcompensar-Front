import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  define: {
    'import.meta.env.LOCAL_AUTH_UI': JSON.stringify(command === 'serve' && mode !== 'production'),
  },
  resolve: {
    alias: {
      '#local-auth': fileURLToPath(new URL(
        command === 'serve' && mode !== 'production'
          ? './src/dev/localAuthBypass.js'
          : './src/config/localAuthBypass.js',
        import.meta.url,
      )),
    },
  },
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
}));
