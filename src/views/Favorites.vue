<template>
  <b-container fluid v-if="images && images.length > 0" class="pt-3">
    <h1>Favorites</h1>
    <image-grid :imageCount="imageCount"
                :images="images"
                v-on:onImageNavigation="page => onImageNavigation(page)"/>
  </b-container>
</template>

<script>
import ImageGrid from '../components/ImageGrid.vue'
import { mapGetters } from 'vuex'

export default {
  data: function () {
    return {
      images: [],
      imageCount: 0
    }
  },
  components: {
    'image-grid': ImageGrid
  },
  computed: {
    ...mapGetters([
      'imagesPerPage'
    ])
  },
  watch: {
    imagesPerPage: function (newValue, oldValue) {
      this.onImageNavigation(1)
    }
  },
  methods: {
    onImageNavigation: function (page) {
      var vm = this

      this.apiGetAllImages({
        fav: true
      }, page - 1, this.imagesPerPage, function (result) {
        vm.images = result
      })
    }
  },
  mounted: function () {
    var vm = this
    this.apiGetAllImageCount({
      fav: true
    }, function (result) {
      vm.imageCount = result
      vm.imagesCurPage = 1
      vm.onImageNavigation(1)
    })
  }
}
</script>

<style>

</style>
