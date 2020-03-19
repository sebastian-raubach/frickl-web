<template>
  <l-map
    :zoom="zoom"
    :center="center"
    class="map"
    ref="map">
    <l-tile-layer
      :url="url"
      :attribution="attribution"/>
    <l-marker :lat-lng="center"></l-marker>
  </l-map>
</template>

<script>
import L from 'leaflet'
export default {
  data: function () {
    return {
      center: L.latLng(this.latitude, this.longitude),
      url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  props: {
    latitude: {
      type: Number,
      default: 0,
      validator (value) {
        return value >= -90 && value <= 90
      }
    },
    longitude: {
      type: Number,
      default: 0,
      validator (value) {
        return value >= -180 && value <= 180
      }
    },
    zoom: {
      type: Number,
      default: 3
    }
  },
  mounted: function () {
    // Disable zoom until focus gained, disable when blur
    const mapObject = this.$refs.map.mapObject
    mapObject.scrollWheelZoom.disable()
    mapObject.on('focus', () => {
      mapObject.scrollWheelZoom.enable()
    })
    mapObject.on('blur', () => {
      mapObject.scrollWheelZoom.disable()
    })
  }
}
</script>

<style scoped>
  .map {
    height: 300px;
  }
</style>
