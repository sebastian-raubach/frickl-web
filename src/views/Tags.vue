<template>
  <div class="container tags">
    <div v-if="tags && tags.length > 0" class="pt-3">
      <h1>Tags <b-badge>{{ tags.length }}</b-badge></h1>
      <p>All tags currently used in your collection are shown below. Click on a tag to show images with that tag.</p>
      <b-form inline @submit.prevent>
        <label class="sr-only" for="inline-form-input-name">Name</label>
        <b-input id="inline-form-input-name" placeholder="Search tags" v-model="searchTerm" v-on:keyup="onTagsFiltered()"/>
      </b-form>
      <b-badge v-for="tag in filteredTags" :key="tag.id" variant="primary" @click="onTagClicked(tag)" class="tag-badge cursor-pointer">{{ tag.name }}</b-badge>
    </div>

    <div v-if="imageCount > 0" class="pt-3">
      <h1>Images tagged '{{ tag.name }}' <b-badge>{{ imageCount }}</b-badge></h1>
      <b-card-group columns v-if="images && images.length > 0">
        <image-node :image="image" :baseUrl="baseUrl" v-for="image in images" :key="image.id"/>
      </b-card-group>

      <b-pagination v-if="imageCount > imagesPerPage"
        v-model="imagesCurPage"
        :total-rows="imageCount"
        :per-page="imagesPerPage"
        @change="page => onImageNavigation(page)"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import ImageNode from '../components/ImageNode.vue'

export default {
  data: function () {
    return {
      imagesPerPage: 12,
      imagesCurPage: 1,
      imageCount: 0,
      searchTerm: null,
      tag: null,
      tags: [],
      filteredTags: [],
      images: []
    }
  },
  components: {
    'image-node': ImageNode
  },
  props: [ 'baseUrl' ],
  methods: {
    onTagsFiltered: function () {
      var vm = this
      if (this.searchTerm && this.searchTerm.length > 0) {
        this.filteredTags = this.tags.filter(function (t) {
          return t.name.includes(vm.searchTerm)
        })
      } else {
        this.filteredTags = this.tags
      }
    },
    onTagClicked: function (tag) {
      var vm = this
      this.tag = tag

      this.apiGetImageCountForTag(tag.id, function (result) {
        vm.imageCount = result
        vm.imagesCurPage = 1
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
  }
}
</script>

<style>
</style>
