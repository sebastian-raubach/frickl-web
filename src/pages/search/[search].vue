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
      <AlbumGallery :get-data="getAlbums" />

      <h1 class="text-h4 mb-3 mt-6">
        {{ $t('pageImagesTitle') }}
      </h1>
      <v-divider class="mb-3" />
      <ImageGallery :get-data="getImages" :get-ids="getIds" />
    </template>
  </v-container>
</template>

<script>
  import { mapState, mapStores } from 'pinia'
  import { coreStore } from '@/stores/app'
  import ImageGallery from '@/components/ImageGallery.vue'
  import AlbumGallery from '@/components/AlbumGallery.vue'
  import { apiPostAlbums, apiPostImageIds, apiPostImages } from '@/plugins/api'

  export default {
    components: {
      ImageGallery,
      AlbumGallery,
    },
    data: function () {
      return {
        searchTerm: '',
      }
    },
    computed: {
      ...mapStores(coreStore),
      ...mapState(coreStore, [
        'storeToken',
      ]),
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
      },
    },
    mounted: function () {
      if (this.$route.params && this.$route.params.search) {
        this.searchTerm = this.$route.params.search
      }
    },
  }
</script>
