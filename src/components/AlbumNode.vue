<template>
  <div class="album h-100">
    <hr/>
    <hr/>

    <b-card no-body class="album-card">
      <div class="bg-img" :style="{ height: `${albumHeight}px`, backgroundImage: `url(${getSrc('SMALL')})` }">
        <div class="overlay"></div>
        <div class="inner p-4">
          <h1>{{ cardTitle }}</h1>
        </div>
      </div>
      <div class="info d-flex flex-wrap align-items-stretch">
        <div class="p-3 wrapper d-flex flex-column justify-content-center align-items-center text-center" v-if="imageCount !== undefined && imageCount !== null">
          <h4>{{ getNumberWithSuffix(imageCount, 1) }}</h4>
          <small class="text-muted">{{ categoryTitle }}</small>
        </div>
        <div class="p-3 wrapper bg-light border-left d-flex flex-column justify-content-center align-items-center text-center" v-if="album.imageViewCount !== undefined && album.imageViewCount !== null" :title="toThousandSeparators(album.imageViewCount)">
          <h4>{{ getNumberWithSuffix(album.imageViewCount, 0) }}</h4>
          <small class="text-muted">views</small>
        </div>
        <div class="p-3 wrapper border-left d-flex flex-column justify-content-center align-items-center text-center" v-if="day">
          <h4>{{ day }}</h4>
          <small class="text-muted">{{ month }} {{ year }}</small>
        </div>
      </div>

      <router-link :to="routerTo" :title="album.name" class="stretched-link" />
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: function () {
    return {
    }
  },
  props: {
    album: {
      type: Object,
      default: null
    },
    albumHeight: {
      type: Number,
      default: 300
    },
    title: {
      type: String,
      default: null
    },
    to: {
      type: String,
      default: null
    },
    count: {
      type: Number,
      default: null
    },
    categoryTitle: {
      type: String,
      default: 'images'
    }
  },
  computed: {
    ...mapGetters([
      'baseUrl',
      'serverSettings',
      'albumDetailsMode',
      'token',
      'accessToken'
    ]),
    cardTitle: function () {
      return this.title || this.album.name
    },
    routerTo: function () {
      return this.to || `/albums/${this.album.id}`
    },
    month: function () {
      if (this.album.newestImage) {
        const date = new Date(this.album.newestImage)
        return date.toLocaleDateString(undefined, { month: 'short' })
      } else {
        return null
      }
    },
    day: function () {
      if (this.album.newestImage) {
        const date = new Date(this.album.newestImage)
        return date.toLocaleDateString(undefined, { day: '2-digit' })
      } else {
        return null
      }
    },
    year: function () {
      if (this.album.newestImage) {
        const date = new Date(this.album.newestImage)
        return date.toLocaleDateString(undefined, { year: 'numeric' })
      } else {
        return null
      }
    },
    imageCount: function () {
      if (this.count !== null) {
        return this.count
      } else {
        if ((this.serverSettings && this.serverSettings.authEnabled === false) || this.token || this.accessToken) {
          return this.album.imageCount
        } else {
          return this.album.imageCountPublic
        }
      }
    }
  },
  methods: {
    getSrc: function (size) {
      var result = `${this.baseUrl}image/${(this.accessToken || this.token || (this.serverSettings && this.serverSettings.authEnabled === false)) ? this.album.bannerImageId : this.album.bannerImagePublicId}/img?size=${size}`

      if (this.token && this.token.imageToken) {
        result = `${result}&token=${this.token.imageToken}`
      }
      if (this.accessToken) {
        result = `${result}&accesstoken=${this.accessToken}`
      }

      return result
    }
  }
}
</script>

<style scoped>
.album > hr {
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  border-color:  rgba(0, 0, 0, 0.2)
}
.album > hr:first-child {
  margin-left: 1rem;
  margin-right: 1rem;
}
.album > hr:nth-child(2) {
  margin-left: 0.65rem;
  margin-right: 0.65rem;
}

.album-card .bg-img {
  position: relative;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

.album-card .bg-img .inner {
  position: relative;
}

.album-card .bg-img .inner h1 {
  color: #fff;
  font-size: 28px;
  max-width: 75%;
  line-height: 1.2em;
  margin-bottom: 12px;
  font-weight: 300;
}

.album-card .overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.15);
  transition: background 0.1s linear;
}

.album-card:hover .overlay {
  background: rgba(0,0,0,.05);
}

.album-card .info > .wrapper {
  flex: 1;
}

.album-card .info h4 {
  margin-bottom: 0;
}
</style>
