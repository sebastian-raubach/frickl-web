import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const essentialKeys = ['token', 'baseUrl', 'serverSettings', 'cookiesAccepted']

export default new Vuex.Store({
  state: {
    serverSettings: {
      authEnabled: false
    },
    baseUrl: null,
    album: null,
    image: null,
    albumWidth: 'large',
    imageWidth: 'large',
    albumsPerPage: '12',
    imagesPerPage: '12',
    albumDetailsMode: 'below',
    imageDetailsMode: 'below',
    token: null,
    cookiesAccepted: null,
    accessToken: null
  },
  getters: {
    serverSettings: state => state.serverSettings,
    token: state => state.token,
    baseUrl: state => state.baseUrl,
    album: state => state.album,
    image: state => state.image,
    albumWidth: state => state.albumWidth,
    imageWidth: state => state.imageWidth,
    albumsPerPage: state => state.albumsPerPage,
    imagesPerPage: state => state.imagesPerPage,
    albumDetailsMode: state => state.albumDetailsMode,
    imageDetailsMode: state => state.imageDetailsMode,
    cookiesAccepted: state => state.cookiesAccepted,
    accessToken: state => state.accessToken
  },
  mutations: {
    ON_SERVER_SETTINGS_CHANGED_MUTATION: function (state, newServerSettings) {
      state.serverSettings = newServerSettings

      if (newServerSettings && newServerSettings.googleAnalyticsKey) {
        if (state.cookiesAccepted === true) {
          Vue.$ga.enable()
        } else {
          Vue.$ga.disable()
        }
      }
    },
    ON_TOKEN_CHANGED_MUTATION: function (state, newToken) {
      state.token = newToken
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    },
    ON_BASE_URL_CHANGED_MUTATION: function (state, newBaseUrl) {
      state.baseUrl = newBaseUrl
    },
    ON_ALBUM_CHANGED_MUTATION: function (state, newAlbum) {
      state.album = newAlbum
    },
    ON_IMAGE_CHANGED_MUTATION: function (state, newImage) {
      state.image = newImage
    },
    ON_ALBUM_WIDTH_CHANGED_MUTATION: function (state, newAlbumWidth) {
      state.albumWidth = newAlbumWidth
    },
    ON_IMAGE_WIDTH_CHANGED_MUTATION: function (state, newImageWidth) {
      state.imageWidth = newImageWidth
    },
    ON_IMAGES_PER_PAGE_CHANGED_MUTATION: function (state, newImagesPerPage) {
      state.imagesPerPage = newImagesPerPage
    },
    ON_ALBUMS_PER_PAGE_CHANGED_MUTATION: function (state, newAlbumsPerPage) {
      state.albumsPerPage = newAlbumsPerPage
    },
    ON_IMAGE_DETAILS_MODE_CHANGED_MUTATION: function (state, newImageDetailsMode) {
      state.imageDetailsMode = newImageDetailsMode
    },
    ON_ALBUM_DETAILS_MODE_CHANGED_MUTATION: function (state, newAlbumDetailsMode) {
      state.albumDetailsMode = newAlbumDetailsMode
    },
    ON_COOKIES_ACCEPTED_MUTATION: function (state, newCookiesAccepted) {
      state.cookiesAccepted = newCookiesAccepted

      if (state.serverSettings && state.serverSettings.googleAnalyticsKey) {
        if (newCookiesAccepted === true) {
          Vue.$ga.enable()
        } else {
          Vue.$ga.disable()
        }
      }
    },
    ON_ACCESS_TOKEN_CHANGED_MUTATION: function (state, newAccessToken) {
      state.accessToken = newAccessToken
    }
  },
  actions: {
    ON_SERVER_SETTINGS_CHANGED: function ({ commit }, serverSettings) {
      commit('ON_SERVER_SETTINGS_CHANGED_MUTATION', serverSettings)
    },
    ON_TOKEN_CHANGED: function ({ commit }, token) {
      commit('ON_TOKEN_CHANGED_MUTATION', token)
    },
    ON_BASE_URL_CHANGED: function ({ commit }, baseUrl) {
      commit('ON_BASE_URL_CHANGED_MUTATION', baseUrl)
    },
    ON_ALBUM_CHANGED: function ({ commit }, album) {
      commit('ON_ALBUM_CHANGED_MUTATION', album)
    },
    ON_IMAGE_CHANGED: function ({ commit }, image) {
      commit('ON_IMAGE_CHANGED_MUTATION', image)
    },
    ON_ALBUM_WIDTH_CHANGED: function ({ commit }, albumWidth) {
      commit('ON_ALBUM_WIDTH_CHANGED_MUTATION', albumWidth)
    },
    ON_IMAGE_WIDTH_CHANGED: function ({ commit }, imageWidth) {
      commit('ON_IMAGE_WIDTH_CHANGED_MUTATION', imageWidth)
    },
    ON_IMAGES_PER_PAGE_CHANGED: function ({ commit }, imagesPerPage) {
      commit('ON_IMAGES_PER_PAGE_CHANGED_MUTATION', imagesPerPage)
    },
    ON_ALBUMS_PER_PAGE_CHANGED: function ({ commit }, albumsPerPage) {
      commit('ON_ALBUMS_PER_PAGE_CHANGED_MUTATION', albumsPerPage)
    },
    ON_IMAGE_DETAILS_MODE_CHANGED: function ({ commit }, imageDetailsMode) {
      commit('ON_IMAGE_DETAILS_MODE_CHANGED_MUTATION', imageDetailsMode)
    },
    ON_ALBUM_DETAILS_MODE_CHANGED: function ({ commit }, albumDetailsMode) {
      commit('ON_ALBUM_DETAILS_MODE_CHANGED_MUTATION', albumDetailsMode)
    },
    ON_COOKIES_ACCEPTED: function ({ commit }, cookiesAccepted) {
      commit('ON_COOKIES_ACCEPTED_MUTATION', cookiesAccepted)
    },
    ON_ACCESS_TOKEN_CHANGED: function ({ commit }, accessToken) {
      commit('ON_ACCESS_TOKEN_CHANGED_MUTATION', accessToken)
    }
  },
  plugins: [
    createPersistedState({
      key: 'frickl',
      reducer: (state, paths) => {
        var result = {}
        try {
          result = JSON.parse(JSON.stringify(state))
        } catch (err) {
          console.error(err)
          console.log(state)
        }

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
