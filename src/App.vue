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
          <b-nav-item to="/images">Image stream</b-nav-item>
          <b-nav-item to="/favorites">Favorites</b-nav-item>
          <b-nav-item to="/albums">Albums</b-nav-item>
          <b-nav-item to="/tags">Tags</b-nav-item>
          <b-nav-item to="/maps">Maps</b-nav-item>
          <b-nav-item to="/calendar" v-if="authEnabled === false || token">Calendar</b-nav-item>
          <b-nav-item to="/stats" v-if="authEnabled === false || token">Statistics</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <template v-if="authEnabled === true">
            <b-nav-item v-if="authEnabled === false || token" @click="logout">Logout</b-nav-item>
            <b-nav-item v-else @click="login">Login</b-nav-item>
          </template>
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
    <b-tooltip v-if="importStatus" placement="bottom" target="importStatus" :title="`Checking photos for updates. Remaining photos: ${importStatus.queueSize}`" />
    <b-alert dismissible :variant="variant" :show="showAlert" @dismissed="showAlert=false" class="text-center global-alert">{{ message }}</b-alert>
    <router-view :key="$route.path" id="content"/>

    <LoginModal ref="loginModal" v-on:login="onLogin" />
  </div>
</template>

<script>
import LoginModal from '@/components/modals/LoginModal'
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'
import { mapGetters } from 'vuex'

export default {
  data: function () {
    return {
      timer: null,
      searchTerm: '',
      showAlert: false,
      variant: 'warning',
      message: '',
      importStatus: null
    }
  },
  computed: {
    ...mapGetters([
      'authEnabled',
      'token'
    ])
  },
  components: {
    LoginModal,
    MagnifyIcon
  },
  methods: {
    login: function () {
      this.$refs.loginModal.show()
    },
    onLogin: function () {
      this.$router.go({ name: 'home' })
    },
    logout: function () {
      this.$store.dispatch('ON_TOKEN_CHANGED', null)
      this.$router.go({ name: 'home' })
    },
    onSearch: function () {
      this.$router.push({ name: 'search', params: { searchTerm: this.searchTerm } })
      this.searchTerm = ''
    },
    checkImportStatus: function () {
      var vm = this
      this.apiGetImportStatus(function (result) {
        vm.importStatus = result

        if (result.status === 'IMPORTING') {
          vm.$insProgress.start()
          vm.timer = setTimeout(vm.checkImportStatus, 10000)
        } else {
          vm.$insProgress.finish()

          if (vm.timer) {
            clearInterval(vm.timer)
            vm.$eventHub.$emit('alert', 'success', `Photo update of ${result.totalImages} successfully completed.`)
            clearInterval(vm.timer)
            vm.timer = null
          }
        }
      })
    },
    handleAlert: function (variant, message) {
      this.variant = variant
      this.message = message
      this.showAlert = true
    }
  },
  created: async function () {
    await this.apiGetSettings(result => {
      this.$store.dispatch('ON_AUTH_CHANGED', result.authEnabled)
    })
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
  margin-bottom: 0;
}
</style>
