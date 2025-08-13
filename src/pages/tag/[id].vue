<template>
  <Tags :tag-id="tagId" />
</template>

<script setup lang="ts">
  import Tags from '@/components/Tags.vue'

  const route = useRoute()

  // @ts-ignore
  const tagId = ref<number | undefined>(route.id || undefined)
</script>
