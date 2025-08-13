<template>
  <div class="background d-flex align-center">
    <WelcomeComponent />
  </div>
</template>

<script setup lang="ts">
  import WelcomeComponent from '@/components/WelcomeComponent.vue'
</script>

<style scpped>
.background {
  min-height: calc(100vh - var(--v-layout-top));
  background-image: url('~@/assets/home-tiled.svg');
  background-size: 200px auto;
  background-repeat: repeat;
  background-attachment: fixed;
}
</style>
