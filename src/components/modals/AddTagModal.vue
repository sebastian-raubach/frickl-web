<template>
  <b-modal v-if="image"
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
    image: {
      type: Object,
      default: null
    }
  },
  methods: {
    handleOk (event) {
      // TODO: create tag (if necessary), then add
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
