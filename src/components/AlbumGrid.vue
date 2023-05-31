<template>
  <div ref="albumGrid">
    <b-row>
      <b-col cols=12>
        <b-button-group class="pb-3 float-right">
          <b-button v-b-tooltip.hover title="Large images" :pressed="albumWidth === 'large'" @click="setColWidth('large')" class="grid-icon grid-large"></b-button>
          <b-button v-b-tooltip.hover title="Medium images" :pressed="albumWidth === 'medium'" @click="setColWidth('medium')" class="grid-icon grid-medium"></b-button>
          <b-button v-b-tooltip.hover title="Small images" :pressed="albumWidth === 'small'" @click="setColWidth('small')" class="grid-icon grid-small"></b-button>
          <b-dropdown right :text="localAlbumsPerPage" v-b-tooltip.hover title="Albums per page" :disabled="customAlbumsPerPage !== null">
            <b-dropdown-item v-for="option in albumsPerPageOptions"
                            :key="option"
                            @click="setAlbumsPerPage(option)"
                            :active="option === localAlbumsPerPage">
              {{ option }}
            </b-dropdown-item>
          </b-dropdown>
        </b-button-group>
        <b-button-group class="pb-3 pr-2 float-right" v-if="(serverSettings && serverSettings.authEnabled === false) || token">
          <b-button v-b-tooltip.hover title="Add album" @click="$emit('add-album-clicked')"><FolderPlusOutlineIcon /></b-button>
        </b-button-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col :cols="getColumns('cols')" :sm="getColumns('sm')" :md="getColumns('md')" :lg="getColumns('lg')" :xl="getColumns('xl')" v-for="album in albums" :key="album.id" :class="'mb-4 ' + getColumns('xxl')">
        <AlbumNode :albumHeight="albumHeights[albumWidth]" :album="album" v-on:click.native="onAlbumClicked(album)"/>
      </b-col>
    </b-row>

    <b-pagination v-if="albumCount > localAlbumsPerPage"
      v-model="currentPage"
      :total-rows="albumCount"
      :per-page="localAlbumsPerPage"
      @change="page => $emit('onAlbumNavigation', page)"
    ></b-pagination>
  </div>
</template>

<script>
import AlbumNode from '../components/AlbumNode.vue'
import FolderPlusOutlineIcon from 'vue-material-design-icons/FolderPlusOutline'
import { mapGetters } from 'vuex'

export default {
  data: function () {
    return {
      currentPage: 1,
      albumsPerPageOptions: ['12', '24', '48', '96'],
      localAlbumsPerPage: null,
      albumHeights: {
        large: 300,
        medium: 200,
        small: 150
      },
      widths: {
        large: {
          xxl: 3,
          xl: 3,
          lg: 4,
          md: 6,
          sm: 12,
          cols: 12
        },
        medium: {
          xxl: 2,
          xl: 2,
          lg: 3,
          md: 4,
          sm: 6,
          cols: 12
        },
        small: {
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
  props: {
    albumCount: {
      type: Number,
      default: 0
    },
    albums: {
      type: Array,
      default: null
    },
    customAlbumsPerPage: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'albumWidth',
      'albumsPerPage',
      'token'
    ])
  },
  watch: {
    albumCount: function () {
      this.currentPage = 1
    },
    albums: function () {
      window.scrollTo({
        left: 0,
        top: this.$refs.albumGrid.getBoundingClientRect().top,
        behavior: 'smooth'
      })
    }
  },
  components: {
    AlbumNode,
    FolderPlusOutlineIcon
  },
  methods: {
    getColumns: function (size) {
      if (size === 'xxl') {
        return 'col-xxl-' + this.widths[this.albumWidth][size]
      } else {
        return this.widths[this.albumWidth][size]
      }
    },
    setColWidth: function (size) {
      this.$store.dispatch('ON_ALBUM_WIDTH_CHANGED', size)
    },
    setAlbumsPerPage: function (option) {
      this.$store.dispatch('ON_ALBUMS_PER_PAGE_CHANGED', option)
    },
    onAlbumClicked: function (album) {
      this.$store.dispatch('ON_ALBUM_CHANGED', album)
    },
    onPageChanged: function (page) {
      this.currentPage = page
    }
  },
  mounted: function () {
    if (this.customAlbumsPerPage) {
      this.localAlbumsPerPage = this.customAlbumsPerPage
    } else {
      this.localAlbumsPerPage = this.albumsPerPage
    }
  }
}
</script>

<style>

</style>
