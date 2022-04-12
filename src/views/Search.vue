<template>
  <b-container fluid class="mt-3">
    <h1>Search: {{ searchTerm }}</h1>

    <template v-if="images || albums">
      <album-grid v-if="albums && albums.length > 0"
                  :albumCount="albumCount"
                  :albumsPerPage="albumsPerPage"
                  :albums="albums"
                  ref="albumGrid"
                  v-on:onAlbumNavigation="page => onAlbumNavigation(page)"/>

      <image-grid v-if="images && images.length > 0"
                  :imageCount="imageCount"
                  :images="images"
                  ref="imageGrid"
                  v-on:onImageNavigation="page => onImageNavigation(page)"/>
    </template>
    <h3 v-else>Loading...</h3>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import AlbumGrid from '../components/AlbumGrid.vue'
import ImageGrid from '../components/ImageGrid.vue'

export default {
  data: function () {
    return {
      searchTerm: '',
      albumsPerPage: 12,
      albumCount: 0,
      imageCount: 0,
      albums: null,
      images: null
    }
  },
  components: {
    'album-grid': AlbumGrid,
    'image-grid': ImageGrid
  },
  computed: {
    ...mapGetters([
      'imagesPerPage'
    ])
  },
  watch: {
    imagesPerPage: function (newValue, oldValue) {
      this.onImageNavigation(1)
    }
  },
  methods: {
    onImageNavigation: function (page) {
      this.apiGetImagesForSearch(this.searchTerm, page - 1, this.imagesPerPage, result => {
        this.images = result
      })
    },
    onAlbumNavigation: function (page) {
      this.apiGetAlbumsForSearch(this.searchTerm, page - 1, this.albumsPerPage, result => {
        this.albums = result
      })
    }
  },
  mounted: function () {
    this.searchTerm = this.$route.params.searchTerm

    this.apiGetImageCountForSearch(this.searchTerm, result => {
      this.imageCount = result
      this.onImageNavigation(1)
    })
    this.apiGetAlbumCountForSearch(this.searchTerm, result => {
      this.albumCount = result
      this.onAlbumNavigation(1)
    })
  }
}
</script>

<style>

</style>
