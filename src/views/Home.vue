<template>
  <div>
    <!-- The background image -->
    <div class="bg-img" :style="{'background-image': 'url(' + getUrl + ')'}" v-if="backgroundImageId">
      <!-- The semi-transparent overlay -->
      <div class="overlay bg-dark"></div>
      <!-- The scroll indicator -->
      <!-- <div class="mouse-icon">
        <div class="wheel"></div>
      </div> -->
    </div>
    <div v-else class="bg-img bg-dark"></div>
    <!-- The text -->
    <div class="home-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-md-10 offset-md-1">
            <div class="home-content">
              <img src="../assets/frickl.svg" class="img-fluid" alt="Frickl logo" />
              <h1 class="white-text">Welcome to Frickl</h1>
              <p class="white-text">The new home for all your photos.</p>
            </div>
          </div>
        </div>
      </div>
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
      'baseUrl'
    ]),
    getUrl: function () {
      return this.baseUrl + 'image/' + this.backgroundImageId + '/img?size=MEDIUM'
    }
  },
  mounted: function () {
    var vm = this

    this.apiGetRandomFavorite(function (result) {
      if (result) {
        vm.backgroundImageId = result.id
      }
    })
  }
}
</script>

<style scoped>
  .bg-img {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
  }

  .bg-img .overlay {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: .6;
  }

  .home-wrapper {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    text-align: center;
    color: white;
    z-index: -1;
  }

  .mouse-icon {
    position: absolute;
    left: 50%;
    bottom: 40px;
    border: 2px solid #fff;
    border-radius: 16px;
    height: 50px;
    width: 30px;
    margin-left: -17px;
    display: block;
    z-index: 10;
  }
  .mouse-icon .wheel {
    position: relative;
    border-radius: 10px;
    background: #fff;
    width: 4px;
    height: 10px;
    top: 4px;
    margin-left: auto;
    margin-right: auto;
  }
  .mouse-icon .wheel {
    -webkit-animation-name: drop;
    -webkit-animation-duration: 1s;
    -webkit-animation-timing-function: linear;
    -webkit-animation-delay: 0s;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-play-state: running;
    animation-name: drop;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-play-state: running;
  }
  @-webkit-keyframes drop {
    0% {
      top: 5px;
      opacity: 0;
    }
    30% {
      top: 10px;
      opacity: 1;
    }
    100% {
      top: 25px;
      opacity: 0;
    }
  }

  @keyframes drop {
    0% {
      top: 5px;
      opacity: 0;
    }
    30% {
      top: 10px;
      opacity: 1;
    }
    100% {
      top: 25px;
      opacity: 0;
    }
  }
</style>
