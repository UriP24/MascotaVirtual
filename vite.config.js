import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// En GitHub Pages la app vive en https://urip24.github.io/MascotaVirtual/
const base = process.env.GITHUB_PAGES ? '/MascotaVirtual/' : '/'

export default defineConfig({
  base,
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
        name: 'Huellitas',
        short_name: 'Huellitas',
        description: 'Alguien especial te espera en casa 🐾',
        lang: 'es-AR',
        theme_color: '#ec6f9e',
        background_color: '#fff5f8',
        display: 'standalone',
        orientation: 'portrait',
        // Relativos a base, para que la app instalada abra en la carpeta correcta
        start_url: base,
        scope: base,
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
