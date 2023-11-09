<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      scrollable
      width="640">
      <div>
        <v-card
          class="mx-auto pa-12 pb-8"
          elevation="8"
          max-width="448"
          rounded="lg"
          :loading="loading">
          <template v-slot:loader="{ isActive }">
            <v-progress-linear
              :active="isActive"
              color="primary"
              height="4"
              indeterminate
            ></v-progress-linear>
          </template>

          <v-form @submit.prevent="login">

            <div class="text-subtitle-1 text-medium-emphasis">{{ $t('widgetLoginTitle') }}</div>

            <v-text-field
              density="compact"
              :label="$t('formLabelUsername')"
              :placeholder="$t('formPlaceholderUsername')"
              prepend-inner-icon="mdi-email-outline"
              autofocus
              :readonly="loading"
              v-model="username" />

            <v-text-field
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              density="compact"
              :label="$t('formLabelPassword')"
              :placeholder="$t('formPlaceholderPassword')"
              v-model="password"
              prepend-inner-icon="mdi-lock-outline"
              :readonly="loading"
              @click:append-inner="visible = !visible" />

            <v-card
              v-if="error"
              class="mb-4"
              color="red-darken-1">
              <v-card-text class="text-caption text-white">
                {{ error }}
              </v-card-text>
            </v-card>

            <v-btn
              block
              type="submit"
              @click="login"
              :disabled="!valid || loading"
              class="mb-8"
              color="primary"
              size="large">
              {{ $t('buttonLogin') }}
            </v-btn>
          </v-form>

          <v-card-actions>
            <v-btn
              color="secondary"
              variant="text"
              @click="dialog = false">
              {{ $t('buttonClose') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
  </v-row>
</template>

<script>
import { apiPostToken } from '@/plugins/api'
import emitter from 'tiny-emitter/instance'

export default {
  data: function () {
    return {
      dialog: false,
      visible: false,
      username: null,
      password: null,
      loading: false,
      error: null
    }
  },
  computed: {
    valid: function () {
      return this.username && this.username !== '' && this.password && this.password !== ''
    }
  },
  methods: {
    show: function () {
      this.dialog = true
    },
    hide: function () {
      this.dialog = false
    },
    login: function () {
      this.loading = true
      this.error = null
      apiPostToken({
        username: this.username,
        password: this.password
      }, result => {
        this.loading = false
        this.$store.commit('TOKEN_CHANGED_MUTATION', result)
        emitter.emit('token-changed')
        this.$router.push({ name: 'home' })
        this.username = null
        this.password = null
        this.error = null
        this.dialog = false
      }, {
        codes: [403, 503],
        callback: e => {
          this.loading = false
          switch (e.status) {
            case 403:
              this.error = this.$t('errorLoginFourOThree')
              break
            case 504:
              this.error = this.$t('errorLoginFiveOThree')
              break
          }
        }
      })
    }
  }
}
</script>
