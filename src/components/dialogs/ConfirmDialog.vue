<template>
  <v-dialog width="auto" v-model="dialog">
    <v-card>
      <v-card-text>{{ message }}</v-card-text>

      <v-card-actions>
        <v-btn
          variant="text"
          @click="$emit('no')">
          {{ $t('buttonNo') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          @click="$emit('yes')">
          {{ $t('buttonYes') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      dialog: false
    }
  },
  emits: ['yes', 'no'],
  methods: {
    show: function () {
      this.dialog = true
    },
    hide: function () {
      this.dialog = false
    }
  }
}
</script>
