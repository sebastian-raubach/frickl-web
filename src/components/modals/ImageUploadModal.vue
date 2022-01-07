<template>
  <b-modal
    ref="imageUploadModal"
    title="Upload images"
    ok-title="Upload"
    ok-only
    @ok.prevent="uploadImage">
    <b-img v-for="(image, index) in imageData" :src="imageData[index]" :key="`image-preview-${index}`" fluid-grow rounded @load="clearMemory(index)" />
    <b-form @submit.prevent>
      <b-form-file
        class="mt-3"
        v-model="imageFiles"
        multiple
        :state="Boolean(imageFiles)"
        accept=".jpg, .jpeg, .png"/>
    </b-form>
  </b-modal>
</template>

<script>
export default {
  props: {
    albumId: {
      type: Number,
      default: null
    }
  },
  data: function () {
    return {
      imageFiles: [],
      imageData: []
    }
  },
  watch: {
    imageFiles: function (newValue) {
      this.imageData = newValue.map(f => URL.createObjectURL(f))
    }
  },
  methods: {
    clearMemory: function (index) {
      URL.revokeObjectURL(this.imageData[index])
    },
    show: function () {
      this.imageFiles = []
      this.imageData = []
      this.$refs.imageUploadModal.show()
    },
    hide: function () {
      this.$refs.imageUploadModal.hide()
    },
    uploadImage: function () {
      if (this.imageFiles === null || this.imageFiles.length < 1) {
        // TODO feedback
        return
      }

      let formData = new FormData()
      this.imageFiles.forEach(i => formData.append('imageFiles', i))

      this.apiPostImageForm(this.albumId, formData, result => {
        if (result) {
          this.$emit('images-uploaded')
          this.hide()
        }
      })
    }
  }
}
</script>

<style>

</style>
