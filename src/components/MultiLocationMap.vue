<template>
  <div id="image-map" ref="imageMap" class="d-flex justify-center align-center" :style="{ height: `${heightPercent}vh` }">
    <p class="text-h5" v-if="images === null"><v-progress-circular indeterminate></v-progress-circular></p>
    <p class="text-h5" v-else-if="images.length < 1">{{ $t('errorNoGpsAvailable') }}</p>

    <div ref="popupContent" v-if="selectedLocation">
      <img :src="getImgUrl(selectedLocation.imageIndex, 'SMALL')" width="300"/>
      <v-btn block color="primary" class="marker-button" :to="{ name: 'image-details', params: { imageId: selectedLocation.location.id } }">{{ $t('buttonView') }}</v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { getNumberWithSuffix } from '@/plugins/misc'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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
      selectedLocation: null,
      isInitializing: false
    }
  },
  watch: {
    images: function () {
      this.init()
    },
    storeTheme: function () {
      this.updateThemeLayer()
    }
  },
  methods: {
    init: function () {
      if (this.isInitializing) {
        return
      }
      this.isInitializing = true

      if (!this.pruneClusterScript) {
        const pruneClusterScript = document.createElement('script')
        pruneClusterScript.setAttribute('src', '/js/PruneCluster.js')
        pruneClusterScript.addEventListener('load', () => {
          console.log('load', window.PruneCluster)
          this.pruneClusterScript = pruneClusterScript
          this.initMap()
        })
        document.head.appendChild(pruneClusterScript)
      } else {
        console.log('already-loaded')
        this.initMap()
      }
    },
    getImgUrl: function (index, size = 'TINY') {
      let result = `${this.storeBaseUrl}image/${this.images[index].id}/img?size=${size}`

      if (this.storeToken && this.storeToken.imageToken) {
        result = `${result}&token=${this.storeToken.imageToken}`
      }
      if (this.storeAccessToken) {
        result = `${result}&accesstoken=${this.storeAccessToken}`
      }

      return result
    },
    update: function () {
      console.log('update')

      let needsAdding = false
      
      if (this.clusterer) {
        this.clusterer.RemoveMarkers()
        // this.clusterer.clearLayers()
      } else {
        needsAdding = true
        window.PruneCluster.Cluster.ENABLE_MARKERS_LIST = true
        this.clusterer = new window.PruneClusterForLeaflet()
        // this.clusterer = L.markerClusterGroup({
        //   chunkedLoading: true,
        //   iconCreateFunction: (cluster) => {
        //     const markers = cluster.getAllChildMarkers().concat().sort((a, b) => b.viewCount - a.viewCount)

        //     const html = `<div class="v-badge"> <div class="v-avatar v-avatar--density-default bg-surface-variant v-avatar--size-x-large v-avatar--variant-flat"><div class="v-responsive v-img" role="img"><div class="v-responsive__sizer" style="padding-bottom: 100%;"></div><img class="v-img__img v-img__img--contain" src="${this.getImgUrl(markers[0].imageIndex)}" style=""></div><span class="v-avatar__underlay"></span></div> <div class="v-badge__wrapper"> <span class="v-badge__badge v-theme--light bg-info" role="status" style="bottom: calc(100% - 12px); left: calc(100% - 12px);">${getNumberWithSuffix(markers.length, 0)}</span> </div> </div>`
        //     return L.divIcon({ html: html, className: 'mycluster', iconSize: L.point(56, 56), iconAnchor: [28, 28] });
        //   }
        // })

        this.clusterer.PrepareLeafletMarker = (leafletMarker, data) => {
          //listeners can be applied to markers in this function
          leafletMarker.on('click', () => {
            this.selectedLocation = {
              location: leafletMarker.data.location,
              imageIndex: leafletMarker.data.imageIndex
            }

            this.$nextTick(() => {
              // A popup can already be attached to the marker
              // bindPopup can override it, but it's faster to update the content instead
              if (leafletMarker.getPopup()) {
                  leafletMarker.setPopupContent(this.$refs.popupContent)
              } else {
                  leafletMarker.bindPopup(this.$refs.popupContent)
              }
            })
          })
        }

        this.clusterer.BuildLeafletClusterIcon = (cluster) => {
            const population = cluster.population

            // If you want list of markers inside the cluster
            // (you must enable the option using PruneCluster.Cluster.ENABLE_MARKERS_LIST = true)
            const markers = cluster.GetClusterMarkers() 

            const html = `<div class="v-badge"> <div class="v-avatar v-avatar--density-default bg-surface-variant v-avatar--size-x-large v-avatar--variant-flat"><div class="v-responsive v-img" role="img"><div class="v-responsive__sizer" style="padding-bottom: 100%;"></div><img class="v-img__img v-img__img--contain" src="${this.getImgUrl(markers[0].data.imageIndex)}" style=""></div><span class="v-avatar__underlay"></span></div> <div class="v-badge__wrapper"> <span class="v-badge__badge v-theme--light bg-info" role="status" style="bottom: calc(100% - 12px); left: calc(100% - 12px);">${getNumberWithSuffix(population, 0)}</span> </div> </div>`
            return L.divIcon({ html: html, className: 'mycluster', iconSize: L.point(56, 56), iconAnchor: [28, 28] });
        }
      }

      const latLngBounds = L.latLngBounds()
      if (this.images) {
        this.images.forEach((l, i) => {
          const html = `<div class="v-badge"> <div class="v-avatar v-avatar--density-default bg-surface-variant v-avatar--size-x-large v-avatar--variant-flat"><div class="v-responsive v-img" role="img"><div class="v-responsive__sizer" style="padding-bottom: 100%;"></div><img class="v-img__img v-img__img--contain" src="${this.getImgUrl(i)}" style=""></div><span class="v-avatar__underlay"></span></div> <div class="v-badge__wrapper"> </div> </div>`
          const icon = L.divIcon({ html: html, className: 'mycluster', iconSize: L.point(56, 56), iconAnchor: [28, 0] });
          const marker = new window.PruneCluster.Marker(l.latitude, l.longitude)

          marker.data.viewCount = l.viewCount
          marker.data.imageIndex = i
          marker.data.location = l
          marker.icon = icon
          marker.popup = ''

          this.clusterer.RegisterMarker(marker)
          
          // marker.imageIndex = i
          // marker.viewCount = l.viewCount
          // marker.on('click', e => {
          //   this.selectedLocation = {
          //     location: l,
          //     imageIndex: i
          //   }

          //   this.$nextTick(() => {
          //     const popup = e.target.getPopup()
          //     popup.setContent(this.$refs.popupContent)
          //   })
          // })
          // this.clusterer.addLayer(marker)
          // l.location = L.latLng(l.latitude, l.longitude)
          // latLngBounds.extend(l.location)
        })
      }

      if (needsAdding) {
        this.map.addLayer(this.clusterer)
      }

      if (this.images) {
        if (this.images.length === 1) {
          this.map.panTo([this.images[0].latitude, this.images[0].longitude])
        } else if (latLngBounds.isValid()) {
          this.map.fitBounds(latLngBounds.pad(0.1))
        }
      }

      this.isInitializing = false
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
      this.map.setView(center, 1)

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

      this.map.whenReady(() => {
        this.update()
      })
    }
  },
  beforeUnmount: function () {
    if (this.pruneClusterScript) {
      this.pruneClusterScript.remove()
    }
  },
  mounted: function () {
    this.init()
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
  bottom: 10px;
  right: 10px;
  position: absolute;
}

#image-map .leaflet-popup-content-wrapper {
  background: transparent;
  padding: 0;
  border-radius: 0;
}
#image-map .leaflet-popup-content {
  margin: 0;
  width: 300px !important;
}
#image-map .leaflet-popup-content .v-btn {
  border-radius: 0;
}
#image-map .leaflet-popup-tip {
  background-color: rgb(var(--v-theme-primary));
}
</style>