import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseUrl: null,
    album: null,
    image: null
  },
  getters: {
    baseUrl: state => state.baseUrl,
    album: state => state.album,
    image: state => state.image
  },
  mutations: {
    ON_BASE_URL_CHANGED_MUTATION: function (state, newBaseUrl) {
      state.baseUrl = newBaseUrl
    },
    ON_ALBUM_CHANGED_MUTATION: function (state, newAlbum) {
      state.album = newAlbum
    },
    ON_IMAGE_CHANGED_MUTATION: function (state, newImage) {
      state.image = newImage
    }
  },
  actions: {
    ON_BASE_URL_CHANGED: function ({ commit }, baseUrl) {
      commit('ON_BASE_URL_CHANGED_MUTATION', baseUrl)
    },
    ON_ALBUM_CHANGED: function ({ commit }, album) {
      commit('ON_ALBUM_CHANGED_MUTATION', album)
    },
    ON_IMAGE_CHANGED: function ({ commit }, image) {
      commit('ON_IMAGE_CHANGED_MUTATION', image)
    }
  },
  plugins: [
    createPersistedState()
  ]
})
