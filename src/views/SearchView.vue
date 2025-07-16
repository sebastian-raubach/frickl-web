<template>
  <v-container fluid>
    <h1 class="text-h4 mb-3">{{ $t('pageSearchTitle') }}</h1>
    <v-divider class="mb-3" />
    <div v-html="$t('pageSearchText', { value: searchTerm })" />

    <template v-if="searchTerm">
      <h1 class="text-h4 mb-3">
        {{ $t('pageAlbumsTitle') }}
      </h1>
      <v-divider class="mb-3" />
      <AlbumGallery :getData="getAlbums" />

      <h1 class="text-h4 mb-3 mt-6">
        {{ $t('pageImagesTitle') }}
      </h1>
      <v-divider class="mb-3" />
      <ImageGallery :getData="getImages" :getIds="getIds" />
    </template>
  </v-container>
</template>

<script>
import ImageGallery from '@/components/ImageGallery.vue'
import AlbumGallery from '@/components/AlbumGallery.vue'
import { apiPostAlbums, apiPostImageIds, apiPostImages } from '@/plugins/api'
import { mapGetters } from 'vuex'

export default {
  components: {
    ImageGallery,
    AlbumGallery
  },
  data: function () {
    return {
      searchTerm: ''
    }
  },
  computed: {
    ...mapGetters([
      'storeToken'
    ])
  },
  methods: {
    getAlbums: function (params) {
      const adjusted = Object.assign({}, params, { searchTerm: this.searchTerm })
      return apiPostAlbums(adjusted)
    },
    getImages: function (params) {
      const adjusted = Object.assign({}, params, { searchTerm: this.searchTerm })
      return apiPostImages(adjusted)
    },
    getIds: function (params) {
      const adjusted = Object.assign({}, params, { searchTerm: this.searchTerm })
      return apiPostImageIds(adjusted)
    }
  },
  mounted: function () {
    if (this.$route.params && this.$route.params.searchTerm) {
      this.searchTerm = this.$route.params.searchTerm
    }
  }
}
</script>
