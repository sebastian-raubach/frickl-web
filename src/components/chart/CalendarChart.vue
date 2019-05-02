<!--
  Shows a dropdown for all the years there are images for. Depending on the selected year, a heatmap with number of images per day in that year will be shown.
  Emits:
   - onDateSelected: User selected a date in the heatmap.
-->

<template>
  <apexchart type=heatmap height=350 :options="chartOptions" :series="chartSeries" ref="heatmapChart"/>
</template>

<script>
var moment = require('moment')

export default {
  data: function () {
    return {
      selectedYear: null,
      chartOptions: {
        dataLabels: {
          enabled: false
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return value === -1 ? 'Invalid date' : value
            }
          }
        },
        title: {
          text: this.selectedYear
        },
        xaxis: {
          tickPlacement: 'between',
          tickAmount: 31,
          categories: new Array(31).fill(0).map((e, i) => i + 1)
        },
        chart: {
          events: {
            dataPointSelection: (event, chartContext, config) => {
              this.handleClick(config)
            }
          }
        },
        legend: {
          show: false
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.7,
            colorScale: {
              ranges: [{
                from: -1.0001,
                to: -0.9999,
                color: '#ffffff',
                name: 'invalid'
              }, {
                from: -0.0001,
                to: 0.0001,
                color: '#dedede',
                name: 'zero'
              },
              {
                from: 1,
                to: 100,
                color: '#00acef',
                name: 'data'
              }]
            }
          }
        }
      },
      chartSeries: [{
        name: 'Dec',
        data: new Array(31).fill(0)
      }, {
        name: 'Nov',
        data: new Array(30).fill(0)
      }, {
        name: 'Oct',
        data: new Array(31).fill(0)
      }, {
        name: 'Sep',
        data: new Array(30).fill(0)
      }, {
        name: 'Aug',
        data: new Array(31).fill(0)
      }, {
        name: 'Jul',
        data: new Array(31).fill(0)
      }, {
        name: 'Jun',
        data: new Array(30).fill(0)
      }, {
        name: 'May',
        data: new Array(31).fill(0)
      }, {
        name: 'Apr',
        data: new Array(30).fill(0)
      }, {
        name: 'Mar',
        data: new Array(31).fill(0)
      }, {
        name: 'Feb',
        data: new Array(29).fill(0)
      }, {
        name: 'Jan',
        data: new Array(31).fill(0)
      }]
    }
  },
  props: {
    baseUrl: {
      type: String,
      default: null
    }
  },
  methods: {
    handleClick: function (config) {
      const year = this.selectedYear
      const month = 12 - config.seriesIndex - 1
      const day = config.dataPointIndex + 1
      const date = new Date(year, month, day)

      // Check if the date is a valid one
      if (date.getDate() !== day ||
        date.getMonth() !== month ||
        date.getFullYear() !== year) {
        return
      }

      this.$emit('onDateSelected', date)
    },
    onUpdate: function (selectedYear, result) {
      this.selectedYear = selectedYear
      // Fill all months will zeros to delete previous data
      this.chartSeries.forEach(function (s) {
        s.data = s.data.fill(0)
      })
      // Adjust the length of february for leap years
      const leapYear = ((this.selectedYear % 4 === 0) && (this.selectedYear % 100 !== 0)) || (this.selectedYear % 400 === 0)
      this.chartSeries[10].data = leapYear ? new Array(29).fill(0) : new Array(28).fill(0)

      // Calculate the maximum value for the color gradient
      var max = 0
      var vm = this
      // Set the data from the API result
      result.forEach(function (r) {
        var date = new Date(r.date)
        var month = date.getMonth()
        var day = date.getDate()

        var series = vm.chartSeries[11 - month]
        series.data[day - 1] = r.count
        max = Math.max(max, r.count)

        var momentDate = moment(date)
        r.date = momentDate.format('YYYY-MM-DD')
      })

      // Set the maximum
      this.chartOptions.plotOptions.heatmap.colorScale.ranges[2].to = max + 1
    }
  }
}
</script>

<style>

</style>
