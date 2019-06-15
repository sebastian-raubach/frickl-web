<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand>
        <router-link to="/">
          <img src="./assets/frickl.svg" height="40px" alt="Frickl">
        </router-link>
      </b-navbar-brand>
      <!-- <b-navbar-brand to="/">Frickl</b-navbar-brand> -->

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/albums">Albums</b-nav-item>
          <b-nav-item to="/favorites">Favorites</b-nav-item>
          <b-nav-item to="/tags">Tags</b-nav-item>
          <b-nav-item to="/maps">Maps</b-nav-item>
          <b-nav-item to="/calendar">Calendar</b-nav-item>
          <b-nav-item to="/stats">Statistics</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/about">About</b-nav-item>
          <b-nav-form @submit.prevent="onSearch()">
            <b-input-group>
              <b-form-input size="sm" placeholder="Search" v-model="searchTerm"></b-form-input>
              <b-input-group-append>
                <b-button size="sm" type="submit"><MagnifyIcon /></b-button>
              </b-input-group-append>
            </b-input-group>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <vue-ins-progress-bar id="importStatus" />
    <b-tooltip placement="bottom" target="importStatus" title="Images are importing..." />
    <b-alert dismissible :variant="variant" :show="showAlert" @dismissed="showAlert=false" class="text-center global-alert">{{ message }}</b-alert>
    <router-view :key="$route.path" id="content"/>
  </div>
</template>

<script>
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'

export default {
  data: function () {
    return {
      timer: null,
      searchTerm: '',
      showAlert: false,
      variant: 'warning',
      message: ''
    }
  },
  components: {
    MagnifyIcon
  },
  methods: {
    onSearch: function () {
      this.$router.push('/search/' + this.searchTerm)
      this.searchTerm = ''
    },
    checkImportStatus: function () {
      var vm = this
      this.apiGetImportStatus(function (result) {
        if (result === 'IMPORTING') {
          vm.$insProgress.start()
          vm.timer = setInterval(vm.checkImportStatus, 10000)
        } else {
          vm.$insProgress.finish()

          if (vm.timer) {
            vm.$eventHub.$emit('alert', 'success', 'Image import successfully completed.')
          }

          clearInterval(vm.timer)
          vm.timer = null
        }
      })
    },
    handleAlert: function (variant, message) {
      this.variant = variant
      this.message = message
      this.showAlert = true
    }
  },
  beforeDestroy: function () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }

    this.$eventHub.$off('alert')
  },
  mounted: function () {
    this.checkImportStatus()

    this.$eventHub.$on('alert', this.handleAlert)
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#app .global-alert {
  border-radius: 0;
}
</style>
