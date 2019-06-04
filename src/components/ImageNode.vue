<template>
  <b-card no-body class="image-card">
    <router-link :to="'/images/' + image.id">
      <div class="card-img-wrap">
        <img :src="baseUrl + 'image/' + image.id + '/img?small=true'" class="card-img" :style="'height:' + imageHeight + 'px'"/>
      </div>
    </router-link>
    <div class="card-img-overlay h-100 d-flex flex-column justify-content-end" v-if="imageDetailsMode === 'overlay'">
      <div class="image-actions">
        <div class="mb-2">{{ image.name }}</div>
        <HeartIcon v-if="image.isFavorite" @click.native="onToggleFavorite($event)"/>
        <HeartOutlineIcon v-else  @click.native="onToggleFavorite($event)"/>
        <FolderImageIcon title="Set image as album cover" @click.native="onSetImageAsAlbumCover($event)" v-if="albumId"/>
        <OpenInNewIcon @click.native="onImagePreview($event)"/>
      </div>
    </div>
    <b-card-body v-else class="card-image-details">
      <div class="image-actions">
        <div class="mb-2">{{ image.name }}</div>
        <HeartIcon v-if="image.isFavorite" @click.native="onToggleFavorite($event)"/>
        <HeartOutlineIcon v-else  @click.native="onToggleFavorite($event)"/>
        <FolderImageIcon title="Set image as album cover" @click.native="onSetImageAsAlbumCover($event)" v-if="albumId"/>
        <OpenInNewIcon @click.native="onImagePreview($event)"/>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import HeartIcon from 'vue-material-design-icons/Heart.vue'
import HeartOutlineIcon from 'vue-material-design-icons/HeartOutline.vue'
import FolderImageIcon from 'vue-material-design-icons/FolderImage.vue'
import OpenInNewIcon from 'vue-material-design-icons/OpenInNew.vue'

import { mapGetters } from 'vuex'

export default {
  data: function () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'imageDetailsMode'
    ])
  },
  watch: {
    imageDetailsMode: function (newValue, oldValue) {
      this.currentPage = 1
    }
  },
  props: {
    baseUrl: {
      type: String,
      default: null
    },
    image: {
      type: Object,
      default: null
    },
    albumId: {
      type: String,
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
    OpenInNewIcon
  },
  methods: {
    onImagePreview: function (event) {
      event.stopPropagation()
      event.preventDefault()
      // TODO: open lightbox
    },
    onSetImageAsAlbumCover: function (event) {
      event.stopPropagation()
      event.preventDefault()

      const album = {
        id: this.albumId,
        bannerImageId: this.image.id
      }
      this.apiPatchAlbum(album, function (result) {
      })
    },
    onToggleFavorite: function (event) {
      event.stopPropagation()
      event.preventDefault()
      this.image.isFavorite = Math.abs(this.image.isFavorite - 1)

      this.apiPatchImage(this.image, function (result) {
      })
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
  .image-card .image-actions .material-design-icon {
    margin-right: 0.5rem;
  }
  .image-card .card-img-overlay {
    padding: 0;
  }
  .image-card .card-img-overlay .material-design-icon {
    height: 1.5rem;
    width: 1.5rem;
    opacity: 0;
    transition: opacity .2s ease-in-out;
  }
  .image-card .card-image-details .material-design-icon {
    height: 1.5rem;
    width: 1.5rem;
  }
  .image-actions svg:hover {
    cursor: pointer;
  }
  .image-card .card-img-overlay > .image-actions {
    opacity: 0;
    padding: 1rem;
    background-color: rgba(1,1,1,.5);
    margin:0 !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: white;
    transition: opacity .2s ease-in-out;
  }
  .image-card .card-image-details > .image-actions {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .image-card .card-img-overlay > .image-actions > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 11pt;
  }
  .image-card:hover .card-img-overlay > .image-actions {
    opacity: 1;
  }
  .image-card .card-img-overlay .material-design-icon.heart-icon {
    opacity: 1;
  }
  .image-card:hover .card-img-overlay .material-design-icon {
    opacity: 1;
  }
  .image-card .card-img-overlay .material-design-icon > .material-design-icon__svg {
    height: 1.5rem;
    width: 1.5rem;
    fill: white;
  }
  .image-card .card-image-details .material-design-icon > .material-design-icon__svg {
    height: 1.5rem;
    width: 1.5rem;
    fill: #636e72;
  }
  .image-card .card-img-overlay .material-design-icon.heart-icon > .material-design-icon__svg,
  .image-card .card-img-overlay .material-design-icon.heart-outline-icon:hover > .material-design-icon__svg,
  .image-card .card-image-details .material-design-icon.heart-icon > .material-design-icon__svg,
  .image-card .card-image-details .material-design-icon.heart-outline-icon:hover > .material-design-icon__svg {
      fill: #EA2027;
  }
  .image-card .image-actions .material-design-icon.folder-image-icon:hover > .material-design-icon__svg,
  .image-card .card-image-details .material-design-icon.folder-image-icon:hover > .material-design-icon__svg {
      fill: #FFC312;
  }
  .image-card .image-actions .material-design-icon.open-in-new-icon:hover > .material-design-icon__svg,
  .image-card .card-image-details .material-design-icon.open-in-new-icon:hover > .material-design-icon__svg {
      fill: #A3CB38;
  }

  .col-xxl-1 .card-body {
    padding: 1rem;
  }
</style>
