import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME?.startsWith('/')
    ? env.VITE_APP_BASE_NAME
    : `/${env.VITE_APP_BASE_NAME || ''}/`;

  return {
    server: {
      open: true,
      port: 3000
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: [
        {
          find: 'assets',
          replacement: path.resolve(__dirname, 'src/assets')
        }
      ]
    },
    css: {
      preprocessorOptions: {
        scss: { charset: false },
        less: { charset: false }
      },
      charset: false,
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    base: API_URL,
    plugins: [
      react(),
      jsconfigPaths(),
      {
        name: 'suppress-sass-warnings',
        apply: 'serve',
        configureServer(server) {
          const originalWarn = console.warn;
          console.warn = (...args) => {
            if (
              typeof args[0] === 'string' &&
              args[0].includes('Deprecation Warning')
            ) {
              return;
            }
            originalWarn(...args);
          };
        }
      }
    ]
  };
});
