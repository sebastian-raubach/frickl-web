<template>
  <div>
    <b-row>
      <b-col cols=12 sm=4 md=3 lg=3 v-for="image in images" :key="image.id" class="mb-3">
        <image-node :image="image" :baseUrl="baseUrl" v-on:click.native="onImageClicked(image)" />
      </b-col>
    </b-row>

    <b-pagination v-if="imageCount > imagesPerPage"
      v-model="currentPage"
      :total-rows="imageCount"
      :per-page="imagesPerPage"
      @change="page => $emit('onImageNavigation', page)"
    ></b-pagination>
  </div>
</template>

<script>
import ImageNode from '../components/ImageNode.vue'

export default {
  data: function () {
    return {
      currentPage: 1
    }
  },
  props: {
    baseUrl: {
      type: String,
      default: null
    },
    imageCount: {
      type: Number,
      default: 0
    },
    imagesPerPage: {
      type: Number,
      default: 12
    },
    images: {
      type: Array,
      default: null
    }
  },
  components: {
    'image-node': ImageNode
  },
  methods: {
    onImageClicked: function (image) {
      this.$store.dispatch('ON_IMAGE_CHANGED', image)
    }
  }
}
</script>

<style>

</style>
