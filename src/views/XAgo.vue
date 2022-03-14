<template>
  <b-container class="home mt-3" fluid>
    <AlbumGrid :albumCount="albums.length"
               :albumsPerPage="albums.length"
               :albums="albums"
               ref="albumGrid"
               v-if="albums && albums.length > 0"/>
  </b-container>
</template>

<script>
import AlbumGrid from '@/components/AlbumGrid'

export default {
  components: {
    AlbumGrid
  },
  data: function () {
    return {
      albums: null
    }
  },
  mounted: function () {
    const year = this.$route.params.year

    if (year) {
      this.apiGetAlbumsXAgo(year, 0, 1, result => {
        this.albums = result
      })
    }
  }
}
</script>

<style>

</style>
