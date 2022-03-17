<template>
  <b-card no-body class="image-card">
    <div class="bg-img" :style="{ height: `${imageHeight}px`, backgroundImage: `url(${getSrc('SMALL')})` }">
      <div class="overlay"></div>
    </div>
    <div class="card-image-details">
      <div class="info d-flex flex-wrap align-items-stretch">
        <div class="p-4 wrapper d-flex flex-column justify-content-center align-items-center text-center" v-if="image.exif && image.exif.cameraModel">
          <h4>{{ image.exif.cameraMake }}</h4>
          <small>{{ image.exif.cameraModel }}</small>
        </div>
        <div class="p-4 wrapper bg-light border-left d-flex flex-column justify-content-center align-items-center text-center" v-if="day">
          <h4>{{ day }}</h4>
          <small>{{ month }} {{ year }}</small>
        </div>
      </div>

      <b-button-group class="image-actions w-100">
        <template v-if="(serverSettings && serverSettings.authEnabled === false) || token">
          <b-button v-b-tooltip.hover.bottom="'Mark as favourite'" v-if="image.isFavorite" @click="onToggleFavorite($event)"><HeartIcon /></b-button>
          <b-button v-b-tooltip.hover.bottom="'Unmark as favourite'" v-else  @click="onToggleFavorite($event)"><HeartOutlineIcon /></b-button>
          <template v-if="(serverSettings && serverSettings.authEnabled === true) && token">
            <b-button v-b-tooltip.hover.bottom="'Make private'" @click="onTogglePublic($event)" v-if="image.isPublic === 1"><LockOpenVariantIcon /></b-button>
            <b-button v-b-tooltip.hover.bottom="'Make public'" @click="onTogglePublic($event)" v-else><LockIcon /></b-button>
          </template>
          <b-button v-b-tooltip.hover.bottom="'Set image as album cover'" @click="onSetImageAsAlbumCover($event)" v-if="albumId"><FolderImageIcon/></b-button>
        </template>

        <b-button @click="$emit('image-preview-clicked')" v-b-tooltip.hover.bottom="'Open large preview'"><MagnifyPlusIcon /></b-button>
      </b-button-group>

      <router-link :to="'/images/' + image.id" class="stretched-link" :title="image.name" />
    </div>
  </b-card>
</template>

<script>
import HeartIcon from 'vue-material-design-icons/Heart.vue'
import HeartOutlineIcon from 'vue-material-design-icons/HeartOutline.vue'
import FolderImageIcon from 'vue-material-design-icons/FolderImage.vue'
import LockIcon from 'vue-material-design-icons/Lock.vue'
import LockOpenVariantIcon from 'vue-material-design-icons/LockOpenVariant.vue'
import MagnifyPlusIcon from 'vue-material-design-icons/MagnifyPlus.vue'

import { mapGetters } from 'vuex'

export default {
  data: function () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'serverSettings',
      'baseUrl',
      'token',
      'accessToken'
    ]),
    month: function () {
      if (this.image.exif && (this.image.exif.dateTimeOriginal || this.image.exif.dateTime)) {
        const date = new Date(this.getTime())
        return date.toLocaleDateString(undefined, { month: 'short' })
      } else {
        return null
      }
    },
    day: function () {
      if (this.image.exif && (this.image.exif.dateTimeOriginal || this.image.exif.dateTime)) {
        const date = new Date(this.getTime())
        return date.toLocaleDateString(undefined, { day: '2-digit' })
      } else {
        return null
      }
    },
    year: function () {
      if (this.image.exif && (this.image.exif.dateTimeOriginal || this.image.exif.dateTime)) {
        const date = new Date(this.getTime())
        return date.toLocaleDateString(undefined, { year: 'numeric' })
      } else {
        return null
      }
    }
  },
  props: {
    image: {
      type: Object,
      default: null
    },
    albumId: {
      type: Number,
      default: null
    },
    imageHeight: {
      type: Number,
      default: 300
    }
  },
  components: {
    HeartIcon,
    HeartOutlineIcon,
    FolderImageIcon,
    LockIcon,
    LockOpenVariantIcon,
    MagnifyPlusIcon
  },
  methods: {
    getVideoSrc: function () {
      var result = `${this.baseUrl}image/${this.image ? this.image.id : 'null'}/video/${this.image.name.toLowerCase()}?a=1`

      if (this.token && this.token.imageToken) {
        result = `${result}&token=${this.token.imageToken}`
      }
      if (this.accessToken) {
        result = `${result}&accesstoken=${this.accessToken}`
      }

      return result
    },
    getSrc: function (size) {
      var result = `${this.baseUrl}image/${this.image.id}/img?size=${size}`

      if (this.token && this.token.imageToken) {
        result = `${result}&token=${this.token.imageToken}`
      }
      if (this.accessToken) {
        result = `${result}&accesstoken=${this.accessToken}`
      }

      return result
    },
    getTime: function () {
      if (this.image.exif.dateTime) {
        return this.image.exif.dateTime
      } else if (this.image.exif.dateTimeOriginal) {
        return this.image.exif.dateTimeOriginal
      } else {
        return ''
      }
    },
    onSetImageAsAlbumCover: function (event) {
      event.stopPropagation()
      event.preventDefault()

      var vm = this
      this.$bvModal.msgBoxConfirm('Set image as album cover?', {
        title: 'Album cover',
        okTitle: 'Yes',
        okVariant: 'success',
        cancelTitle: 'No',
        cancelVariant: 'secondary'
      })
        .then(value => {
          if (value) {
            const album = {
              id: vm.albumId,
              bannerImageId: vm.image.id
            }

            vm.apiPatchAlbum(album, function (result) {
              vm.$bvToast.toast('Image set as album cover.', {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: true
              })
            })
          }
        })
    },
    onTogglePublic: function (event) {
      event.stopPropagation()
      event.preventDefault()
      this.image.isPublic = Math.abs(this.image.isPublic - 1)

      this.apiPatchImage(this.image)
    },
    onToggleFavorite: function (event) {
      event.stopPropagation()
      event.preventDefault()
      this.image.isFavorite = Math.abs(this.image.isFavorite - 1)

      this.apiPatchImage(this.image)
    }
  }
}
</script>

<style>
  .image-card .card-img {
    width: 100%;
    object-fit: cover;
    transition: transform .2s ease-in-out;
  }
  .image-card.below .card-img {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .image-card .card-image-details .material-design-icon {
    height: 1.5rem;
    width: 1.5rem;
  }
  .image-actions svg:hover {
    cursor: pointer;
  }
  .image-card .card-image-details .image-actions {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    z-index: 2;
  }
  .image-card .card-image-details .image-actions .btn {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .image-card .card-image-details .material-design-icon > .material-design-icon__svg {
    height: 1.2rem;
    width: 1.2rem;
    fill: white;
  }
  .image-card .card-image-details .card-body .material-design-icon > .material-design-icon__svg {
    fill: #6c757d;
  }
  .image-card .card-image-details .material-design-icon.heart-icon > .material-design-icon__svg,
  .image-card .card-image-details .material-design-icon.heart-outline-icon:hover > .material-design-icon__svg {
      fill: #EA2027;
  }
  .image-card .image-actions .material-design-icon.folder-image-icon:hover > .material-design-icon__svg,
  .image-card .card-image-details .material-design-icon.folder-image-icon:hover > .material-design-icon__svg {
      fill: #FFC312;
  }
  .image-card .image-actions .material-design-icon.magnify-plus-icon:hover > .material-design-icon__svg,
  .image-card .card-image-details .material-design-icon.magnify-plus-icon:hover > .material-design-icon__svg {
      fill: #A3CB38;
  }
  .image-card .card-image-details .material-design-icon.lock-icon:hover > .material-design-icon__svg,
  .image-card .card-image-details .material-design-icon.lock-open-variant-icon > .material-design-icon__svg {
      fill: #3498db;
  }

  .col-xxl-1 .card-body {
    padding: 1rem;
  }
  .image-card .mdi-sm.material-design-icon,
  .image-card .mdi-sm.material-design-icon .material-design-icon__svg {
    height: 1rem;
    width: 1rem;
  }

  .image-card .info > .wrapper {
    flex: 1;
  }

  .image-card .info h4 {
    margin-bottom: 0;
  }

  .image-card .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.15);
    transition: background 0.1s linear;
  }

  .image-card:hover .overlay {
    background: rgba(0,0,0,.05);
  }

  .image-card .bg-img {
    position: relative;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .image-card .bg-img .inner {
    position: relative;
  }
</style>
