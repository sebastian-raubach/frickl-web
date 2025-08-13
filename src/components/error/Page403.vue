<template>
  <v-container fluid>
    <v-alert
      type="error"
      :title="$t('pageTitleForbidden')"
      :text="$t('pageTextForbidden')"
    />
  </v-container>
</template>

<script>
  export default {}
</script>

<style scoped>
</style>
