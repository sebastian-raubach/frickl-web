import axios from 'axios'
import emitter from 'tiny-emitter/instance'
import router from '@/router'
import { coreStore } from '@/stores/app'

/**
 * Returns the current authentication token
 */
const getToken = () => {
  const store = coreStore()
  let t = store.token

  // Check if the token is still valid
  if (t && ((Date.now() - new Date(t.createdOn).getTime()) > t.lifetime)) {
    t = null
    store.setToken(t)
  }

  return t ? t.token : null
}

const handleError = error => {
  const store = coreStore()
  switch (error.status) {
    case 401:
    case 403: {
      store.setToken(undefined)
      router.push('/')
      break
    }
  }
}

/**
 * Sends an Axios request to the server using authentication
 * @param {Object} param0 `{ url: String, method: String, data: Object, formData: Object, dataType: String, contentType: String, success: Callback, error: { codes: [], callback: Callback } }`
 */
const apiAxios = ({ url = null, method = 'GET', data = null, formData = null, dataType = 'json', contentType = 'application/json; charset=utf-8', success = null, error = { codes: [], callback: handleError } }) => {
  const store = coreStore()
  let requestData = null
  let requestParams = null

  if (store.accessToken) {
    if (data === null || data === undefined) {
      data = {}
    }

    data.accesstoken = store.accessToken
  }

  // Stringify the data object for non-GET requests
  if (data !== null || data !== undefined) {
    if (method === 'GET') {
      requestParams = data
    } else {
      requestData = data
    }
  }

  const promise = axios({
    baseURL: store.baseUrl,
    url,
    method,
    data: requestData,
    formData,
    params: requestParams,
    crossDomain: true,
    responseType: dataType,
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': contentType,
    },
  })

  promise.then(result => {
    const t = store.token

    // Check if the token is still valid. Renew it if so.
    if (t && ((Date.now() - new Date(t.createdOn).getTime()) <= t.lifetime)) {
      t.createdOn = Date.now()
      store.setToken(t)
    }

    if (success) {
      if (dataType === 'blob' && result.headers && result.headers['content-disposition']) {
        const filename = result.headers['content-disposition']
          .split(';')
          .map(p => p.trim())
          .filter(p => p.indexOf('filename') === 0)
          .map(p => p.replace('filename=', ''))

        if (filename && filename.length > 0) {
          result.data.filename = filename[0]
        }
      }

      success(result.data)
    }
  })

  promise.catch(error_ => {
    if (error_.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      // Log the user out if the result is forbidden and no error method has been provided
      // Otherwise, we assume that the calling method takes care of the error
      if (!error) {
        if (error_.response.status === 401 || error_.response.status === 403) {
          store.setToken(undefined)
        } else if (process.env.NODE_ENV === 'development') {
          console.error(error_)
        }
      } else if (error && error.callback) {
        return error.codes.length === 0 || error.codes.includes(error_.response.status) ? error.callback(error_.response) : handleError(error_.response)
      } else if (process.env.NODE_ENV === 'development') {
        console.error(error_)
      }
    } else if (error_.request) {
      // The request was made but no response was received `err.request` is an instance of XMLHttpRequest in the browser
      if (error_.request.textStatus === 'timeout') {
        emitter.emit('toast', {
          message: 'Request to the server timed out.',
          title: 'Error',
          variant: 'danger',
          autoHideDelay: 5000,
          appendToast: true,
        })
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      if (process.env.NODE_ENV === 'development') {
        console.error(error_)
      }
    }

    throw error_
  })

  return promise
}

const apiPostAlbumById = (albumId, data, onSuccess, onError) => apiAxios({ url: `album/${albumId}`, method: 'POST', data, success: onSuccess, error: onError })

const apiGetImageById = (imageId, onSuccess, onError) => apiAxios({ url: `image/${imageId}`, success: onSuccess, error: onError })

const apiGetAlbumById = (albumId, onSuccess, onError) => apiAxios({ url: `album/${albumId}`, success: onSuccess, error: onError })

const apiPatchImage = (image, onSuccess, onError) => apiAxios({ url: `image/${image.id}`, data: image, method: 'PATCH', success: onSuccess, error: onError })

const apiGetLocations = (onSuccess, onError) => apiAxios({ url: 'location', success: onSuccess, error: onError })

const apiPostImages = (data, onSuccess, onError) => apiAxios({ url: 'image', method: 'POST', data, success: onSuccess, error: onError })

const apiPostImageIds = (data, onSuccess, onError) => apiAxios({ url: 'image/ids', method: 'POST', data, success: onSuccess, error: onError })

const apiPostAlbums = (data, onSuccess, onError) => apiAxios({ url: 'album', method: 'POST', data, success: onSuccess, error: onError })

const apiGetImageTags = (imageId, onSuccess, onError) => apiAxios({ url: `image/${imageId}/tag`, success: onSuccess, error: onError })

const apiDeleteAlbum = (albumId, onSuccess, onError) => apiAxios({ url: `album/${albumId}`, method: 'DELETE', success: onSuccess, error: onError })

const apiDeleteAlbums = (albumIds, onSuccess, onError) => apiAxios({ url: 'album', method: 'DELETE', data: albumIds, success: onSuccess, error: onError })

const apiDeleteImage = (imageId, onSuccess, onError) => apiAxios({ url: `image/${imageId}`, method: 'DELETE', success: onSuccess, error: onError })

const apiDeleteImages = (imageIds, onSuccess, onError) => apiAxios({ url: 'image', method: 'DELETE', data: imageIds, success: onSuccess, error: onError })

const apiDeleteImageTag = (imageId, tagId, onSuccess, onError) => apiAxios({ url: `image/${imageId}/tag/${tagId}`, method: 'DELETE', success: onSuccess, error: onError })

const apiPostImageTags = (imageId, tags, onSuccess, onError) => apiAxios({ url: `image/${imageId}/tag`, method: 'POST', data: tags, success: onSuccess, error: onError })

const apiGetTags = (onSuccess, onError) => apiAxios({ url: 'tag', success: onSuccess, error: onError })

const apiPostToken = (data, onSuccess, onError) => apiAxios({ url: 'token', method: 'POST', data, success: onSuccess, error: onError })

const apiGetStatsCounts = (onSuccess, onError) => apiAxios({ url: 'stats/count', success: onSuccess, error: onError })

const apiGetStatsYears = (onSuccess, onError) => apiAxios({ url: 'stats/year', success: onSuccess, error: onError })

const apiGetStatsYearData = (year, onSuccess, onError) => apiAxios({ url: `stats/year/${year}`, success: onSuccess, error: onError })

const apiGetSettings = (onSuccess, onError) => apiAxios({ url: 'settings', success: onSuccess, error: onError })

const apiScanAlbum = (albumId, onSuccess, onError) => apiAxios({ url: `album/${albumId}/scan`, success: onSuccess, error: onError })

const apiGetImportStatus = (onSuccess, onError) => apiAxios({ url: 'status', success: onSuccess, error: onError })

const apiPutAlbum = (album, onSuccess, onError) => apiAxios({ url: 'album', method: 'PUT', data: album, success: onSuccess, error: onError })

const apiPostAlbumUsers = (albumId, userIds, onSuccess, onError) => apiAxios({ url: `album/${albumId}/user`, method: 'POST', data: userIds, success: onSuccess, error: onError })

const apiGetAlbumUsers = (albumId, onSuccess, onError) => apiAxios({ url: `album/${albumId}/user`, success: onSuccess, error: onError })

const apiGetDownloadAlbum = (albumId, onSuccess, onError) => apiAxios({ url: `album/${albumId}/download`, success: onSuccess, error: onError })

const apiPostDownloadImages = (imageIds, onSuccess, onError) => apiAxios({ url: 'image/download', method: 'POST', data: imageIds, success: onSuccess, error: onError })

const apiCheckDownloadStatus = (uuids, onSuccess, onError) => apiAxios({ url: 'download/status', method: 'POST', data: uuids, success: onSuccess, error: onError })

const apiDeleteDownloadJobs = (uuids, onSuccess, onError) => apiAxios({ url: 'download', method: 'DELETE', data: uuids, success: onSuccess, error: onError })

const apiGetImageAlbumHierarchy = (imageId, onSuccess, onError) => apiAxios({ url: `image/${imageId}/hierarchy`, success: onSuccess, error: onError })

const apiGetAlbumAlbumHierarchy = (albumId, onSuccess, onError) => apiAxios({ url: `album/${albumId}/hierarchy`, success: onSuccess, error: onError })

const apiPostUsers = (data, onSuccess, onError) => apiAxios({ url: 'user', method: 'POST', data, success: onSuccess, error: onError })

const apiPutUsers = (data, onSuccess, onError) => apiAxios({ url: 'user', method: 'PUT', data, success: onSuccess, error: onError })

const apiDeleteUser = (userId, onSuccess, onError) => apiAxios({ url: `user/${userId}`, method: 'DELETE', success: onSuccess, error: onError })

const apiPatchUser = (userId, data, onSuccess, onError) => apiAxios({ url: `user/${userId}`, method: 'PATCH', data, success: onSuccess, error: onError })

export {
  getToken,
  apiAxios,
  apiGetImageById,
  apiGetAlbumById,
  apiPostAlbumById,
  apiPostAlbums,
  apiPatchImage,
  apiGetLocations,
  apiPostImages,
  apiPostImageIds,
  apiPostToken,
  apiGetStatsCounts,
  apiGetImageTags,
  apiDeleteImageTag,
  apiPostImageTags,
  apiGetTags,
  apiGetStatsYears,
  apiGetStatsYearData,
  apiGetSettings,
  apiScanAlbum,
  apiGetImportStatus,
  apiPostAlbumUsers,
  apiGetAlbumUsers,
  apiPutAlbum,
  apiGetDownloadAlbum,
  apiPostDownloadImages,
  apiCheckDownloadStatus,
  apiDeleteDownloadJobs,
  apiGetImageAlbumHierarchy,
  apiGetAlbumAlbumHierarchy,
  apiDeleteAlbum,
  apiDeleteAlbums,
  apiDeleteImage,
  apiDeleteImages,
  apiPostUsers,
  apiPutUsers,
  apiDeleteUser,
  apiPatchUser,
}
