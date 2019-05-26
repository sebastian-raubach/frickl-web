<template>
  <b-container class="pt-3" fluid>
    <h1>Maps</h1>
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
  </b-container>
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
      result.forEach(function (l) {
        l.location = L.latLng(l.latitude, l.longitude)
      })

      vm.locations = result
    })
  }
}
</script>

<style>
  .location-map {
    height: 100vh !important;
  }
</style>
