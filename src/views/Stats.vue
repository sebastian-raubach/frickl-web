<template>
  <b-container class="mt-3">
    <h3>Photos per camera</h3>
    <div ref="chart" />
  </b-container>
</template>

<script>
export default {
  mounted: function () {
    var vm = this

    this.apiGetStatsCamera(function (result) {
      if (result) {
        const data = [{
          x: result.map(d => d.camera),
          y: result.map(d => d.count),
          type: 'bar',
          marker: {
            color: '#f8a631'
          }
        }]

        const layout = {
          height: 500,
          xaxis: {
            title: 'Camera',
            automargin: true
          },
          yaxis: {
            title: '# photos'
          }
        }

        const config = {
          responsive: true,
          displaylogo: false
        }

        vm.$plotly.newPlot(vm.$refs.chart, data, layout, config)
      }
    })
  }
}
</script>

<style>
</style>
