<template>
  <b-modal title="Select album"
           ref="selectAlbumModal"
           ok-only
           ok-variant="secondary"
           ok-title="Cancel">
    <b-input v-model="filter" @keyup="filterAlbums($event)" class="top" placeholder="Filter..."/>
    <b-list-group class="bottom">
      <b-list-group-item href="#" @click="$emit('on-album-clicked', album)" v-for="album in pageAlbums" :key="album.id">{{ album.name }}</b-list-group-item>
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
      allAlbums: [],
      pageAlbums: [],
      filteredAlbums: [],
      filter: null,
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
    filterAlbums: function () {
      if (this.filter && this.filter.length > 0) {
        this.filteredAlbums = this.allAlbums.filter(a => a.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1)
      } else {
        this.filteredAlbums = this.allAlbums
      }
      this.albumCount = this.filteredAlbums.length
      this.currentPage = 1
      this.update()
    },
    show: function () {
      this.$nextTick(() => this.$refs.selectAlbumModal.show())
    },
    hide: function () {
      this.$nextTick(() => this.$refs.selectAlbumModal.hide())
    },
    onAlbumNavigation: function (page) {
      this.pageAlbums = this.allAlbums.slice(this.albumsPerPage * (page - 1), this.albumsPerPage * page)
    },
    update: function () {
      this.pageAlbums = this.filteredAlbums.slice(0, this.albumsPerPage)
      this.albumCount = this.filteredAlbums.length
    }
  },
  mounted: function () {
    this.apiGetAlbums(-1, 0, this.MAX_JAVA_INTEGER, result => {
      this.allAlbums = result
      this.filteredAlbums = result
      this.update()
    })
  }
}
</script>

<style scoped>
.top {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.bottom .list-group-item:first-child {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: 0
}
</style>
