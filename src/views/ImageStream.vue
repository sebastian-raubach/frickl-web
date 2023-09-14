<template>
  <v-container>
    <h1 class="text-h4 mb-3">
      Image stream
    </h1>
    <v-divider class="mb-3" />
    <ImageGallery :getData="getImages" />
  </v-container>
</template>

<script>
import ImageGallery from '@/components/ImageGallery.vue'
import { apiPostImages } from '@/plugins/api'

export default {
  components: {
    ImageGallery
  },
  methods: {
    getImages: function (params) {
      const adjusted = Object.assign({}, params, { albumId: -1 })
      return apiPostImages(adjusted)
    }
  }
}
</script>

<style>

</style>
