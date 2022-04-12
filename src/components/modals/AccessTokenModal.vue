<template>
  <b-modal title="Generate access token"
           ref="accessTokenModal"
           :ok-title="generated ? 'Close' : 'Generate'"
           @ok.prevent="generated ? hide(): addToken()">
    <p>An access token will allow anyone with this token to access a set of albums. Be careful who you share tokens with.</p>

    <b-form @submit.prevent>
      <b-form-group label="Token" label-for="uuid">
        <b-input-group>
          <template v-slot:prepend>
            <b-input-group-text><ShareVariantIcon /></b-input-group-text>
          </template>
          <b-form-input id="uuid" v-model="uuid" readonly />
        </b-input-group>
      </b-form-group>
      <b-form-group label="Expires on" label-for="expires">
        <b-form-datepicker v-model="expiresOn" :min="min" id="expires" />
      </b-form-group>

      <b-form-group label="URL to share with people" label-for="url" v-if="generated">
        <b-input-group>
          <b-form-input id="url" v-model="url" readonly ref="url"/>
        </b-input-group>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant'

export default {
  props: {
    albumId: {
      type: Number,
      default: null
    }
  },
  data: function () {
    return {
      uuid: null,
      expiresOn: null,
      min: null,
      generated: false
    }
  },
  computed: {
    ...mapGetters([
      'accessToken'
    ]),
    url: function () {
      const l = window.location
      return `${l.protocol}//${l.host}${l.pathname}#/albums/${this.albumId}/?accesstoken=${this.uuid}`
    }
  },
  components: {
    ShareVariantIcon
  },
  methods: {
    addToken: function () {
      this.apiPostAccessToken(this.albumId, {
        token: this.uuid,
        expiresOn: this.expiresOn
      }, result => {
        if (result) {
          this.generated = true
        }
      })
    },
    show () {
      this.uuid = this.uuidv4()
      this.expiresOn = null
      this.generated = false
      const date = new Date()
      date.setDate(date.getDate() + 1)
      this.min = date

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
