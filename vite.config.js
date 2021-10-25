import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  server: {
    open: true,
  },
  plugins: [svelte({ preprocess: sveltePreprocess() })],
});
