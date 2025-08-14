<template>
  <div class="example-full">
    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
      <h3>Drop files to upload</h3>
    </div>
    <div class="upload">
      <v-data-table
        :items-per-page="perPage"
        :headers="fields"
        :items="files"
        hover
        no-data-text="Drag and drop files to upload"
        class="elevation-1"
      >
        <template #bottom />
        <template #item.thumb="{ item }">
          <v-img :src="item.thumb" v-if="item.thumb" />
          <span v-else>No Image</span>
        </template>
        <template #item.name="{ item }">
          <div class="filename">{{ item.name }}</div>
          <v-progress-linear :model-value="+item.progress" v-if="item.active || item.progress !== '0.00'" :color="item.error ? 'error' : (item.success ? 'green' : 'primary')" :striped="item.active" />
        </template>
        <template #item.width="{ value }">
          {{ value || 'N/A' }}
        </template>
        <template #item.height="{ value }">
          {{ value || 'N/A' }}
        </template>
        <template #item.size="{ value }">
          {{ formatSize(value) }}
        </template>
        <template #item.speed="{ value }">
          <span v-if="value">{{ formatSize(value) }}/s</span>
        </template>
        <template #item.status="{ item }">
          <v-chip color="error" v-if="item.error">{{ item.error }}</v-chip>
          <v-chip color="green" v-else-if="item.success">success</v-chip>
          <v-chip color="primary" v-else-if="item.active">active</v-chip>
          <span v-else />
        </template>
        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                color="secondary"
                v-bind="props"
              >
                <v-icon icon="mdi-menu-down" />
              </v-btn>
            </template>
            <v-list>
              <v-list-item :disabled="!item.active" @click="item.active ? $refs.upload.update(item, {error: 'cancel'}) : false">
                <v-list-item-title>Cancel</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="item.active" @click="$refs.upload.update(item, {active: false})">
                <v-list-item-title>Abort</v-list-item-title>
              </v-list-item>
              <v-list-item v-else-if="item.error && item.error !== 'compressing' && item.error !== 'image parsing' && $refs.upload.features.html5" @click="$refs.upload.update(item, {active: true, error: '', progress: '0.00'})">
                <v-list-item-title>Retry upload</v-list-item-title>
              </v-list-item>
              <v-list-item :disabled="item.success || item.error === 'compressing' || item.error === 'image parsing'" v-else @click="item.success || item.error === 'compressing' || item.error === 'image parsing' ? false : $refs.upload.update(item, {active: true})">
                <v-list-item-title>Upload</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item @click="$refs.upload.remove(item)">
                <v-list-item-title>Remove</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>

      <div class="example-footer">
        <div>
          <file-upload
            class="my-3"
            :post-action="postAction"
            :accept="accept"
            :multiple="multiple"
            :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
            :headers="headers"
            :drop="drop"
            :name="name"
            v-model="files"
            @input-filter="inputFilter"
            @input-file="inputFile"
            ref="upload"
          >
            <v-btn color="primary">
              <v-icon icon="mdi-file-plus-outline" /> Add photos
            </v-btn>
          </file-upload>
        </div>

        <template v-if="files && files.length > 0">
          <v-btn color="green" @click="$refs.upload.active = true" v-if="!$refs.upload || !$refs.upload.active"><v-icon icon="mdi-upload" /> Start upload</v-btn>
          <v-btn color="yellow" @click="$refs.upload.active = false" v-else><v-icon icon="mdi-stop-circle-outline" /> Stop upload</v-btn>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapStores } from 'pinia'
  import { coreStore } from '@/stores/app'
  import FileUpload from 'vue-upload-component'
  import { getToken } from '@/plugins/api'

  export default {
    components: {
      FileUpload,
    },
    props: {
      albumId: {
        type: Number,
        default: null,
      },
    },
    data () {
      return {
        files: [],
        accept: 'image/png,image/gif,image/jpeg,image/webp,video/*',
        multiple: true,
        drop: true,
        thread: 3,
        perPage: -1,
        name: 'imageFile',
        headers: {
          Authorization: 'Bearer ' + getToken(),
        },
        uploadAuto: false,
        fields: [
          { key: 'thumb', title: this.$t('tableColumnImageUploadThumb'), sortable: false },
          { key: 'name', title: this.$t('tableColumnImageUploadName'), sortable: false },
          { key: 'width', title: this.$t('tableColumnImageUploadWidth'), sortable: false },
          { key: 'height', title: this.$t('tableColumnImageUploadHeight'), sortable: false },
          { key: 'size', title: this.$t('tableColumnImageUploadSize'), sortable: false },
          { key: 'speed', title: this.$t('tableColumnImageUploadSpeed'), sortable: false },
          { key: 'status', title: this.$t('tableColumnImageUploadStatus'), sortable: false },
          { key: 'actions', title: this.$t('tableColumnImageUploadActions'), sortable: false },
        ],
      }
    },
    computed: {
      ...mapStores(coreStore),
      ...mapState(coreStore, [
        'storeBaseUrl',
      ]),
      postAction: function () {
        return `${this.storeBaseUrl}album/${this.albumId}/upload/image`
      },
    },
    methods: {
      clear: function () {
        this.$refs.upload.clear()
      },
      formatSize: function (size) {
        if (size > 1024 * 1024 * 1024 * 1024) {
          return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
        } else if (size > 1024 * 1024 * 1024) {
          return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
        } else if (size > 1024 * 1024) {
          return (size / 1024 / 1024).toFixed(2) + ' MB'
        } else if (size > 1024) {
          return (size / 1024).toFixed(2) + ' KB'
        }
        return size.toString() + ' B'
      },
      inputFilter (newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
          // Before adding a file
          // Filter system files or hide files
          if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
            return prevent()
          }
          // Filter php html js file
          if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
            return prevent()
          }
        }
        if (newFile && newFile.error === '' && newFile.file && (!oldFile || newFile.file !== oldFile.file)) {
          // Create a blob field
          newFile.blob = ''
          const URL = (window.URL || window.webkitURL)
          if (URL) {
            newFile.blob = URL.createObjectURL(newFile.file)
          }
          // Thumbnails
          newFile.thumb = ''
          if (newFile.blob && newFile.type.slice(0, 6) === 'image/') {
            newFile.thumb = newFile.blob
          }
        }
        // image size
        if (newFile && newFile.error === '' && newFile.type.slice(0, 6) === 'image/' && newFile.blob && (!oldFile || newFile.blob !== oldFile.blob)) {
          newFile.error = 'image parsing'
          const img = new Image()
          img.addEventListener('load', () => {
            this.$refs.upload.update(newFile, { error: '', height: img.height, width: img.width })
          })
          img.οnerrοr = () => {
            this.$refs.upload.update(newFile, { error: 'parsing image size' })
          }
          img.src = newFile.blob
        }
      },
      // add, update, remove File Event
      inputFile (newFile, oldFile) {
        if (newFile && oldFile) {
          // update
          if (newFile.active && !oldFile.active && newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
            this.$refs.upload.update(newFile, { error: 'size' })
          }
          if (newFile.progress !== oldFile.progress) {
            // progress
          }
          if (newFile.error && !oldFile.error) {
            // error
          }
          if (newFile.success && !oldFile.success) {
            // success
          }
        }
        // Automatically activate upload
        if ((Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) && this.uploadAuto && !this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      },
      alert (message) {
        alert(message)
      },
    },
  }
</script>

<style>
.file-table {
  min-height: 300px;
}
.td-image-thumb {
  max-width: 4em;
  max-height: 4em;
}
.example-full .filename {
  margin-bottom: .3rem
}
.example-full .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: .6;
  text-align: center;
  background: #000;
}
.example-full .drop-active h3 {
  margin: -.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
</style>
