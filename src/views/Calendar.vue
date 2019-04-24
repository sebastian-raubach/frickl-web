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
        <calendar-chart :baseUrl="baseUrl" ref="calendarChart" v-on:onDateSelected="date => onDateSelected(date)"/>
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
import CalendarChart from '../components/chart/CalendarChart.vue'

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
      error: null
    }
  },
  props: [ 'baseUrl' ],
  components: {
    'image-grid': ImageGrid,
    'calendar-chart': CalendarChart
  },
  methods: {
    onDateSelected: function (date) {
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
          vm.$refs.calendarChart.onUpdate(vm.selectedYear, result)
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
