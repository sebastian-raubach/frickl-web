<template>
  <b-container class="mt-3">
    <b-row>
      <b-col cols=2></b-col>
      <b-col cols=8 class="text-center">
        <img src="../assets/frickl.svg" class="img-fluid" alt="Frickl logo" />
      </b-col>
      <b-col cols=2></b-col>
    </b-row>
    <h1>About Frickl</h1>
    <p>Frickl is an open source, self-hosted image management tool. Frickl uses your existing image library on your
       file system or external hard drive and makes it available through a modern and interactive web interface.</p>
    <p>It has been written, designed and developed by <a href="http://www.raubach.co.uk">Sebastian Raubach</a>.</p>
    <b-row class="about-links">
      <b-col xs=12 sm=6 lg=4 class="mb-3">
        <b-card no-body>
          <div class="card-img text-center">
            <GithubCircleIcon class="github" />
          </div>
          <b-card-footer class="text-center">
            <a href="https://github.com/sebastian-raubach/frickl-web">Frickl on Github</a>
          </b-card-footer>
        </b-card>
      </b-col>
      <b-col xs=12 sm=6 lg=4 class="mb-3">
        <b-card no-body>
          <div class="card-img text-center">
            <DockerIcon class="docker"/>
          </div>
          <b-card-footer class="text-center">
            <a href="https://github.com/sebastian-raubach/frickl-docker">Frickl Docker Container</a>
          </b-card-footer>
        </b-card>
      </b-col>
      <b-col xs=12 sm=6 lg=4 class="mb-3">
        <b-card no-body>
          <div class="card-img text-center">
            <GithubCircleIcon class="github" />
          </div>
          <b-card-footer class="text-center">
            <a href="https://github.com/sebastian-raubach">Sebastian Raubach on Github</a>
          </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import DockerIcon from 'vue-material-design-icons/Docker.vue'
import GithubCircleIcon from 'vue-material-design-icons/GithubCircle.vue'

export default {
  components: {
    DockerIcon,
    GithubCircleIcon
  }
}
</script>

<style>
  .about-links .material-design-icon {
    height: 10em;
    width: 10em;
  }
  .about-links .material-design-icon > .material-design-icon__svg {
      height: 10em;
      width: 10em;
  }
  .about-links .docker .material-design-icon__svg {
    fill: #0db7ed;
  }
  .about-links .github .material-design-icon__svg {
    fill: #333;
  }
</style>
