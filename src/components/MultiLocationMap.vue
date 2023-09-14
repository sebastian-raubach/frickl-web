<template>
  <div id="image-map" ref="imageMap" class="d-flex justify-center align-center" :style="{ height: `${heightPercent}vh` }">
    <p class="text-h5" v-if="images === null"><v-progress-circular indeterminate></v-progress-circular></p>
    <p class="text-h5" v-else-if="images.length < 1">{{ $vuetify.locale.t('errorNoGpsAvailable') }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { getNumberWithSuffix } from '@/plugins/misc'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

export default {
  props: {
    images: {
      type: Array,
      default: () => null
    },
    heightPercent: {
      type: Number,
      default: 75
    }
  },
  computed: {
    ...mapGetters([
      'storeTheme',
      'storeBaseUrl',
      'storeToken',
      'storeAccessToken'
    ])
  },
  data: function () {
    return {
      selectedLocation: null
    }
  },
  watch: {
    images: function () {
      this.initMap()
      this.update()
    },
    storeTheme: function () {
      this.updateThemeLayer()
    }
  },
  methods: {
    getImgUrl: function (index) {
      let result = `${this.storeBaseUrl}image/${this.images[index].id}/img?size=TINY`

      if (this.storeToken && this.storeToken.imageToken) {
        result = `${result}&token=${this.storeToken.imageToken}`
      }
      if (this.storeAccessToken) {
        result = `${result}&accesstoken=${this.storeAccessToken}`
      }

      return result
    },
    update: function () {
      if (this.clusterer) {
        this.clusterer.clearLayers()
      } else {
        this.clusterer = L.markerClusterGroup({
          chunkedLoading: true,
          iconCreateFunction: (cluster) => {
            const markers = cluster.getAllChildMarkers().concat().sort((a, b) => b.viewCount - a.viewCount)

            const html = `<div class="v-badge"> <div class="v-avatar v-avatar--density-default bg-surface-variant v-avatar--size-x-large v-avatar--variant-flat"><div class="v-responsive v-img" role="img"><div class="v-responsive__sizer" style="padding-bottom: 100%;"></div><img class="v-img__img v-img__img--contain" src="${this.getImgUrl(markers[0].imageIndex)}" style=""></div><span class="v-avatar__underlay"></span></div> <div class="v-badge__wrapper"> <span class="v-badge__badge v-theme--light bg-info" role="status" style="bottom: calc(100% - 12px); left: calc(100% - 12px);">${getNumberWithSuffix(markers.length, 0)}</span> </div> </div>`
            return L.divIcon({ html: html, className: 'mycluster', iconSize: L.point(60, 60), iconAnchor: [30, 30] });
          }
        })
      }

      const latLngBounds = L.latLngBounds()
      if (this.images) {
        this.images.forEach((l, i) => {
          const marker = L.marker([l.latitude, l.longitude]).bindPopup('')
          marker.imageIndex = i
          marker.viewCount = l.viewCount
          marker.on('click', e => {
            this.selectedLocation = l

            this.$nextTick(() => {
              const popup = e.target.getPopup()
              popup.setContent(this.$refs.popupContent)
            })
          })
          this.clusterer.addLayer(marker)
          l.location = L.latLng(l.latitude, l.longitude)
          latLngBounds.extend(l.location)
        })
      }

      this.map.addLayer(this.clusterer)

      if (this.images) {
        if (this.images.length === 1) {
          this.map.panTo([this.images[0].latitude, this.images[0].longitude])
        } else if (latLngBounds.isValid()) {
          this.map.fitBounds(latLngBounds.pad(0.1))
        }
      }
    },
    updateThemeLayer: function () {
      if (this.themeLayer) {
        this.themeLayer.setUrl(`//services.arcgisonline.com/arcgis/rest/services/Canvas/${this.storeTheme === 'fricklDark' ? 'World_Dark_Gray_Base' : 'World_Light_Gray_Base'}/MapServer/tile/{z}/{y}/{x}`)
      }
    },
    initMap: function () {
      if (this.map) {
        return
      }

      this.map = L.map(this.$refs.imageMap)

      const center = [32, 32]
      this.map.setView(center, 5)

      // Add OSM as the default
      this.themeLayer = L.tileLayer(`//services.arcgisonline.com/arcgis/rest/services/Canvas/${this.storeTheme === 'fricklDark' ? 'World_Dark_Gray_Base' : 'World_Light_Gray_Base'}/MapServer/tile/{z}/{y}/{x}`, {
        id: this.storeTheme === 'fricklDark' ? 'Esri Dark Gray Base' : 'Esri Light Gray Base',
        attribution: 'Esri, HERE, Garmin, FAO, NOAA, USGS, © OpenStreetMap contributors, and the GIS User Community',
        maxZoom: 21,
        maxNativeZoom: 15
      })

      this.map.addLayer(this.themeLayer)

      // Add an additional satellite layer
      const satellite = L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        id: 'Esri WorldImagery',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 21,
        maxNativeZoom: 19
      })

      const baseMaps = {
        OpenStreetMap: this.themeLayer,
        'Esri WorldImagery': satellite
      }

      L.control.layers(baseMaps).addTo(this.map)
    }
  },
  mounted: function () {
    this.initMap()
    this.update()
  }
}
</script>

<style>
.v-theme--fricklDark .leaflet-control-attribution {
  background: rgba(0,0,0,0.8) !important;
  color: #ccc !important;
}

.v-theme--fricklDark .leaflet-bar a {
  background-color: rgb(24, 26, 27);
  border-bottom-color: rgb(62, 68, 70);
  color: rgb(232, 230, 227);
}

.v-theme--fricklDark .leaflet-bar a:hover, .leaflet-bar a:focus {
  background-color: rgb(30, 33, 34);
}

.v-theme--fricklDark .leaflet-control-layers {
  box-shadow: rgba(0, 0, 0, 0.4) 0px 1px 5px;
  background-color: rgb(24, 26, 27);
}

.v-theme--fricklDark .leaflet-control-layers-separator {
  border-top-color: rgb(58, 62, 65);
}

.v-theme--fricklDark .leaflet-control-layers-expanded {
  color: rgb(200, 195, 188);
  background-image: initial;
  background-color: rgb(24, 26, 27);
}

#image-map .v-badge .v-badge__wrapper {
  bottom: 15px;
  right: 15px;
  position: absolute;
}
</style>