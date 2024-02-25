import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import checker from 'vite-plugin-checker';

import packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    jsconfigPaths(),
    checker({
      enableBuild: false,
      eslint: {
        lintCommand: packageJson.scripts.lint,
      },
      stylelint: {
        lintCommand: packageJson.scripts.stylelint,
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/ws': {
        target: 'http://127.0.0.1:8000',
        ws: true,
      },
    },
  },
  define: {
    __DAKARA_VERSION__: JSON.stringify(packageJson.version),
    __DAKARA_BUGTRACKER__: JSON.stringify(packageJson.bugs.url),
    __DAKARA_PROJECT_HOMEPAGE__: JSON.stringify(packageJson.homepage),
  },
});
