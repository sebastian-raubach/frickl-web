import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  data: function () {
    return {
      MAX_JAVA_INTEGER: 2147483647
    }
  },
  computed: {
    ...mapGetters([
      'serverSettings',
      'accessToken'
    ])
  },
  methods: {
    /**
     * Formats the given value into a human-readable number (e.g. 1.000 -> 1K, 1.000.000 -> 1G)
     * @param {Number} value The value to format
     * @param {Number} decimals The decimal places
     * @param {Number} k The thousand value (e.g. 1000 or 1024)
     * @param {String} separator The separator between the number and the letter
     */
    getNumberWithSuffix: function (value, decimals = 2, k = 1000, separator = '') {
      if (value === undefined || value === null || value === 0) {
        return '0'
      }

      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']

      const i = Math.floor(Math.log(value) / Math.log(k))

      return parseFloat((value / Math.pow(k, i)).toFixed(dm)) + separator + sizes[i]
    },
    toThousandSeparators: function (value) {
      if (value === null || value === undefined) {
        return null
      } else {
        return value.toLocaleString()
      }
    },
    uuidv4: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    /**
     * This is the default error method that gets called if no other error handler is defined for the error code that caused it.
     * @param {*} error The error response object
     */
    handleError: function (error) {
      const variant = 'danger'
      const title = 'Error'
      let message = error ? error.statusText : 'UNKNOWN ERROR'

      if (error && error.status) {
        switch (error.status) {
          case 400:
            message = 'Bad request. Server refused to respond.'
            break
          case 401:
            message = 'Unauthorized. Authentication failed.'
            this.$store.dispatch('ON_TOKEN_CHANGED', null)
            if (this.serverSettings && this.serverSettings.authEnabled === true) {
              this.$router.push({ name: 'home' })
            }
            return
          case 403:
            message = 'Forbidden. You cannot access this resource.'
            this.$store.dispatch('ON_TOKEN_CHANGED', null)
            if (this.serverSettings && this.serverSettings.authEnabled === true) {
              this.$router.push({ name: 'home' })
            }
            return
          case 404:
            message = 'Not found. Request returned no data.'
            break
          case 405:
            message = 'Method not allowed.'
            break
          case 408:
            message = 'Timeout. The request timed out.'
            break
          case 409:
            message = 'Conflict. The request conflicts with existing data.'
            break
          case 410:
            message = 'Gone. The resource is no longer available at this address.'
            break
          case 500:
            message = 'Internal Server Error. Something went wrong...'
            break
          case 501:
            message = 'Not implemented. This resource is not implemented yet.'
            break
          case 503:
            message = 'Service unavailable.'
            break
        }
      }

      this.$bvToast.toast(message, {
        title: title,
        variant: variant,
        autoHideDelay: 5000,
        appendToast: true
      })
    },
    /**
     * Sends a FORM to the given URL using authentication
     * @param {Object} param0 `{ url: String, formData: Object, success: Callback, error: { codes: [], callback: Callback } }`
     */
    unauthForm ({ url = null, formData, success = null, error = null }) {
      return axios({
        url: url,
        method: 'POST',
        data: formData,
        responseType: 'json',
        crossDomain: true,
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + this.getToken()
        }
      })
        .then(data => {
          if (success) {
            success(data.data)
          }
        })
        .catch(err => {
          if (err && err.response && err.response.status === 403) {
            this.handleError(err.response)
          }

          if (error) {
            error(err)
          } else {
            this.handleError(err.response)
          }
        })
    },
    unauthAjax ({ url = null, method = 'GET', data = null, params = null, dataType = 'json', contentType = 'application/json; charset=utf-8', success = null, error = null }) {
      let requestData = null
      let requestParams = null

      if (this.accessToken) {
        if (data === null || data === undefined) {
          data = {}
        }

        data.accesstoken = this.accessToken
      }

      // Stringify the data object for non-GET requests
      if (data !== null && data !== undefined) {
        if (method === 'GET') {
          requestParams = data
        } else {
          requestData = data
        }
      }

      return axios({
        url: url,
        method: method,
        data: requestData,
        params: requestParams,
        responseType: dataType,
        crossDomain: true,
        withCredentials: true,
        headers: {
          'Content-Type': contentType,
          Authorization: 'Bearer ' + this.getToken()
        }
      })
        .then(data => {
          if (success) {
            success(data.data)
          }
        })
        .catch(err => {
          if (err && err.response && err.response.status === 403) {
            this.handleError(err.response)
          }

          if (error) {
            error(err)
          } else {
            this.handleError(err.response)
          }
        })
    },
    getToken () {
      let t = this.$store.getters.token

      // Check if the token is still valid
      if (t && ((new Date().getTime() - new Date(t.createdOn).getTime()) > t.lifetime)) {
        t = null
        this.$store.dispatch('ON_TOKEN_CHANGED', t)
      }

      return t ? t.token : null
    }
  }
}
