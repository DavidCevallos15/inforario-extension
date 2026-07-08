import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite para Inforario (extensión Chrome MV3)
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Consolidar todo el CSS en un solo archivo para la extensión
      css: {
        devSourcemap: true,
      },
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        // Un solo archivo CSS sin code-splitting
        cssCodeSplit: false,
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            background: path.resolve(__dirname, 'src/extension/background.ts'),
            content: path.resolve(__dirname, 'src/extension/content.ts'),
          },
          output: {
            entryFileNames: (chunkInfo) => {
              if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
                return '[name].js'; // Sin hash para los scripts de la extensión
              }
              return 'assets/[name]-[hash].js';
            },
            // Nombre predecible para el CSS compilado
            assetFileNames: (assetInfo) => {
              if (assetInfo.names?.some(name => name.endsWith('.css'))) {
                return 'assets/main.css';
              }
              return 'assets/[name]-[hash][extname]';
            },
          },
        },
      }
    };
});

