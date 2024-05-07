<template>
  <section :class="`wrapper wrapper-${$vuetify.display.name}`">
    <canvas width="20" height="12" aria-hidden="true" class="canvas" ref="canvas" />
    <div class="shadow" />
    <video controls class="video" preload="metadata" :src="src" :poster="poster" ref="video" />
  </section>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    poster: {
      type: String,
      default: ''
    }
  },
  methods: {
    init: function () {
      this.ctx = this.canvas.getContext('2d')
      this.ctx.filter = 'blur(1px)';

      this.video.addEventListener('loadeddata', this.draw, false)
      this.video.addEventListener('seeked', this.draw, false)
      this.video.addEventListener('play', this.drawLoop, false)
      this.video.addEventListener('pause', this.drawPause, false)
      this.video.addEventListener('ended', this.drawPause, false)
    },
    draw: function () {
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
    },
    drawLoop: function () {
      this.draw()
      this.step = window.requestAnimationFrame(this.drawLoop)
    },
    drawPause: function () {
      window.cancelAnimationFrame(this.step)
      this.step = undefined
    }
  },
  mounted: function () {
    this.video = this.$refs.video
    this.canvas = this.$refs.canvas

    this.init()
  },
  beforeDestroy: function () {
    this.video.removeEventListener('loadeddata', this.draw)
    this.video.removeEventListener('seeked', this.draw)
    this.video.removeEventListener('play', this.drawLoop)
    this.video.removeEventListener('pause', this.drawPause)
    this.video.removeEventListener('ended', this.drawPause)
  }
}
</script>

<style scoped>
.video,
.canvas {
  display: block;
  width: 100%;
  height: auto;
  margin: 0;
}

.shadow {
  position: absolute;
  box-shadow: inset 0 0 1rem 1.5rem rgb(var(--v-theme-background));
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wrapper-md .shadow,
.wrapper-lg .shadow,
.wrapper-xl .shadow,
.wrapper-xxl .shadow {
  box-shadow: inset 0 0 4rem 4.5rem rgb(var(--v-theme-background));
}

.wrapper {
  position: relative;
  margin: auto auto;
  max-width: calc(1280px + 12rem);
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

.video {
  padding: 2rem;
  position: relative;
}

.wrapper-md .video,
.wrapper-lg .video,
.wrapper-xl .video,
.wrapper-xxl .video {
  padding: 6rem;
}
</style>
