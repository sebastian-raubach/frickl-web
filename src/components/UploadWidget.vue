<template>
<div class="example-full">
  <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
    <h3>Drop files to upload</h3>
  </div>
  <div class="upload">
    <b-table hover
            sticky-header="60vh"
            responsive
            show-empty
            empty-text="Drag and drop files to upload"
            :items="files"
            :fields="fields"
            class="file-table">
      <template #cell(thumb)="data">
        <img class="td-image-thumb" v-if="data.item.thumb" :src="data.item.thumb" />
        <span v-else>No Image</span>
      </template>
      <template #cell(name)="data">
        <div class="filename">{{ data.item.name }}</div>
        <div class="progress" v-if="data.item.active || data.item.progress !== '0.00'">
          <div :class="{'progress-bar': true, 'progress-bar-striped': true, 'bg-success': data.item.success, 'bg-danger': data.item.error, 'progress-bar-animated': data.item.active}" role="progressbar" :style="{width: data.item.progress + '%'}">{{data.item.progress}}%</div>
        </div>
      </template>
      <template #cell(width)="data">
        {{data.item.width || 'N/A'}}
      </template>
      <template #cell(height)="data">
        {{data.item.height || 'N/A'}}
      </template>
      <template #cell(size)="data">
        {{formatSize(data.item.size)}}
      </template>
      <template #cell(speed)="data">
        <span v-if="data.item.speed">{{formatSize(data.item.speed)}}/s</span>
      </template>
      <template #cell(status)="data">
        <b-badge variant="danger" v-if="data.item.error">{{data.item.error}}</b-badge>
        <b-badge variant="success" v-else-if="data.item.success">success</b-badge>
        <b-badge variant="info" v-else-if="data.item.active">active</b-badge>
        <span v-else></span>
      </template>
      <template #cell(actions)="data">
        <b-dropdown right>
          <b-dropdown-item :disabled="!data.item.active" @click="data.item.active ? $refs.upload.update(data.item, {error: 'cancel'}) : false">Cancel</b-dropdown-item>
          <b-dropdown-item v-if="data.item.active" @click="$refs.upload.update(data.item, {active: false})">Abort</b-dropdown-item>
          <b-dropdown-item v-else-if="data.item.error && data.item.error !== 'compressing' && data.item.error !== 'image parsing' && $refs.upload.features.html5" @click="$refs.upload.update(data.item, {active: true, error: '', progress: '0.00'})">Retry upload</b-dropdown-item>
          <b-dropdown-item :disabled="data.item.success || data.item.error === 'compressing' || data.item.error === 'image parsing'" v-else @click="data.item.success || data.item.error === 'compressing' || data.item.error === 'image parsing' ? false : $refs.upload.update(data.item, {active: true})">Upload</b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item @click="$refs.upload.remove(data.item)">Remove</b-dropdown-item>
        </b-dropdown>
      </template>
    </b-table>

    <div class="example-foorer">
      <div>
        <file-upload
          class="btn btn-secondary mb-3"
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
          ref="upload">
          <BIconFileEarmarkPlus /> Add files
        </file-upload>
      </div>
      <template v-if="files && files.length > 0">
        <b-button variant="success" @click="$refs.upload.active = true" v-if="!$refs.upload || !$refs.upload.active"><BIconUpload /> Start upload</b-button>
        <b-button variant="danger" @click="$refs.upload.active = false" v-else><BIconSlashCircle /> Stop upload</b-button>
      </template>
    </div>
  </div>
</div>
</template>

<script>
import { BIconUpload, BIconSlashCircle, BIconFileEarmarkPlus } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import FileUpload from 'vue-upload-component'
export default {
  components: {
    FileUpload,
    BIconUpload,
    BIconSlashCircle,
    BIconFileEarmarkPlus
  },
  props: {
    albumId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      files: [],
      accept: 'image/png,image/gif,image/jpeg,image/webp,video/*',
      multiple: true,
      drop: true,
      thread: 3,
      name: 'imageFile',
      headers: {
        Authorization: 'Bearer ' + this.getToken()
      },
      uploadAuto: false,
      fields: [
        { key: 'thumb', label: 'Thumb' },
        { key: 'name', label: 'Name' },
        { key: 'width', label: 'Width' },
        { key: 'height', label: 'Height' },
        { key: 'size', label: 'Size' },
        { key: 'speed', label: 'Speed' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'baseUrl'
    ]),
    postAction: function () {
      return `${this.baseUrl}album/${this.albumId}/upload/image`
    }
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
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
      // image size
      if (newFile && newFile.error === '' && newFile.type.substr(0, 6) === 'image/' && newFile.blob && (!oldFile || newFile.blob !== oldFile.blob)) {
        newFile.error = 'image parsing'
        const img = new Image()
        img.onload = () => {
          this.$refs.upload.update(newFile, { error: '', height: img.height, width: img.width })
        }
        img.οnerrοr = (e) => {
          this.$refs.upload.update(newFile, { error: 'parsing image size' })
        }
        img.src = newFile.blob
      }
    },
    // add, update, remove File Event
    inputFile (newFile, oldFile) {
      if (newFile && oldFile) {
        // update
        if (newFile.active && !oldFile.active) {
          // beforeSend
          // min size
          if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
            this.$refs.upload.update(newFile, { error: 'size' })
          }
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
      if (!newFile && oldFile) {
        // remove
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/upload/delete?id=' + oldFile.response.id,
          // })
        }
      }
      // Automatically activate upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (this.uploadAuto && !this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    },
    alert (message) {
      alert(message)
    }
  }
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
