export default {
  methods: {
    apiGetAlbum: function (albumId, onSuccess) {
      this.unauthAjax({ url: 'album/' + albumId, success: onSuccess })
    },
    apiGetAlbums: function (parentAlbumId, page, imagesPerPage, onSuccess) {
      this.unauthAjax({ url: 'album?page=' + page + '&limit=' + imagesPerPage + '&parentAlbumId=' + parentAlbumId, success: onSuccess })
    },
    apiGetAlbumCount: function (albumId, onSuccess) {
      this.unauthAjax({ url: 'album/count?parentAlbumId=' + albumId, success: onSuccess })
    },
    apiGetAlbumLocations: function (albumId, onSuccess) {
      this.unauthAjax({ url: 'album/' + albumId + '/location', success: onSuccess })
    },
    apiGetLocations: function (onSuccess) {
      this.unauthAjax({ url: 'location', success: onSuccess })
    },
    apiGetAlbumTags: function (albumId, onSuccess) {
      this.unauthAjax({ url: 'album/' + albumId + '/tag', success: onSuccess })
    },
    apiDeleteTagFromAlbum: function (albumId, tag, onSuccess) {
      this.unauthAjax({ url: 'album/' + albumId + '/tag', method: 'DELETE', data: tag, success: onSuccess })
    },
    apiPostAlbumTags: function (albumId, tags, onSuccess) {
      this.unauthAjax({ url: 'album/' + albumId + '/tag', method: 'POST', data: tags, success: onSuccess })
    },
    apiGetCalendarYears: function (onSuccess) {
      this.unauthAjax({ url: 'calendar/year', success: onSuccess })
    },
    apiGetCalendar: function (year, onSuccess) {
      this.unauthAjax({ url: 'calendar?year=' + year, success: onSuccess })
    },
    apiGetImages: function (albumId, page, imagesPerPage, onSuccess) {
      this.unauthAjax({ url: 'album/' + albumId + '/image?page=' + page + '&limit=' + imagesPerPage, success: onSuccess })
    },
    apiGetAllImages: function (data, page, imagesPerPage, onSuccess) {
      this.unauthAjax({ url: 'image?page=' + page + '&limit=' + imagesPerPage, data: data, success: onSuccess })
    },
    apiGetAllImageCount: function (data, onSuccess) {
      this.unauthAjax({ url: 'image/count', data: data, success: onSuccess })
    },
    apiGetImage: function (imageId, onSuccess) {
      this.unauthAjax({ url: 'image/' + imageId, success: onSuccess })
    },
    apiGetImageCount: function (albumId, onSuccess) {
      this.unauthAjax({ url: 'album/' + albumId + '/image/count', success: onSuccess })
    },
    apiGetTagsForImage: function (imageId, onSuccess) {
      this.unauthAjax({ url: 'image/' + imageId + '/tag', success: onSuccess })
    },
    apiDeleteTagFromImage: function (imageId, tag, onSuccess) {
      this.unauthAjax({ url: 'image/' + imageId + '/tag', method: 'DELETE', data: tag, success: onSuccess })
    },
    apiAddTagsToImage: function (imageId, tags, onSuccess) {
      this.unauthAjax({ url: 'image/' + imageId + '/tag', method: 'POST', data: tags, success: onSuccess })
    },
    apiGetTag: function (tagId, onSuccess) {
      this.unauthAjax({ url: 'tag/' + tagId, success: onSuccess })
    },
    apiGetTags: function (onSuccess) {
      this.unauthAjax({ url: 'tag', success: onSuccess })
    },
    apiGetImageCountForTag: function (tagId, onSuccess) {
      this.unauthAjax({ url: 'tag/' + tagId + '/image/count', success: onSuccess })
    },
    apiGetImagesForTag: function (tagId, page, imagesPerPage, onSuccess) {
      this.unauthAjax({ url: 'tag/' + tagId + '/image?page=' + page + '&limit=' + imagesPerPage, success: onSuccess })
    },
    apiGetAlbumCountForSearch: function (searchTerm, onSuccess) {
      this.unauthAjax({ url: 'search/' + searchTerm + '/album/count', success: onSuccess })
    },
    apiGetImageCountForSearch: function (searchTerm, onSuccess) {
      this.unauthAjax({ url: 'search/' + searchTerm + '/image/count', success: onSuccess })
    },
    apiGetAlbumsForSearch: function (searchTerm, page, albumsPerPage, onSuccess) {
      this.unauthAjax({ url: 'search/' + searchTerm + '/album?page=' + page + '&limit=' + albumsPerPage, success: onSuccess })
    },
    apiGetImagesForSearch: function (searchTerm, page, imagesPerPage, onSuccess) {
      this.unauthAjax({ url: 'search/' + searchTerm + '/image?page=' + page + '&limit=' + imagesPerPage, success: onSuccess })
    },
    apiGetStatsCamera: function (onSuccess) {
      this.unauthAjax({ url: 'stats/camera', success: onSuccess })
    },
    apiGetImportStatus: function (onSuccess) {
      this.unauthAjax({ url: 'status', success: onSuccess })
    },
    apiPatchImage: function (image, onSuccess) {
      this.unauthAjax({ url: 'image/' + image.id, method: 'PATCH', data: image, success: onSuccess })
    },
    apiPatchAlbum: function (album, onSuccess) {
      this.unauthAjax({ url: 'album/' + album.id, method: 'PATCH', data: album, success: onSuccess })
    },
    apiGetRandomFavorite: function (onSuccess) {
      this.unauthAjax({ url: 'image/fav/random', success: onSuccess })
    }
  }
}
