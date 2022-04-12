const Plotly = require('plotly.js/lib/core')

Plotly.register([
  require('plotly.js/lib/bar'),
  require('plotly.js/lib/heatmap')
])

module.exports = Plotly
