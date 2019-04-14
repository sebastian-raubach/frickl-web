<template>
  <div>
    <b-container class="home mt-3" fluid>
      <div v-if="(albums && albums.length > 0) || (images && images.length > 0)">
        <div v-if="albums && albums.length > 0">
          <h1>Albums</h1>
          <b-row>
            <b-col cols=12 sm=4 md=3 lg=3 v-for="album in albums" :key="album.id">
              <album-node :album="album" :baseUrl="baseUrl" v-on:click.native="onAlbumClicked(album)"/>
            </b-col>
          </b-row>
        </div>
        <div v-if="images && images.length > 0">
          <h1>Images</h1>
          <image-grid :baseUrl="baseUrl"
                      :imageCount="imageCount"
                      :imagesPerPage="imagesPerPage"
                      :images="images"
                      v-on:onImageNavigation="page => onImageNavigation(page)"/>
        </div>
      </div>
      <h3 v-else>No albums or images found.</h3>
    </b-container>
    <div class="map" v-if="locations && locations.length > 0">
      <album-location-map :locations="locations" :currentlyVisibleIds="currentlyVisibleIds" />
    </div>
  </div>
</template>

<script>
import L from 'leaflet'

import AlbumNode from '../components/AlbumNode.vue'
import ImageGrid from '../components/ImageGrid.vue'
import AlbumLocationMap from '../components/AlbumLocationMap.vue'

export default {
  props: [ 'baseUrl' ],
  components: {
    'album-node': AlbumNode,
    'image-grid': ImageGrid,
    'album-location-map': AlbumLocationMap
  },
  data: function () {
    return {
      albums: [],
      images: [],
      imageCount: 0,
      imagesPerPage: 12,
      parentAlbumId: null,
      locations: [],
      currentlyVisibleIds: []
    }
  },
  methods: {
    onAlbumClicked: function (album) {
      this.$store.dispatch('ON_ALBUM_CHANGED', album)
    },
    onImageNavigation: function (page) {
      var vm = this

      this.apiGetImages(this.parentAlbumId, page - 1, this.imagesPerPage, function (result) {
        vm.images = result

        vm.currentlyVisibleIds = result.map(function (i) {
          return i.id
        })
      })
    }
  },
  mounted: function () {
    var vm = this

    this.parentAlbumId = this.$route.params.albumId

    this.apiGetAlbums(this.parentAlbumId, function (result) {
      vm.albums = result
    })

    if (this.parentAlbumId) {
      this.apiGetAlbum(this.parentAlbumId, function (result) {
        vm.$store.dispatch('ON_ALBUM_CHANGED', result[0])
      })
      this.apiGetImageCount(this.parentAlbumId, function (result) {
        vm.imageCount = result
        vm.imagesCurPage = 1
        vm.onImageNavigation(1)
      })
    }

    this.apiGetAlbumLocations(this.parentAlbumId, function (result) {
      result.forEach(function (l) {
        l.location = L.latLng(l.latitude, l.longitude)
      })
      vm.locations = result
    })
  }
}
</script>
