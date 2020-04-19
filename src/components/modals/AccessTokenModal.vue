<template>
  <b-modal title="Generate access token"
           ref="accessTokenModal"
           ok-title="Generate">
    <p>An access token will allow anyone with this token to access a set of albums. Be careful who you share tokens with.</p>

    <b-form @submit.prevent>
      <b-input-group>
        <template v-slot:prepend>
          <b-input-group-text><ShareVariantIcon /></b-input-group-text>
        </template>
        <b-form-input v-model="uuid" readonly />
      </b-input-group>
    </b-form>
  </b-modal>
</template>

<script>
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant'

export default {
  data: function () {
    const uuid = this.uuidv4()

    return {
      uuid: uuid
    }
  },
  components: {
    ShareVariantIcon
  },
  methods: {
    show () {
      this.$nextTick(() => this.$refs.accessTokenModal.show())
    },
    hide () {
      this.$nextTick(() => this.$refs.accessTokenModal.hide())
    }
  }
}
</script>

<style scoped>
</style>
