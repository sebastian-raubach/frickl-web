<template>
  <div>
    <b-container v-if="album" fluid class="bg-dark text-white pt-3 pb-3">
      <h1 class="mb-0 mt-0">{{ album.name }}</h1>
    </b-container>
    <b-container class="home mt-3" fluid>
      <div v-if="albums || images">
        <div v-if="albums">
          <h2>Albums</h2>
          <AlbumGrid :albumCount="albumCount"
                      :albumsPerPage="albumsPerPage"
                      :albums="albums"
                      ref="albumGrid"
                      @add-album-clicked="$refs.addAlbumModal.show()"
                      @onAlbumNavigation="page => onAlbumNavigation(page)"/>
        </div>
        <div class="tags" v-if="images && images.length > 0">
          <h2>Tags</h2>
          <TagWidget :tags="tags"
                     :id="album.id"
                     :type="'album'"
                     v-on:on-tag-deleted="updateTags"
                     v-on:on-tag-added="updateTags" />
          <b-button variant="secondary" size="sm" class="mt-3" @click="onApplyTagsToAlbum" v-if="(serverSettings && serverSettings.authEnabled === false) || token">Apply to all</b-button>
        </div>
        <div v-if="images">
          <h2>Images</h2>
          <ImageGrid :imageCount="imageCount"
                      :images="images"
                      :albumId="parentAlbumId"
                      :albumName="album ? album.name : null"
                      ref="imageGrid"
                      @add-image-clicked="$refs.imageUploadModal.show()"
                      @onImageNavigation="page => onImageNavigation(page)"/>
        </div>
      </div>
      <h3 v-else>Loading...</h3>
    </b-container>
    <div class="map" v-if="locations && locations.length > 0">
      <AlbumLocationMap :locations="locations" :currentlyVisibleIds="currentlyVisibleIds" />
    </div>

    <AddAlbumModal :parentAlbumId="parentAlbumId" ref="addAlbumModal" @album-added="update" />
    <ImageUploadModal :albumId="album.id" v-if="album" ref="imageUploadModal" @images-uploaded="update" />
  </div>
</template>

<script>
import L from 'leaflet'

import AlbumGrid from '@/components/AlbumGrid'
import ImageGrid from '@/components/ImageGrid'
import AlbumLocationMap from '@/components/AlbumLocationMap'
import TagWidget from '@/components/TagWidget'
import AddAlbumModal from '@/components/modals/AddAlbumModal'
import ImageUploadModal from '@/components/modals/ImageUploadModal'
import { mapGetters } from 'vuex'

export default {
  components: {
    AddAlbumModal,
    ImageUploadModal,
    AlbumGrid,
    ImageGrid,
    AlbumLocationMap,
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
      'imagesPerPage',
      'serverSettings',
      'token'
    ])
  },
  watch: {
    albumsPerPage: function () {
      this.onAlbumNavigation(1)
    },
    imagesPerPage: function () {
      this.onImageNavigation(1)
    }
  },
  methods: {
    onApplyTagsToAlbum: function () {
      // TODO: Show the AddTagModal prefilled with the existing tags, then the user can remove some.
      this.$bvModal.msgBoxConfirm('Do you want to apply these tags to all images in this album?', {
        title: 'Confirm',
        okTitle: 'Yes',
        okVariant: 'success',
        cancelTitle: 'No'
      })
        .then(value => {
          if (value) {
            this.apiPostAlbumTags(this.album.id, this.tags, result => {
              this.$bvToast.toast('Tags applied to all images in album.', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: true
              })
            })
          }
        })
    },
    updateTags: function () {
      this.apiGetAlbumTags(this.parentAlbumId, result => {
        this.tags = result
      })
    },
    onAlbumNavigation: function (page) {
      this.apiGetAlbums(this.parentAlbumId, page - 1, this.albumsPerPage, result => {
        this.albums = result

        if (result && result.length > 0) {
          let query = JSON.parse(JSON.stringify(this.$router.currentRoute.query))

          if (!query) {
            query = {}
          }

          query.albumPage = page

          this.$router.replace({
            path: this.$router.currentRoute.path,
            query: query
          })

          this.$nextTick(() => this.$refs.albumGrid.onPageChanged(page))
        }
      })
    },
    onImageNavigation: function (page) {
      this.apiGetImages(this.parentAlbumId, page - 1, this.imagesPerPage, result => {
        this.images = result

        if (result && result.length > 0) {
          this.currentlyVisibleIds = result.map(i => i.id)

          let query = JSON.parse(JSON.stringify(this.$router.currentRoute.query))

          if (!query) {
            query = {}
          }

          query.imagePage = page

          this.$router.replace({
            path: this.$router.currentRoute.path,
            query: query
          })

          this.$nextTick(() => this.$refs.imageGrid.onPageChanged(page))
        }
      })
    },
    update: function () {
      let imagePage = 1
      let albumPage = 1
      const query = this.$route.query

      if (query && query.imagePage) {
        imagePage = query.imagePage
      }
      if (query && query.albumPage) {
        albumPage = query.albumPage
      }

      this.apiGetAlbumCount(this.parentAlbumId, result => {
        this.albumCount = result
        this.onAlbumNavigation(albumPage)
      })

      if (this.parentAlbumId) {
        this.apiGetAlbum(this.parentAlbumId, result => {
          this.album = result[0]
        })
        this.apiGetImageCount(this.parentAlbumId, result => {
          this.imageCount = result
          this.onImageNavigation(imagePage)
        })
        this.apiGetAlbumLocations(this.parentAlbumId, result => {
          result.forEach(l => {
            l.location = L.latLng(l.latitude, l.longitude)
          })
          this.locations = result
        })
        this.updateTags()
      }
    }
  },
  mounted: function () {
    const id = this.$route.params.albumId

    if (id) {
      this.parentAlbumId = parseInt(id)
    }

    this.update()
  }
}
</script>
