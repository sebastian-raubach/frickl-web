<template>
  <div class="album h-100">
    <hr/>
    <hr/>
    <b-card :class="`album-card ${albumDetailsMode} ${albumDetailsMode === 'below' ? 'h-100': ''}`" no-body>
      <router-link :to="'/albums/' + album.id" :title="album.name">
        <div class="card-img-wrap">
          <img :src="baseUrl + 'image/' + album.bannerImageId + '/img?small=true'" class="card-img" :style="'height:' + albumHeight + 'px'"/>
        </div>
      </router-link>
      <div class="card-img-overlay flex-column justify-content-end" v-if="albumDetailsMode === 'overlay'">
        <div>
          <h5 class="mb-2">{{ album.name }}</h5>
          <span v-if="album.count > 0" class="font-weight-light"><ImageMultipleIcon /> {{ album.count }}</span>
        </div>
      </div>
      <b-card-body v-else>
        <div>
          <h5 class="mb-2">{{ album.name }}</h5>
          <span v-if="album.count > 0" class="font-weight-light"><ImageMultipleIcon /> {{ album.count }}</span>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ImageMultipleIcon from 'vue-material-design-icons/ImageMultiple.vue'

export default {
  data: function () {
    return {
    }
  },
  components: {
    ImageMultipleIcon
  },
  props: {
    album: {
      type: Object,
      default: null
    },
    albumHeight: {
      type: Number,
      default: 300
    }
  },
  computed: {
    ...mapGetters([
      'baseUrl',
      'albumDetailsMode'
    ])
  }
}
</script>

<style>
  .album-card .card-img {
    width: 100%;
    object-fit: cover;
    height: 300px;
    transition: transform .2s ease-in-out;
  }
  .album-card.below .card-img {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .album-card h5 {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .album-card .card-img-overlay {
    padding: 0!important;
    top: inherit;
  }
  .album-card .card-img-overlay > *:first-child {
    padding: 1.25rem;
    margin:0 !important;
    background-color: rgba(1,1,1,.5);
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .album-card .card-img-wrap {
    overflow: hidden;
    position: relative;
  }
  .album-card:hover .card-img {
    transform: scale(1.05);
  }
  .album > hr {
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
    border-color:  rgba(0, 0, 0, 0.2)
  }
  .album > hr:first-child {
    margin-left: 1rem;
    margin-right: 1rem;
  }
  .album > hr:nth-child(2) {
    margin-left: 0.65rem;
    margin-right: 0.65rem;
  }
</style>
