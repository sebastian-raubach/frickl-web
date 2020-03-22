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
    <p>Mark photos as your favourites, tag them, look at them on a map or just take pleasure from the fact that all
       your photos are neatly organised.</p>
    <p>It has been written, designed and developed by <a href="http://www.raubach.co.uk">Sebastian Raubach</a>.</p>
    <b-row class="about-links">
      <b-col xs=12 sm=6 lg=4 class="mb-3">
        <b-card no-body>
          <div class="card-img text-center">
            <img src="../assets/github.svg" class="img-fluid p-5" alt="Github" />
          </div>
          <b-card-footer class="text-center">
            <a href="https://github.com/sebastian-raubach/frickl-web">Frickl on Github</a>
          </b-card-footer>
        </b-card>
      </b-col>
      <b-col xs=12 sm=6 lg=4 class="mb-3">
        <b-card no-body>
          <div class="card-img text-center">
            <img src="../assets/docker.svg" class="img-fluid p-5" alt="Docker" />
          </div>
          <b-card-footer class="text-center">
            <a href="https://github.com/sebastian-raubach/frickl-docker">Frickl Docker Container</a>
          </b-card-footer>
        </b-card>
      </b-col>
      <b-col xs=12 sm=6 lg=4 class="mb-3">
        <b-card no-body>
          <div class="card-img text-center">
            <img src="../assets/coffee2.svg" class="img-fluid p-5" alt="Coffee" />
          </div>
          <b-card-footer class="text-center">
            <a href="https://github.com/sponsors/sebastian-raubach">Buy Sebastian a coffee!</a>
          </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
</script>

<style>
  .about-links img {
    height: 15em;
    max-width: 100%;
  }
  .about-links .docker .material-design-icon__svg {
    fill: #0db7ed;
  }
  .about-links .github .material-design-icon__svg {
    fill: #333;
  }
</style>
