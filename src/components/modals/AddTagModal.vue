<!--
  Shows a modal dialog that can be used to add tags to images and albums.
-->

<template>
  <b-modal v-if="id"
           title="Add tag"
           ref="addTagModal"
           ok-title="Add"
           cancel-title="Cancel"
           @ok="handleOk"
           @shown="$refs.focusThis.focus()">
    <VueTagsInput
      v-model="tempInput"
      :tags="newTags"
      :autocomplete-items="allTags"
      placeholder="Enter tag names"
      @tags-changed="addedTags => addTags(addedTags)"
      ref="focusThis" />
  </b-modal>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input'

export default {
  data: function () {
    return {
      tempInput: '',
      newTags: [],
      allTags: []
    }
  },
  props: {
    id: {
      type: Number,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    prefilledTags: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    VueTagsInput
  },
  methods: {
    addTags: function (addedTags) {
      this.newTags = addedTags.map(t => {
        return {
          text: t.text,
          classes: 'bg-primary'
        }
      })
    },
    handleOk: function (event) {
      event.preventDefault()

      var mappedTags = this.newTags.map(t => {
        return {
          id: null,
          name: t.text
        }
      })

      if (this.type === 'image') {
        this.apiAddTagsToImage(this.id, mappedTags, result => {
          this.$refs.addTagModal.hide()
          this.$emit('on-tag-added')
        })
      } else if (this.type === 'album') {
        this.apiPostAlbumTags(this.id, mappedTags, result => {
          this.$refs.addTagModal.hide()
          this.$emit('on-tag-added')
        })
      }
    },
    show () {
      this.$nextTick(() => this.$refs.addTagModal.show())
    }
  },
  mounted: function () {
    this.apiGetTags(result => {
      this.allTags = result.map(t => {
        return {
          text: t.tag.name
        }
      })
    })

    this.newTags = this.prefilledTags.map(t => {
      return {
        text: t,
        classes: 'bg-primary'
      }
    })
  }
}
</script>

<style>
</style>
