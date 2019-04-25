<template>
  <router-link :to="'/images/' + image.id">
    <b-card no-body class="image-card">
      <div class="card-img-wrap">
        <img :src="baseUrl + 'image/' + image.id + '/img?small=true'" class="card-img"/>
      </div>
      <div class="card-img-overlay h-100 d-flex flex-column justify-content-end">
        <div>
          <HeartIcon :width="48" :height="48" v-if="image.isFavorite" @click.native="onToggleFavorite($event)"/>
          <HeartOutlineIcon :width="48" :height="48" v-else  @click.native="onToggleFavorite($event)"/>
        </div>
        </div>
    </b-card>
  </router-link>
</template>

<script>
import HeartIcon from 'vue-material-design-icons/Heart.vue'
import HeartOutlineIcon from 'vue-material-design-icons/HeartOutline.vue'

export default {
  data: function () {
    return {
    }
  },
  props: [ 'baseUrl', 'image' ],
  components: {
    HeartIcon,
    HeartOutlineIcon
  },
  methods: {
    onToggleFavorite: function (event) {
      event.stopPropagation()
      event.preventDefault()
      this.image.isFavorite = Math.abs(this.image.isFavorite - 1)

      this.apiPatchImageFav(this.image.id, this.image.isFavorite > 0, function (result) {
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
    height: 300px;
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
</style>
