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
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
        },
        includeAssets: ['pwa-192x192.png', 'pwa-512x512.png', 'assets/front_logo.png', 'assets/back_logo.png', 'favicon.ico', 'favicon.png', 'faces/*.jpg'],
        manifest: {
          id: '/',
          name: 'Srushti AI — Business to Brand',
          short_name: 'Srushti AI',
          description: 'Business to Brand - AI-powered product photography & fashion studio.',
          theme_color: '#ebeaea',
          background_color: '#ebeaea',
          display: 'standalone',
          orientation: 'any',
          start_url: '/',
          scope: '/',
          categories: ['photo', 'business', 'productivity', 'utilities'],
          prefer_related_applications: false,
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ],
          shortcuts: [
            {
              name: 'Garment Studio',
              short_name: 'Garments',
              description: 'Create garment product photography',
              url: '/?workspace=garment'
            },
            {
              name: 'Jewelry Studio',
              short_name: 'Jewelry',
              description: 'Create jewelry product photography',
              url: '/?workspace=jewelry'
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
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
    },
  };
});
