<template>
  <div>
    <b-container class="home mt-3" fluid>
      <div v-if="images && images.length > 0">
        <h2>Image stream</h2>
        <image-grid :imageCount="imageCount"
                    :images="images"
                    ref="imageGrid"
                    v-on:onImageNavigation="page => onImageNavigation(page)"/>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ImageGrid from '../components/ImageGrid.vue'

export default {
  data: function () {
    return {
      images: null,
      imageCount: 0
    }
  },
  computed: {
    ...mapGetters([
      'imagesPerPage'
    ])
  },
  components: {
    'image-grid': ImageGrid
  },
  watch: {
    imagesPerPage: function (newValue, oldValue) {
      this.onImageNavigation(1)
    }
  },
  methods: {
    onImageNavigation: function (page) {
      var vm = this

      this.apiGetImages(null, page - 1, this.imagesPerPage, function (result) {
        vm.images = result

        if (result && result.length > 0) {
          var query = JSON.parse(JSON.stringify(vm.$router.currentRoute.query))

          if (!query) {
            query = {}
          }

          query.imagePage = page

          vm.$router.replace({
            path: vm.$router.currentRoute.path,
            query: query
          })

          vm.$nextTick(function () {
            vm.$refs.imageGrid.onPageChanged(page)
          })
        }
      })
    }
  },
  mounted: function () {
    var imagePage = 1
    var query = this.$route.query

    if (query && query.imagePage) {
      imagePage = query.imagePage
    }

    var vm = this
    this.apiGetImageCount(null, function (result) {
      vm.imageCount = result
      vm.onImageNavigation(imagePage)
    })
  }
}
</script>

<style>

</style>
