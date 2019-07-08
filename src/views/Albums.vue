<template>
  <div>
    <b-container v-if="album" fluid class="bg-dark text-white pt-3 pb-3">
      <h1 class="mb-0 mt-0">{{ album.name }}</h1>
    </b-container>
    <b-container class="home mt-3" fluid>
      <div v-if="albums || images">
        <div v-if="albums && albums.length > 0">
          <h2>Albums</h2>
          <album-grid :albumCount="albumCount"
                      :albumsPerPage="albumsPerPage"
                      :albums="albums"
                      ref="albumGrid"
                      v-on:onAlbumNavigation="page => onAlbumNavigation(page)"/>
        </div>
        <div class="tags" v-if="images && images.length > 0">
          <h2>Tags</h2>
          <TagWidget :tags="tags"
                     :id="album.id"
                     :type="'album'"
                     v-on:on-tag-deleted="updateTags"
                     v-on:on-tag-added="updateTags" />
          <b-button variant="secondary" size="sm" class="mt-3" @click="onApplyTagsToAlbum">Apply to all</b-button>
        </div>
        <div v-if="images && images.length > 0">
          <h2>Images</h2>
          <image-grid :imageCount="imageCount"
                      :images="images"
                      :albumId="parentAlbumId"
                      ref="imageGrid"
                      v-on:onImageNavigation="page => onImageNavigation(page)"/>
        </div>
      </div>
      <h3 v-else>Loading...</h3>
    </b-container>
    <div class="map" v-if="locations && locations.length > 0">
      <album-location-map :locations="locations" :currentlyVisibleIds="currentlyVisibleIds" />
    </div>
  </div>
</template>

<script>
import L from 'leaflet'

import AlbumGrid from '../components/AlbumGrid.vue'
import ImageGrid from '../components/ImageGrid.vue'
import AlbumLocationMap from '../components/AlbumLocationMap.vue'
import TagWidget from '../components/TagWidget.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    'album-grid': AlbumGrid,
    'image-grid': ImageGrid,
    'album-location-map': AlbumLocationMap,
    TagWidget
  },
  data: function () {
    return {
      album: null,
      albums: null,
      albumCount: 0,
      images: null,
      imageCount: 0,
      parentAlbumId: null,
      locations: [],
      currentlyVisibleIds: [],
      tags: []
    }
  },
  computed: {
    ...mapGetters([
      'albumsPerPage',
      'imagesPerPage'
    ])
  },
  watch: {
    albumsPerPage: function (newValue, oldValue) {
      this.onAlbumNavigation(1)
    },
    imagesPerPage: function (newValue, oldValue) {
      this.onImageNavigation(1)
    }
  },
  methods: {
    onApplyTagsToAlbum: function () {
      var vm = this
      this.$bvModal.msgBoxConfirm('Do you want to apply these tags to all images in this album?', {
        title: 'Confirm',
        okTitle: 'Yes',
        okVariant: 'success',
        cancelTitle: 'No'
      })
        .then(value => {
          if (value) {
            vm.apiPostAlbumTags(vm.album.id, vm.tags, function (result) {
              vm.$bvToast.toast('Tags applied to all images in album.', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: true
              })
            })
          }
        })
    },
    updateTags: function () {
      var vm = this
      this.apiGetAlbumTags(this.parentAlbumId, function (result) {
        vm.tags = result
      })
    },
    onAlbumNavigation: function (page) {
      var vm = this

      this.apiGetAlbums(this.parentAlbumId, page - 1, this.albumsPerPage, function (result) {
        vm.albums = result

        if (result && result.length > 0) {
          var query = JSON.parse(JSON.stringify(vm.$router.currentRoute.query))

          if (!query) {
            query = {}
          }

          query.albumPage = page

          vm.$router.replace({
            path: vm.$router.currentRoute.path,
            query: query
          })

          vm.$nextTick(function () {
            vm.$refs.albumGrid.onPageChanged(page)
          })
        }
      })
    },
    onImageNavigation: function (page) {
      var vm = this

      this.apiGetImages(this.parentAlbumId, page - 1, this.imagesPerPage, function (result) {
        vm.images = result

        if (result && result.length > 0) {
          vm.currentlyVisibleIds = result.map(function (i) {
            return i.id
          })

          var query = JSON.parse(JSON.stringify(vm.$router.currentRoute.query))

          if (!query) {
            query = {}
          }

          query.imagePage = page

          vm.$router.replace({
            path: vm.$router.currentRoute.path,
            query: query
          })

          vm.$nextTick(function () {
            vm.$refs.imageGrid.onPageChanged(page)
          })
        }
      })
    }
  },
  mounted: function () {
    var vm = this

    this.parentAlbumId = this.$route.params.albumId
    var imagePage = 1
    var albumPage = 1
    var query = this.$route.query

    if (query && query.imagePage) {
      imagePage = query.imagePage
    }
    if (query && query.albumPage) {
      albumPage = query.albumPage
    }

    this.apiGetAlbumCount(this.parentAlbumId, function (result) {
      vm.albumCount = result
      vm.onAlbumNavigation(albumPage)
    })

    if (this.parentAlbumId) {
      this.apiGetAlbum(this.parentAlbumId, function (result) {
        vm.album = result[0]
      })
      this.apiGetImageCount(this.parentAlbumId, function (result) {
        vm.imageCount = result
        vm.onImageNavigation(imagePage)
      })
      this.apiGetAlbumLocations(this.parentAlbumId, function (result) {
        result.forEach(function (l) {
          l.location = L.latLng(l.latitude, l.longitude)
        })
        vm.locations = result
      })
      this.updateTags()
    }
  }
}
</script>
