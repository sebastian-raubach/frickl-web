<template>
  <div v-if="image">
    <v-toolbar color="secondary">
      <v-breadcrumbs>
        <template v-if="hierarchy && hierarchy.length > 0">
          <template v-for="h in hierarchy" :key="`hierarchy-item-${h.id}`">
            <v-breadcrumbs-item :title="h.name" :to="`/album/${h.id}`" />
            <v-breadcrumbs-divider />
          </template>
        </template>
        <v-breadcrumbs-item :title="image.name" />
      </v-breadcrumbs>

      <v-spacer />

      <v-btn icon="mdi-download" :href="imgSrc['ORIGINAL']" :download="`${album ? album.name : 'NA'}-${image.name}`" />

      <v-btn color="red" icon="mdi-heart" :disabled="!canEditImage" @click.stop.prevent="toggleFavorite" v-if="image.isFavorite === 1" />
      <v-btn color="null" icon="mdi-heart-outline" :disabled="!canEditImage" @click.stop.prevent="toggleFavorite" v-else />

      <v-btn color="blue" icon="mdi-lock-open-variant" :disabled="!canEditImage" @click.stop.prevent="togglePublic" v-if="image.isPublic === 1" />
      <v-btn color="null" icon="mdi-lock" :disabled="!canEditImage" @click.stop.prevent="togglePublic" v-else />
    </v-toolbar>

    <template v-if="image.dataType === 'image'">
      <v-img
        :src="imgSrc['MEDIUM']"
        :lazy-src="imgSrc['TINY']"
        @click="overlay = true"
        class="align-end img-max-width"
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
      </v-img>

      <v-overlay
        v-model="overlay"
        class="align-center justify-center image-wrapper"
      >
        <v-img
          :src="imgSrc['ORIGINAL']"
          @click="overlay = false"
        />
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
                <v-card>
                  <v-card-title>
                    <span>{{ $t('widgetTagsTitle') }}</span>
                    <v-tooltip max-width="300">
                      <template #activator="{ props }">
                        <v-icon size="x-small" class="ms-2" v-bind="props" icon="mdi-help-circle-outline" />
                      </template>
                      <span>{{ $t('widgetTagsText') }}</span>
                    </v-tooltip>
                  </v-card-title>
                  <v-card-text>
                    <div v-if="tags && tags.length > 0">
                      <v-chip-group column>
                        <v-chip label class="me-2 mb-2" :to="`/tag/${tag.id}`" closable v-for="tag in tags" :key="`tag-${tag.id}`">
                          <template #close>
                            <v-icon icon="mdi-close-circle" @click.prevent.stop="askRemoveTag(tag)" v-if="canDeleteTags" />
                          </template>
                          <v-icon start icon="mdi-tag" />
                          {{ tag.name }}
                        </v-chip>
                      </v-chip-group>
                    </div>
                    <span v-else>{{ $t('widgetTagsNoData') }}</span>

                    <v-btn id="add-tag-button" class="d-block mt-3" size="small" color="secondary" icon="mdi-plus" v-if="canAddTags" />
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
    <ConfirmDialog :message="$t('modalTextConfirmDeleteTag')" @yes="deleteTag" @no="$refs.confirmDialog.hide()" ref="confirmDialog" />

    <v-dialog
      activator="#add-tag-button"
      width="400"
    >
      <template #default="{ isActive }">
        <v-card
          prepend-icon="mdi-tag-plus"
          :title="$t('modalTitleAddTag')"
        >
          <v-card-text>
            <v-combobox
              chips
              multiple
              :hint="$t('formDescriptionTags')"
              :label="$t('formLabelTags')"
              v-model="newTags"
            >
              <template #message="{ message }">
                <span v-html="message" />
              </template>
            </v-combobox>
          </v-card-text>
          <template #actions>
            <v-spacer />
            <v-btn
              :text="$t('buttonClose')"
              @click="isActive.value = false"
            />
            <v-btn
              :text="$t('buttonSave')"
              color="primary"
              variant="tonal"
              @click="saveTags(isActive)"
            />
          </template>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
  import { mapState, mapStores } from 'pinia'
  import { coreStore } from '@/stores/app'
  import { apiGetImageById, apiPostAlbumById, apiPatchImage, apiGetImageTags, apiDeleteImageTag, apiGetImageAlbumHierarchy, apiPostImageTags } from '@/plugins/api'
  import SingleLocationMap from '@/components/SingleLocationMap.vue'
  import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
  import AmbientVideoPlayer from '@/components/AmbientVideoPlayer.vue'

  import emitter from 'tiny-emitter/instance'

  export default {
    components: {
      AmbientVideoPlayer,
      ConfirmDialog,
      SingleLocationMap,
    },
    data: function () {
      return {
        imageId: null,
        image: null,
        album: null,
        imageSizes: ['TINY', 'SMALL', 'MEDIUM', 'ORIGINAL', 'VIDEO'],
        overlay: false,
        tags: [],
        selectedTag: null,
        hierarchy: [],
        newTags: [],
      }
    },
    computed: {
      ...mapStores(coreStore),
      ...mapState(coreStore, [
        'storeBaseUrl',
        'storeToken',
        'storeTheme',
        'storeAccessToken',
        'storeUserPermissions',
      ]),
      canEditImage: function () {
        return this.storeUserPermissions && this.storeUserPermissions.IMAGE_EDIT
      },
      canDeleteTags: function () {
        return this.storeUserPermissions && this.storeUserPermissions.TAG_DELETE
      },
      canAddTags: function () {
        return this.storeUserPermissions && this.storeUserPermissions.TAG_ADD
      },
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
        return this.image && this.image.exif && (this.image.exif.cameraMake || this.image.exif.cameraModel) ? [this.image.exif.cameraMake, this.image.exif.cameraModel].filter(Boolean).join(' ') : null
      },
      flash: function () {
        return this.image && this.image.exif && this.image.exif.flash ? this.image.exif.flash.toLowerCase().startsWith('flash fired') : undefined
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
      },
    },
    watch: {
      imageId: function () {
        this.update()
      },
    },
    methods: {
      askRemoveTag: function (tag) {
        this.selectedTag = tag

        this.$nextTick(() => this.$refs.confirmDialog.show())
      },
      deleteTag: function () {
        this.$refs.confirmDialog.hide()

        apiDeleteImageTag(this.image.id, this.selectedTag.id, () => this.updateTags())
      },
      toggleFavorite: function () {
        this.image.isFavorite = Math.abs(this.image.isFavorite - 1)

        apiPatchImage(this.image, () => {
          emitter.emit('overview-counts-changed')
        })
      },
      togglePublic: function () {
        this.image.isPublic = Math.abs(this.image.isPublic - 1)

        apiPatchImage(this.image)
      },
      update: function () {
        apiGetImageById(this.imageId, imageResult => {
          this.image = imageResult

          apiPostAlbumById(imageResult.albumId, null, albumResult => {
            if (albumResult && albumResult.data && albumResult.data.length > 0) {
              this.album = albumResult.data[0]
            }
          })
        })

        apiGetImageAlbumHierarchy(this.imageId, result => {
          this.hierarchy = result
        })

        this.updateTags()
      },
      updateTags: function () {
        apiGetImageTags(this.imageId, tags => {
          this.tags = tags || []
        })
      },
      saveTags: function (active) {
        active.value = false

        apiPostImageTags(this.imageId, this.newTags, () => {
          this.newTags = []
          this.updateTags()
        })
      },
    },
    mounted: function () {
      if (this.$route.params && this.$route.params.id) {
        this.imageId = Number.parseInt(this.$route.params.id)
      }
    },
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
