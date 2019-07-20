import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-xxl/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Tooltip from 'bootstrap-vue/es/directives/tooltip'

import 'vue-material-design-icons/styles.css'

import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

import 'baguettebox.js/dist/baguetteBox.min.css'

import mixin from './mixin/mixin.js'
import api from './mixin/api.js'

import VueInsProgressBar from 'vue-ins-progress-bar'

import VueApexCharts from 'vue-apexcharts'

Vue.component('apexchart', VueApexCharts)

Vue.use(VueInsProgressBar, {
  show: true,
  position: 'initial',
  height: '5px'
})

Vue.mixin(mixin)
Vue.mixin(api)

Vue.use(BootstrapVue)
Vue.use(Tooltip)

Vue.component('l-map', LMap)
Vue.component('l-popup', LPopup)
Vue.component('l-tile-layer', LTileLayer)
Vue.component('l-marker', LMarker)
Vue.component('v-marker-cluster', Vue2LeafletMarkerCluster)

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

Vue.config.productionTip = false

Vue.filter('toDateTime', function (value) {
  if (value) {
    var date = new Date(value)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  } else {
    return null
  }
})
Vue.filter('toDate', function (value) {
  if (value) {
    var date = new Date(value)
    return date.toLocaleDateString()
  } else {
    return null
  }
})

// Global event bus
Vue.prototype.$eventHub = new Vue()

// Set base URL based on environment
var baseUrl = 'http://localhost:8080/frickl/v1/api/'

if (process.env.VUE_APP_BASE_URL) {
  baseUrl = process.env.VUE_APP_BASE_URL
}

store.commit('ON_BASE_URL_CHANGED_MUTATION', baseUrl)

let axiosDefaults = require('axios/lib/defaults')
axiosDefaults.baseURL = baseUrl

// Make sure jQuery is available
Vue.use({
  install: function (Vue, options) {
    Vue.prototype.$jQuery = require('jquery')
    window.jQuery = Vue.prototype.$jQuery
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
