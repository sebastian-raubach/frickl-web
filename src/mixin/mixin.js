export default {
  methods: {
    unauthAjax ({ url = null, method = 'GET', data = null, dataType = 'json', success = null, error = null }) {
      var requestData = null

      // Stringify the data object for non-GET requests
      if (data !== null || data !== undefined) {
        requestData = method === 'GET' ? data : JSON.stringify(data)
      }

      return this.$jQuery.ajax({
        url: url,
        method: method,
        dataType: dataType,
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        data: requestData
      })
        .fail(function (jqXHR, textStatus) {
          if (error) {
            error(jqXHR)
          }
        })
        .done(function (data) {
          if (success) {
            success(data)
          }
        })
    }
  }
}
