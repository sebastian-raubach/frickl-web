// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'

import en from '@/plugins/i18n/en_GB.json'
import de from '@/plugins/i18n/de_DE.json'

import { createI18n, useI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    de
  },
  legacy: false
})

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'fricklDark',
    themes: {
      fricklLight: {
        dark: false,
        colors: {
          primary: '#009432',
          secondary: '#A3CB38',
          'primary-darken-1': '#006266'
        }
      },
      fricklDark: {
        dark: true,
        colors: {
          primary: '#009432',
          secondary: '#A3CB38',
          'primary-darken-1': '#006266'
        }
      }
    }
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n })
  }
})
