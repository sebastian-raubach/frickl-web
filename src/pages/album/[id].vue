<template>
  <AlbumComponent :parent-album-id="parentAlbumId" />
</template>

<script setup lang="ts">
  import AlbumComponent from '@/components/AlbumComponent.vue'

  const route = useRoute()

  // @ts-ignore
  const parentAlbumId = ref<number>(route.params.id || -1)
</script>
