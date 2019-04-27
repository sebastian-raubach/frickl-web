<template>
  <div>
    <b-container class="home mt-3" fluid>
      <div v-if="(albums && albums.length > 0) || (images && images.length > 0)">
        <div v-if="albums && albums.length > 0">
          <h1>Albums</h1>
          <album-grid :baseUrl="baseUrl"
                      :albumCount="albumCount"
                      :albumsPerPage="albumsPerPage"
                      :albums="albums"
                      v-on:onAlbumNavigation="page => onAlbumNavigation(page)"/>
        </div>
        <div v-if="tags && tags.length > 0" class="tags">
          <h1>Tags</h1>
          <div>
            <b-badge v-for="tag in tags" :key="tag.id" class="tag-badge" :to="'/tags/' + tag.id">
              {{ tag.name }}
            </b-badge>
          </div>
          <b-button variant="primary" size="sm" class="mt-3">Apply to all</b-button>
        </div>
        <div v-if="images && images.length > 0">
          <h1>Images</h1>
          <image-grid :baseUrl="baseUrl"
                      :imageCount="imageCount"
                      :imagesPerPage="imagesPerPage"
                      :images="images"
                      :albumId="parentAlbumId"
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

import AlbumGrid from '../components/AlbumGrid.vue'
import ImageGrid from '../components/ImageGrid.vue'
import AlbumLocationMap from '../components/AlbumLocationMap.vue'

export default {
  props: [ 'baseUrl' ],
  components: {
    'album-grid': AlbumGrid,
    'image-grid': ImageGrid,
    'album-location-map': AlbumLocationMap
  },
  data: function () {
    return {
      albums: [],
      albumCount: 0,
      albumsPerPage: 12,
      images: [],
      imageCount: 0,
      imagesPerPage: 12,
      parentAlbumId: null,
      locations: [],
      currentlyVisibleIds: [],
      tags: []
    }
  },
  methods: {
    onAlbumNavigation: function (page) {
      var vm = this

      this.apiGetAlbums(this.parentAlbumId, page - 1, this.albumsPerPage, function (result) {
        vm.albums = result
      })
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

    this.apiGetAlbumCount(this.parentAlbumId, function (result) {
      vm.albumCount = result
      vm.onAlbumNavigation(1)
    })

    if (this.parentAlbumId) {
      this.apiGetAlbum(this.parentAlbumId, function (result) {
        vm.$store.dispatch('ON_ALBUM_CHANGED', result[0])
      })
      this.apiGetImageCount(this.parentAlbumId, function (result) {
        vm.imageCount = result
        vm.onImageNavigation(1)
      })
      this.apiGetAlbumLocations(this.parentAlbumId, function (result) {
        result.forEach(function (l) {
          l.location = L.latLng(l.latitude, l.longitude)
        })
        vm.locations = result
      })
      this.apiGetAlbumTags(this.parentAlbumId, function (result) {
        vm.tags = result
      })
    }
  }
}
</script>
