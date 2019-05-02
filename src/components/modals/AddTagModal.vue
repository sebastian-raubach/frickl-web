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
    <b-form-input v-model="tagName"
                  placeholder="Enter tag name"
                  ref="focusThis"></b-form-input>
  </b-modal>
</template>

<script>
export default {
  data: function () {
    return {
      tagName: null
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
    }
  },
  methods: {
    handleOk (event) {
      // TODO: create tag (if necessary), then add
      if (this.type === 'image') {
        console.log('add tag to image')
      } else if (this.type === 'album') {
        console.log('add tag to album')
      }
    },
    show () {
      var vm = this
      this.$nextTick(function () {
        vm.$refs.addTagModal.show()
      })
    }
  }
}
</script>

<style>
</style>
