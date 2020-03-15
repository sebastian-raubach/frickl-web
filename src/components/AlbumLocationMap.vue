<template>
  <l-map
    :zoom="zoom"
    class="album-map"
    ref="map">
    <l-tile-layer
      :url="url"
      :attribution="attribution"/>
    <l-marker v-for="location in locations" :key="location.id" :lat-lng="location.location" :icon="getIcon(location)" :zIndexOffset="getZOffset(location)"/>
  </l-map>
</template>

<script>
import L from 'leaflet'
export default {
  data: function () {
    return {
      latLngBounds: L.latLngBounds(),
      defaultIcon: L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMC41ODMgMTAuNTgzIiBoZWlnaHQ9IjQwIiB3aWR0aD0iNDAiPjxwYXRoIGQ9Ik01LjI5Mi4yNjVhMy44NyAzLjg2NyAwIDAgMC0zLjg3IDMuODY3IDMuODcgMy44NjcgMCAwIDAgLjc3OCAyLjMyaC0uMDA1bC4wNDYuMDU3YTMuODcgMy44NjcgMCAwIDAgLjA0NC4wNTVsMy4wMDcgMy43NTUgMi45NTMtMy42OWEzLjg3IDMuODY3IDAgMCAwIC4wMjQtLjAyOGwuMTE5LS4xNWgtLjAwNmEzLjg3IDMuODY3IDAgMCAwIC43OC0yLjMyQTMuODcgMy44NjcgMCAwIDAgNS4yOTIuMjY2eiIgZmlsbD0iIzI5ODBiOSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9Ii41MjkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      }),
      selectedIcon: L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDEwLjU4MyAxMC41ODMiPjxwYXRoIGQ9Ik01LjI5Mi4yNjVhMy44NyAzLjg2NyAwIDAgMC0zLjg3IDMuODY3IDMuODcgMy44NjcgMCAwIDAgLjc3OCAyLjMyaC0uMDA1bC4wNDYuMDU3YTMuODcgMy44NjcgMCAwIDAgLjA0NC4wNTVsMy4wMDcgMy43NTUgMi45NTMtMy42OWEzLjg3IDMuODY3IDAgMCAwIC4wMjQtLjAyOGwuMTE5LS4xNWgtLjAwNmEzLjg3IDMuODY3IDAgMCAwIC43OC0yLjMyQTMuODcgMy44NjcgMCAwIDAgNS4yOTIuMjY2eiIgZmlsbD0iI2U3NGMzYyIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9Ii41MjkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      }),
      url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }
  },
  props: {
    locations: {
      type: Array,
      default: null
    },
    currentlyVisibleIds: {
      type: Array,
      default: null
    },
    zoom: {
      type: Number,
      default: 3
    }
  },
  methods: {
    getIcon: function (location) {
      if (this.currentlyVisibleIds && this.currentlyVisibleIds.length > 0 && this.currentlyVisibleIds.includes(location.id)) {
        return this.selectedIcon
      } else {
        return this.defaultIcon
      }
    },
    getZOffset: function (location) {
      if (this.currentlyVisibleIds && this.currentlyVisibleIds.length > 0 && this.currentlyVisibleIds.includes(location.id)) {
        return 1000
      } else {
        return null
      }
    }
  },
  mounted: function () {
    this.locations.forEach(l => {
      this.latLngBounds.extend(l.location)
    })

    const map = this.$refs.map

    if (this.locations.length === 1) {
      map.setCenter(this.locations[0].location)
      map.setZoom(10)
    } else {
      map.fitBounds(this.latLngBounds.pad(0.5))
    }

    // Disable zoom until focus gained, disable when blur
    const mapObject = map.mapObject
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

<style>
  .album-map {
    height: 500px !important;
  }
</style>
