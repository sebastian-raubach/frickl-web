<template>
  <div>
    <b-row>
      <b-col cols=12 sm=4 md=3 lg=3 v-for="album in albums" :key="album.id" class="mb-3">
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
  components: {
    'album-node': AlbumNode
  },
  methods: {
    onAlbumClicked: function (album) {
      this.$store.dispatch('ON_ALBUM_CHANGED', album)
    }
  }
}
</script>

<style>

</style>
