<template>
  <l-map
    :zoom="zoom"
    class="location-map"
    ref="map">
    <l-tile-layer
      :url="url"
      :attribution="attribution"/>
    <v-marker-cluster>
      <l-marker v-for="location in locations" :key="location.id" :lat-lng="location.location" />
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
    })
  }
}
</script>

<style>
  .location-map {
    height: calc(100vh - 60px) !important;
  }
</style>
