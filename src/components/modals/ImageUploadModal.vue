<template>
  <b-modal
    ref="imageUploadModal"
    title="Upload images"
    ok-title="Upload"
    ok-only
    size="xl"
    @ok.prevent="uploadImage">
    <b-row>
      <b-col cols=6 md=4 lg=3 v-for="(image, index) in imageData" :key="`image-preview-${index}`" class="mb-3">
        <b-img :src="imageData[index]" fluid-grow rounded @load="clearMemory(index)" class="preview-img" />
      </b-col>
    </b-row>
    <b-form @submit.prevent>
      <b-form-file
        class="mt-3 file-input"
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

      this.$eventHub.$emit('show-loading', true)
      this.apiPostImageForm(this.albumId, formData, result => {
        if (result) {
          this.$emit('images-uploaded')
          this.hide()
        }
        this.$eventHub.$emit('show-loading', false)
      })
    }
  }
}
</script>

<style scoped>
.preview-img {
  width: 100%;
  object-fit: cover;
  max-height: 250px;
}
</style>

<style>
.file-input > label {
  overflow: hidden;
}
</style>
