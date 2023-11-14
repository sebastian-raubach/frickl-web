import store from '@/store'
import router from '@/router'

import axios from 'axios'
import emitter from 'tiny-emitter/instance'

/**
 * Returns the current authentication token
 */
const getToken = () => {
  let t = store.getters.storeToken

  // Check if the token is still valid
  if (t && ((new Date().getTime() - new Date(t.createdOn).getTime()) > t.lifetime)) {
    t = null
    store.dispatch('setToken', t)
  }

  return t ? t.token : null
}

const handleError = (error) => {
  switch (error.status) {
    case 401:
    case 403:
      store.dispatch('setToken', null)
      router.push({ name: 'home' })
      break
  }
}

/**
 * Sends an Axios request to the server using authentication
 * @param {Object} param0 `{ url: String, method: String, data: Object, formData: Object, dataType: String, contentType: String, success: Callback, error: { codes: [], callback: Callback } }`
 */
const apiAxios = ({ url = null, method = 'GET', data = null, formData = null, dataType = 'json', contentType = 'application/json; charset=utf-8', success = null, error = { codes: [], callback: handleError } }) => {
  let requestData = null
  let requestParams = null

  if (store.getters.storeAccessToken) {
    if (data === null || data === undefined) {
      data = {}
    }

    data.accesstoken = store.getters.storeAccessToken
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
    baseURL: store.getters.storeBaseUrl,
    url: url,
    method: method,
    data: requestData,
    formData: formData,
    params: requestParams,
    crossDomain: true,
    responseType: dataType,
    withCredentials: true,
    headers: {
      'Content-Type': contentType,
      Authorization: `Bearer ${getToken()}`
    }
  })

  promise.then(result => {
    const t = store.getters.storeToken

    // Check if the token is still valid. Renew it if so.
    if (t && ((new Date().getTime() - new Date(t.createdOn).getTime()) <= t.lifetime)) {
      t.createdOn = new Date().getTime()
      store.dispatch('setToken', t)
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

  promise.catch(err => {
    if (err.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      // Log the user out if the result is forbidden and no error method has been provided
      // Otherwise, we assume that the calling method takes care of the error
      if (!error) {
        if (err.response.status === 401 || err.response.status === 403) {
          store.dispatch('setToken', null)
        } else if (process.env.NODE_ENV === 'development') {
          console.error(err)
        }
      } else if (error && error.callback) {
        if (error.codes.length === 0 || error.codes.includes(err.response.status)) {
          return error.callback(err.response)
        } else {
          return handleError(err.response)
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.error(err)
      }
    } else if (err.request) {
      // The request was made but no response was received `err.request` is an instance of XMLHttpRequest in the browser
      if (err.request.textStatus === 'timeout') {
        emitter.emit('toast', {
          message: 'Request to the server timed out.',
          title: 'Error',
          variant: 'danger',
          autoHideDelay: 5000,
          appendToast: true
        })
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      if (process.env.NODE_ENV === 'development') {
        console.error(err)
      }
    }

    throw err
  })

  return promise
}

const apiPostAlbumById = (albumId, data, onSuccess, onError) => apiAxios({ url: `album/${albumId}`, method: 'POST', data: data, success: onSuccess, error: onError })

const apiGetImageById = (imageId, onSuccess, onError) => apiAxios({ url: `image/${imageId}`, success: onSuccess, error: onError })

const apiPatchImage = (image, onSuccess, onError) => apiAxios({ url: `image/${image.id}`, data: image, method: 'PATCH', success: onSuccess, error: onError })

const apiGetLocations = (onSuccess, onError) => apiAxios({ url: 'location', success: onSuccess, error: onError })

const apiPostImages = (data, onSuccess, onError) => apiAxios({ url: 'image', method: 'POST', data: data, success: onSuccess, error: onError })

const apiPostAlbums = (data, onSuccess, onError) => apiAxios({ url: 'album', method: 'POST', data: data, success: onSuccess, error: onError })

const apiGetImageTags = (imageId, onSuccess, onError) => apiAxios({ url: `image/${imageId}/tag`, success: onSuccess, error: onError })

const apiDeleteImageTag = (imageId, tagId, onSuccess, onError) => apiAxios({ url: `image/${imageId}/tag/${tagId}`, method: 'DELETE', success: onSuccess, error: onError })

const apiGetTags = (onSuccess, onError) => apiAxios({ url: 'tag', success: onSuccess, error: onError })

const apiPostToken = (data, onSuccess, onError) => apiAxios({ url: 'token', method: 'POST', data: data, success: onSuccess, error: onError })

const apiGetStatsCounts = (onSuccess, onError) => apiAxios({ url: 'stats/count', success: onSuccess, error: onError })

const apiGetStatsYears = (onSuccess, onError) => apiAxios({ url: 'stats/year', success: onSuccess, error: onError })

const apiGetStatsYearData = (year, onSuccess, onError) => apiAxios({ url: `stats/year/${year}`, success: onSuccess, error: onError })

const apiGetSettings = (onSuccess, onError) => apiAxios({ url: 'settings', success: onSuccess, error: onError })

const apiScanAlbum = (albumId, onSuccess, onError) => apiAxios({ url: `album/${albumId}/scan`, success: onSuccess, error: onError })

const apiGetImportStatus = (onSuccess, onError) => apiAxios({ url: 'status', success: onSuccess, error: onError })

const apiPutAlbum = (album, onSuccess, onError) => apiAxios({ url: 'album', method: 'PUT', data: album, success: onSuccess, error: onError })

const apiDownloadAlbum = (albumId, onSuccess, onError) => apiAxios({ url: `album/${albumId}/download`, success: onSuccess, error: onError })

const apiCheckAlbumDownloadStatus = (uuids, onSuccess, onError) => apiAxios({ url: 'album/download/status', method: 'POST', data: uuids, success: onSuccess, error: onError })

export {
  getToken,
  apiAxios,
  apiGetImageById,
  apiPostAlbumById,
  apiPostAlbums,
  apiPatchImage,
  apiGetLocations,
  apiPostImages,
  apiPostToken,
  apiGetStatsCounts,
  apiGetImageTags,
  apiDeleteImageTag,
  apiGetTags,
  apiGetStatsYears,
  apiGetStatsYearData,
  apiGetSettings,
  apiScanAlbum,
  apiGetImportStatus,
  apiPutAlbum,
  apiDownloadAlbum,
  apiCheckAlbumDownloadStatus
}
