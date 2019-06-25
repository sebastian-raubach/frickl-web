<template>
  <l-map
    :zoom="zoom"
    class="location-map"
    ref="map">
    <l-tile-layer
      :url="url"
      :attribution="attribution"/>
    <v-marker-cluster>
      <l-marker v-for="location in locations" :key="location.id" :lat-lng="location.location">
        <l-popup>
          <img :src="baseUrl + 'image/' + location.id + '/img?small=true'" width=300/>
          <b-button variant="primary" class="btn-block marker-button" @click="onMarkerClicked(location)">Select</b-button>
        </l-popup>
      </l-marker>
    </v-marker-cluster>
  </l-map>
</template>

<script>
import L from 'leaflet'

export default {
  data: function () {
    return {
      locations: [],
      zoom: 3,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  props: [ 'baseUrl' ],
  methods: {
    onMarkerClicked: function (location) {
      this.$router.push('images/' + location.id)
    }
  },
  mounted: function () {
    var vm = this

    this.apiGetLocations(function (result) {
      var latLngBounds = L.latLngBounds()
      result.forEach(function (l) {
        l.location = L.latLng(l.latitude, l.longitude)
        latLngBounds.extend(l.location)
      })

      vm.locations = result

      if (result.length === 1) {
        vm.$refs.map.setCenter(vm.locations[0].latLng)
        vm.zoom = 10
      } else {
        vm.$refs.map.fitBounds(latLngBounds.pad(0.1))
      }

      var mapObject = vm.$refs.map.mapObject
      mapObject.on('popupopen', function (e) {
        var px = mapObject.project(e.popup._latlng)
        px.y -= e.popup._container.clientHeight / 2
        mapObject.panTo(mapObject.unproject(px), { animate: true })
      })
    })
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
</style>
