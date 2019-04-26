<template>
  <b-modal title="Select album"
           ref="selectAlbumModal"
           ok-title="Select"
           cancel-title="Cancel"
           @ok="handleOk">
    <b-list-group>
      <b-list-group-item href="#" @click="onAlbumClicked(album)" v-for="album in albums" :key="album.id">{{ album.name }}</b-list-group-item>
    </b-list-group>

    <b-pagination v-if="albumCount > albumsPerPage"
      v-model="currentPage"
      :total-rows="albumCount"
      :per-page="albumsPerPage"
      @change="page => onAlbumNavigation(page)"
    ></b-pagination>
  </b-modal>
</template>

<script>
export default {
  data: function () {
    return {
      albums: [],
      albumsPerPage: 12,
      albumCount: 0,
      currentPage: 1
    }
  },
  props: {
    image: {
      type: Object,
      default: null
    }
  },
  methods: {
    handleOk (event) {
      // TODO
    },
    show () {
      var vm = this
      this.$nextTick(function () {
        vm.$refs.selectAlbumModal.show()
      })
    },
    onAlbumClicked: function (album) {
      console.log(album)
      // TODO: Submit result
    },
    onAlbumNavigation: function (page) {
      var vm = this

      this.apiGetAlbums(-1, page - 1, this.albumsPerPage, function (result) {
        vm.albums = result
      })
    }
  },
  mounted: function () {
    var vm = this
    this.apiGetAlbumCount(-1, function (result) {
      vm.albumCount = result
      vm.onAlbumNavigation(1)
    })
  }
}
</script>

<style>

</style>
