import axios from 'axios'

export default {
  methods: {
    unauthAjax ({ url = null, method = 'GET', data = null, params = null, dataType = 'json', success = null, error = null }) {
      var requestData = null
      var requestParams = null

      // Stringify the data object for non-GET requests
      if (data !== null || data !== undefined) {
        if (method === 'GET') {
          requestData = data
          requestParams = data
        } else {
          requestData = JSON.stringify(data)
          requestParams = data
        }
      }

      return axios({
        url: url,
        method: method,
        data: requestData,
        params: requestParams,
        responseType: dataType,
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
      })
        .then(function (data) {
          if (success) {
            success(data.data)
          }
        })
        .catch(function (err) {
          if (error) {
            error(err)
          }
        })
    }
  }
}
