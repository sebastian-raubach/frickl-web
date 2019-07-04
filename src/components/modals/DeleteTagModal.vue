<!--
  Shows a modal dialog that asks the user for confirmation of their decision to remove the tag from an image or an album.
  Emits:
   - on-tag-deleted: The user decided to delete the tag and it has been removed from the image or album.
-->

<template>
  <b-modal v-if="tag && id"
           title="Remove tag"
           ref="deleteTagModal"
           ok-title="Yes"
           cancel-title="No"
           @ok="handleOk">
    <p class="my-4">Are you sure you want to remove the tag '{{ tag.name }}' from this {{ type }}?</p>
  </b-modal>
</template>

<script>
export default {
  props: {
    tag: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    id: {
      type: Number,
      default: null
    }
  },
  methods: {
    handleOk (event) {
      var vm = this

      if (this.type === 'image') {
        this.apiDeleteTagFromImage(this.id, { id: this.tag.id }, function () {
          vm.$emit('on-tag-deleted')
        })
      } else if (this.type === 'album') {
        this.apiDeleteTagFromAlbum(this.id, [{ id: this.tag.id }], function () {
          vm.$emit('on-tag-deleted')
        })
      }
    },
    show () {
      var vm = this
      this.$nextTick(function () {
        vm.$refs.deleteTagModal.show()
      })
    }
  }
}
</script>

<style>
</style>
