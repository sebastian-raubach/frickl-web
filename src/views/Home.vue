<template>
  <div>
    <!-- The text -->
    <div class="position-relative vhc-100">
      <div class="background-image vhc-100" :style="{'background-image': 'url(' + getUrl + ')'}" v-if="backgroundImageId" />
      <div class="background-image vhc-100 bg-dark d-flex justify-content-center align-items-center h-100" v-else>
        <img src="../assets/photos.svg" class="img-fluid mh-75" alt="Photo collection" />
      </div>
      <b-container class="vhc-100 d-flex justify-content-center align-items-center">
        <div class="content text-white text-center">
          <img src="../assets/frickl.svg" class="img-fluid mh-75" alt="Frickl logo" />
          <h1>Welcome to Frickl</h1>
          <p>The new home for all your photos.</p>
          <p class="mt-5" v-if="backgroundImageId">
            Do you like the photo in the background? Go look at it <router-link :to="{ name: 'image-details', params: { imageId: backgroundImageId } }">here</router-link>.
          </p>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  data: function () {
    return {
      backgroundImageId: null
    }
  },
  computed: {
    ...mapGetters([
      'baseUrl',
      'token',
      'accessToken'
    ]),
    getUrl: function () {
      let result = `${this.baseUrl}image/${this.backgroundImageId}/img?size=MEDIUM`

      if (this.token && this.token.imageToken) {
        result = `${result}&token=${this.token.imageToken}`
      }
      if (this.accessToken) {
        result = `${result}&accesstoken=${this.accessToken}`
      }

      return result
    }
  },
  mounted: function () {
    this.apiGetRandomFavorite(result => {
      if (result) {
        this.backgroundImageId = result.id
      }
    })
  }
}
</script>

<style scoped>
.background-image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  filter: brightness(50%);
  background-size: cover;
  background-position: center center;
}
.vhc-100 {
  height: calc(100vh - 66px);
}
.mh-75 {
  max-height: 75%;
}
.content {
  z-index: 1;
}
</style>
