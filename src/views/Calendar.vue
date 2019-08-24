<template>
  <div>
    <b-container>
      <h3 v-if="error">{{ error }}</h3>
      <div v-else-if="years && years.length > 0" class="pt-3">
        <h1>Calendar</h1>
        <p>This page shows a heatmapped calendar view with the number if images you've taken each day. Use the select widget to switch between years.</p>
        <b-form-group label="Select year:" label-for="selectYear">
          <b-form-select id="selectYear" v-model="selectedYear" :options="years" @change="getForYear(false)"></b-form-select>
        </b-form-group>
        <calendar-chart ref="calendarChart" v-on:onDateSelected="date => onDateSelected(date)"/>
      </div>
    </b-container>
    <b-container fluid v-if="dateSelection.date">
      <template v-if="dateSelection.images && dateSelection.images.length > 0">
        <h3>Images taken on: {{ dateSelection.date | toDate }}</h3>
        <image-grid :imageCount="dateSelection.imageCount"
                    :images="dateSelection.images"
                    v-on:onImageNavigation="page => onImageNavigation(page)" />
      </template>
      <h3 v-else>No images taken on: {{ dateSelection.date | toDate }}</h3>
    </b-container>
  </div>
</template>

<script>
import ImageGrid from '../components/ImageGrid.vue'
import CalendarChart from '../components/chart/CalendarChart.vue'
import { mapGetters } from 'vuex'

var moment = require('moment')

export default {
  data: function () {
    return {
      years: [],
      selectedYear: null,
      dateSelection: {
        date: null,
        imageCount: 0,
        images: []
      },
      error: null
    }
  },
  computed: {
    ...mapGetters([
      'imagesPerPage'
    ])
  },
  watch: {
    imagesPerPage: function (newValue, oldValue) {
      this.onImageNavigation(1)
    }
  },
  components: {
    'image-grid': ImageGrid,
    'calendar-chart': CalendarChart
  },
  methods: {
    onDateSelected: function (date) {
      this.dateSelection.date = date

      this.dateSelection.formattedDate = moment(date).format('YYYY-MM-DD')

      var vm = this
      this.apiGetAllImageCount({
        date: this.dateSelection.formattedDate
      }, function (result) {
        vm.dateSelection.imageCount = result
        vm.dateSelection.imagesCurPage = 1
        vm.onImageNavigation(1)

        var query = JSON.parse(JSON.stringify(vm.$router.currentRoute.query))

        if (!query) {
          query = {}
        }

        query.date = vm.dateSelection.formattedDate

        vm.$router.replace({
          path: vm.$router.currentRoute.path,
          query: query
        })
      })
    },
    onImageNavigation: function (page) {
      var vm = this

      this.apiGetAllImages({
        date: this.dateSelection.formattedDate
      }, page - 1, this.imagesPerPage, function (result) {
        vm.dateSelection.images = result
      })
    },
    getForYear: function (restoreDate) {
      var vm = this

      this.apiGetCalendar(this.selectedYear, function (result) {
        if (result && result.length > 0) {
          vm.$refs.calendarChart.onUpdate(vm.selectedYear, result)

          var query = JSON.parse(JSON.stringify(vm.$router.currentRoute.query))

          if (!query) {
            query = {}
          }

          query.year = vm.selectedYear
          if (!restoreDate) {
            delete query.date
          }

          vm.$router.replace({
            path: vm.$router.currentRoute.path,
            query: query
          })

          if (restoreDate) {
            vm.onDateSelected(vm.dateSelection.date)
          }
        } else {
          vm.error = 'No calendar data found'
        }
      })
    }
  },
  mounted: function () {
    var vm = this

    var query = this.$route.query
    var yearToRestore = query.year
    if (query.date) {
      var m = moment(query.date)
      this.dateSelection.date = m.toDate()
      this.dateSelection.formattedDate = m.format('YYYY-MM-DD')
    }

    this.apiGetCalendarYears(function (result) {
      vm.years = result

      if (result && result.length > 0) {
        if (yearToRestore) {
          vm.selectedYear = +yearToRestore
        } else {
          vm.selectedYear = result[0]
        }
        vm.getForYear(yearToRestore !== undefined)
      }
    })
  }
}
</script>

<style>
</style>
