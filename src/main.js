import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { vuetify, i18n } from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'

// Set base URL based on environment
let baseUrl = 'http://localhost:8180/frickl/v1/api/'

if (import.meta.env.VITE_BASE_URL) {
  baseUrl = import.meta.env.VITE_BASE_URL
}

store.commit('BASE_URL_CHANGED_MUTATION', baseUrl)

loadFonts()

createApp(App)
  .use(router)
  .use(i18n)
  .use(store)
  .use(vuetify)
  .mount('#app')
