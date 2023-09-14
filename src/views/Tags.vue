<template>
  <v-container>
    <h1 class="text-h4 mb-3">
      {{ $vuetify.locale.t('pageTagsTitle') }}
    </h1>
    <v-divider class="mb-3" />
    
    <v-chip-group v-model="selectedTag" column selected-class="text-primary">
      <v-chip v-for="tag in tags" :key="`tag-${tag.id}`" filter>{{ tag.tag.name }} <v-badge :content="tag.count" inline /></v-chip>
    </v-chip-group>

    <ImageGallery :getData="getImages" v-if="selectedTag !== null" ref="imageGallery" />
  </v-container>
</template>

<script>
import { apiGetTags, apiPostImages } from '@/plugins/api'
import ImageGallery from '@/components/ImageGallery.vue'

export default {
  components: {
    ImageGallery
  },
  data: function () {
    return {
      selectedTag: null,
      tags: []
    }
  },
  watch: {
    selectedTag: function () {
      if (this.$refs.imageGallery) {
        this.$refs.imageGallery.reset()
      }
    }
  },
  methods: {
    getImages: function (params) {
      const p = Object.assign({}, params, { tagId: this.tags[this.selectedTag].tag.id, albumId: -1 })
      return apiPostImages(p)
    }
  },
  mounted: function () {
    apiGetTags(result => {
      this.tags = result

      if (this.$route.params.tagId) {
        const int = parseInt(this.$route.params.tagId)

        const index = result.findIndex(t => t.tag.id === int)

        if (index !== -1) {
          this.selectedTag = index
        }
      }
    })
  }
}
</script>

<style>

</style>
