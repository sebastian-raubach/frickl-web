<template>
  <div v-if="image && album">
    <v-toolbar color="secondary">
      <v-breadcrumbs>
        <v-breadcrumbs-item :title="album.name" />
        <v-breadcrumbs-divider />
        <v-breadcrumbs-item :title="image.name" />
      </v-breadcrumbs>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-download" :href="imgSrc['ORIGINAL']" :download="`${album.name}-${image.name}`" />

      <v-btn color="red" icon="mdi-heart" @click.stop.prevent="toggleFavorite" v-if="image.isFavorite === 1"></v-btn>
      <v-btn color="null" icon="mdi-heart-outline" @click.stop.prevent="toggleFavorite" v-else></v-btn>

      <v-btn color="blue" icon="mdi-lock-open-variant" @click.stop.prevent="togglePublic" v-if="image.isPublic === 1"></v-btn>
      <v-btn color="null" icon="mdi-lock" @click.stop.prevent="togglePublic" v-else></v-btn>
    </v-toolbar>

    <template v-if="image.dataType === 'image'">
      <v-img
        :src="imgSrc['MEDIUM']"
        :lazy-src="imgSrc['TINY']"
        @click="overlay = true"
        class="align-end img-max-width"
        cover>
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              color="grey-lighten-4"
              indeterminate
            ></v-progress-circular>
          </div>
        </template>
      </v-img>

      <v-overlay
        v-model="overlay"
        class="align-center justify-center image-wrapper">
        <v-img
          :src="imgSrc['ORIGINAL']"
          @click="overlay = false">
        </v-img>
      </v-overlay>
    </template>
    <template v-else-if="image.dataType === 'video'">
      <AmbientVideoPlayer class="frickl-video" :src="imgSrc['VIDEO']" :poster="imgSrc['MEDIUM']" />
    </template>

    <v-container>
      <div v-if="image.exif">
        <v-row>
          <v-col :cols="12" :md="6">
            <v-row dense>
              <v-col :cols="12" :sm="6">
                <v-card>
                  <div class="py-3">
                    <v-list-item density="compact" prepend-icon="mdi-camera">
                      <v-list-item-subtitle>{{ makeModel || 'N/A' }}</v-list-item-subtitle>
                    </v-list-item>
                  </div>
                </v-card>
              </v-col>
              <v-col :cols="12" :sm="6">
                <v-card>
                  <div class="py-3">
                    <v-list-item density="compact" prepend-icon="mdi-calendar">
                      <v-list-item-subtitle>{{ date || 'N/A' }}</v-list-item-subtitle>
                    </v-list-item>
                  </div>
                </v-card>
              </v-col>
              <v-col :cols="12" :sm="6">
                <v-card>
                  <div class="py-3">
                    <v-list-item density="compact" prepend-icon="mdi-counter">
                      <v-list-item-subtitle>{{ image.viewCount || 0 }}</v-list-item-subtitle>
                    </v-list-item>
                  </div>
                </v-card>
              </v-col>
              <v-col :cols="12" :sm="6" v-if="image.exif.fNumber">
                <v-card>
                  <div class="py-3">
                    <v-list-item density="compact" prepend-icon="mdi-camera-iris">
                      <v-list-item-subtitle>{{ image.exif.fNumber }}</v-list-item-subtitle>
                    </v-list-item>
                  </div>
                </v-card>
              </v-col>
              <v-col :cols="12" :sm="6" v-if="image.exif.exposureTime">
                <v-card>
                  <div class="py-3">
                    <v-list-item density="compact" prepend-icon="mdi-camera-timer">
                      <v-list-item-subtitle>{{ image.exif.exposureTime }}</v-list-item-subtitle>
                    </v-list-item>
                  </div>
                </v-card>
              </v-col>
              <v-col :cols="12" :sm="6" v-if="image.exif.focalLength">
                <v-card>
                  <div class="py-3">
                    <v-list-item density="compact" prepend-icon="mdi-tape-measure">
                      <v-list-item-subtitle>{{ image.exif.focalLength }}</v-list-item-subtitle>
                    </v-list-item>
                  </div>
                </v-card>
              </v-col>
              <v-col :cols="12" :sm="6" v-if="image.exif.isoSpeedRatings">
                <v-card>
                  <div class="py-3">
                    <v-list-item density="compact" prepend-icon="mdi-image-filter-black-white">
                      <v-list-item-subtitle>{{ image.exif.isoSpeedRatings }}</v-list-item-subtitle>
                    </v-list-item>
                  </div>
                </v-card>
              </v-col>
              <v-col :cols="12" :sm="6" v-if="flash === true || flash === false">
                <v-card>
                  <div class="py-3">
                    <v-list-item density="compact" :prepend-icon="flash ? 'mdi-flash' : 'mdi-flash-off'">
                      <v-list-item-subtitle>{{ image.exif.flash }}</v-list-item-subtitle>
                    </v-list-item>
                  </div>
                </v-card>
              </v-col>
              <v-col :cols="12">
                <v-card :title="$vuetify.locale.t('widgetTagsTitle')">
                  <v-card-text>
                    <v-chip-group column v-if="tags && tags.length > 0">
                      <v-chip class="me-2 mb-2" :to="{ name: 'tag-specific', params: { tagId: tag.id } }" closable v-for="tag in tags" :key="`tag-${tag.id}`">
                        <template #close>
                          <v-icon icon="mdi-close-circle" @click.stop="askRemoveTag(tag)" />
                        </template>
                        {{ tag.name }}
                      </v-chip>
                    </v-chip-group>
                    <span v-else>{{ $vuetify.locale.t('widgetTagsNoData') }}</span>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col :cols="12" :md="6">
            <v-row dense>
              <v-col :ols="12">
                <v-card>
                  <SingleLocationMap :image="image" />
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <ConfirmDialog :message="$vuetify.locale.t('modalTextConfirmDeleteTag')" @yes="deleteTag" @no="$refs.confirmDialog.hide()" ref="confirmDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { apiGetImageById, apiPostAlbumById, apiPatchImage, apiGetImageTags, apiDeleteImageTag } from '@/plugins/api'
import SingleLocationMap from '@/components/SingleLocationMap.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import AmbientVideoPlayer from '@/components/AmbientVideoPlayer.vue'

export default {
  components: {
    AmbientVideoPlayer,
    ConfirmDialog,
    SingleLocationMap
  },
  data: function () {
    return {
      imageId: null,
      image: null,
      album: null,
      imageSizes: ['TINY', 'SMALL', 'MEDIUM', 'ORIGINAL', 'VIDEO'],
      overlay: false,
      tags: [],
      selectedTag: null
    }
  },
  computed: {
    ...mapGetters([
      'storeBaseUrl',
      'storeToken',
      'storeTheme',
      'storeAccessToken'
    ]),
    date: function () {
      if (this.image) {
        if (this.image.exif) {
          if (this.image.exif.dateTimeOriginal) {
            return new Date(this.image.exif.dateTimeOriginal).toLocaleDateString()
          } else if (this.image.exif.dateTime) {
            return new Date(this.image.exif.dateTime).toLocaleDateString()
          } else {
            return new Date(this.image.updatedOn).toLocaleDateString()
          }
        } else {
          return new Date(this.image.updatedOn).toLocaleDateString()
        }
      } else {
        return null
      }
    },
    makeModel: function () {
      if (this.image && this.image.exif && (this.image.exif.cameraMake || this.image.exif.cameraModel)) {
        return [this.image.exif.cameraMake, this.image.exif.cameraModel].filter(c => c).join(' ')
      } else {
        return null
      }
    },
    flash: function () {
      if (this.image && this.image.exif && this.image.exif.flash) {
        return this.image.exif.flash.toLowerCase().startsWith('flash fired')
      } else {
        return undefined
      }
    },
    imgSrc: function () {
      const srcs = {}

      this.imageSizes.forEach(s => {
        let result = null

        if (this.image) {
          result = `${this.storeBaseUrl}image/${this.image.id}/${s === 'VIDEO' ? 'video' : 'img'}/${this.image.name}?size=${s}`

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
  watch: {
    imageId: function () {
      this.update()
    }
  },
  methods: {
    askRemoveTag: function (tag) {
      console.log(tag)
      this.selectedTag = tag

      this.$refs.confirmDialog.show()
    },
    deleteTag: function () {
      this.$refs.confirmDialog.hide()

      apiDeleteImageTag(this.image.id, this.selectedTag.id, () => this.updateTags())
    },
    toggleFavorite: function () {
      this.image.isFavorite = Math.abs(this.image.isFavorite - 1)

      apiPatchImage(this.image)
    },
    togglePublic: function () {
      this.image.isPublic = Math.abs(this.image.isPublic - 1)

      apiPatchImage(this.image)
    },
    update: function () {
      apiGetImageById(this.imageId, result => {
        this.image = result

        apiPostAlbumById(result.albumId, null, result => {
          if (result && result.data && result.data.length > 0) {
            this.album = result.data[0]
          }
        })
      })

      this.updateTags()
    },
    updateTags: function () {
      apiGetImageTags(this.imageId, tags => {
        this.tags = tags || []
      })
    }
  },
  mounted: function () {
    if (this.$route.params && this.$route.params.imageId) {
      this.imageId = parseInt(this.$route.params.imageId)
    }
  }
}
</script>

<style>
.img-max-width {
  max-width: 1280px;
  margin: 0 auto;
}

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