<!--
  Shows a modal dialog that can be used to add tags to images and albums.
-->

<template>
  <b-modal title="Add album"
           ref="addAlbumModal"
           ok-title="Add"
           cancel-title="Cancel"
           @ok="handleOk"
           @shown="$refs.albumName.focus()">
    <b-form @submit.prevent="handleOk">
      <b-form-group label="Album name" label-for="album-name">
        <b-input v-model="albumName" id="album-name" ref="albumName" />
      </b-form-group>
      <b-form-group label="Album description" label-for="album-description">
        <b-input v-model="albumDescription" id="album-description" />
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
export default {
  data: function () {
    return {
      albumName: null,
      albumDescription: null
    }
  },
  props: {
    parentAlbumId: {
      type: Number,
      default: null
    }
  },
  methods: {
    handleOk: function () {
      if (!this.albumName) {
        return
      }

      this.apiPostAlbum({
        name: this.albumName,
        description: this.albumDescription,
        parentAlbumId: this.parentAlbumId
      }, result => {
        if (result) {
          this.$emit('album-added')
          this.hide()
        }
      })
    },
    hide () {
      this.$nextTick(() => this.$refs.addAlbumModal.hide())
    },
    show () {
      this.albumName = null
      this.albumDescription = null
      this.$nextTick(() => this.$refs.addAlbumModal.show())
    }
  }
}
</script>

<style>
</style>
