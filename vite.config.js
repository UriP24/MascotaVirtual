import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // Escucha en toda la red local para poder abrirla desde el celular.
    host: true,
  },
  plugins: [
    react(),
    VitePWA({
      // Cuando subimos una versión nueva, la app se actualiza sola.
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Bolti',
        short_name: 'Bolti',
        description: 'Bolti te espera en casa 🐾',
        lang: 'es-AR',
        theme_color: '#ec6f9e',
        background_color: '#fff5f8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
