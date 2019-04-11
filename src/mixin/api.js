import store from '../store'

export default {
  methods: {
    apiGetAlbum: function (albumId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'album/' + albumId, success: onSuccess })
    },
    apiGetAlbums: function (parentAlbumId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'album?parentAlbumId=' + parentAlbumId, success: onSuccess })
    },
    apiGetImages: function (albumId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'album/' + albumId + '/image', success: onSuccess })
    },
    apiGetImage: function (imageId, onSuccess) {
      this.unauthAjax({ url: this.getBaseUrl() + 'image/' + imageId, success: onSuccess })
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
    getBaseUrl () {
      return store.getters.baseUrl
    }
  }
}
