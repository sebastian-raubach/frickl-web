<template>
  <div>
    <b-container fluid :style="{ backgroundColor: backgroundColor, color: foregroundColor}" id="image-details">
      <b-row v-if="image && album" class="pt-3">
        <b-col cols=12>
          <b-breadcrumb class="align-items-center">
            <b-breadcrumb-item :text="album.name" :to="'/albums/' + album.id"/>
            <b-breadcrumb-item :text="image.name" disabled active />
            <a class="ml-auto btn btn-sm btn-primary" :href="getSrc('ORIGINAL')" :download="`${album.name}-${image.name}`">Download</a>
          </b-breadcrumb>
        </b-col>
      </b-row>
      <b-row v-if="image" >
        <b-col cols=12 sm=12 md=12 lg=8 xl=9 class="img-col">
          <a :href="getSrc('ORIGINAL')">
            <b-img fluid-grow :src="getSrc('MEDIUM')" class="img-details"/>
          </a>
        </b-col>
        <b-col cols=12 sm=12 md=12 lg=4 xl=3 class="exif">
          <div v-if="image.exif && !(Object.keys(image.exif).length === 0 && img.exif.constructor === Object)" class="mt-3">
            <h3 v-if="image.exif && (image.exif.dateTimeOriginal || image.exif.dateTime)">Taken on: {{ getTime() | toDate }}</h3>
            <b-row>
              <b-col cols=6>
                <img src="../assets/icon-camera.svg" fluid>
                <div>{{ image.exif.cameraMake }}</div>
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
          <b-row v-if="authEnabled === false || token">
            <b-col cols=12>
              <b-button-group class="image-actions">
                <b-button v-b-tooltip.hover title="Unmark as favorite" v-if="image.isFavorite" @click="onToggleFavorite($event)">
                  <HeartIcon />
                </b-button>
                <b-button v-b-tooltip.hover title="Mark as favorite" v-else @click="onToggleFavorite($event)">
                  <HeartOutlineIcon />
                </b-button>
                <b-button v-b-tooltip.hover title="Make private" @click="onTogglePublic($event)" v-if="image.isPublic === 1">
                  <LockOpenVariantIcon />
                </b-button>
                <b-button v-b-tooltip.hover title="Make public" @click="onTogglePublic($event)" v-else>
                  <LockIcon />
                </b-button>
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
    <SelectAlbumModal :image="image"
                      ref="selectAlbumModal"
                      v-on:on-album-clicked="album => onAlbumClicked(album)" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import baguetteBox from 'baguettebox.js'

import SingleLocationMap from '../components/SingleLocationMap.vue'
import SelectAlbumModal from '../components/modals/SelectAlbumModal.vue'
import HeartIcon from 'vue-material-design-icons/Heart.vue'
import HeartOutlineIcon from 'vue-material-design-icons/HeartOutline.vue'
import FolderImageIcon from 'vue-material-design-icons/FolderImage.vue'
import LockIcon from 'vue-material-design-icons/Lock.vue'
import LockOpenVariantIcon from 'vue-material-design-icons/LockOpenVariant.vue'
import TagWidget from '../components/TagWidget.vue'
var Vibrant = require('node-vibrant')

export default {
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
    HeartIcon,
    HeartOutlineIcon,
    FolderImageIcon,
    LockIcon,
    LockOpenVariantIcon,
    TagWidget
  },
  computed: {
    ...mapGetters([
      'baseUrl',
      'token'
    ])
  },
  methods: {
    getSrc: function (size) {
      var result = `${this.baseUrl}image/${this.image.id}/img?size=${size}`

      if (this.token && this.token.imageToken) {
        result = `${result}&token=${this.token.imageToken}`
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

      this.$refs.selectAlbumModal.hide()
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
    var vm = this

    var imageId = this.$route.params.imageId

    if (!this.image || this.image.id !== parseInt(imageId)) {
      this.apiGetImage(imageId, function (result) {
        if (result && result.length > 0) {
          vm.image = result[0]
          vm.updateTags()
          vm.updateAlbum()
          Vibrant.from(vm.getSrc('SMALL'))
            .getPalette(function (err, palette) {
              if (!err && palette && palette.Vibrant) {
                vm.backgroundColor = palette.Vibrant.getHex()
                var avg = (palette.Vibrant.r + palette.Vibrant.g + palette.Vibrant.b) / 3
                vm.foregroundColor = avg < 128 ? 'white' : 'black'
              }
            })

          vm.$nextTick(function () {
            baguetteBox.run('.img-col', {
              fullScreen: true,
              captions: 'true',
              filter: /.*/i
            })
          })
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
  .image-actions .btn:hover .material-design-icon.heart-icon > .material-design-icon__svg,
  .image-actions .btn:hover .material-design-icon.heart-outline-icon > .material-design-icon__svg {
      fill: #EA2027;
  }
  .image-actions .btn:hover .material-design-icon.folder-image-icon > .material-design-icon__svg {
      fill: #FFC312;
  }

  #image-details {
    transition: all 1.5s;
    transition-property: background-color, color;
  }
</style>
