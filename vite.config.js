import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import vitePluginRequire from 'vite-plugin-require'

const path = require('path')

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true
    }),
    vitePluginRequire()
  ],
  base: './',
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~@': path.resolve(__dirname, 'src')
    }
  }
})
