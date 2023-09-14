<template>
  <v-container>
    <h1 class="text-h4 mb-3">
      Albums
    </h1>
    <v-divider class="mb-3" />
    <AlbumGallery :getData="getAlbums" />

    <h1 class="text-h4 mb-3 mt-6">
      Images
    </h1>
    <v-divider class="mb-3" />
    <ImageGallery :getData="getImages" />
  </v-container>
</template>

<script>
import AlbumGallery from '@/components/AlbumGallery.vue'
import ImageGallery from '@/components/ImageGallery.vue'
import { apiPostAlbums, apiPostImages } from '@/plugins/api'

export default {
  components: {
    AlbumGallery,
    ImageGallery
  },
  data: function () {
    return {
      parentAlbumId: null
    }
  },
  methods: {
    getAlbums: function (params) {
      const adjusted = Object.assign({}, params, { parentAlbumId: this.parentAlbumId })
      return apiPostAlbums(adjusted)
    },
    getImages: function (params) {
      const adjusted = Object.assign({}, params, { albumId: this.parentAlbumId })
      return apiPostImages(adjusted)
    }
  },
  created: function () {
    if (this.$route.params && this.$route.params.parentAlbumId) {
      this.parentAlbumId = parseInt(this.$route.params.parentAlbumId)
    }
  }
}
</script>

<style>

</style>
