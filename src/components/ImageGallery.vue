<template>
  <div>
    <v-toolbar dark density="comfortable" color="dark" class="px-2 mb-2">
      <v-text-field
        v-model="tempSearch"
        clearable
        @change="textChanged"
        @click:clear="textChanged"
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search"
        variant="solo"
        density="compact"
      />
      <v-spacer />
      <v-select
        v-model="orderBy"
        hide-details
        :items="sortByKeys"
        prepend-inner-icon="mdi-sort"
        :label="$t('formLabelSortBy')"
        density="compact"
      />
      <v-spacer />
      <v-btn-group density="compact" class="me-3">
        <v-btn
          v-if="canUpload"
          @click="showImageUpload"
          variant="tonal"
        >
          <v-icon>mdi-image-plus</v-icon>
        </v-btn>
        <v-btn
          v-if="hasItemsSelected && (canAddTag || canDelete)"
          active
          color="primary"
          variant="tonal"
        >
          <v-icon>mdi-checkbox-multiple-marked-outline</v-icon> <span v-if="hasItemsSelected">{{ $t('widgetGallerySelectionCount', selectedItemCount) }}</span>
          <v-menu activator="parent" v-if="hasItemsSelected">
            <v-list>
              <v-list-item href="#" @click.prevent="downloadSelectedImages" :disabled="downloadInProgress"><v-icon>mdi-download</v-icon> {{ $t('buttonDownload') }}</v-list-item>
              <!-- <v-list-item href="#" @click.prevent="onAddTagClicked" :disabled="!canAddTag"><v-icon>mdi-tag-plus</v-icon> {{ $t('buttonAddTag') }}</v-list-item> -->
              <v-list-item href="#" @click.prevent="askDeleteImages" :disabled="!canDelete"><v-icon>mdi-delete</v-icon> {{ $t('buttonDelete') }}</v-list-item>
              <v-list-item>
                <v-btn-group density="compact" divided class="d-flex">
                  <v-btn
                    @click="markIds(true)"
                    variant="outlined"
                    class="flex-grow-1"
                  >
                    <v-icon>mdi-checkbox-multiple-marked-outline</v-icon> {{ $t('buttonAll') }}
                  </v-btn>
                  <v-btn
                    @click="markIds(false)"
                    variant="outlined"
                    class="flex-grow-1"
                  >
                    <v-icon>mdi-checkbox-multiple-blank-outline</v-icon> {{ $t('buttonNone') }}
                  </v-btn>
                </v-btn-group>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
        <v-btn
          v-if="albumId"
          @click="downloadAlbum"
          :loading="downloadInProgress"
          variant="tonal"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-btn-group>
      <v-btn-toggle
        v-model="ascending"
        density="compact"
        mandatory
      >
        <v-btn
          color="primary-darken-1"
          :value="1"
        >
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <v-btn
          color="primary-darken-1"
          :value="0"
        >
          <v-icon>mdi-arrow-down</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>

    <v-row dense>
      <v-col :cols="widths[cardSize].cols" :sm="widths[cardSize].sm" :md="widths[cardSize].md" :lg="widths[cardSize].lg" :xl="widths[cardSize].xl" :xxl="widths[cardSize].xxl" v-if="disabled">
        <v-card :text="$t('genericNoData')" />
      </v-col>

      <v-col :cols="widths[cardSize].cols" :sm="widths[cardSize].sm" :md="widths[cardSize].md" :lg="widths[cardSize].lg" :xl="widths[cardSize].xl" :xxl="widths[cardSize].xxl" v-for="(image, index) in images" :key="`image-card-${image.id}`" v-else>
        <ImageCard :height="selectedItems[image.id] ? heightsSelected[cardSize] : heights[cardSize]" :image="image" @on-public-changed="togglePublic(index)" @on-favorite-changed="toggleFavorite(index)" :class="`position-relative image-card ${selectedItems[image.id] ? 'ma-2 selected' : null}`">
          <v-checkbox v-model="selectedItems[image.id]" class="card-selection-button ma-2" v-if="canAddTag || canDelete" />
        </ImageCard>
      </v-col>
    </v-row>

    <v-toolbar dark density="comfortable" color="dark" class="px-2 mt-2">
      <v-select
        v-model="perPage"
        hide-details
        :items="perPageKeys"
        prepend-inner-icon="mdi-book-open-page-variant"
        :label="$t('formLabelPerPage')"
        density="compact"
      />
      <v-spacer />
      <v-pagination
        v-model="page"
        :total-visible="3"
        :show-first-last-page="pageCount > 3"
        density="compact"
        :length="pageCount"
      />
      <v-spacer />
      <v-btn-toggle
        v-model="cardSize"
        density="compact"
        mandatory
      >
        <v-btn
          color="primary-darken-1"
          value="sm"
        >
          <v-icon>mdi-size-s</v-icon>
        </v-btn>
        <v-btn
          color="primary-darken-1"
          value="md"
        >
          <v-icon>mdi-size-m</v-icon>
        </v-btn>
        <v-btn
          color="primary-darken-1"
          value="lg"
        >
          <v-icon>mdi-size-l</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>

    <MultiLocationMap class="mt-3" :height-percent="33" :images="imageLocations" v-if="imageLocations.length > 0" />
    <UploadDialog ref="imageUploadDialog" :album-id="albumId" @images-uploaded="reset" />
    <ConfirmDialog :message="$t('modalTextConfirmDeleteImage')" @yes="onDeleteClicked" @no="$refs.confirmDialog.hide()" ref="confirmDialog" />
  </div>
</template>

<script>
  import ImageCard from '@/components/ImageCard.vue'
  import MultiLocationMap from '@/components/MultiLocationMap.vue'
  import UploadDialog from '@/components/dialogs/UploadDialog.vue'
  import { mapState, mapStores } from 'pinia'
  import { coreStore } from '@/stores/app'
  import { apiDeleteImages, apiGetDownloadAlbum, apiPatchImage, apiPostDownloadImages } from '@/plugins/api'
  import emitter from 'tiny-emitter/instance'
  import { MAX_JAVA_INTEGER } from '@/plugins/misc'

  export default {
    components: {
      ImageCard,
      UploadDialog,
      MultiLocationMap,
    },
    props: {
      albumId: {
        type: Number,
        default: null,
      },
      getData: {
        type: Function,
        default: () => {
          return { count: 0, data: [] }
        },
      },
      getIds: {
        type: Function,
        default: () => {
          return []
        },
      },
    },
    computed: {
      ...mapStores(coreStore),
      ...mapState(coreStore, [
        'storeImagesPerPage',
        'storeUserPermissions',
        'storeImageCardSize',
      ]),
      hasItemsSelected: function () {
        return Object.values(this.selectedItems).some(Boolean)
      },
      selectedItemCount: function () {
        return Object.values(this.selectedItems).filter(Boolean).length
      },
      canUpload: function () {
        return this.storeUserPermissions && this.storeUserPermissions['IMAGE_UPLOAD']
      },
      canDelete: function () {
        return this.storeUserPermissions && this.storeUserPermissions['IMAGE_DELETE']
      },
      canAddTag: function () {
        return this.storeUserPermissions && this.storeUserPermissions['TAG_ADD']
      },
      imageLocations: function () {
        return this.images
          ? this.images.filter(i => i.exif && i.exif.gpsLatitude && i.exif.gpsLongitude).map(i => {
            const copy = JSON.parse(JSON.stringify(i))

            copy.latitude = i.exif.gpsLatitude
            copy.longitude = i.exif.gpsLongitude

            copy.location = {
              lat: i.exif.gpsLatitude,
              lng: i.exif.gpsLongitude,
            }

            return copy
          })
          : []
      },
      disabled: function () {
        return this.imageCount === 0
      },
      pageCount: function () {
        return Math.ceil(this.imageCount / this.perPage)
      },
      sortByKeys: function () {
        return [
          { title: this.$t('selectOptionSortCreatedOn'), value: 'createdOn' },
          { title: this.$t('selectOptionSortViewCount'), value: 'viewCount' },
          { title: this.$t('selectOptionSortIsPublic'), value: 'isPublic' },
          { title: this.$t('selectOptionSortIsFavorite'), value: 'isFavorite' },
          { title: this.$t('selectOptionSortName'), value: 'name' },
        ]
      },
      perPageKeys: function () {
        return [
          { title: '12', value: 12 },
          { title: '24', value: 24 },
          { title: '48', value: 48 },
          { title: '96', value: 96 },
        ]
      },
    },
    watch: {
      perPage: function (newValue) {
        this.fricklStore.setImagesPerPage(newValue)
        this.page = 1
        this.imageCount = -1
        this.update()
      },
      page: function (newValue) {
        this.update()
        this.setQuery('imagePage', newValue)
      },
      orderBy: function (newValue) {
        this.update()
        this.setQuery('imageOrderBy', newValue)
      },
      ascending: function (newValue) {
        this.update()
        this.setQuery('imageAscending', newValue)
      },
      search: function () {
        this.page = 1
        this.imageCount = -1
        this.update()
      },
      cardSize: function (newValue) {
        this.fricklStore.setImageCardSize(newValue)
      },
    },
    data: function () {
      return {
        images: [],
        perPage: 24,
        page: 1,
        imageCount: -1,
        tempSearch: null,
        search: null,
        orderBy: 'createdOn',
        ascending: 0,
        cardSize: 'md',
        downloadInProgress: false,
        selectedItems: {},
        heights: {
          lg: 300,
          md: 250,
          sm: 200,
        },
        heightsSelected: {
          lg: 280,
          md: 230,
          sm: 180,
        },
        widths: {
          lg: {
            xxl: 3,
            xl: 3,
            lg: 4,
            md: 6,
            sm: 12,
            cols: 12,
          },
          md: {
            xxl: 2,
            xl: 2,
            lg: 3,
            md: 4,
            sm: 6,
            cols: 12,
          },
          sm: {
            xxl: 1,
            xl: 2,
            lg: 2,
            md: 3,
            sm: 4,
            cols: 6,
          },
        },
      }
    },
    methods: {
      askDeleteImages: function () {
        this.$nextTick(() => this.$refs.confirmDialog.show())
      },
      onDeleteClicked: function () {
        if (this.$refs.confirmDialog) {
          this.$refs.confirmDialog.hide()
        }

        const ids = Object.keys(this.selectedItems).map(Number)

        apiDeleteImages(ids, () => {
          this.selectedItems = {}
          this.update()
        })
      },
      toggle: function (imageId) {
        if (this.selectedItems[imageId]) {
          delete this.selectedItems[imageId]
        } else {
          this.selectedItems[imageId] = true
        }
      },
      setQuery: function (param, value) {
        let query = {}

        const current = this.$router.currentRoute.value

        if (current.query) {
          query = JSON.parse(JSON.stringify(current.query))
        }

        query[param] = value

        this.$router.replace({
          path: current.path,
          query: query,
        })
      },
      downloadSelectedImages: function () {
        this.downloadInProgress = true
        const imageIds = []
        Object.keys(this.selectedItems).filter(k => this.selectedItems[k]).forEach(k => {
          imageIds.push(+k)
        })
        apiPostDownloadImages(imageIds, job => {
          this.fricklStore.addDownloadJob(job)

          emitter.emit('show-download-menu', true)

          this.downloadInProgress = false
        })
      },
      downloadAlbum: function () {
        this.downloadInProgress = true
        apiGetDownloadAlbum(this.albumId, job => {
          this.fricklStore.addDownloadJob(job)

          emitter.emit('show-download-menu', true)

          this.downloadInProgress = false
        })
      },
      showImageUpload: function () {
        this.$refs.imageUploadDialog.show()
      },
      toggleFavorite: function (index) {
        this.images[index].isFavorite = Math.abs(this.images[index].isFavorite - 1)

        apiPatchImage(this.images[index], () => emitter.emit('overview-counts-changed'))
      },
      togglePublic: function (index) {
        this.images[index].isPublic = Math.abs(this.images[index].isPublic - 1)

        apiPatchImage(this.images[index])
      },
      textChanged: function () {
        this.search = this.tempSearch
      },
      reset: function () {
        this.selectedItems = {}
        this.page = 1
        this.imageCount = -1
        this.update()
      },
      markIds: function (mark) {
        if (mark) {
          this.getIds({
            page: 0,
            limit: MAX_JAVA_INTEGER,
            searchTerm: this.search,
          }).then(result => {
            if (result && result.data) {
              const temp = {}
              Object.keys(this.selectedItems).filter(k => this.selectedItems[k]).forEach(k => {
                temp[k] = true
              })
              result.data.forEach(r => {
                temp[r] = true
              })
              this.selectedItems = temp
            }
          })
        } else {
          this.selectedItems = {}
        }
      },
      update: function () {
        // Make sure to remove all `false` entries from the map
        const temp = {}
        Object.keys(this.selectedItems).filter(k => this.selectedItems[k]).forEach(k => {
          temp[k] = true
        })
        this.selectedItems = temp

        this.getData({
          page: this.page - 1,
          limit: this.perPage,
          prevCount: this.imageCount,
          orderBy: this.orderBy,
          searchTerm: this.search,
          ascending: this.ascending,
        }).then(result => {
          if (result && result.data) {
            this.images = result.data.data
            this.imageCount = result.data.count
          } else {
            this.images = []
            this.imageCount = 0
          }
        })
      },
    },
    mounted: function () {
      const query = this.$route.query

      if (query) {
        if (query.imagePage) {
          this.page = +query.imagePage
        }
        if (query.imageOrderBy) {
          this.orderBy = query.imageOrderBy
        }
        if (query.imageAscending !== undefined && query.imageAscending !== null) {
          this.ascending = +query.imageAscending
        }
      }

      this.perPage = this.storeImagesPerPage
      this.cardSize = this.storeImageCardSize
      this.update()
    },
  }
</script>

<style scoped>
.card-selection-button {
  position: absolute;
  top: 0;
  right: 0;
  mix-blend-mode: color-dodge;
  color: #ccc;
}

.image-card .card-selection-button {
  visibility: hidden;
}

.image-card:hover .card-selection-button {
  visibility: initial;
}

.image-card.selected .card-selection-button {
  visibility: initial;
}
</style>
