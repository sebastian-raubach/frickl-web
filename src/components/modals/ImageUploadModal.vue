<template>
  <b-modal
    ref="imageUploadModal"
    title="Upload images and videos"
    ok-title="Refresh album"
    cancel-title="Cancel"
    size="xl"
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close
    @cancel="$refs.upload.clear()"
    @ok.prevent="refresh">
    <UploadWidget :albumId="albumId" ref="upload" />
  </b-modal>
</template>

<script>
import UploadWidget from '@/components/UploadWidget'

export default {
  components: {
    UploadWidget
  },
  props: {
    albumId: {
      type: Number,
      default: null
    }
  },
  methods: {
    show: function () {
      this.$refs.imageUploadModal.show()
    },
    hide: function () {
      this.$refs.imageUploadModal.hide()
    },
    refresh: function () {
      this.apiScanAlbum(this.albumId, () => {
        this.$emit('images-uploaded')
        this.$nextTick(() => this.hide())
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
