<template>
  <div>
    <div class="bg-img" :style="{'background-image': 'url(' + baseUrl + 'image/fav/random)'}">
      <div class="overlay"></div>
      <div class="mouse-icon">
        <div class="wheel"></div>
      </div>
    </div>
    <div class="home-wrapper">
      <div class="container">
        <div class="row">

          <!-- home content -->
          <div class="col-md-10 offset-md-1">
            <div class="home-content">
              <h1 class="white-text">Welcome to Frickl</h1>
              <p class="white-text">Something totally important goes here...</p>
            </div>
          </div>
          <!-- /home content -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  props: [ 'baseUrl' ]
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
    background: #1C1D21;
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
