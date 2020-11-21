<template>
  <div>
    <b-container fluid :style="{ backgroundColor: backgroundColor, color: foregroundColor}" id="image-details">
      <b-row v-if="image && album" class="pt-3">
        <b-col cols=12>
          <b-breadcrumb class="align-items-center">
            <b-breadcrumb-item :text="album.name" :to="'/albums/' + album.id"/>
            <b-breadcrumb-item :text="image.name" disabled active />
            <div class="ml-auto">
              <b-btn size="sm" class="mr-2" @click="$refs.shareModal.show()" v-if="image.isPublic === 1"><ShareVariantIcon /> Share</b-btn>
              <b-btn size="sm" variant="primary" :href="getSrc('ORIGINAL')" :download="`${album.name}-${image.name}`"><DownloadIcon /> Download</b-btn>
            </div>
          </b-breadcrumb>
        </b-col>
      </b-row>
      <b-row v-if="image" >
        <b-col cols=12 sm=12 md=12 lg=8 xl=9 class="img-col">
          <template v-if="image.dataType === 'video'">
            <b-embed type="video" :src="getVideoSrc()" allowfullscreen controls />
          </template>
          <a :href="getSrc('ORIGINAL')" v-else>
            <b-img fluid-grow :src="getSrc('MEDIUM')" class="img-details"/>
          </a>
        </b-col>
        <b-col cols=12 sm=12 md=12 lg=4 xl=3 class="exif">
          <div v-if="image.exif && !(Object.keys(image.exif).length === 0 && img.exif.constructor === Object)" class="mt-3">
            <h3 v-if="image.exif && (image.exif.dateTimeOriginal || image.exif.dateTime)">Taken on: {{ getTime() | toDate }}</h3>
            <b-row>
              <b-col cols=6>
                <img src="../assets/icon-camera.svg" fluid>
                <div class="font-weight-bold">{{ image.exif.cameraMake }}</div>
                <div>{{ image.exif.cameraModel }}</div>
              </b-col>
              <b-col cols=6>
                <div v-b-tooltip.left.hover title="Aperture"><img src="../assets/icon-aperture.svg"> <span>{{ image.exif.fNumber ? image.exif.fNumber : '' }}</span></div>
                <div v-b-tooltip.left.hover title="Exposure time"><img src="../assets/icon-exposure.svg"> <span>{{ image.exif.exposureTime ? image.exif.exposureTime : '' }}</span></div>
                <div v-b-tooltip.left.hover title="Focal length"><img src="../assets/icon-focal-length.svg"> <span>{{ image.exif.focalLength ? image.exif.focalLength : '' }}</span></div>
                <div v-b-tooltip.left.hover title="ISO"><img src="../assets/icon-iso.svg"> <span>{{ image.exif.isoSpeedRatings ? image.exif.isoSpeedRatings : '' }}</span></div>
                <div v-b-tooltip.left.hover title="Flash" v-if="hasFlash()"><img src="../assets/icon-flash.svg"> <span>{{ image.exif.flash ? image.exif.flash : '' }}</span></div>
                <div v-b-tooltip.left.hover title="Flash" v-else><img src="../assets/icon-flash-no.svg"> <span>{{ image.exif.flash ? image.exif.flash : '' }}</span></div>
              </b-col>
              <b-col cols=6 v-if="image.exif.lensMake || image.exif.lensModel">
                <img src="../assets/icon-lens.svg" fluid>
                <div>{{ image.exif.lensMake }}</div><div>{{ image.exif.lensModel }}</div>
              </b-col>
              <b-col cols=12>
                <hr class="white"/>
              </b-col>
              <template v-if="image.exif">
                <b-col cols=12>
                  <a v-b-toggle.collapse-exif href="#" @click="$event.preventDefault()" class="exif-anchor">Toggle full EXIF</a>
                  <b-collapse id="collapse-exif" class="mt-2">
                    <dl>
                      <template v-for="(value, name) in image.exif">
                        <dt :key="'dt-' + name" class="text-capitalize">{{ name | decamelize }}</dt>
                        <dd :key="'dd-' + name">{{ value }}</dd>
                      </template>
                    </dl>
                  </b-collapse>
                </b-col>
                <b-col cols=12>
                  <hr class="white"/>
                </b-col>
              </template>
            </b-row>
            <template v-if="image.exif && image.exif.gpsLatitude && image.exif.gpsLongitude">
              <b-row>
                <b-col cols=12>
                  <SingleLocationMap :latitude="image.exif.gpsLatitude" :longitude="image.exif.gpsLongitude" :zoom=5 />
                </b-col>
              </b-row>
              <b-row>
                <b-col cols=12>
                  <hr class="white"/>
                </b-col>
              </b-row>
            </template>
          </div>
          <b-row v-if="(serverSettings && serverSettings.authEnabled === false) || token">
            <b-col cols=12>
              <b-button-group class="image-actions">
                <b-button v-b-tooltip.hover title="Unmark as favorite" v-if="image.isFavorite" @click="onToggleFavorite($event)">
                  <HeartIcon />
                </b-button>
                <b-button v-b-tooltip.hover title="Mark as favorite" v-else @click="onToggleFavorite($event)">
                  <HeartOutlineIcon />
                </b-button>
                <template v-if="(serverSettings && serverSettings.authEnabled === true) && token">
                  <b-button v-b-tooltip.hover title="Make private" @click="onTogglePublic($event)" v-if="image.isPublic === 1">
                    <LockOpenVariantIcon />
                  </b-button>
                  <b-button v-b-tooltip.hover title="Make public" @click="onTogglePublic($event)" v-else>
                    <LockIcon />
                  </b-button>
                </template>
                <b-button v-b-tooltip.hover title="Set image as album cover" @click="onSetImageAsAlbumCover($event)">
                  <FolderImageIcon />
                </b-button>
              </b-button-group>
            </b-col>
            <b-col cols=12>
              <hr class="white" />
            </b-col>
          </b-row>
          <div class="mt-3 tags">
            <h3>Tags</h3>
            <TagWidget :tags="tags"
                      :id="image.id"
                      :type="'image'"
                      v-on:on-tag-deleted="updateTags"
                      v-on:on-tag-added="updateTags" />
          </div>
        </b-col>
      </b-row>
    </b-container>
    <ShareModal :url="shareUrl" ref="shareModal" />
    <SelectAlbumModal :image="image"
                      ref="selectAlbumModal"
                      v-on:on-album-clicked="album => onAlbumClicked(album)" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import baguetteBox from 'baguettebox.js'

import SingleLocationMap from '@/components/SingleLocationMap'
import SelectAlbumModal from '@/components/modals/SelectAlbumModal'
import ShareModal from '@/components/modals/ShareModal'
import DownloadIcon from 'vue-material-design-icons/Download'
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant'
import HeartIcon from 'vue-material-design-icons/Heart'
import HeartOutlineIcon from 'vue-material-design-icons/HeartOutline'
import FolderImageIcon from 'vue-material-design-icons/FolderImage'
import LockIcon from 'vue-material-design-icons/Lock'
import LockOpenVariantIcon from 'vue-material-design-icons/LockOpenVariant'
import TagWidget from '@/components/TagWidget'
var Vibrant = require('node-vibrant')

export default {
  metaInfo () {
    return {
      meta: [
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: 'Frickl' },
        { property: 'og:description', content: 'The new home for all your photos.' },
        { property: 'og:image', content: this.getExternalSrc() },
        { property: 'og:image:type', content: 'image/jpeg' },
        { name: 'twitter:title', content: 'The new home for all your photos.' },
        { name: 'twitter:description', content: 'Frickl' },
        { name: 'twitter:url', content: window.location.href },
        { name: 'twitter:image', content: this.getExternalSrc() },
        { name: 'twitter:card', content: 'summary_large_image' }
      ]
    }
  },
  data: function () {
    return {
      tags: [],
      image: null,
      album: null,
      backgroundColor: '#343a40',
      foregroundColor: '#ffffff'
    }
  },
  components: {
    SingleLocationMap,
    SelectAlbumModal,
    DownloadIcon,
    HeartIcon,
    HeartOutlineIcon,
    FolderImageIcon,
    LockIcon,
    LockOpenVariantIcon,
    ShareModal,
    ShareVariantIcon,
    TagWidget
  },
  computed: {
    ...mapGetters([
      'serverSettings',
      'baseUrl',
      'token',
      'accessToken'
    ]),
    shareUrl: function () {
      if (this.image) {
        const l = window.location
        return `${l.protocol}//${l.host}${l.pathname}api/image/${this.image.id}/share`
      } else {
        return null
      }
    }
  },
  methods: {
    getExternalSrc: function () {
      const url = window.location.protocol + '//' + window.location.hostname

      if (this.baseUrl.indexOf(url) === 0) {
        return this.getSrc('MEDIUM')
      } else {
        return url + this.getSrc('MEDIUM')
      }
    },
    getVideoSrc: function () {
      var result = `${this.baseUrl}image/${this.image ? this.image.id : 'null'}/video?a=1`

      if (this.token && this.token.imageToken) {
        result = `${result}&token=${this.token.imageToken}`
      }
      if (this.accessToken) {
        result = `${result}&accesstoken=${this.accessToken}`
      }

      return result
    },
    getSrc: function (size) {
      var result = `${this.baseUrl}image/${this.image ? this.image.id : 'null'}/img?size=${size}`

      if (this.token && this.token.imageToken) {
        result = `${result}&token=${this.token.imageToken}`
      }
      if (this.accessToken) {
        result = `${result}&accesstoken=${this.accessToken}`
      }

      return result
    },
    onTogglePublic: function (event) {
      event.stopPropagation()
      event.preventDefault()
      this.image.isPublic = Math.abs(this.image.isPublic - 1)

      this.apiPatchImage(this.image)
    },
    onAlbumClicked: function (album) {
      album.bannerImageId = this.image.id

      if (this.$refs.selectAlbumModal) {
        this.$refs.selectAlbumModal.hide()
      }
      this.apiPatchAlbum(album, function (result) {
      })
    },
    hasFlash: function () {
      if (this.image.exif.flash) {
        const flashValue = this.image.exif.flash.toLowerCase()
        return flashValue.startsWith('Flash fired')
      } else {
        return false
      }
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
    updateTags: function () {
      var vm = this
      this.apiGetTagsForImage(vm.image.id, function (result) {
        vm.tags = result
      })
    },
    updateAlbum: function () {
      var vm = this
      this.apiGetAlbum(this.image.albumId, function (result) {
        vm.album = result[0]
      })
    },
    onSetImageAsAlbumCover: function (event) {
      event.stopPropagation()
      event.preventDefault()
      this.$refs.selectAlbumModal.show()
    },
    onToggleFavorite: function (event) {
      event.stopPropagation()
      event.preventDefault()
      this.image.isFavorite = Math.abs(this.image.isFavorite - 1)

      this.apiPatchImage(this.image, function (result) {
      })
    }
  },
  mounted: function () {
    var imageId = this.$route.params.imageId

    if (!this.image || this.image.id !== parseInt(imageId)) {
      this.apiGetImage(imageId, result => {
        if (result && result.length > 0) {
          this.image = result[0]
          this.updateTags()
          this.updateAlbum()
          Vibrant.from(this.getSrc('SMALL'))
            .getPalette((err, palette) => {
              if (!err && palette && palette.Vibrant) {
                this.backgroundColor = palette.Vibrant.getHex()
                var avg = (palette.Vibrant.r + palette.Vibrant.g + palette.Vibrant.b) / 3
                this.foregroundColor = avg < 128 ? 'white' : 'black'
              }
            })

          this.$nextTick(() => {
            baguetteBox.run('.img-col', {
              fullScreen: true,
              captions: 'true',
              filter: /.*/i
            })
          })

          this.$meta().refresh()
        }
      })
    }
  }
}
</script>

<style>
  .exif-anchor {
    color: inherit;
  }
  #image-details {
    min-height: calc(100vh - 56px);
  }
  .img-col {
    padding-left: 0!important;
    padding-right: 0!important;
  }
  .img-details {
    width: 100%;
    object-fit: cover;
  }

  .exif img[src$=".svg"] {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .exif img + span {
    line-height: 24px;
  }

  #collapse-exif dl {
    max-height: 300px;
    overflow-y: auto;
  }

  hr.white {
    border-top: 1px solid rgba(255, 255, 255, 0.9);
  }

  .image-actions .material-design-icon {
    height: 2em;
    width: 2em;
    transition: opacity .2s ease-in-out;
    cursor: pointer;
  }
  .image-actions .material-design-icon > .material-design-icon__svg {
      height: 2em;
      width: 2em;
      fill: white;
  }
  .image-actions .btn .material-design-icon.heart-icon > .material-design-icon__svg,
  .image-actions .btn:hover .material-design-icon.heart-icon > .material-design-icon__svg,
  .image-actions .btn:hover .material-design-icon.heart-outline-icon > .material-design-icon__svg {
      fill: #EA2027;
  }
  .image-actions .btn .material-design-icon.lock-open-variant-icon > .material-design-icon__svg,
  .image-actions .btn:hover .material-design-icon.lock-icon > .material-design-icon__svg,
  .image-actions .btn:hover .material-design-icon.lock-open-variant-icon > .material-design-icon__svg {
      fill: #3498db;
  }
  .image-actions .btn:hover .material-design-icon.folder-image-icon > .material-design-icon__svg {
      fill: #FFC312;
  }

  #image-details {
    transition: all 1.5s;
    transition-property: background-color, color;
  }
</style>
