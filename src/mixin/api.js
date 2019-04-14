import store from '../store'

export default {
  methods: {
    apiGetAlbum: function (albumId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'album/' + albumId, success: onSuccess })
    },
    apiGetAlbums: function (parentAlbumId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'album?parentAlbumId=' + parentAlbumId, success: onSuccess })
    },
    apiGetAlbumLocations: function (albumId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'album/' + albumId + '/location', success: onSuccess })
    },
    apiGetCalendarYears: function (onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'calendar/year', success: onSuccess })
    },
    apiGetCalendar: function (year, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'calendar?year=' + year, success: onSuccess })
    },
    apiGetImages: function (albumId, page, imagesPerPage, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'album/' + albumId + '/image?page=' + page + '&limit=' + imagesPerPage, success: onSuccess })
    },
    apiGetAllImages: function (data, page, imagesPerPage, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'image?page=' + page + '&limit=' + imagesPerPage, data: data, success: onSuccess })
    },
    apiGetAllImageCount: function (data, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'image/count', data: data, success: onSuccess })
    },
    apiGetImage: function (imageId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'image/' + imageId, success: onSuccess })
    },
    apiGetImageCount: function (albumId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'album/' + albumId + '/image/count', success: onSuccess })
    },
    apiGetTagsForImage: function (imageId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'image/' + imageId + '/tag', success: onSuccess })
    },
    apiDeleteTagFromImage: function (imageTag, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'image/' + imageTag.imageId + '/tag', method: 'DELETE', data: imageTag, success: onSuccess })
    },
    apiGetTags: function (onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'tag', success: onSuccess })
    },
    apiGetImageCountForTag: function (tagId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'tag/' + tagId + '/image/count', success: onSuccess })
    },
    apiGetImagesForTag: function (tagId, page, imagesPerPage, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'tag/' + tagId + '/image?page=' + page + '&limit=' + imagesPerPage, success: onSuccess })
    },
    apiGetStatsCamera: function (onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'stats/camera', success: onSuccess })
    },
    getBaseUrl () {
      return store.getters.baseUrl
    }
  }
}
