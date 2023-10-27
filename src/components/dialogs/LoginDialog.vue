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

            <div class="text-subtitle-1 text-medium-emphasis">Sign in</div>

            <v-text-field
              density="compact"
              label="Email address"
              prepend-inner-icon="mdi-email-outline"
              autofocus
              :readonly="loading"
              v-model="username" />

            <v-text-field
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              label="compact"
              placeholder="Enter your password"
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
              Log In
            </v-btn>
          </v-form>

          <v-card-actions>
            <v-btn
              color="secondary"
              variant="text"
              @click="dialog = false">
              Close
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
        console.log(result)
        this.$store.commit('TOKEN_CHANGED_MUTATION', result)
        emitter.emit('token-changed')
        this.$router.push({ name: 'home' })
        this.dialog = false
      }, {
        codes: [401, 403, 404],
        callback: e => {
          this.loading = false
          switch (e.status) {
            case 401:
              this.error = '401'
              break
            case 403:
              this.error = '403'
              break
            case 404:
              this.error = '404'
              break
          }
        }
      })
    }
  }
}
</script>
