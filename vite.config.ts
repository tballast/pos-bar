import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pos-bar/',  // Add this line with your repo name
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

