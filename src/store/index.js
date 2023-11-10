import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

let name = process.env.VUE_APP_INSTANCE_NAME

if (!name) {
  name = 'frickl-next-' + window.location.pathname
}

export default createStore({
  state: {
    theme: 'fricklLight',
    accessToken: null,
    baseUrl: null,
    token: null,
    locale: 'en',
    imagesPerPage: 24,
    albumsPerPage: 24,
    serverSettings: null,
    cookiesAccepted: false,
    albumDownloadJobs: [],
    albumCardSize: 'md',
    imageCardSize: 'md'
  },
  getters: {
    storeTheme: (state) => state.theme,
    storeAccessToken: (state) => state.accessToken,
    storeBaseUrl: (state) => state.baseUrl,
    storeToken: (state) => state.token,
    storeLocale: (state) => state.locale,
    storeImagesPerPage: (state) => state.imagesPerPage,
    storeAlbumsPerPage: (state) => state.albumsPerPage,
    storeServerSettings: (state) => state.serverSettings,
    storeCookiesAccepted: (state) => state.cookiesAccepted,
    storeAlbumDownloadJobs: (state) => state.albumDownloadJobs,
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
    ALBUM_DOWNLOAD_JOB_ADDED_MUTATION: (state, newAlbumDownloadJob) => {
      if (!state.albumDownloadJobs) {
        state.albumDownloadJobs = [newAlbumDownloadJob]
      } else {
        state.albumDownloadJobs.push(newAlbumDownloadJob)
      }
    },
    ALBUM_CARD_SIZE_CHANGED_MUTATION: (state, newAlbumCardSize) => {
      state.albumCardSize = newAlbumCardSize
    },
    IMAGE_CARD_SIZE_CHANGED_MUTATION: (state, newImageCardSize) => {
      state.imageCardSize = newImageCardSize
    },
    SERVER_SETTINGS_CHANGED_MUTATION: (state, newServerSettings) => {
      state.serverSettings = newServerSettings

      // if (newServerSettings && newServerSettings.googleAnalyticsKey) {
      //   if (state.cookiesAccepted === true) {
      //     Vue.$ga.enable()
      //   } else {
      //     Vue.$ga.disable()
      //   }
      // }
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
    addAlbumDownloadJob: ({ commit }, albumDownloadJob) => {
      commit('ALBUM_DOWNLOAD_JOB_ADDED_MUTATION', albumDownloadJob)
    },
    setServerSettings: ({ commit }, serverSettings) => {
      commit('SERVER_SETTINGS_CHANGED_MUTATION', serverSettings)
    },
    setAlbumCardSize: ({ commit }, albumCardSize) => {
      commit('ALBUM_CARD_SIZE_CHANGED_MUTATION', albumCardSize)
    },
    setImageCardSize: ({ commit }, imageCardSize) => {
      commit('IMAGE_CARD_SIZE_CHANGED_MUTATION', imageCardSize)
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      key: name
    })
  ]
})
