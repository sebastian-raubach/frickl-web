<template>
  <div>
    <div class="map-spinner d-flex justify-content-center h-100 align-items-center" v-if="!locations || locations.length < 1">
      <b-spinner label="Loading..." type="grow" variant="primary" v-if="!locations" />
      <h2 v-else>No images with geographic locations found.</h2>
    </div>
    <div class="location-map" id="location-map">
    </div>
    <div v-if="location" ref="popupContent">
      <img :src="getSrc(location.id, 'SMALL')" width="300"/>
      <button class="btn btn-primary btn-block marker-button" @click="onMarkerClicked(location)">Select</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'

export default {
  data: function () {
    return {
      locations: null,
      location: null,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  computed: {
    ...mapGetters([
      'baseUrl',
      'token',
      'accessToken'
    ])
  },
  methods: {
    getSrc: function (id, size) {
      let result = `${this.baseUrl}image/${id}/img?size=${size}`

      if (this.token && this.token.imageToken) {
        result = `${result}&token=${this.token.imageToken}`
      }
      if (this.accessToken) {
        result = `${result}&accesstoken=${this.accessToken}`
      }

      return result
    },
    onMarkerClicked: function (location) {
      this.$router.push('images/' + location.id)
    }
  },
  mounted: function () {
    // Note: We create the map and markers and popups manually, because using the Vue way of doing things, it would
    // create reactive vue elements for each marker which is a big overhead (sloooow). Popups are dynamically
    // populated on demand as well, to further reduce the load.
    const map = L.map('location-map')

    map.on('load', () => {
      const markers = L.markerClusterGroup()

      this.apiGetLocations(result => {
        if (result && result.length > 0) {
          const latLngBounds = L.latLngBounds()
          result.forEach(l => {
            const marker = L.marker([l.latitude, l.longitude]).bindPopup('')
            marker.on('click', e => {
              this.location = l

              this.$nextTick(() => {
                const popup = e.target.getPopup()
                popup.setContent(this.$refs.popupContent)
              })
            })
            markers.addLayer(marker)
            l.location = L.latLng(l.latitude, l.longitude)
            latLngBounds.extend(l.location)
          })

          map.addLayer(markers)

          this.locations = result

          if (result.length === 1) {
            map.panTo([this.locations[0].latitude, this.locations[0].longitude])
          } else {
            map.fitBounds(latLngBounds.pad(0.1))
          }

          map.on('popupopen', e => {
            const px = map.project(e.popup._latlng)
            px.y -= e.popup._container.clientHeight / 2
            map.panTo(map.unproject(px), { animate: true })
          })
        } else {
          this.locations = []
        }
      })
    })

    map.setView([22.5937, 2.1094], 3)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
  }
}
</script>

<style>
  .location-map {
    height: calc(100vh - 66px) !important;
  }
  .marker-button {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .leaflet-popup-content-wrapper {
    padding: 0;
    border-radius: 0;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .leaflet-popup-content {
    margin: 0;
    width: 300px !important;
  }
  .map-spinner {
    position: absolute;
    z-index: 1001;
    width: 100%;
    height: calc(100vh - 66px) !important;
    background-color: rgba(0,0,0,.6);
    color: white;
  }
  .map-spinner > span {
    width: 6rem;
    height: 6rem;
  }
</style>
