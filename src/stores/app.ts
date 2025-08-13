// Utilities
import { userHasPermission } from '@/plugins/misc'
import { defineStore } from 'pinia'

let name = import.meta.env.VUE_APP_INSTANCE_NAME

if (!name) {
  name = 'frickl-' + window.location.pathname
}

export const coreStore = defineStore('frickl', {
  state: () => ({
    theme: 'fricklDark',
    accessToken: undefined as string | undefined,
    baseUrl: undefined as string | undefined,
    token: undefined as any | undefined,
    mapLayer: 'theme',
    locale: 'en',
    imagesPerPage: 24,
    albumsPerPage: 24,
    serverSettings: undefined as any | undefined,
    cookiesAccepted: undefined as boolean | undefined,
    downloadJobs: [] as any[],
    albumCardSize: 'md',
    imageCardSize: 'md',
  }),
  getters: {
    storeTheme: (state): string | undefined => state.theme,
    storeAccessToken: (state): string | undefined => state.accessToken,
    storeBaseUrl: (state): string | undefined => state.baseUrl,
    storeToken: (state): any | undefined => state.token,
    storeLocale: (state): string => state.locale,
    storeMapLayer: (state): string => state.mapLayer,
    storeImagesPerPage: (state): number => state.imagesPerPage,
    storeAlbumsPerPage: (state): number => state.albumsPerPage,
    storeServerSettings: (state): any | undefined => state.serverSettings,
    storeCookiesAccepted: (state): boolean | undefined => state.cookiesAccepted,
    storeDownloadJobs: (state): any[] => state.downloadJobs,
    storeAlbumCardSize: (state): string => state.albumCardSize,
    storeImageCardSize: (state): string => state.imageCardSize,
    storeUserPermissions: (state): any => {
      const result = {}

      if (state.token && state.token.allPermissions && state.token.permissions) {
        state.token.allPermissions.forEach((p: any) => {
          // @ts-ignore
          result[p.name] = userHasPermission(state.token.permissions, p.code)
        })
      }

      return result
    }
  },
  actions: {
    setTheme (newTheme: string) {
      this.theme = newTheme
    },
    setAccessToken (newAccessToken: string) {
      this.accessToken = newAccessToken
    },
    setBaseUrl (newBaseUrl: string | undefined) {
      this.baseUrl = newBaseUrl
    },
    setToken (newToken: any | undefined) {
      this.token = newToken
    },
    setLocale (newLocale: string) {
      this.locale = newLocale
    },
    setImagesPerPage (newImagesPerPage: number) {
      this.imagesPerPage = newImagesPerPage
    },
    setAlbumsPerPage (newAlbumsPerPage: number) {
      this.albumsPerPage = newAlbumsPerPage
    },
    setServerSettings (newServerSettings: any) {
      this.serverSettings = newServerSettings
    },
    setMapLayer (newMapLayer: string) {
      this.mapLayer = newMapLayer
    },
    setCookiesAccepted (newCookiesAccepted: boolean) {
      this.cookiesAccepted = newCookiesAccepted
    },
    setDownloadJobs (newDownloadJobs: any[]) {
      this.downloadJobs = newDownloadJobs
    },
    setAlbumCardSize (newAlbumCardSize: string) {
      this.albumCardSize = newAlbumCardSize
    },
    setImageCardSize (newImageCardSize: string) {
      this.imageCardSize = newImageCardSize
    },
    addDownloadJob (newDownloadJob: any) {
      if (!this.downloadJobs) {
        this.downloadJobs = [newDownloadJob]
      } else {
        this.downloadJobs.push(newDownloadJob)
      }
    },
  },
  persist: {
    key: name,
  },
})
