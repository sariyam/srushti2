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
        devOptions: {
          enabled: true,
        },
        includeAssets: [
          'favicon.ico',
          'favicon.png',
          'pwa-64x64.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-192x192.png',
          'pwa-maskable-512x512.png',
          'apple-touch-icon.png',
          'screenshot-wide.png',
          'screenshot-narrow.png',
          'front_logo.png',
          'back_logo.png',
        ],
        manifest: {
          id: '/',
          name: 'Srushti AI — Business to Brand',
          short_name: 'Srushti AI',
          description: 'Business to Brand - AI-powered product photography & fashion studio.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'any',
          background_color: '#ebeaea',
          theme_color: '#ebeaea',
          icons: [
            {
              src: '/pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          screenshots: [
            {
              src: '/screenshot-wide.png',
              sizes: '1280x720',
              type: 'image/png',
              form_factor: 'wide',
              label: 'Srushti AI Studio Dashboard',
            },
            {
              src: '/screenshot-narrow.png',
              sizes: '750x1334',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Srushti AI Mobile Studio',
            },
          ],
          categories: ['photo', 'business', 'productivity', 'utilities'],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
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
    },
  };
});
