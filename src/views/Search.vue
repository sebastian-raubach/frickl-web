<template>
  <b-container class="mt-3">
    <h1>Search: {{ searchTerm }}</h1>

    <template v-if="images">
      <image-grid v-if="images.length > 0"
                :baseUrl="baseUrl"
                :imageCount="imageCount"
                :imagesPerPage="imagesPerPage"
                :images="images"
                ref="imageGrid"
                v-on:onImageNavigation="page => onImageNavigation(page)"/>
      <h3 v-else>No images found.</h3>
    </template>
    <h3 v-else>Loading...</h3>
  </b-container>
</template>

<script>
import ImageGrid from '../components/ImageGrid.vue'

export default {
  data: function () {
    return {
      searchTerm: '',
      imagesPerPage: 12,
      imagesCurPage: 1,
      imageCount: 0,
      images: null
    }
  },
  props: [ 'baseUrl' ],
  components: {
    'image-grid': ImageGrid
  },
  methods: {
    onImageNavigation: function (page) {
      var vm = this

      this.apiGetImagesForSearch(this.searchTerm, page - 1, this.imagesPerPage, function (result) {
        vm.images = result
      })
    }
  },
  mounted: function () {
    this.searchTerm = this.$route.params.searchTerm

    var vm = this
    this.apiGetImageCountForSearch(this.searchTerm, function (result) {
      vm.imageCount = result
      vm.imagesCurPage = 1
      vm.onImageNavigation(1)
    })
  }
}
</script>

<style>

</style>
