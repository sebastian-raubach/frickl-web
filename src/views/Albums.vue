<template>
  <b-container class="home" fluid>
    <div v-if="albums && albums.length > 0">
      <h1>Albums</h1>
      <b-row>
        <b-col cols=12 sm=4 md=3 lg=3 v-for="album in albums" :key="album.id">
          <album-node :album="album" :baseUrl="baseUrl" v-on:click.native="onAlbumClicked(album)"/>
        </b-col>
      </b-row>
    </div>
    <div v-if="images && images.length > 0">
      <h1>Images</h1>
      <b-card-group columns>
        <image-node :image="image" :baseUrl="baseUrl" v-for="image in images" :key="image.id" v-on:click.native="onImageClicked(image)"/>
      </b-card-group>
    </div>
  </b-container>
</template>

<script>
import AlbumNode from '../components/AlbumNode.vue'
import ImageNode from '../components/ImageNode.vue'

export default {
  props: [ 'baseUrl' ],
  components: {
    'album-node': AlbumNode,
    'image-node': ImageNode
  },
  data: function () {
    return {
      albums: [],
      images: []
    }
  },
  methods: {
    onAlbumClicked: function (album) {
      this.$store.dispatch('ON_ALBUM_CHANGED', album)
    },
    onImageClicked: function (image) {
      this.$store.dispatch('ON_IMAGE_CHANGED', image)
    }
  },
  mounted: function () {
    var vm = this

    var parentAlbumId = this.$route.params.albumId

    // TODO: Get count first for each, then paginate content
    if (parentAlbumId) {
      this.apiGetAlbum(parentAlbumId, function (result) {
        vm.$store.dispatch('ON_ALBUM_CHANGED', result[0])
      })
    }

    this.apiGetAlbums(parentAlbumId, function (result) {
      vm.albums = result
    })

    if (parentAlbumId) {
      this.apiGetImages(parentAlbumId, function (result) {
        vm.images = result
      })
    }
  }
}
</script>
