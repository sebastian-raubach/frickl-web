<template>
  <router-link :to="'/images/' + image.id">
    <b-card no-body class="image-card">
      <div class="card-img-wrap">
        <img :src="baseUrl + 'image/' + image.id + '/img?small=true'" class="card-img" :style="'height:' + imageHeight + 'px'"/>
      </div>
      <div class="card-img-overlay h-100 d-flex flex-column justify-content-end">
        <div class="image-actions">
          <HeartIcon :width="48" :height="48" v-if="image.isFavorite" @click.native="onToggleFavorite($event)"/>
          <HeartOutlineIcon :width="48" :height="48" v-else  @click.native="onToggleFavorite($event)"/>
          <FolderImageIcon :width="48" :height="48" title="Set image as album cover" @click.native="onSetImageAsAlbumCover($event)" v-if="albumId"/>
          <OpenInNewIcon :width="48" :height="48" />
        </div>
        </div>
    </b-card>
  </router-link>
</template>

<script>
import HeartIcon from 'vue-material-design-icons/Heart.vue'
import HeartOutlineIcon from 'vue-material-design-icons/HeartOutline.vue'
import FolderImageIcon from 'vue-material-design-icons/FolderImage.vue'
import OpenInNewIcon from 'vue-material-design-icons/OpenInNew.vue'

export default {
  data: function () {
    return {
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
    margin: 0 5px;
  }
  .image-card .card-img-overlay .material-design-icon {
    height: 2em;
    width: 2em;
    opacity: 0;
    transition: opacity .2s ease-in-out;
  }
  .image-card .card-img-overlay .material-design-icon.heart-icon {
    opacity: 1;
  }
  .image-card:hover .card-img-overlay .material-design-icon {
    opacity: 1;
  }
  .image-card .card-img-overlay .material-design-icon > .material-design-icon__svg {
      height: 2em;
      width: 2em;
      fill: white;
  }
  .image-card .card-img-overlay .material-design-icon.heart-icon > .material-design-icon__svg,
  .image-card .card-img-overlay .material-design-icon.heart-outline-icon:hover > .material-design-icon__svg {
      fill: #EA2027;
  }
  .image-card z.image-actions .material-design-icon.folder-image-icon:hover > .material-design-icon__svg {
      fill: #FFC312;
  }
</style>
