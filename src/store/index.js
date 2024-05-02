import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { bootstrap } from 'vue-gtag'
import { userHasPermission } from '@/plugins/misc'

let name = process.env.VUE_APP_INSTANCE_NAME

if (!name) {
  name = 'frickl-next-' + window.location.pathname
}

const essentialKeys = ['token', 'baseUrl', 'serverSettings', 'cookiesAccepted']

export default createStore({
  state: {
    theme: 'fricklDark',
    accessToken: null,
    baseUrl: null,
    token: null,
    locale: 'en',
    imagesPerPage: 24,
    albumsPerPage: 24,
    serverSettings: null,
    cookiesAccepted: null,
    downloadJobs: [],
    albumCardSize: 'md',
    imageCardSize: 'md'
  },
  getters: {
    storeTheme: (state) => state.theme,
    storeAccessToken: (state) => state.accessToken,
    storeBaseUrl: (state) => state.baseUrl,
    storeToken: (state) => state.token,
    storeUserPermissions: (state) => {
      const result = {}

      if (state.token && state.token.allPermissions && state.token.permissions) {
        state.token.allPermissions.forEach(p => {
          result[p.name] = userHasPermission(state.token.permissions, p.code)
        })
      }
      
      return result
    },
    storeLocale: (state) => state.locale,
    storeImagesPerPage: (state) => state.imagesPerPage,
    storeAlbumsPerPage: (state) => state.albumsPerPage,
    storeServerSettings: (state) => state.serverSettings,
    storeCookiesAccepted: (state) => state.cookiesAccepted,
    storeDownloadJobs: (state) => state.downloadJobs,
    storeAlbumCardSize: (state) => state.albumCardSize,
    storeImageCardSize: (state) => state.imageCardSize
  },
  mutations: {
    THEME_CHANGED_MUTATION: (state, newTheme) => {
      state.theme = newTheme
    },
    ACCESS_TOKEN_CHANGED_MUTATION: (state, newAccessToken) => {
      state.accessToken = newAccessToken
    },
    BASE_URL_CHANGED_MUTATION: (state, newBaseUrl) => {
      state.baseUrl = newBaseUrl
    },
    TOKEN_CHANGED_MUTATION: (state, newToken) => {
      state.token = newToken
    },
    LOCALE_CHANGED_MUTATION: (state, newLocale) => {
      state.locale = newLocale
    },
    IMAGES_PER_PAGE_CHANGED_MUTATION: (state, newImagesPerPage) => {
      state.imagesPerPage = newImagesPerPage
    },
    ALBUMS_PER_PAGE_CHANGED_MUTATION: (state, newAlbumsPerPage) => {
      state.albumsPerPage = newAlbumsPerPage
    },
    DOWNLOAD_JOB_ADDED_MUTATION: (state, newDownloadJob) => {
      if (!state.downloadJobs) {
        state.downloadJobs = [newDownloadJob]
      } else {
        state.downloadJobs.push(newDownloadJob)
      }
    },
    DOWNLOAD_JOBS_CHANGED_MUTATION: (state, newDownloadJobs) => {
      state.downloadJobs = newDownloadJobs
    },
    ALBUM_CARD_SIZE_CHANGED_MUTATION: (state, newAlbumCardSize) => {
      state.albumCardSize = newAlbumCardSize
    },
    IMAGE_CARD_SIZE_CHANGED_MUTATION: (state, newImageCardSize) => {
      state.imageCardSize = newImageCardSize
    },
    COOKIES_ACCEPTED_CHANGED_MUTATION: function (state, newCookiesAccepted) {
      state.cookiesAccepted = newCookiesAccepted

      if (state.serverSettings && state.serverSettings.googleAnalyticsKey) {
        if (newCookiesAccepted === true) {
          bootstrap().then((gtag) => {
            // all done!
          })
        } else {
          // Do nothing here
        }
      }
    },
    SERVER_SETTINGS_CHANGED_MUTATION: (state, newServerSettings) => {
      state.serverSettings = newServerSettings

      if (newServerSettings && newServerSettings.googleAnalyticsKey) {
        if (state.cookiesAccepted === true) {
          bootstrap().then((gtag) => {
            // all done!
          })
        } else {
          //  Do nothing here
        }
      }
    },
  },
  actions: {
    setTheme: ({ commit }, theme) => {
      commit('THEME_CHANGED_MUTATION', theme)
    },
    setAccessToken: ({ commit }, accessToken) => {
      commit('ACCESS_TOKEN_CHANGED_MUTATION', accessToken)
    },
    setBaseUrl: ({ commit }, baseUrl) => {
      commit('BASE_URL_CHANGED_MUTATION', baseUrl)
    },
    setToken: ({ commit }, token) => {
      commit('TOKEN_CHANGED_MUTATION', token)
    },
    setLocale: ({ commit }, locale) => {
      commit('LOCALE_CHANGED_MUTATION', locale)
    },
    setImagesPerPage: ({ commit }, imagesPerPage) => {
      commit('IMAGES_PER_PAGE_CHANGED_MUTATION', imagesPerPage)
    },
    setAlbumsPerPage: ({ commit }, albumsPerPage) => {
      commit('ALBUMS_PER_PAGE_CHANGED_MUTATION', albumsPerPage)
    },
    addDownloadJob: ({ commit }, downloadJob) => {
      commit('DOWNLOAD_JOB_ADDED_MUTATION', downloadJob)
    },
    setDownloadJobs: ({ commit }, downloadJobs) => {
      commit('DOWNLOAD_JOBS_CHANGED_MUTATION', downloadJobs)
    },
    setServerSettings: ({ commit }, serverSettings) => {
      commit('SERVER_SETTINGS_CHANGED_MUTATION', serverSettings)
    },
    setAlbumCardSize: ({ commit }, albumCardSize) => {
      commit('ALBUM_CARD_SIZE_CHANGED_MUTATION', albumCardSize)
    },
    setImageCardSize: ({ commit }, imageCardSize) => {
      commit('IMAGE_CARD_SIZE_CHANGED_MUTATION', imageCardSize)
    },
    setCookiesAccepted: function ({ commit }, cookiesAccepted) {
      commit('COOKIES_ACCEPTED_CHANGED_MUTATION', cookiesAccepted)
    },
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      key: name,
      reducer: (state, paths) => {
        const result = JSON.parse(JSON.stringify(state))

        if (result.cookiesAccepted !== true) {
          Object.keys(result).forEach(k => {
            if (essentialKeys.indexOf(k) === -1) {
              delete result[k]
            }
          })
        }

        delete result.accessToken

        return result
      }
    })
  ]
})
