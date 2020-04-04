<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark" id="navbar">
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
          <b-nav-item to="/calendar" v-if="(serverSettings && serverSettings.authEnabled === false) || token">Calendar</b-nav-item>
          <b-nav-item to="/stats" v-if="(serverSettings && serverSettings.authEnabled === false) || token">Statistics</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <template v-if="(serverSettings && serverSettings.authEnabled === true)">
            <b-nav-item v-if="(serverSettings && serverSettings.authEnabled === false) || token" @click="logout">Logout</b-nav-item>
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
    <template v-if="importStatus">
      <b-tooltip v-if="importStatus.status === 'SCANNING'" placement="bottom" target="importStatus" title="Scanning image source for changes." />
      <b-tooltip v-else-if="importStatus.status === 'IMPORTING'" placement="bottom" target="importStatus" :title="`Checking ${importStatus.totalImages} photos for updates. Photos on processing queue: ${importStatus.queueSize}`" />
    </template>
    <b-alert dismissible :variant="variant" :show="showAlert" @dismissed="showAlert=false" class="text-center global-alert">{{ message }}</b-alert>
    <router-view :key="$route.path" id="content"/>

    <LoginModal ref="loginModal" v-on:login="onLogin" />

    <b-popover target="navbar" show placement="bottom" variant="info" v-if="cookiesAccepted === null">
      <template v-slot:title>GDPR Cookie Consent</template>
      <p>Frickl uses cookies to facilitate user login and to remember user preferences.</p>
      <div class="d-flex flex-row">
        <b-button variant="success" class="flex-fill mr-2" @click="acceptCookies(true)">Accept</b-button>
        <b-button variant="outline-secondary" class="flex-fill" v-b-tooltip:hover title="Please be aware that rejecting cookies will disable certain features of Frickl." @click="acceptCookies(false)">Reject</b-button>
      </div>
    </b-popover>
  </div>
</template>

<script>
import LoginModal from '@/components/modals/LoginModal'
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import VueAnalytics from 'vue-analytics'

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
      'cookiesAccepted',
      'serverSettings',
      'token'
    ])
  },
  components: {
    LoginModal,
    MagnifyIcon
  },
  methods: {
    acceptCookies: function (decision) {
      this.$store.dispatch('ON_COOKIES_ACCEPTED', decision)
    },
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

        if (result.status !== 'IDLE') {
          vm.$insProgress.start()
          vm.timer = setTimeout(vm.checkImportStatus, 10000)
        } else {
          vm.$insProgress.finish()

          if (vm.timer) {
            clearInterval(vm.timer)
            if (result.totalImages > 0) {
              vm.$eventHub.$emit('alert', 'success', `Photo update of ${result.totalImages} successfully completed.`)
            } else {
              vm.$eventHub.$emit('alert', 'success', `Photos scanned for updates. No changes found.`)
            }
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
      if (result && result.googleAnalyticsKey) {
        Vue.use(VueAnalytics, {
          id: result.googleAnalyticsKey,
          router: this.$router,
          autoTracking: {
            exception: true,
            exceptionLogs: false
          }
        })
        // Disable initially, users have to opt-in
        Vue.$ga.disable()
      }

      this.$store.dispatch('ON_AUTH_CHANGED', result)
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
