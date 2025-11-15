
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/server': {
        target: "user-api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server/, '') // 移除/server前缀
      },
    },
  },

  plugins: [
    vue(),

    // Elemtnt Configs
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),


  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  
})
