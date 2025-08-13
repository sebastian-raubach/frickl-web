<template>
  <div>
    <v-toolbar color="secondary">
      <v-breadcrumbs>
        <v-breadcrumbs-item title="Home" to="/album" />
        <template v-if="albumHierarchy && albumHierarchy.length > 0">
          <template v-for="h in albumHierarchy" :key="`hierarchy-item-${h.id}`">
            <v-breadcrumbs-divider />
            <v-breadcrumbs-item :title="h.name" :to="`/album/${h.id}`" />
          </template>
        </template>
      </v-breadcrumbs>
    </v-toolbar>
    <v-container>
      <h1 class="text-h4 mb-3">
        {{ $t('pageAlbumsTitle') }}
      </h1>
      <v-divider class="mb-3" />
      <AlbumGallery :get-data="getAlbums" :parent-album-id="parentAlbumId" />

      <h1 class="text-h4 mb-3 mt-6">
        {{ $t('pageImagesTitle') }}
      </h1>
      <v-divider class="mb-3" />
      <ImageGallery :album-id="parentAlbumId" :get-data="getImages" :get-ids="getIds" />
    </v-container>
  </div>
</template>

<script>
  import AlbumGallery from '@/components/AlbumGallery.vue'
  import ImageGallery from '@/components/ImageGallery.vue'
  import { apiPostAlbums, apiPostImages, apiPostImageIds, apiGetAlbumAlbumHierarchy } from '@/plugins/api'

  export default {
    components: {
      AlbumGallery,
      ImageGallery,
    },
    props: {
      parentAlbumId: {
        type: Number,
        default: -1,
      },
    },
    data: function () {
      return {
        albumHierarchy: null,
      }
    },
    created: function () {
      apiGetAlbumAlbumHierarchy(this.parentAlbumId, result => {
        this.albumHierarchy = result
      })
    },
    methods: {
      getAlbums: function (params) {
        const adjusted = Object.assign({}, params, { parentAlbumId: this.parentAlbumId })
        return apiPostAlbums(adjusted)
      },
      getImages: function (params) {
        const adjusted = Object.assign({}, params, { albumId: this.parentAlbumId })
        return apiPostImages(adjusted)
      },
      getIds: function (params) {
        const adjusted = Object.assign({}, params, { albumId: this.parentAlbumId })
        return apiPostImageIds(adjusted)
      },
    },
  }
</script>

<style>

</style>
