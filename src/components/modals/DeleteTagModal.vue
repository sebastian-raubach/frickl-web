<template>
  <b-modal v-if="tag && image"
           title="Remove tag"
           ref="deleteTagModal"
           ok-title="Yes"
           cancel-title="No"
           @ok="handleOk">
    <p class="my-4">Are you sure you want to remove the tag '{{ tag.name }}' from this image?</p>
  </b-modal>
</template>

<script>
export default {
  props: {
    tag: {
      type: Object,
      default: null
    },
    image: {
      type: Object,
      default: null
    }
  },
  methods: {
    handleOk (event) {
      var vm = this

      this.apiDeleteTagFromImage({
        imageId: this.image.id,
        tagId: this.tag.id
      }, function () {
        vm.$emit('onTagDeleted')
      })
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
