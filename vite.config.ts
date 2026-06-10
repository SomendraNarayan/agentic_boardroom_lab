import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    // Base path for asset URLs. For a GitHub Pages PROJECT site the app is served
    // from https://<user>.github.io/<repo>/, so the base must be '/<repo>/'.
    // The deploy workflow sets this via the VITE_BASE env var; the default below
    // matches this repository's name for manual builds.
    base: env.VITE_BASE || '/agentic_boardroom_lab/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
            // Hot module replacement can be disabled by setting DISABLE_HMR=true.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
