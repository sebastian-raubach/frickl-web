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
        <v-btn
          v-if="canCreate"
          @click="addAlbum"
          variant="tonal">
          <v-icon>mdi-folder-plus</v-icon>
        </v-btn>
        <v-btn v-if="hasItemsSelected && (canAddTag || canDelete)"
          active
          color="primary"
          variant="tonal">
          <v-icon>mdi-checkbox-multiple-marked-outline</v-icon> <span v-if="hasItemsSelected">{{ $t('widgetGallerySelectionCount', selectedItemCount) }}</span>
          <v-menu activator="parent" v-if="hasItemsSelected">
            <v-list>
              <v-list-item href="#" @click.prevent="onAddTagClicked" :disabled="!canAddTag">{{ $t('buttonAddTag') }}</v-list-item>
              <v-list-item href="#" @click.prevent="onDeleteClicked" :disabled="!canDelete">{{ $t('buttonDelete') }}</v-list-item>
            </v-list>
          </v-menu>
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

      <v-col :cols="widths[cardSize].cols" :sm="widths[cardSize].sm" :md="widths[cardSize].md" :lg="widths[cardSize].lg" :xl="widths[cardSize].xl" :xxl="widths[cardSize].xxl" v-for="album in albums" :key="`album-card-${album.id}`" v-else>
        <AlbumCard :height="selectedItems[album.id] ? heightsSelected[cardSize] : heights[cardSize]" :album="album" :class="`position-relative image-card ${selectedItems[album.id] ? 'ma-2 selected' : null}`">
          <v-checkbox v-model="selectedItems[album.id]" class="card-selection-button ma-2" v-if="canAddTag || canDelete" />
        </AlbumCard>
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

    <AddAlbumDialog :parentAlbumId="parentAlbumId" @album-added="update" ref="addAlbumDialog" />
  </div>
</template>

<script>
import AlbumCard from '@/components/AlbumCard.vue'
import AddAlbumDialog from '@/components/dialogs/AddAlbumDialog.vue'
import { mapGetters } from 'vuex'
import { apiDeleteAlbums } from '@/plugins/api'

export default {
  components: {
    AlbumCard,
    AddAlbumDialog
  },
  props: {
    getData: {
      type: Function,
      default: () => { return { count: 0, data: [] } }
    },
    parentAlbumId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'storeAlbumsPerPage',
      'storeUserPermissions',
      'storeAlbumCardSize'
    ]),
    hasItemsSelected: function () {
      return Object.values(this.selectedItems).some(k => k)
    },
    selectedItemCount: function () {
      return Object.values(this.selectedItems).filter(k => k).length
    },
    canDelete: function () {
      return this.storeUserPermissions && this.storeUserPermissions['ALBUM_DELETE']
    },
    canAddTag: function () {
      return this.storeUserPermissions && this.storeUserPermissions['TAG_ADD']
    },
    canCreate: function () {
      return this.storeUserPermissions && this.storeUserPermissions['ALBUM_CREATE']
    },
    disabled: function () {
      return this.albumCount === 0
    },
    pageCount: function () {
      return Math.ceil(this.albumCount / this.perPage)
    },
    sortByKeys: function () {
      return [
        { title: this.$t('selectOptionSortNewestImage'), value: 'newestImage' },
        { title: this.$t('selectOptionSortViewCount'), value: 'imageViewCount' },
        { title: this.$t('selectOptionSortImageCount'), value: 'imageCount' },
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
      this.$store.dispatch('setAlbumsPerPage', newValue)
      this.page = 1
      this.albumCount = -1
      this.update()
    },
    page: function (newValue) {
      this.update()
      this.setQuery('albumPage', newValue)
    },
    orderBy: function (newValue) {
      this.update()
      this.setQuery('albumOrderBy', newValue)
    },
    ascending: function (newValue) {
      this.update()
      this.setQuery('albumAscending', newValue)
    },
    search: function () {
      this.page = 1
      this.albumCount = -1
      this.update()
    },
    cardSize: function (newValue) {
      this.$store.dispatch('setAlbumCardSize', newValue)
    }
  },
  data: function () {
    return {
      albums: [],
      perPage: 24,
      page: 1,
      albumCount: -1,
      tempSearch: null,
      search: null,
      orderBy: 'newestImage',
      ascending: 0,
      cardSize: 'md',
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
          xl: 4,
          lg: 6,
          md: 6,
          sm: 12,
          cols: 12
        },
        md: {
          xxl: 2,
          xl: 3,
          lg: 4,
          md: 6,
          sm: 12,
          cols: 12
        },
        sm: {
          xxl: 2,
          xl: 3,
          lg: 3,
          md: 4,
          sm: 6,
          cols: 12
        }
      }
    }
  },
  methods: {
    onDeleteClicked: function () {
      const ids = Object.keys(this.selectedItems).filter(k => this.selectedItems[k])

      apiDeleteAlbums(ids, result => {
        this.reset()
      })
    },
    toggle: function (albumId) {
      if (this.selectedItems[albumId]) {
        delete this.selectedItems[albumId]
      } else {
        this.selectedItems[albumId] = true
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
    addAlbum: function () {
      this.$refs.addAlbumDialog.show()
    },
    textChanged: function () {
      this.search = this.tempSearch
    },
    reset: function () {
      this.selectedItems = {}
      this.page = 1
      this.albumCount = -1
      this.update()
    },
    update: function () {
      const temp = {}
      Object.keys(this.selectedItems).filter(k => this.selectedItems[k]).forEach(k => { temp[k] = true })
      this.selectedItems = temp

      this.getData({
        page: this.page - 1,
        limit: this.perPage,
        prevCount: this.albumCount,
        orderBy: this.orderBy,
        searchTerm: this.search,
        ascending: this.ascending
      }).then(result => {
        if (result && result.data) {
          this.albums = result.data.data
          this.albumCount = result.data.count
        } else {
          this.albums = []
          this.albumCount = 0
        }
      })
    }
  },
  mounted: function () {
    const query = this.$route.query

    if (query) {
      if (query.albumPage) {
        this.page = +query.albumPage
      }
      if (query.albumOrderBy) {
        this.orderBy = query.albumOrderBy
      }
      if (query.albumAscending !== undefined && query.albumAscending !== null) {
        this.ascending = +query.albumAscending
      }
    }

    this.perPage = this.storeAlbumsPerPage
    this.cardSize = this.storeAlbumCardSize
    this.update()
  }
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
