/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'

import enGB from '@/plugins/i18n/en_GB.json'
import deDE from '@/plugins/i18n/de_DE.json'

import { createI18n, useI18n } from 'vue-i18n'
import { en, de } from 'vuetify/locale'

// @ts-ignore
enGB.$vuetify = en
// @ts-ignore
deDE.$vuetify = de

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: enGB,
    de: deDE,
  },
  legacy: false,
  globalInjection: true,
})

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'fricklDark',
    themes: {
      fricklLight: {
        dark: false,
        colors: {
          primary: '#009432',
          secondary: '#A3CB38',
          'primary-darken-1': '#006266',
        }
      },
      fricklDark: {
        dark: true,
        colors: {
          primary: '#009432',
          secondary: '#A3CB38',
          'primary-darken-1': '#006266',
        },
      },
    },
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
})

export {
  vuetify,
  i18n,
}
