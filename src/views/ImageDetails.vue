<template>
  <div>
    <b-container fluid class="bg-dark text-light">
      <b-row v-if="image && album" class="pt-3">
        <b-col cols=12>
          <b-breadcrumb>
            <b-breadcrumb-item :text="album.name" :to="'/albums/' + album.id"/>
            <b-breadcrumb-item :text="image.path" disabled active />
          </b-breadcrumb>
        </b-col>
      </b-row>
      <b-row v-if="image" >
        <b-col cols=12 sm=12 md=12 lg=8 xl=9 class="img-col">
          <a :href="baseUrl + 'image/' + image.id + '/img?small=false'">
            <b-img fluid-grow :src="baseUrl + 'image/' + image.id + '/img?small=false'" class="img-details"/>
          </a>
        </b-col>
        <b-col cols=12 sm=12 md=12 lg=4 xl=3 class="exif">
          <div v-if="image.exif" class="mt-3">
            <h3 v-if="image.exif && (image.exif.dateTimeOriginal || image.exif.dateTime)">Taken on: {{ getTime() | toDate }}</h3>
            <b-row>
              <b-col cols=6>
                <img src="/img/icon-camera.svg" fluid>
                <div>{{ image.exif.cameraMake }}</div><div>{{ image.exif.cameraModel }}</div>
              </b-col>
              <b-col cols=6>
                <div title="Aperture"><img src="/img/icon-aperture.svg"> <span>{{ image.exif.fNumber ? image.exif.fNumber : '' }}</span></div>
                <div title="Exposure time"><img src="/img/icon-exposure.svg"> <span>{{ image.exif.exposureTime ? image.exif.exposureTime : '' }}</span></div>
                <div title="Focal length"><img src="/img/icon-focal-length.svg"> <span>{{ image.exif.focalLength ? image.exif.focalLength : '' }}</span></div>
                <div title="ISO"><img src="/img/icon-iso.svg"> <span>{{ image.exif.isoSpeedRatings ? image.exif.isoSpeedRatings : '' }}</span></div>
                <div title="Flash"><img :src="getFlashIcon()"> <span>{{ image.exif.flash ? image.exif.flash : '' }}</span></div>
              </b-col>
              <b-col cols=12>
                <hr class="white" />
              </b-col>
              <b-col cols=12>
                <b-button v-b-toggle.collapse-exif variant="link">Show full EXIF</b-button>
                <b-collapse id="collapse-exif" class="mt-2">
                  {{ image.exif }}
                </b-collapse>
              </b-col>
              <b-col cols=12>
                <hr class="white"/>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols=12 v-if="image.exif && image.exif.gpsLatitude && image.exif.gpsLongitude">
                <SingleLocationMap :latitude="image.exif.gpsLatitude" :longitude="image.exif.gpsLongitude" :zoom=5 />
              </b-col>
            </b-row>
          </div>
          <div class="mt-3 tags">
            <h3>Tags</h3>
            <div>
              <b-badge v-for="tag in tags" :key="tag.id" class="tag-badge" :to="'/tags/' + tag.id">
                {{ tag.name }} <CloseCircleOutlineIcon class="cursor-pointer" title="Remove tag" v-on:click.native="onDeleteClicked(tag, $event)"/>
              </b-badge>
            </div>
            <b-button variant="primary" size="sm" @click="onAddClicked()" class="mt-3">Add tag</b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <AddTagModal :image="image"
                 ref="tagAddModal" />
    <DeleteTagModal :tag="tagToDelete"
                    :image="image"
                    ref="tagDeleteModal"
                    v-on:onTagDeleted="updateTags" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import baguetteBox from 'baguettebox.js'

import SingleLocationMap from '../components/SingleLocationMap.vue'
import AddTagModal from '../components/modals/AddTagModal.vue'
import DeleteTagModal from '../components/modals/DeleteTagModal.vue'
import CloseCircleOutlineIcon from 'vue-material-design-icons/CloseCircleOutline.vue'

export default {
  data: function () {
    return {
      tags: [],
      tagToDelete: null
    }
  },
  components: {
    SingleLocationMap,
    CloseCircleOutlineIcon,
    AddTagModal,
    DeleteTagModal
  },
  props: [ 'baseUrl' ],
  computed: {
    ...mapGetters([
      'album',
      'image'
    ])
  },
  methods: {
    getFlashIcon: function () {
      if (this.image.exif.flash) {
        if (this.image.exif.flash.startsWith('Flash')) {
          return '/img/icon-flash.svg'
        } else {
          return '/img/icon-flash-no.svg'
        }
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
    onDeleteClicked: function (tag, event) {
      event.preventDefault()
      event.stopPropagation()
      this.tagToDelete = tag
      this.$refs.tagDeleteModal.show()
    },
    onAddClicked: function () {
      this.$refs.tagAddModal.show()
    },
    updateTags: function () {
      var vm = this
      this.apiGetTagsForImage(vm.image.id, function (result) {
        vm.tags = result
      })
    }
  },
  mounted: function () {
    var vm = this

    var imageId = this.$route.params.imageId

    if (!this.image || this.image.id !== parseInt(imageId)) {
      this.apiGetImage(imageId, function (result) {
        if (result && result.length > 0) {
          vm.$store.dispatch('ON_IMAGE_CHANGED', result[0])
        }
      })
    }

    this.updateTags()

    baguetteBox.run('.img-col', {
      captions: 'true',
      filter: /.*/i,
      fullscreen: true
    })
  }
}
</script>

<style>
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

  hr.white {
    border-top: 1px solid rgba(255, 255, 255, 0.9);
  }
</style>
