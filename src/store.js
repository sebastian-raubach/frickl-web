import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authEnabled: false,
    baseUrl: null,
    album: null,
    image: null,
    albumWidth: 'large',
    imageWidth: 'large',
    albumsPerPage: '12',
    imagesPerPage: '12',
    albumDetailsMode: 'below',
    imageDetailsMode: 'below',
    token: null
  },
  getters: {
    authEnabled: state => state.authEnabled,
    token: state => state.token,
    baseUrl: state => state.baseUrl,
    album: state => state.album,
    image: state => state.image,
    albumWidth: state => state.albumWidth,
    imageWidth: state => state.imageWidth,
    albumsPerPage: state => state.albumsPerPage,
    imagesPerPage: state => state.imagesPerPage,
    albumDetailsMode: state => state.albumDetailsMode,
    imageDetailsMode: state => state.imageDetailsMode
  },
  mutations: {
    ON_AUTH_CHANGED_MUTATION: function (state, newAuthEnabled) {
      state.authEnabled = newAuthEnabled
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
    }
  },
  actions: {
    ON_AUTH_CHANGED: function ({ commit }, authEnabled) {
      commit('ON_AUTH_CHANGED_MUTATION', authEnabled)
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
    }
  },
  plugins: [
    createPersistedState({
      key: 'frickl'
    })
  ]
})
