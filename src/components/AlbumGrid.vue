<template>
  <div>
    <b-row>
      <b-col cols=12 sm=12 md=6 lg=4 xl=3 v-for="album in albums" :key="album.id" class="mb-3">
        <album-node :album="album" :baseUrl="baseUrl" v-on:click.native="onAlbumClicked(album)"/>
      </b-col>
    </b-row>

    <b-pagination v-if="albumCount > albumsPerPage"
      v-model="currentPage"
      :total-rows="albumCount"
      :per-page="albumsPerPage"
      @change="page => $emit('onAlbumNavigation', page)"
    ></b-pagination>
  </div>
</template>

<script>
import AlbumNode from '../components/AlbumNode.vue'

export default {
  data: function () {
    return {
      currentPage: 1
    }
  },
  props: {
    baseUrl: {
      type: String,
      default: null
    },
    albumCount: {
      type: Number,
      default: 0
    },
    albumsPerPage: {
      type: Number,
      default: 12
    },
    albums: {
      type: Array,
      default: null
    }
  },
  watch: {
    albumCount: function (newValue, oldValue) {
      this.currentPage = 1
    }
  },
  components: {
    'album-node': AlbumNode
  },
  methods: {
    onAlbumClicked: function (album) {
      this.$store.dispatch('ON_ALBUM_CHANGED', album)
    },
    onPageChanged: function (page) {
      this.currentPage = page
    }
  }
}
</script>

<style>

</style>
