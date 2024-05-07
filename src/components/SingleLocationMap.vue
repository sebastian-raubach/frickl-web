<template>
  <div id="single-image-map" ref="imageMap" class="d-flex justify-center align-center" v-if="image">
    <p class="text-h5">{{ $t('errorNoGpsAvailable') }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

// Set the leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl
})

export default {
  props: {
    image: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    ...mapGetters([
      'storeTheme'
    ])
  },
  watch: {
    image: function () {
      this.update()
    },
    storeTheme: function () {
      this.updateThemeLayer()
    }
  },
  methods: {
    updateThemeLayer: function () {
      if (this.themeLayer) {
        this.themeLayer.setUrl(`//services.arcgisonline.com/arcgis/rest/services/Canvas/${this.storeTheme === 'fricklDark' ? 'World_Dark_Gray_Base' : 'World_Light_Gray_Base'}/MapServer/tile/{z}/{y}/{x}`)
      }
    },
    initMap: function () {
      if (!this.image || this.map || this.image.exif.gpsLatitude === undefined || this.image.exif.gpsLatitude === null || this.image.exif.gpsLongitude === undefined || this.image.exif.gpsLongitude === null) {
        return
      }

      this.map = L.map(this.$refs.imageMap)

      const center = [this.image.exif.gpsLatitude, this.image.exif.gpsLongitude]

      this.map.setView(center, 5)

      // Add OSM as the default
      this.themeLayer = L.tileLayer(`//services.arcgisonline.com/arcgis/rest/services/Canvas/${this.storeTheme === 'fricklDark' ? 'World_Dark_Gray_Base' : 'World_Light_Gray_Base'}/MapServer/tile/{z}/{y}/{x}`, {
        id: this.storeTheme === 'fricklDark' ? 'Esri Dark Gray Base' : 'Esri Light Gray Base',
        attribution: 'Esri, HERE, Garmin, FAO, NOAA, USGS, © OpenStreetMap contributors, and the GIS User Community',
        maxZoom: 21,
        maxNativeZoom: 19
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

      L.marker(center).addTo(this.map)
    }
  },
  mounted: function () {
    this.initMap()
  }
}
</script>

<style>
#single-image-map {
  height: 300px;
}

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
</style>