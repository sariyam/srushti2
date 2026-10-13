import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        manifestFilename: 'manifest.json',
        devOptions: {
          enabled: true,
        },
        includeAssets: [
          'pwa-assets/favicon.ico',
          'pwa-assets/icons/*.png',
          'pwa-assets/splash/*.png',
          'front_logo.png',
          'back_logo.png',
          'faces/*.jpg',
          'showcase/*.jpg',
          'items/*.jpg',
        ],
        manifest: {
          id: '/studio',
          name: 'Srushti AI — Business to Brand',
          short_name: 'Srushti AI',
          description: 'Business to Brand - AI-powered product photography & fashion studio.',
          start_url: '/studio',
          scope: '/',
          display: 'standalone',
          orientation: 'any',
          background_color: '#222222',
          theme_color: '#222222',
          icons: [
            {
              src: '/pwa-assets/icons/icon-48x48.png',
              sizes: '48x48',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-assets/icons/icon-72x72.png',
              sizes: '72x72',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-assets/icons/icon-96x96.png',
              sizes: '96x96',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-assets/icons/icon-120x120.png',
              sizes: '120x120',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-assets/icons/icon-144x144.png',
              sizes: '144x144',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-assets/icons/icon-152x152.png',
              sizes: '152x152',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-assets/icons/icon-180x180.png',
              sizes: '180x180',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-assets/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-assets/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/pwa-assets/icons/icon-310x310.png',
              sizes: '310x310',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-assets/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-assets/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          categories: ['photo', 'business', 'productivity', 'utilities'],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json,jpg,jpeg}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: (process.env.VITE_SERVER_BASE_URL || process.env.VITE_API_URL || 'http://localhost:4000').replace(/\/api\/?$/, ''),
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 600,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@iconify')) {
                return 'vendor-icons';
              }
              if (id.includes('react-colorful')) {
                return 'vendor-colorpicker';
              }
              if (
                id.includes('react') ||
                id.includes('scheduler') ||
                id.includes('@tanstack') ||
                id.includes('motion')
              ) {
                return 'vendor-framework';
              }
            }
          },
        },
      },
    },
  };
});
