<template>
  <v-container>
    <h1 class="text-h4 mb-3">
      Image stream
    </h1>
    <v-divider class="mb-3" />
    <ImageGallery :get-data="getImages" />
  </v-container>
</template>

<script lang="ts" setup>
  import ImageGallery from '@/components/ImageGallery.vue'
  import { apiPostImages } from '@/plugins/api'

  const getImages = (params: any) => {
    const p = Object.assign({}, params, { isFav: true })
    return apiPostImages(p)
  }
</script>
