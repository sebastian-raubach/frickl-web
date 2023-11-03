<template>
  <v-app>
    <v-main>
      <v-app-bar color="grey-darken-4">
        <v-img
          class="ms-4"
          src="img/frickl.svg"
          max-height="40"
          max-width="40"
          contain />

        <v-app-bar-title style="cursor: pointer" @click="$router.push({ name: 'home' })">Frickl</v-app-bar-title>

        <v-spacer></v-spacer>
        <v-tooltip location="top" v-if="importStatus">
          <template #activator="{ props }">
            <v-progress-circular v-bind="props" color="primary" class="mx-3" indeterminate />
          </template>
          <span v-if="importStatus.status === 'SCANNING'">{{ $t('tooltipScanScanning') }}</span>
          <span v-if="importStatus.status === 'IMPORTING'">{{ $t('tooltipScanImporting', { total: importStatus.totalImages, queue: importStatus.queueSize }) }}</span>
        </v-tooltip>
        <v-btn icon="mdi-theme-light-dark" @click.stop="toggleTheme"></v-btn>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-translate" />
          </template>
          <v-list>
            <v-list-item
              @click="changeLocale(language.locale)"
              v-for="language in languages"
              :key="`locale-${language.flag}`"
              :value="language.locale">
              <v-list-item-title>{{ language.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn icon="mdi-login" @click.stop="showLogin" v-if="!storeToken"></v-btn>
        <v-btn icon="mdi-logout" @click.stop="logout" v-else></v-btn>
      </v-app-bar>

      <v-navigation-drawer
        permanent
        :rail="$vuetify.display.mdAndDown"
        :expand-on-hover="$vuetify.display.mdAndDown">
        <v-list>
          <v-list-item
            :title="$t(storeToken ? 'menuUserInfoType' : 'menuUserNotLoggedIn')"
            :subtitle="$t(storeToken ? 'menuUserInfoExplanation' : 'menuUserNotLoggedInExplanation')">
            <template v-slot:prepend>
              <v-avatar color="secondary">
                <v-icon color="black" v-if="storeToken">mdi-account</v-icon>
                <v-icon color="black" v-else>mdi-account-off</v-icon>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-image-move" :title="$t('menuImageStream')" :to="{ name: 'image-stream' }">
            <template v-slot:append v-if="counts.images">
              <v-badge color="dark" :content="getNumberWithSuffix(counts.images, 0)" inline />
            </template>
          </v-list-item>
          <v-list-item prepend-icon="mdi-folder-multiple-image" :title="$t('menuAlbums')" :to="{ name: 'albums' }">
            <template v-slot:append v-if="counts.albums">
              <v-badge color="dark" :content="getNumberWithSuffix(counts.albums, 0)" inline />
            </template>
          </v-list-item>
          <v-list-item prepend-icon="mdi-image-album" :title="$t('menuFavorites')" :to="{ name: 'favorites' }">
            <template v-slot:append v-if="counts.favorites">
              <v-badge color="dark" :content="getNumberWithSuffix(counts.favorites, 0)" inline />
            </template>
          </v-list-item>
          <v-list-item prepend-icon="mdi-tag-text" :title="$t('menuTags')" :to="{ name: 'tags' }">
            <template v-slot:append v-if="counts.tags">
              <v-badge color="dark" :content="getNumberWithSuffix(counts.tags, 0)" inline />
            </template>
          </v-list-item>
          <v-list-item prepend-icon="mdi-map-legend" :title="$t('menuMap')" :to="{ name: 'map' }" />
          <v-list-item prepend-icon="mdi-chart-bar-stacked" :title="$t('menuStatistics')" :to="{ name: 'statistics' }" />
        </v-list>
      </v-navigation-drawer>

      <div>
        <v-container v-if="showAlert">
          <v-alert
            v-model="showAlert"
            closable
            :icon="alert.icon"
            :title="alert.title"
            :text="alert.text"
            :type="alert.type" />
        </v-container>
        <router-view :key="$route.path"/>
      </div>

      <LoginDialog ref="loginDialog" />

    </v-main>
  </v-app>
</template>

<script>
import LoginDialog from '@/components/dialogs/LoginDialog.vue'
import { mapGetters } from 'vuex'
import { apiGetImportStatus, apiGetSettings, apiGetStatsCounts } from '@/plugins/api'
import { getNumberWithSuffix } from '@/plugins/misc'

import emitter from 'tiny-emitter/instance'

export default {
  name: 'App',
  components: {
    LoginDialog
  },
  data: function () {
    return {
      languages: [{
        locale: 'en',
        flag: 'gb',
        name: 'British English'
      }, {
        locale: 'de',
        flag: 'de',
        name: 'Deutsch - Deutschland'
      }],
      counts: {
        images: null,
        albums: null,
        favorites: null,
        tags: null 
      },
      importStatus: null,
      timer: null,
      showAlert: false,
      alert: null
    }
  },
  computed: {
    ...mapGetters([
      'storeTheme',
      'storeLocale',
      'storeToken'
    ])
  },
  watch: {
    storeTheme: {
      immediate: true,
      handler: function (newValue) {
        this.$vuetify.theme.global.name = newValue
      }
    },
    storeToken: function () {
      this.updateCounts()
    },
    storeLocale: {
      immediate: true,
      handler: function (newValue) {
        this.$vuetify.locale.current = newValue
      }
    }
  },
  methods: {
    getNumberWithSuffix,
    checkImportStatus: function () {
      apiGetImportStatus(result => {
        if (result.status !== 'IDLE') {
          this.importStatus = result
          this.timer = setTimeout(this.checkImportStatus, 10000)
        } else {
          this.importStatus = null

          if (this.timer) {
            clearInterval(this.timer)
            if (result.totalImages > 0) {
              this.alert = {
                title: this.$t('alertTitleImportSuccessful'),
                text: this.$tc('alertTextImportSuccessful', result.totalImages),
                type: 'success',
                icon: 'mdi-check-all'
              }
              this.showAlert = true
            } else {
              this.alert = {
                title: this.$t('alertTitleImportNoUpdate'),
                text: this.$t('alertTextImportNoUpdate'),
                type: 'info',
                icon: 'mdi-sync'
              }
              this.showAlert = true
            }
            clearInterval(this.timer)
            this.timer = null
          }
        }
      })
    },
    logout: function () {
      this.$store.commit('TOKEN_CHANGED_MUTATION', null)
      emitter.emit('token-changed')
      this.$router.push({ name: 'home' })
    },
    showLogin: function () {
      this.$refs.loginDialog.show()
    },
    changeLocale (locale) {
      console.log(locale)
      this.$store.dispatch('setLocale', locale)
    },
    toggleTheme: function () {
      if (this.storeTheme === 'fricklDark') {
        this.$store.dispatch('setTheme', 'fricklLight')
      } else {
        this.$store.dispatch('setTheme', 'fricklDark')
      }
    },
    updateCounts: function () {
      apiGetStatsCounts(result => {
        this.counts = result
      })
    }
  },
  mounted: function () {
    this.checkImportStatus()
    this.updateCounts()
  },
  created: async function () {
    await apiGetSettings(result => {
      // if (result) {
      //   if (result.googleAnalyticsKey) {
      //     Vue.use(VueAnalytics, {
      //       id: result.googleAnalyticsKey,
      //       router: this.$router,
      //       autoTracking: {
      //         exception: true,
      //         exceptionLogs: false
      //       }
      //     })
      //     // Disable initially, users have to opt-in
      //     Vue.$ga.disable()
      //   }

      //   if (result.plausibleDomain) {
      //     Vue.use(VuePlausible, {
      //       domain: result.plausibleDomain,
      //       hashMode: result.plausibleHashMode || true,
      //       apiHost: result.plausibleApiHost || 'https://plausible.io',
      //       trackLocalhost: false
      //     })

      //     this.$nextTick(() => {
      //       this.$plausible.enableAutoPageviews()
      //     })
      //   }
      // }

      this.$store.commit('SERVER_SETTINGS_CHANGED_MUTATION', result)
    })
  }
}
</script>

<style>
.v-toolbar__content {
  flex-wrap: wrap;
  height: auto !important;
  padding: 5px 0;
  row-gap: 5px;
}

.v-card-actions {
  flex-wrap: wrap;
  justify-content: end;
}
</style>