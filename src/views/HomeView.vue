<template>
  <div class="background d-flex align-center">
    <WelcomeView />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

// Components
import WelcomeView from '@/views/WelcomeView.vue'

export default defineComponent({
  name: 'HomeView',

  components: {
    WelcomeView
  }
})
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
