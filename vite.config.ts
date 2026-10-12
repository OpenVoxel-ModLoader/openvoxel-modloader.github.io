import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Organization Pages site: served at https://openvoxel-modloader.github.io/ -> base "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/'
});
