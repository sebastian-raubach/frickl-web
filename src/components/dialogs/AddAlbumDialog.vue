<template>
  <v-dialog width="500" v-model="dialog">
    <v-card :title="$t('cardTitleAddAlbum')">
      <v-card-text>
        <p class="mb-3">{{ $t('cardTextAddAlbum') }}</p>

        <v-form @submit.prevent="addAlbum">
          <v-text-field
            density="compact"
            :label="$t('formLabelAlbumName')"
            :placeholder="$t('formPlaceholderAlbumName')"
            prepend-inner-icon="mdi-tag-text"
            autofocus
            :readonly="loading"
            v-model="name"
          />
          <v-textarea
            density="compact"
            :label="$t('formLabelAlbumDescription')"
            :placeholder="$t('formPlaceholderAlbumDescription')"
            prepend-inner-icon="mdi-text"
            :readonly="loading"
            v-model="description"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn
          variant="text"
          @click="hide"
        >
          {{ $t('buttonCancel') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          :disabled="!canContinue"
          @click="addAlbum"
        >
          {{ $t('buttonAdd') }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar" color="error">{{ snackbarText }}</v-snackbar>
  </v-dialog>
</template>

<script>
  import { apiPutAlbum } from '@/plugins/api'
  export default {
    props: {
      parentAlbumId: {
        type: Number,
        default: null,
      },
    },
    data: function () {
      return {
        dialog: false,
        name: null,
        description: null,
        loading: false,
        snackbar: false,
        snackbarText: null,
      }
    },
    computed: {
      canContinue: function () {
        return this.name && this.name.length > 0
      },
    },
    emits: ['album-added'],
    methods: {
      addAlbum: function () {
        apiPutAlbum({
          name: this.name,
          description: this.description,
          parentAlbumId: this.parentAlbumId,
        }, () => {
          this.$emit('album-added')
          this.hide()
        }, {
          codes: [409],
          callback: error => {
            if (error && error.status === 409) {
              this.snackbarText = this.$t('snackbarErrorConflictAlbumName')
              this.snackbar = true
            }
          },
        })
      },
      show: function () {
        this.dialog = true
        this.name = null
        this.description = null
        this.snackbar = false
      },
      hide: function () {
        this.dialog = false
      },
    },
  }
</script>
