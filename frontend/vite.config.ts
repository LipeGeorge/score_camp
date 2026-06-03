import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Atualiza o cache do app automaticamente quando houver nova versão
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // Assets estáticos
      manifest: {
        name: 'Gincana PWA - Juventude para as Nações',
        short_name: 'Gincana PWA',
        description: 'Gestão offline de gincanas, check-in e auditoria',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // Faz o app abrir em tela cheia, sem a barra de URL do navegador
        icons: [
          {
            src: 'pwa-192x192.png', // Precisaremos adicionar essas imagens na pasta public depois
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // Faz o cache de todos os arquivos de interface
        // IMPORTANTE: Prepara a arquitetura para o FastAPI. 
        // Dizemos ao Service Worker para NUNCA tentar usar cache nas chamadas de rede da nossa API.
        navigateFallbackDenylist: [/^\/api/] 
      }
    })
  ]
});