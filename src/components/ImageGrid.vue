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
          <b-button v-b-tooltip.hover title="Download album" :href="baseUrl + 'album/' + albumId + '/download'"><DownloadIcon /></b-button>
        </b-button-group>
        <b-button-group class="pb-3 pr-2 float-right">
          <b-button v-b-tooltip.hover title="Overlay information on hover" :pressed="imageDetailsMode === 'overlay'" @click="setImageDetailsMode('overlay')" ><CardTextOutlineIcon /></b-button>
          <b-button v-b-tooltip.hover title="Show information below image" :pressed="imageDetailsMode === 'below'" @click="setImageDetailsMode('below')" ><CardsVariantIcon /></b-button>
        </b-button-group>
      </b-col>
    </b-row>
    <b-row class="image-grid">
      <b-col :cols="getColumns('cols')" :sm="getColumns('sm')" :md="getColumns('md')" :lg="getColumns('lg')" :xl="getColumns('xl')" v-for="image in images" :key="image.id" :class="'mb-4 ' + getColumns('xxl')">
        <image-node :imageHeight="imageHeights[imageWidth]" :image="image" :albumId="albumId" v-on:click.native="onImageClicked(image)" />
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
    <AccessTokenModal ref="accessTokenModal" />
  </div>
</template>

<script>
import ImageNode from '../components/ImageNode.vue'
import AccessTokenModal from '@/components/modals/AccessTokenModal.vue'
import CardsVariantIcon from 'vue-material-design-icons/CardsVariant.vue'
import CardTextOutlineIcon from 'vue-material-design-icons/CardTextOutline.vue'
import DownloadIcon from 'vue-material-design-icons/Download.vue'
import LockOpenVariantIcon from 'vue-material-design-icons/LockOpenVariant.vue'
import PublicVisibilityModal from '@/components/modals/PublicVisibilityModal'
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant.vue'
import { mapGetters } from 'vuex'

import baguetteBox from 'baguettebox.js'

export default {
  data: function () {
    return {
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
      'imageDetailsMode',
      'token'
    ])
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
      type: String,
      default: null
    }
  },
  watch: {
    imageCount: function (newValue, oldValue) {
      this.currentPage = 1
    },
    images: function (newValue, oldValue) {
      this.baguetteBox()

      window.scrollTo({
        left: 0,
        top: this.$refs.imageGrid.getBoundingClientRect().top,
        behavior: 'smooth'
      })
    }
  },
  components: {
    AccessTokenModal,
    'image-node': ImageNode,
    CardsVariantIcon,
    CardTextOutlineIcon,
    DownloadIcon,
    LockOpenVariantIcon,
    PublicVisibilityModal,
    ShareVariantIcon
  },
  methods: {
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
    setImageDetailsMode: function (mode) {
      this.$store.dispatch('ON_IMAGE_DETAILS_MODE_CHANGED', mode)
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
    },
    baguetteBox: function () {
      this.$nextTick(function () {
        baguetteBox.run('.image-grid', {
          captions: 'true',
          filter: /.*image\/[0-9]+\/img.*/i,
          fullscreen: true
        })
      })
    }
  },
  mounted: function () {
    this.baguetteBox()
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
