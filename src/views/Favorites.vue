<template>
  <b-container fluid v-if="images && images.length > 0" class="pt-3">
    <h1>Favorites</h1>
    <image-grid :imageCount="imageCount"
                :imagesPerPage="imagesPerPage"
                :images="images"
                v-on:onImageNavigation="page => onImageNavigation(page)"/>
  </b-container>
</template>

<script>
import ImageGrid from '../components/ImageGrid.vue'

export default {
  data: function () {
    return {
      images: [],
      imageCount: 0,
      imagesPerPage: 12
    }
  },
  components: {
    'image-grid': ImageGrid
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
