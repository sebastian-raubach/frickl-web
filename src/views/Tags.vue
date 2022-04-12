<template>
  <div>
    <b-container class="tags pt-3">
      <div v-if="tags">
        <div v-if="tags.length > 0">
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
        <h3 v-else>No tags found</h3>
      </div>
      <h3 v-else>Loading...</h3>
    </b-container>
    <b-container fluid v-if="imageCount > 0" class="pt-3">
      <h1>Images tagged '{{ tag.name }}' <b-badge>{{ imageCount }}</b-badge></h1>

      <image-grid :imageCount="imageCount"
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
      tags: null,
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
  methods: {
    onTagsFiltered: function () {
      if (this.searchTerm && this.searchTerm.length > 0) {
        this.filteredTags = this.tags.filter(t => {
          return t.tag.name.includes(this.searchTerm)
        })
      } else {
        this.filteredTags = this.tags
      }
    },
    onTagClicked: function (tag) {
      this.tag = tag.tag

      this.apiGetImageCountForTag(this.tag.id, result => {
        this.imageCount = result
        this.onImageNavigation(1)
      })
    },
    onImageNavigation: function (page) {
      this.apiGetImagesForTag(this.tag.id, page - 1, this.imagesPerPage, result => {
        this.images = result
      })
    }
  },
  mounted: function () {
    this.apiGetTags(result => {
      this.tags = result
      this.filteredTags = result
    })

    const tagId = this.$route.params.tagId

    if (tagId) {
      this.apiGetTag(tagId, result => {
        if (result && result.length > 0) {
          this.tag = result[0]
          this.onTagClicked(this.tag)
        }
      })
    }
  }
}
</script>

<style>
</style>
