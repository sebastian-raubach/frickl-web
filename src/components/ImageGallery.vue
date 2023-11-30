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
        density="compact" />
      <v-spacer />
      <v-select
        v-model="orderBy"
        hide-details
        :items="sortByKeys"
        prepend-inner-icon="mdi-sort"
        :label="$t('formLabelSortBy')"
        density="compact" />
      <v-spacer></v-spacer>
      <v-btn-group density="compact" class="me-3">
        <v-btn v-if="canUpload"
          @click="showImageUpload"
          variant="tonal">
          <v-icon>mdi-image-plus</v-icon>
        </v-btn>
        <v-btn v-if="canAddTag || canDelete"
          :active="hasItemsSelected"
          :color="hasItemsSelected ? 'primary' : null"
          variant="tonal">
          <v-icon>mdi-checkbox-multiple-marked-outline</v-icon> <span v-if="hasItemsSelected">{{ $t('widgetGallerySelectionCount', selectedItemCount) }}</span>
        </v-btn>
        <v-btn v-if="albumId"
          @click="downloadAlbum"
          :loading="downloadInProgress"
          variant="tonal">
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-btn-group>
      <v-btn-toggle
        v-model="ascending"
        density="compact"
        mandatory>
        <v-btn
          color="primary-darken-1"
          :value="1">
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <v-btn
          color="primary-darken-1"
          :value="0">
          <v-icon>mdi-arrow-down</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>

    <v-row dense>
      <v-col :cols="widths[cardSize].cols" :sm="widths[cardSize].sm" :md="widths[cardSize].md" :lg="widths[cardSize].lg" :xl="widths[cardSize].xl" :xxl="widths[cardSize].xxl" v-if="disabled">
        <v-card :text="$t('genericNoData')" />
      </v-col>

      <v-col :cols="widths[cardSize].cols" :sm="widths[cardSize].sm" :md="widths[cardSize].md" :lg="widths[cardSize].lg" :xl="widths[cardSize].xl" :xxl="widths[cardSize].xxl" v-for="(image, index) in images" :key="`image-card-${image.id}`" v-else>
        <ImageCard :height="selectedItems[image.id] ? heightsSelected[cardSize] : heights[cardSize]" :image="image" @onPublicChanged="togglePublic(index)" @onFavoriteChanged="toggleFavorite(index)" :class="`position-relative image-card ${selectedItems[image.id] ? 'ma-2 selected' : null}`">
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
        density="compact" />
      <v-spacer />
      <v-pagination
        v-model="page"
        :total-visible="3"
        :show-first-last-page="pageCount > 3"
        density="compact"
        :length="pageCount" />
      <v-spacer />
      <v-btn-toggle
        v-model="cardSize"
        density="compact"
        mandatory>
        <v-btn
          color="primary-darken-1"
          value="sm">
          <v-icon>mdi-size-s</v-icon>
        </v-btn>
        <v-btn
          color="primary-darken-1"
          value="md">
          <v-icon>mdi-size-m</v-icon>
        </v-btn>
        <v-btn
          color="primary-darken-1"
          value="lg">
          <v-icon>mdi-size-l</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>

    <MultiLocationMap class="mt-3" :heightPercent="33" :images="imageLocations" v-if="imageLocations.length > 0" />
    <UploadDialog ref="imageUploadDialog" :albumId="albumId" @images-uploaded="reset" />
  </div>
</template>

<script>
import ImageCard from '@/components/ImageCard.vue'
import MultiLocationMap from '@/components/MultiLocationMap.vue'
import UploadDialog from '@/components/dialogs/UploadDialog.vue'
import { mapGetters } from 'vuex'
import { apiDownloadAlbum, apiPatchImage } from '@/plugins/api'
import emitter from 'tiny-emitter/instance'

export default {
  components: {
    ImageCard,
    UploadDialog,
    MultiLocationMap
  },
  props: {
    albumId: {
      type: Number,
      default: null
    },
    getData: {
      type: Function,
      default: () => { return { count: 0, data: [] } }
    }
  },
  computed: {
    ...mapGetters([
      'storeImagesPerPage',
      'storeUserPermissions',
      'storeImageCardSize'
    ]),
    hasItemsSelected: function () {
      return Object.values(this.selectedItems).some(k => k)
    },
    selectedItemCount: function () {
      return Object.values(this.selectedItems).filter(k => k).length
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
      if (this.images) {
        return this.images.filter(i => i.exif && i.exif.gpsLatitude && i.exif.gpsLongitude).map(i => {
          const copy = JSON.parse(JSON.stringify(i))

          copy.latitude = i.exif.gpsLatitude
          copy.longitude = i.exif.gpsLongitude

          copy.location = {
            lat: i.exif.gpsLatitude,
            lng: i.exif.gpsLongitude
          }

          return copy
        })
      } else {
        return []
      }
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
        { title: this.$t('selectOptionSortName'), value: 'name' }
      ]
    },
    perPageKeys: function () {
      return [
        { title: '12', value: 12 },
        { title: '24', value: 24 },
        { title: '48', value: 48 },
        { title: '96', value: 96 }
      ]
    }
  },
  watch: {
    perPage: function (newValue) {
      this.$store.dispatch('setImagesPerPage', newValue)
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
      this.$store.dispatch('setImageCardSize', newValue)
    }
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
        sm: 200
      },
      heightsSelected: {
        lg: 280,
        md: 230,
        sm: 180
      },
      widths: {
        lg: {
          xxl: 3,
          xl: 3,
          lg: 4,
          md: 6,
          sm: 12,
          cols: 12
        },
        md: {
          xxl: 2,
          xl: 2,
          lg: 3,
          md: 4,
          sm: 6,
          cols: 12
        },
        sm: {
          xxl: 1,
          xl: 2,
          lg: 2,
          md: 3,
          sm: 4,
          cols: 6
        }
      }
    }
  },
  methods: {
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
        query: query
      })
    },
    downloadAlbum: function () {
      this.downloadInProgress = true
      apiDownloadAlbum(this.albumId, job => {
        this.$store.dispatch('addAlbumDownloadJob', job)

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
      this.page = 1
      this.imageCount = -1
      this.update()
    },
    update: function () {
      const temp = {}
      Object.keys(this.selectedItems).filter(k => this.selectedItems[k]).forEach(k => { temp[k] = true })
      this.selectedItems = temp

      this.getData({
        page: this.page - 1,
        limit: this.perPage,
        prevCount: this.imageCount,
        orderBy: this.orderBy,
        searchTerm: this.search,
        ascending: this.ascending
      }).then(result => {
        if (result && result.data) {
          this.images = result.data.data
          this.imageCount = result.data.count
        } else {
          this.images = []
          this.imageCount = 0
        }
      })
    }
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
  }
}
</script>

<style scoped>
.card-selection-button {
  position: absolute;
  top: 0;
  right: 0;
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
