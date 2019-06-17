<template>
  <b-container class="mt-3">
    <h1>Search: {{ searchTerm }}</h1>

    <template v-if="images || albums">
      <album-grid v-if="albums && albums.length > 0"
                :baseUrl="baseUrl"
                :albumCount="albumCount"
                :albumsPerPage="albumsPerPage"
                :albums="albums"
                ref="albumGrid"
                v-on:onAlbumNavigation="page => onAlbumNavigation(page)"/>

      <image-grid v-if="images && images.length > 0"
                :baseUrl="baseUrl"
                :imageCount="imageCount"
                :imagesPerPage="imagesPerPage"
                :images="images"
                ref="imageGrid"
                v-on:onImageNavigation="page => onImageNavigation(page)"/>
    </template>
    <h3 v-else>Loading...</h3>
  </b-container>
</template>

<script>
import AlbumGrid from '../components/AlbumGrid.vue'
import ImageGrid from '../components/ImageGrid.vue'

export default {
  data: function () {
    return {
      searchTerm: '',
      albumsPerPage: 12,
      imagesPerPage: 12,
      albumsCurPage: 1,
      imagesCurPage: 1,
      albumCount: 0,
      imageCount: 0,
      albums: null,
      images: null
    }
  },
  props: [ 'baseUrl' ],
  components: {
    'album-grid': AlbumGrid,
    'image-grid': ImageGrid
  },
  methods: {
    onImageNavigation: function (page) {
      var vm = this

      this.apiGetImagesForSearch(this.searchTerm, page - 1, this.imagesPerPage, function (result) {
        vm.images = result
      })
    },
    onAlbumNavigation: function (page) {
      var vm = this

      this.apiGetAlbumsForSearch(this.searchTerm, page - 1, this.albumsPerPage, function (result) {
        vm.albums = result
      })
    }
  },
  mounted: function () {
    this.searchTerm = this.$route.params.searchTerm

    var vm = this
    this.apiGetImageCountForSearch(this.searchTerm, function (result) {
      vm.imageCount = result
      vm.imagesCurPage = 1
      vm.onImageNavigation(1)
    })
    this.apiGetAlbumCountForSearch(this.searchTerm, function (result) {
      vm.albumCount = result
      vm.imagesCurPage = 1
      vm.onAlbumNavigation(1)
    })
  }
}
</script>

<style>

</style>
