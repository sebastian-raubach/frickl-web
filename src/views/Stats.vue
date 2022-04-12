<template>
  <b-container class="mt-3">
    <h3>Photos per camera</h3>
    <div ref="chart" />
  </b-container>
</template>

<script>
export default {
  mounted: function () {
    this.apiGetStatsCamera(result => {
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

        this.$plotly.newPlot(this.$refs.chart, data, layout, config)
      }
    })
  }
}
</script>

<style>
</style>
