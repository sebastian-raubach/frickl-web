<template>
  <v-app>
    <v-main>
      <v-app-bar color="grey-darken-4" :extension-height="60">
        <v-img
          class="ms-4"
          src="img/frickl.svg"
          max-height="40"
          max-width="40"
          contain />

        <v-app-bar-title style="cursor: pointer" @click="$router.push({ name: 'home' })">Frickl</v-app-bar-title>

        <v-spacer></v-spacer>

        <template #extension v-if="searchVisible">
          <v-container>
            <v-row justify="end">
              <v-col cols="12">
                <v-text-field
                  autofocus
                  name="name"
                  v-model="searchTerm"
                  :label="$t('formPlaceholderSearch')"
                  density="compact"
                  type="search"
                  hide-details
                  single-line
                  append-inner-icon="mdi-magnify"
                  @keyup.exact.enter="runSearch"
                  @click:append-inner="runSearch" />
              </v-col>
            </v-row>
          </v-container>
        </template>

        <v-tooltip location="top" v-if="importStatus">
          <template #activator="{ props }">
            <v-progress-circular v-bind="props" color="primary" class="mx-3" indeterminate />
          </template>
          <span v-if="importStatus.status === 'SCANNING'">{{ $t('tooltipScanScanning') }}</span>
          <span v-if="importStatus.status === 'IMPORTING'">{{ $t('tooltipScanImporting', { total: importStatus.totalImages, queue: importStatus.queueSize }) }}</span>
        </v-tooltip>
        <v-menu v-if="downloadJobs.length > 0" :close-on-content-click="false" v-model="downloadMenuShown">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-progress-download" />
          </template>
          <v-card min-width="300">
            <v-list>
              <v-list-item
                :title="job.albumName"
                :subtitle="new Date(job.createdOn).toLocaleString()"
                v-for="job in downloadJobs" :key="`download-job-${job.token}`">
                <template v-slot:append>
                  <!-- TODO -->
                </template>
                <template v-slot:prepend>
                  <v-icon icon="mdi-timer-sand" v-if="job.status === 'RUNNING'" />
                  <v-icon tag="a" class="text-decoration-none" :href="`${storeBaseUrl}download/${job.token}`" @click="checkExportStatus(true)" icon="mdi-download" v-else-if="job.status === 'FINISHED'" />
                  <v-icon icon="mdi-alert" v-else-if="job.status === 'EXPIRED'" />
                  <v-icon icon="mdi-help-circle-outline" v-else />
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-btn icon="mdi-magnify" @click="searchVisible = !searchVisible"></v-btn>
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
        <v-btn icon="mdi-account-multiple" :to="{ name: 'users' }" v-if="storeToken && userHasAdminPermission"></v-btn>
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
            :subtitle="storeToken ? storeToken.username : $t('menuUserNotLoggedInExplanation')">
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
          <v-list-item prepend-icon="mdi-information" :title="$t('menuAbout')" :to="{ name: 'about' }" />
        </v-list>
      </v-navigation-drawer>

      <div>
        <v-banner :text="$t('widgetCookieBannerText')" stacked v-if="storeCookiesAccepted === null">
          <template v-slot:actions>
            <v-tooltip :text="$t('widgetCookieBannerRejectTooltip')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" @click="setCookies(false)" color="grey-darken-1">{{ $t('buttonReject') }}</v-btn>
              </template>
            </v-tooltip>
            <v-btn @click="setCookies(true)" color="primary">{{ $t('buttonAccept') }}</v-btn>
          </template>
        </v-banner>
        <v-container v-if="alertShown">
          <v-alert
            v-model="alertShown"
            closable
            :icon="alert.icon"
            :title="alert.title"
            :text="alert.text"
            :type="alert.type" />
        </v-container>
        <router-view :key="$route.path"/>
      </div>

      <LoginDialog ref="loginDialog" v-if="!storeToken" />

    </v-main>
  </v-app>
</template>

<script>
import LoginDialog from '@/components/dialogs/LoginDialog.vue'
import { mapGetters } from 'vuex'
import { apiCheckDownloadStatus, apiGetImportStatus, apiGetSettings, apiGetStatsCounts } from '@/plugins/api'
import { getNumberWithSuffix } from '@/plugins/misc'

import emitter from 'tiny-emitter/instance'

import { getCurrentInstance } from 'vue'
import { createPlausible } from 'v-plausible/vue'
import VueGtag from 'vue-gtag'

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
      importStatusTimer: null,
      exportJobTimer: null,
      alertShown: false,
      alert: null,
      downloadMenuShown: false,
      searchVisible: false,
      searchTerm: ''
    }
  },
  computed: {
    ...mapGetters([
      'storeBaseUrl',
      'storeTheme',
      'storeLocale',
      'storeToken',
      'storeDownloadJobs',
      'storeCookiesAccepted',
      'storeUserPermissions'
    ]),
    downloadJobs: function () {
      if (this.storeDownloadJobs) {
        return this.storeDownloadJobs.concat().sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
      } else {
        return []
      }
    },
    userHasAdminPermission: function () {
      return this.storeToken && this.storeUserPermissions && this.storeUserPermissions.IS_ADMIN
    }
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
    },
    downloadMenuShown: function (newValue) {
      if (newValue) {
        this.checkExportStatus()
      } else {
        this.clearExportJobTimer()
      }
    }
  },
  methods: {
    getNumberWithSuffix,
    runSearch: function () {
      this.$router.push({ name: 'search', params: { searchTerm: this.searchTerm } })
      this.searchTerm = ''
      this.searchVisible = false
    },
    setCookies: function (value) {
      this.$store.dispatch('setCookiesAccepted', value)
    },
    checkExportStatus: function (firstRun = false) {
      this.clearExportJobTimer()

      if (this.storeDownloadJobs) {
        const toCheck = this.storeDownloadJobs
        // const keepChecking = toCheck.some(j => j.status === 'RUNNING')

        if (firstRun || toCheck.length > 0) {
          apiCheckDownloadStatus(toCheck.map(j => j.token), result => {
            this.$store.dispatch('setDownloadJobs', result.filter(j => j.status !== 'EXPIRED'))

            if (!this.exportJobTimer) {
              this.exportJobTimer = setTimeout(this.checkExportStatus, 10000)
            }
          })
        } else {
          this.clearExportJobTimer()
        }
      } else {
        this.clearExportJobTimer()
      }
      apiCheckDownloadStatus()
    },
    clearExportJobTimer: function () {
      if (this.exportJobTimer) {
        clearInterval(this.exportJobTimer)
        this.exportJobTimer = null
      }
    },
    checkImportStatus: function () {
      apiGetImportStatus(result => {
        if (result.status !== 'IDLE') {
          this.importStatus = result
          this.importStatusTimer = setTimeout(this.checkImportStatus, 10000)
        } else {
          this.importStatus = null

          if (this.importStatusTimer) {
            clearInterval(this.importStatusTimer)
            if (result.totalImages > 0) {
              this.alert = {
                title: this.$t('alertTitleImportSuccessful'),
                text: this.$tc('alertTextImportSuccessful', result.totalImages),
                type: 'success',
                icon: 'mdi-check-all'
              }
              this.alertShown = true
            } else {
              this.alert = {
                title: this.$t('alertTitleImportNoUpdate'),
                text: this.$t('alertTextImportNoUpdate'),
                type: 'info',
                icon: 'mdi-sync'
              }
              this.alertShown = true
            }
            clearInterval(this.importStatusTimer)
            this.importStatusTimer = null
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
    },
    showDownloadMenu: function (value) {
      this.downloadMenuShown = value
    }
  },
  mounted: function () {
    this.checkImportStatus()
    this.checkExportStatus(true)
    this.updateCounts()

    emitter.on('overview-counts-changed', this.updateCounts)
    emitter.on('show-download-menu', this.showDownloadMenu)
  },
  beforeDestroy: function () {
    emitter.off('overview-counts-changed', this.updateCounts)
    emitter.off('show-download-menu', this.showDownloadMenu)
  },
  created: async function () {
    const instance = getCurrentInstance()

    await apiGetSettings(result => {
      if (result) {
        if (result.plausibleDomain) {
          instance.use(createPlausible({
            init: {
              domain: result.plausibleDomain,
              hashMode: result.plausibleHashMode || true,
              apiHost: result.plausibleApiHost || 'https://plausible.io',
              trackLocalhost: false
            },
            settings: {
              enableAutoPageviews: true
            }
          }))
        }

        if (result.googleAnalyticsKey) {
          instance.use(VueGtag, {
            config: {
              id: result.googleAnalyticsKey
            },
            // Disable initially, users have to opt-in
            bootstrap: false
          }, this.$router)
        }
      }

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

.v-application p {
  margin-bottom: 1rem;
  line-height: 1.8;
}

.position-relative {
  position: relative;
}
</style>