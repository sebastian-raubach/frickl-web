<template>
  <b-container class="mt-3">
    <h3>Cameras used the most</h3>
    <apexchart type=bar
               height=350
               :options="stats.cameraOptions"
               :series="stats.cameraSeries"
               ref="cameraChart" />
  </b-container>
</template>

<script>
export default {
  data: function () {
    return {
      stats: {
        cameraSeries: [{
          name: 'Camera',
          data: []
        }],
        cameraOptions: {
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%'
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: []
          },
          yaxis: {
            title: {
              text: '# photos'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + ' photos'
              }
            }
          }
        }
      }
    }
  },
  mounted: function () {
    var vm = this

    this.apiGetStatsCamera(function (result) {
      if (result) {
        vm.stats.cameraSeries[0].data = result.map(function (d) {
          return d.count
        })
        vm.stats.cameraOptions.xaxis.categories = result.map(function (d) {
          return d.camera
        })

        console.log(vm.$refs)
        vm.$refs.cameraChart.chart.updateOptions(vm.stats.cameraOptions, true, true)
      }
    })
  }
}
</script>

<style>
</style>
