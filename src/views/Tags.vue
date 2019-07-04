<template>
  <div>
    <b-container class="tags">
      <div v-if="tags && tags.length > 0" class="pt-3">
        <h1>Tags <b-badge>{{ tags.length }}</b-badge></h1>
        <p>All tags currently used in your collection are shown below. Click on a tag to show images with that tag.</p>
        <b-form inline @submit.prevent>
          <label class="sr-only" for="inline-form-input-name">Name</label>
          <b-input id="inline-form-input-name" placeholder="Search tags" v-model="searchTerm" v-on:keyup="onTagsFiltered()"/>
        </b-form>
        <b-button v-for="tag in filteredTags" :key="tag.id" size="sm" variant="primary" @click="onTagClicked(tag)" class="mt-1 mr-1">
          {{ tag.tag.name }}&nbsp;
          <b-badge variant="light">{{ tag.count }}</b-badge>
        </b-button>
      </div>
    </b-container>
    <b-container fluid v-if="imageCount > 0" class="pt-3">
      <h1>Images tagged '{{ tag.name }}' <b-badge>{{ imageCount }}</b-badge></h1>

      <image-grid :baseUrl="baseUrl"
                  :imageCount="imageCount"
                  :images="images"
                  ref="imageGrid"
                  v-on:onImageNavigation="page => onImageNavigation(page)"/>
    </b-container>
  </div>
</template>

<script>
import ImageGrid from '../components/ImageGrid.vue'
import { mapGetters } from 'vuex'

export default {
  data: function () {
    return {
      imageCount: 0,
      searchTerm: null,
      tag: null,
      tags: [],
      filteredTags: [],
      images: []
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
  props: [ 'baseUrl' ],
  methods: {
    onTagsFiltered: function () {
      var vm = this
      if (this.searchTerm && this.searchTerm.length > 0) {
        this.filteredTags = this.tags.filter(function (t) {
          return t.tag.name.includes(vm.searchTerm)
        })
      } else {
        this.filteredTags = this.tags
      }
    },
    onTagClicked: function (tag) {
      var vm = this
      this.tag = tag.tag

      this.apiGetImageCountForTag(this.tag.id, function (result) {
        vm.imageCount = result
        vm.onImageNavigation(1)
      })
    },
    onImageNavigation: function (page) {
      var vm = this

      this.apiGetImagesForTag(this.tag.id, page - 1, this.imagesPerPage, function (result) {
        vm.images = result
      })
    }
  },
  mounted: function () {
    var vm = this

    this.apiGetTags(function (result) {
      vm.tags = result
      vm.filteredTags = result
    })

    const tagId = this.$route.params.tagId

    if (tagId) {
      this.apiGetTag(tagId, function (result) {
        if (result && result.length > 0) {
          vm.tag = result[0]
          vm.onTagClicked(vm.tag)
        }
      })
    }
  }
}
</script>

<style>
</style>
