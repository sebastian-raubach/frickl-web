<template>
  <v-container>
    <h1 class="text-h4 mb-3">
      {{ $t('pageTagsTitle') }}
    </h1>
    <v-divider class="mb-3" />

    <v-chip-group v-model="selectedTag" column selected-class="text-primary">
      <v-chip label v-for="tag in tags" :key="`tag-${tag.id}`" filter>{{ tag.tag.name }} <v-badge :content="tag.count" inline /></v-chip>
    </v-chip-group>

    <ImageGallery :get-data="getImages" v-if="selectedTag !== null" ref="imageGallery" />
  </v-container>
</template>

<script lang="ts" setup>
  import { apiGetTags, apiPostImages } from '@/plugins/api'
  import ImageGallery from '@/components/ImageGallery.vue'

  const props = defineProps<{
    tagId?: number
  }>()

  const selectedTag = ref<number | undefined>()
  const tags = ref<any[]>([])
  const imageGallery = useTemplateRef('imageGallery')

  watch(selectedTag, async () => {
    if (imageGallery.value) {
      imageGallery.value.reset()
    }
  })

  const getImages = (params: any) => {
    const p = selectedTag.value !== undefined ? Object.assign({}, params, { tagId: tags.value[selectedTag.value].tag.id }) : params
    return apiPostImages(p)
  }

  onMounted(() => {
    apiGetTags((result: any[]) => {
      tags.value = result

      if (props && props.tagId) {
        const index = result.findIndex(t => t.tag.id === props.tagId)

        if (index !== -1) {
          selectedTag.value = index
        }
      }
    })
  })
</script>

<style>

</style>
