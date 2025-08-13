<template>
  <v-card v-if="image">
    <v-img
      :src="imgSrc['SMALL']"
      :lazy-src="imgSrc['TINY']"
      class="align-end"
      :height="height"
      gradient="to bottom, rgba(0,0,0,.6) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,.6)"
      cover
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            color="grey-lighten-4"
            indeterminate
          />
        </div>
      </template>
      <v-list-item class="w-100 text-white mb-2" lines="one">
        <v-list-item-title>{{ (image.exif && image.exif.cameraMake) ? image.exif.cameraMake : 'N/A' }}</v-list-item-title>
        <v-list-item-subtitle>{{ (image.exif && image.exif.cameraModel) ? image.exif.cameraModel : 'N/A' }}</v-list-item-subtitle>

        <template #append>
          <div class="justify-self-end">
            <v-icon class="me-1" icon="mdi-counter" />
            <span class="v-list-item-subtitle d-inline-flex me-2">{{ image.viewCount || 0 }}</span>
            <span class="me-1">·</span>
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-icon class="me-1" v-bind="props" icon="mdi-calendar" />
              </template>
              <span>{{ creationDate || 'N/A' }}</span>
            </v-tooltip>
          </div>
        </template>
      </v-list-item>
    </v-img>

    <slot />

    <v-card-actions>
      <v-btn color="primary" variant="text" :to="`/image/${image.id}`">{{ $t('buttonView') }}</v-btn>
      <v-spacer />
      <v-btn size="small" :disabled="!canEdit" color="red" variant="text" icon="mdi-heart" @click.stop.prevent="$emit('on-favorite-changed')" v-if="image.isFavorite === 1" />
      <v-btn size="small" :disabled="!canEdit" :color="null" variant="text" icon="mdi-heart-outline" @click.stop.prevent="$emit('on-favorite-changed')" v-else />

      <v-btn size="small" :disabled="!canEdit" color="blue" variant="text" icon="mdi-lock-open-variant" @click.stop.prevent="$emit('on-public-changed')" v-if="image.isPublic === 1" />
      <v-btn size="small" :disabled="!canEdit" :color="null" variant="text" icon="mdi-lock" @click.stop.prevent="$emit('on-public-changed')" v-else />

      <v-btn size="small" :color="null" variant="text" :icon="image.dataType === 'video' ? 'mdi-play' : 'mdi-magnify-plus'" @click.stop.prevent="overlay = true" />

      <v-btn size="small" :color="null" variant="text" icon="mdi-download" :href="imgSrc['ORIGINAL']" />
    </v-card-actions>

    <v-overlay
      v-model="overlay"
      class="align-center justify-center image-wrapper"
    >
      <v-img v-if="image.dataType === 'image'" :src="imgSrc['ORIGINAL']" @click="overlay = false" />
      <video class="frickl-video" controls :poster="imgSrc['MEDIUM']" :src="imgSrc['VIDEO']" v-else-if="image.dataType === 'video'" />
    </v-overlay>
  </v-card>
</template>

<script>
  import { mapState, mapStores } from 'pinia'
  import { coreStore } from '@/stores/app'

  export default {
    props: {
      height: {
        type: Number,
        default: 250,
      },
      to: {
        type: Object,
        default: () => null,
      },
      image: {
        type: Object,
        default: () => null,
      },
    },
    emits: ['on-favorite-changed', 'on-public-changed'],
    computed: {
      ...mapStores(coreStore),
      ...mapState(coreStore, [
        'storeBaseUrl',
        'storeToken',
        'storeUserPermissions',
        'storeAccessToken',
      ]),
      canEdit: function () {
        return this.storeUserPermissions && this.storeUserPermissions['IMAGE_EDIT']
      },
      creationDate: function () {
        let result = null

        if (this.image) {
          if (this.image.exif) {
            if (this.image.exif.dateTimeOriginal) {
              result = new Date(this.image.exif.dateTimeOriginal).toLocaleDateString()
            } else if (this.image.dateTime) {
              result = new Date(this.image.exif.dateTime).toLocaleDateString()
            }
          } else if (this.image.updatedOn) {
            result = new Date(this.image.updatedOn).toLocaleDateString()
          }
        }

        return result
      },
      imgSrc: function () {
        const srcs = {}

        this.imageSizes.forEach(s => {
          let result = null

          if (this.image) {
            result = `${this.storeBaseUrl}image/${this.image.id}/${s === 'VIDEO' ? 'video' : 'img'}/${this.image.name.toLowerCase()}?size=${s}`

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
      },
    },
    data: function () {
      return {
        imageSizes: ['TINY', 'SMALL', 'MEDIUM', 'ORIGINAL', 'VIDEO'],
        overlay: false,
      }
    },
    methods: {
      download: function () {
        // TODO
      },
    },
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
