<template>
  <b-modal title="Change public visibility"
           ref="publicVisibilityModal"
           hide-footer>
    <p>These settings will apply to all images within this album. This is not a recursive operation and won't apply to contained albums.</p>
    <b-row class="public-buttons">
      <b-col cols=6>
        <a href="#" @click.prevent="$emit('visibility-changed', true)">
          <b-card no-body>
            <b-card-body>
              <h1 class="text-center"><LockOpenVariantIcon /></h1>
            </b-card-body>
            <b-card-footer>
              Make publicly visible
            </b-card-footer>
          </b-card>
        </a>
      </b-col>
      <b-col cols=6>
        <a href="#" @click.prevent="$emit('visibility-changed', false)">
          <b-card no-body>
            <b-card-body>
              <h1 class="text-center"><LockIcon /></h1>
            </b-card-body>
            <b-card-footer>
              Hide publicly
            </b-card-footer>
          </b-card>
        </a>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import LockIcon from 'vue-material-design-icons/Lock'
import LockOpenVariantIcon from 'vue-material-design-icons/LockOpenVariant'

export default {
  components: {
    LockIcon,
    LockOpenVariantIcon
  },
  methods: {
    show () {
      this.$nextTick(() => this.$refs.publicVisibilityModal.show())
    },
    hide () {
      this.$nextTick(() => this.$refs.publicVisibilityModal.hide())
    }
  }
}
</script>

<style scoped>
.public-buttons a:hover {
  text-decoration: none;
}
</style>
