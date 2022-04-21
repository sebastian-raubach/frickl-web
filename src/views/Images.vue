<template>
  <div>
    <b-container class="home mt-3" fluid>
      <div v-if="hasXAgo">
        <h2>This time...</h2>
        <b-row class="mb-3 pb-3">
          <b-col cols=12 md=4 lg=3 v-if="xAgo.one && xAgo.one.length > 0">
            <AlbumNode :album="xAgo.one[0]" title="One year ago" to="/xago/1" />
          </b-col>
          <b-col cols=12 md=4 lg=3 v-if="xAgo.two && xAgo.two.length > 0">
            <AlbumNode :album="xAgo.two[0]" title="Two years ago" to="/xago/2" />
          </b-col>
          <b-col cols=12 md=4 lg=3 v-if="xAgo.three && xAgo.three.length > 0">
            <AlbumNode :album="xAgo.three[0]" title="Three years ago" to="/xago/3" />
          </b-col>
        </b-row>
      </div>

      <div v-if="images && images.length > 0">
        <h2>Image stream</h2>
        <ImageGrid :imageCount="imageCount"
                    :images="images"
                    ref="imageGrid"
                    v-on:onImageNavigation="page => onImageNavigation(page)"/>
      </div>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import AlbumNode from '../components/AlbumNode.vue'
import ImageGrid from '../components/ImageGrid.vue'

export default {
  data: function () {
    return {
      images: null,
      imageCount: 0,
      xAgo: {
        one: null,
        two: null,
        three: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesPerPage'
    ]),
    hasXAgo: function () {
      return (this.xAgo.one && this.xAgo.one.length > 0) || (this.xAgo.two && this.xAgo.two.length > 0) || (this.xAgo.three && this.xAgo.three.length > 0)
    }
  },
  components: {
    AlbumNode,
    ImageGrid
  },
  watch: {
    imagesPerPage: function () {
      this.onImageNavigation(1)
    }
  },
  methods: {
    onImageNavigation: function (page) {
      this.apiGetImages(null, page - 1, this.imagesPerPage, result => {
        this.images = result

        if (result && result.length > 0) {
          let query = JSON.parse(JSON.stringify(this.$router.currentRoute.query))

          if (!query) {
            query = {}
          }

          query.imagePage = page

          this.$router.replace({
            path: this.$router.currentRoute.path,
            query: query
          })

          this.$nextTick(() => this.$refs.imageGrid.onPageChanged(page))
        }
      })
    }
  },
  mounted: function () {
    let imagePage = 1
    const query = this.$route.query

    if (query && query.imagePage) {
      imagePage = query.imagePage
    }

    this.apiGetImageCount(null, result => {
      this.imageCount = result
      this.onImageNavigation(imagePage)
    })

    this.apiGetAlbumsXAgo(1, 0, this.MAX_JAVA_INTEGER, result => {
      Vue.set(this.xAgo, 'one', result)
    })
    this.apiGetAlbumsXAgo(2, 0, this.MAX_JAVA_INTEGER, result => {
      Vue.set(this.xAgo, 'two', result)
    })
    this.apiGetAlbumsXAgo(3, 0, this.MAX_JAVA_INTEGER, result => {
      Vue.set(this.xAgo, 'three', result)
    })
  }
}
</script>

<style scoped>
</style>
