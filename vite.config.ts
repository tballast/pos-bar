import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pos-bar',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

