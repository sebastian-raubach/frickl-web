<template>
  <b-container class="mt-3">
    <h3>Photos per camera</h3>
    <div ref="cameraChart" />
    <h3>Photos taken per day and hour</h3>
    <div ref="dayHourChart" />
  </b-container>
</template>

<script>
export default {
  mounted: function () {
    this.apiGetStatsDayHour(result => {
      if (result) {
        const z = Array.from(Array(24).keys()).map(i => [0, 0, 0, 0, 0, 0, 0])

        result.forEach(r => { z[r.hour][r.day] += r.count })

        console.log(z)

        const data = [{
          x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          y: Array.from(Array(24).keys()),
          z: z,
          name: '',
          type: 'heatmap',
          hoverongaps: false,
          xgap: 1,
          ygap: 1,
          colorscale: [
            [0, '#efefef'],
            [1, '#f8a631']
          ],
          hovertemplate: '%{x}. %{y}: %{z}'
        }]

        const layout = {
          height: 700,
          xaxis: {
            showgrid: false,
            zeroline: false,
            tickmode: 'array',
            tickvals: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            title: 'Day'
          },
          yaxis: {
            showgrid: false,
            zeroline: false,
            tickmode: 'array',
            tickvals: Array.from(Array(24).keys()).map(i => i),
            title: 'Hour'
          }
        }

        const config = {
          responsive: true,
          displaylogo: false
        }

        this.$plotly.newPlot(this.$refs.dayHourChart, data, layout, config)
      }
    })

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

        this.$plotly.newPlot(this.$refs.cameraChart, data, layout, config)
      }
    })
  }
}
</script>

<style>
</style>
