<template>
  <b-modal title="Log in"
           ref="loginModal"
           ok-title="Login"
           cancel-title="Cancel"
           @ok="handleOk"
           @shown="$refs.username.focus()">
    <b-form @submit.prevent="handleOk" :validated="validated">
      <b-form-group
        label="Username"
        label-for="username"
        description="The administrator username">
        <b-form-input
          id="username"
          v-model="userDetails.username"
          required
          :state="state.username"
          ref="username"
          placeholder="Enter username" />
      </b-form-group>
      <b-form-group
        label="Password"
        label-for="password"
        description="The administrator password">
        <b-form-input
          id="password"
          v-model="userDetails.password"
          type="password"
          required
          :state="state.password"
          placeholder="Enter password" />
      </b-form-group>
    </b-form>
    <p class="text-danger" v-if="error">{{ error }}</p>
  </b-modal>
</template>

<script>
export default {
  data: function () {
    return {
      userDetails: {
        username: null,
        password: null
      },
      state: {
        username: null,
        password: null
      },
      validated: false,
      error: null
    }
  },
  methods: {
    handleOk: function () {
      this.state.username = this.userDetails.username !== null && this.userDetails.username.length > 0
      this.state.password = this.userDetails.password !== null && this.userDetails.password.length > 0
      this.validated = true

      if (this.state.username === false || this.state.password === false) {
        return
      }

      this.apiPostToken(this.userDetails, result => {
        this.error = null
        this.$store.dispatch('ON_TOKEN_CHANGED', result)
        this.$refs.loginModal.hide()
        this.$emit('login')
      }, error => {
        this.error = error.message
      })
    },
    show () {
      this.$nextTick(() => this.$refs.loginModal.show())
    }
  }
}
</script>

<style>
</style>
