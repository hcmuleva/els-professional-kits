import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/ui/", // <--- Crucial for subpath
  build: {
    outDir: 'dist',
  }
});
