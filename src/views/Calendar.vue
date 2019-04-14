<template>
  <div>
    <b-container>
      <h3 v-if="error">{{ error }}</h3>
      <div v-else-if="years && years.length > 0" class="pt-3">
        <h1>Calendar</h1>
        <p>This page shows a heatmapped calendar view with the number if images you've taken each day. Use the select widget to switch between years.</p>
        <b-form-group label="Select year:" label-for="selectYear">
          <b-form-select id="selectYear" v-model="selectedYear" :options="years" @change="getForYear()"></b-form-select>
        </b-form-group>
        <div id="calendar" class="pt-3"></div>
        <apexchart type=heatmap height=350 :options="chartOptions" :series="chartSeries" ref="heatmapChart"/>
      </div>
    </b-container>
    <b-container fluid v-if="dateSelection.date">
      <template v-if="dateSelection.images && dateSelection.images.length > 0">
        <h3>Images taken on: {{ dateSelection.date | toDate }}</h3>
        <image-grid :baseUrl="baseUrl"
                    :imageCount="dateSelection.imageCount"
                    :imagesPerPage="dateSelection.imagesPerPage"
                    :images="dateSelection.images"
                    v-on:onImageNavigation="page => onImageNavigation(page)" />
      </template>
      <h3 v-else>No images taken on: {{ dateSelection.date | toDate }}</h3>
    </b-container>
  </div>
</template>

<script>
import ImageGrid from '../components/ImageGrid.vue'

export default {
  data: function () {
    return {
      years: [],
      selectedYear: null,
      dateSelection: {
        date: null,
        imageCount: 0,
        imagesPerPage: 12,
        images: []
      },
      error: null,
      chartOptions: {
        dataLabels: {
          enabled: false
        },
        title: {
          text: this.selectedYear
        },
        chart: {
          events: {
            dataPointSelection: (event, chartContext, config) => {
              this.handleClick(config)
            }
          }
        },
        heatmap: {
          colorScale: {
            ranges: [{
              from: -1,
              to: 13,
              color: '#000000',
              name: 'low'
            },
            {
              from: 14,
              to: 20,
              color: '#128FD9',
              name: 'medium'
            },
            {
              from: 21,
              to: 45,
              color: '#FFB200',
              name: 'high'
            }]
          }
        }
      },
      chartSeries: [{
        name: 'Dec',
        data: new Array(31).fill(0)
      }, {
        name: 'Nov',
        data: new Array(31).fill(0)
      }, {
        name: 'Oct',
        data: new Array(31).fill(0)
      }, {
        name: 'Sep',
        data: new Array(31).fill(0)
      }, {
        name: 'Aug',
        data: new Array(31).fill(0)
      }, {
        name: 'Jul',
        data: new Array(31).fill(0)
      }, {
        name: 'Jun',
        data: new Array(31).fill(0)
      }, {
        name: 'May',
        data: new Array(31).fill(32)
      }, {
        name: 'Apr',
        data: new Array(31).fill(100)
      }, {
        name: 'Mar',
        data: new Array(31).fill(0)
      }, {
        name: 'Feb',
        data: new Array(31).fill(0)
      }, {
        name: 'Jan',
        data: new Array(31).fill(1)
      }]
    }
  },
  props: [ 'baseUrl' ],
  components: {
    'image-grid': ImageGrid
  },
  methods: {
    handleClick: function (config) {
      var date = new Date()
      date.setDate(config.dataPointIndex + 1)
      date.setMonth(12 - config.seriesIndex - 1)
      date.setYear(this.selectedYear)
      this.dateSelection.date = date

      this.dateSelection.formattedDate = window.moment(date).format('YYYY-MM-DD')

      var vm = this
      this.apiGetAllImageCount({
        date: this.dateSelection.formattedDate
      }, function (result) {
        vm.dateSelection.imageCount = result
        vm.dateSelection.imagesCurPage = 1
        vm.onImageNavigation(1)
      })
    },
    onImageNavigation: function (page) {
      var vm = this

      this.apiGetAllImages({
        date: this.dateSelection.formattedDate
      }, page - 1, this.dateSelection.imagesPerPage, function (result) {
        vm.dateSelection.images = result
      })
    },
    getForYear: function () {
      var vm = this

      this.apiGetCalendar(this.selectedYear, function (result) {
        if (result && result.length > 0) {
          result.forEach(function (r) {
            var date = new Date(r.date)
            // var month = date.getMonth()
            // var day = date.getDay()

            // var series = vm.chartSeries[11 - month]
            // series.data[day] = r.count

            var momentDate = window.moment(date)
            r.date = momentDate.format('YYYY-MM-DD')
          })

          vm.$jQuery('#calendar').empty()
          vm.$jQuery('#calendar').append('<div id="innercalendar"></div>')
          vm.$jQuery('#innercalendar').CalendarHeatmap(result, {
            lastMonth: 12,
            lastYear: vm.selectedYear,
            title: vm.selectedYear,
            legend: {
              show: true,
              align: 'right',
              minLabel: 'Few',
              maxLabel: 'Many'
            }
          })

          // vm.$refs.heatmapChart.chart.updateSeries(vm.chartSeries)
        } else {
          vm.error = 'No calendar data found'
        }
      })
    }
  },
  mounted: function () {
    var vm = this

    this.apiGetCalendarYears(function (result) {
      vm.years = result

      if (result && result.length > 0) {
        vm.selectedYear = result[0]
        vm.getForYear()
      }
    })
  }
}
</script>

<style>
</style>
