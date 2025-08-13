<template>
  <v-container>
    <h1 class="text-h4 mb-3">
      Image stream
    </h1>
    <v-divider class="mb-3" />
    <ImageGallery :get-data="getImages" :get-ids="getIds" />
  </v-container>
</template>

<script>
  import ImageGallery from '@/components/ImageGallery.vue'
  import { apiPostImageIds, apiPostImages } from '@/plugins/api'

  export default {
    components: {
      ImageGallery,
    },
    methods: {
      getImages: function (params) {
        const adjusted = Object.assign({}, params, {})
        return apiPostImages(adjusted)
      },
      getIds: function (params) {
        const adjusted = Object.assign({}, params, {})
        return apiPostImageIds(adjusted)
      },
    },
  }
</script>

<style>

</style>
