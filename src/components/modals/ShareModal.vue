<template>
  <b-modal title="Share image"
           ref="shareModal"
           ok-title="Close">
    <p>Use this link to share the image with friends or to post on social media.</p>

    <b-form @submit.prevent>
      <b-form-group label="Share link" label-for="link">
        <b-form-input id="link" :value="url" readonly />
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: null
    }
  },
  methods: {
    show () {
      this.$nextTick(() => this.$refs.shareModal.show())
    },
    hide () {
      this.$nextTick(() => this.$refs.shareModal.hide())
    }
  }
}
</script>

<style scoped>
</style>
