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
    uuidv4: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0
        var v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    /**
     * This is the default error method that gets called if no other error handler is defined for the error code that caused it.
     * @param {*} error The error response object
     */
    handleError: function (error) {
      var variant = 'danger'
      var title = 'Error'
      var message = error ? error.statusText : 'UNKNOWN ERROR'

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
          'Authorization': 'Bearer ' + this.getToken()
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
      var requestData = null
      var requestParams = null

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
          'Authorization': 'Bearer ' + this.getToken()
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
      var t = this.$store.getters.token

      // Check if the token is still valid
      if (t && ((new Date().getTime() - new Date(t.createdOn).getTime()) > t.lifetime)) {
        t = null
        this.$store.dispatch('ON_TOKEN_CHANGED', t)
      }

      return t ? t.token : null
    }
  }
}
