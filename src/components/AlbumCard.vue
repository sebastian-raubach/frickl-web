<template>
  <v-card v-if="album">
    <v-img
      :src="imgSrc['SMALL']"
      :lazy-src="imgSrc['TINY']"
      class="align-end"
      :height="height"
      gradient="to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, rgba(0,0,0,.8)"
      cover>
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            color="grey-lighten-4"
            indeterminate
          ></v-progress-circular>
        </div>
      </template>
      <v-list-item class="w-100 text-white mb-2" lines="one">
        <v-list-item-title>{{ album.name }}</v-list-item-title>
        <v-list-item-subtitle v-if="album.description">{{ album.description }}</v-list-item-subtitle>

        <template v-slot:append>
          <div class="justify-self-end">
            <v-icon class="me-1" icon="mdi-counter"></v-icon>
            <span class="v-list-item-subtitle d-inline-flex me-2">{{ album.imageViewCount || 0 }}</span>
            <v-icon class="me-1" icon="mdi-image-multiple"></v-icon>
            <span class="v-list-item-subtitle d-inline-flex me-2">{{ album.imageCount || 0 }}</span>
            <span class="me-1">·</span>
            <v-icon class="me-1" icon="mdi-folder-image"></v-icon>
            <span class="v-list-item-subtitle d-inline-flex me-2">{{ album.albumCount || 0 }}</span>
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-icon class="me-1" v-bind="props" icon="mdi-calendar"></v-icon>
              </template>
              <span>{{ album.newestImage ? new Date(album.newestImage).toLocaleDateString() : 'N/A' }}</span>
            </v-tooltip>
          </div>
        </template>
      </v-list-item>
    </v-img>

    <v-card-actions>
      <v-btn color="primary" variant="text" :to="{ name: 'albums-for-parent', params: { parentAlbumId: album.id } }">{{ $t('buttonView') }}</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    height: {
      type: Number,
      default: 250
    },
    album: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    ...mapGetters([
      'storeBaseUrl',
      'storeToken',
      'storeAccessToken'
    ]),
    imgSrc: function () {
      const srcs = {}

      this.imageSizes.forEach(s => {
        let result = null

        if (this.album) {
          result = `${this.storeBaseUrl}image/${this.album.bannerImageId}/${s === 'VIDEO' ? 'video/placeholder' : 'img'}?size=${s}`

          if (this.storeToken && this.storeToken.imageToken) {
            result = `${result}&token=${this.storeToken.imageToken}`
          }
          if (this.storeAccessToken) {
            result = `${result}&accesstoken=${this.storeAccessToken}`
          }
        }

        srcs[s] = result
      })

      return srcs
    }
  },
  data: function () {
    return {
      imageSizes: ['TINY', 'SMALL', 'MEDIUM', 'ORIGINAL', 'VIDEO'],
      overlay: false
    }
  }
}
</script>

<style>
.frickl-video {
  width: 100%;
  height: auto;
}
.image-wrapper img {
  max-height: 100vh;
  max-width: 100vw;
  position: relative;
}
</style>
