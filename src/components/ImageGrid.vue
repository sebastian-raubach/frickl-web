<template>
  <div ref="imageGrid">
    <b-row>
      <b-col cols=12>
        <b-button-group class="pb-3 float-right">
          <b-button v-b-tooltip.hover title="Large images" :pressed="imageWidth === 'large'" @click="setColWidth('large')" class="grid-icon grid-large"></b-button>
          <b-button v-b-tooltip.hover title="Medium images" :pressed="imageWidth === 'medium'" @click="setColWidth('medium')" class="grid-icon grid-medium"></b-button>
          <b-button v-b-tooltip.hover title="Small images" :pressed="imageWidth === 'small'" @click="setColWidth('small')" class="grid-icon grid-small"></b-button>
          <b-dropdown right :text="imagesPerPage" v-b-tooltip.hover title="Images per page">
            <b-dropdown-item v-for="option in imagesPerPageOptions"
                            :key="option"
                            @click="setImagesPerPage(option)"
                            :active="option === imagesPerPage">
              {{ option }}
            </b-dropdown-item>
          </b-dropdown>
        </b-button-group>
        <b-button-group v-if="albumId" class="pb-3 pr-2 float-right">
          <b-button v-b-tooltip.hover title="Change public visibility of album" v-if="(serverSettings && serverSettings.authEnabled === false) || token" href="#" @click.prevent="$refs.publicModal.show" ><LockOpenVariantIcon /></b-button>
          <b-button v-b-tooltip.hover title="Generate share token" v-if="(serverSettings && serverSettings.authEnabled === false) || token" href="#" @click.prevent="$refs.accessTokenModal.show"><ShareVariantIcon /></b-button>
          <b-button v-b-tooltip.hover title="Download album" @click="downloadAlbum"><DownloadIcon /></b-button>
        </b-button-group>
        <b-button-group class="pb-3 pr-2 float-right" v-if="albumId && ((serverSettings && serverSettings.authEnabled === false) || token)">
          <b-button @click="$emit('add-image-clicked')"><ImagePlusIcon /></b-button>
        </b-button-group>
      </b-col>
    </b-row>
    <b-row class="image-grid">
      <b-col :cols="getColumns('cols')" :sm="getColumns('sm')" :md="getColumns('md')" :lg="getColumns('lg')" :xl="getColumns('xl')" v-for="(image, index) in images" :key="image.id" :class="'mb-4 ' + getColumns('xxl')">
        <image-node :imageHeight="imageHeights[imageWidth]" :image="image" :albumId="albumId" @click.native="onImageClicked(image)" @image-preview-clicked="coolboxIndex = index" />
      </b-col>
    </b-row>

    <b-pagination v-if="imageCount > imagesPerPage"
      v-model="currentPage"
      limit=10
      :total-rows="imageCount"
      :per-page="imagesPerPage"
      @change="page => $emit('onImageNavigation', page)">
    </b-pagination>
    <PublicVisibilityModal ref="publicModal" v-on:visibility-changed="onVisibilityChanged" />
    <AccessTokenModal :albumId="albumId" ref="accessTokenModal" />

    <CoolLightBox
      :items="coolboxImages"
      :index="coolboxIndex"
      :useZoomBar="true"
      @close="coolboxIndex = null" />
  </div>
</template>

<script>
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'

import ImageNode from '../components/ImageNode'
import AccessTokenModal from '@/components/modals/AccessTokenModal'
import DownloadIcon from 'vue-material-design-icons/Download'
import LockOpenVariantIcon from 'vue-material-design-icons/LockOpenVariant'
import PublicVisibilityModal from '@/components/modals/PublicVisibilityModal'
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant'
import ImagePlusIcon from 'vue-material-design-icons/ImagePlus'
import { mapGetters } from 'vuex'

export default {
  data: function () {
    return {
      coolboxIndex: null,
      currentPage: 1,
      imagesPerPageOptions: ['12', '24', '48', '96'],
      imageHeights: {
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
  computed: {
    ...mapGetters([
      'serverSettings',
      'baseUrl',
      'imageWidth',
      'imagesPerPage',
      'token'
    ]),
    coolboxImages: function () {
      if (this.images) {
        return this.images.map(i => {
          if (i.dataType === 'video') {
            return {
              src: this.getVideoSrc(i),
              thumb: this.getSrc(i, 'SMALL'),
              title: i.name,
              mediaType: 'video'
            }
          } else {
            return {
              src: this.getSrc(i, 'ORIGINAL'),
              thumb: this.getSrc(i, 'SMALL'),
              title: i.name
            }
          }
        })
      } else {
        return []
      }
    }
  },
  props: {
    imageCount: {
      type: Number,
      default: 0
    },
    images: {
      type: Array,
      default: null
    },
    albumId: {
      type: Number,
      default: null
    },
    albumName: {
      type: String,
      default: 'unknown-album'
    }
  },
  watch: {
    imageCount: function () {
      this.currentPage = 1
    },
    images: function () {
      window.scrollTo({
        left: 0,
        top: this.$refs.imageGrid.getBoundingClientRect().top,
        behavior: 'smooth'
      })
    }
  },
  components: {
    CoolLightBox,
    AccessTokenModal,
    'image-node': ImageNode,
    DownloadIcon,
    LockOpenVariantIcon,
    PublicVisibilityModal,
    ShareVariantIcon,
    ImagePlusIcon
  },
  methods: {
    downloadAlbum: function () {
      this.$eventHub.$emit('show-loading', true)
      // Download the current table data
      this.apiDownloadAlbum(this.albumId, result => {
        this.downloadFile(`${this.baseUrl}download/${result}`, `${this.albumName}.zip`)
        this.$eventHub.$emit('show-loading', false)
      })
    },
    downloadFile: function (url, filename) {
      const downloadLink = document.createElement('a')
      downloadLink.href = url
      if (filename) {
        downloadLink.download = filename
      }
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    },
    getVideoSrc: function (image) {
      let result = `${this.baseUrl}image/${image ? image.id : 'null'}/video/${image.name.toLowerCase()}?a=1`

      if (this.token && this.token.imageToken) {
        result = `${result}&token=${this.token.imageToken}`
      }
      if (this.accessToken) {
        result = `${result}&accesstoken=${this.accessToken}`
      }

      return result
    },
    getSrc: function (image, size) {
      let result = `${this.baseUrl}image/${image.id}/img?size=${size}`

      if (this.token && this.token.imageToken) {
        result = `${result}&token=${this.token.imageToken}`
      }
      if (this.accessToken) {
        result = `${result}&accesstoken=${this.accessToken}`
      }

      return result
    },
    onVisibilityChanged: function (isPublic) {
      if (this.albumId) {
        this.apiGetAlbumPublicVisibility(this.albumId, isPublic, result => {
          this.$emit('onImageNavigation', this.currentPage)
          this.$refs.publicModal.hide()
        })
      }
    },
    setColWidth: function (size) {
      this.$store.dispatch('ON_IMAGE_WIDTH_CHANGED', size)
    },
    setImagesPerPage: function (option) {
      this.$store.dispatch('ON_IMAGES_PER_PAGE_CHANGED', option)
    },
    getColumns: function (size) {
      if (size === 'xxl') {
        return 'col-xxl-' + this.widths[this.imageWidth][size]
      } else {
        return this.widths[this.imageWidth][size]
      }
    },
    onImageClicked: function (image) {
      this.$store.dispatch('ON_IMAGE_CHANGED', image)
    },
    onPageChanged: function (page) {
      this.currentPage = page
    }
  }
}
</script>

<style>
  .grid-icon {
    background-position: 6px 6px;
    background-repeat: no-repeat;
    background-size: 24px 24px;
    padding-left: 24px;
  }
  .grid-icon.grid-large {
    background-image: url('../assets/grid-large.svg') !important;
  }
  .grid-icon.grid-medium {
    background-image: url('../assets/grid-medium.svg') !important;
  }
  .grid-icon.grid-small {
    background-image: url('../assets/grid-small.svg') !important;
  }
</style>
