<template>
  <v-dialog width="auto" v-model="dialog">
    <v-card :title="$t('modalTitleUploadImages')">
      <v-card-text>
        <UploadWidget :album-id="albumId" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn :text="$t('buttonClose')" @click="dialog = false" />
        <v-btn :text="$t('buttonRefresh')" @click="refresh" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import UploadWidget from '@/components/UploadWidget.vue'
  import { apiScanAlbum } from '@/plugins/api'

  export default {
    components: {
      UploadWidget,
    },
    props: {
      albumId: {
        type: Number,
        defaut: null,
      },
    },
    data: function () {
      return {
        dialog: false,
      }
    },
    emits: ['images-uploaded'],
    methods: {
      show: function () {
        this.dialog = true
      },
      hide: function () {
        this.dialog = false
      },
      refresh: function () {
        apiScanAlbum(this.albumId, () => {
          this.$emit('images-uploaded')
          this.$nextTick(() => this.hide())
        })
      },
    },
  }
</script>
