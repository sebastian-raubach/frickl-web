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
      const p = Object.assign({}, params, { isFav: true })
      return apiPostImages(p)
    }
  }
}
</script>

<style>

</style>
