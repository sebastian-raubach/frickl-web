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
      <template v-if="storeToken">
        <v-btn-group density="compact" class="me-3">
          <v-btn
            @click="showImageUpload"
            variant="tonal">
            <v-icon>mdi-image-plus</v-icon>
          </v-btn>
        </v-btn-group>
      </template>
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
        <ImageCard :height="heights[cardSize]" :image="image" @onPublicChanged="togglePublic(index)" @onFavoriteChanged="toggleFavorite(index)" />
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
import { apiPatchImage } from '@/plugins/api'

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
      'storeToken'
    ]),
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
      let query = {}

      const current = this.$router.currentRoute.value

      if (current.query) {
        query = JSON.parse(JSON.stringify(current.query))
      }

      query.imagePage = newValue

      this.$router.replace({
        path: current.path,
        query: query
      })
    },
    orderBy: function () {
      this.update()
    },
    ascending: function () {
      this.update()
    },
    search: function () {
      this.page = 1
      this.imageCount = -1
      this.update()
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
      heights: {
        lg: 300,
        md: 250,
        sm: 200
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
    showImageUpload: function () {
      this.$refs.imageUploadDialog.show()
    },
    toggleFavorite: function (index) {
      this.images[index].isFavorite = Math.abs(this.images[index].isFavorite - 1)

      apiPatchImage(this.images[index])
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

    if (query && query.imagePage) {
      this.page = +query.imagePage
    }

    this.perPage = this.storeImagesPerPage
    this.update()
  }
}
</script>