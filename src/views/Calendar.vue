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
        <CalendarChart ref="chart" v-on:date-selected="onDateSelected" />
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

const moment = require('moment')

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
    CalendarChart,
    'image-grid': ImageGrid
  },
  methods: {
    onDateSelected: function (date) {
      this.dateSelection.date = date

      this.dateSelection.formattedDate = moment(date).format('YYYY-MM-DD')

      this.apiGetAllImageCount({
        date: this.dateSelection.formattedDate
      }, result => {
        this.dateSelection.imageCount = result
        this.dateSelection.imagesCurPage = 1
        this.onImageNavigation(1)

        let query = JSON.parse(JSON.stringify(this.$router.currentRoute.query))

        if (!query) {
          query = {}
        }

        query.date = this.dateSelection.formattedDate

        this.$router.replace({
          path: this.$router.currentRoute.path,
          query: query
        })
      })
    },
    onImageNavigation: function (page) {
      this.apiGetAllImages({
        date: this.dateSelection.formattedDate
      }, page - 1, this.imagesPerPage, result => {
        this.dateSelection.images = result
      })
    },
    getForYear: function (restoreDate) {
      this.apiGetCalendar(this.selectedYear, result => {
        if (result && result.length > 0) {
          this.$refs.chart.update(result)

          let query = JSON.parse(JSON.stringify(this.$router.currentRoute.query))

          if (!query) {
            query = {}
          }

          query.year = this.selectedYear
          if (!restoreDate) {
            delete query.date
          }

          this.$router.replace({
            path: this.$router.currentRoute.path,
            query: query
          })

          if (restoreDate) {
            this.onDateSelected(this.dateSelection.date)
          }
        } else {
          this.error = 'No calendar data found'
        }
      })
    }
  },
  mounted: function () {
    const query = this.$route.query
    const yearToRestore = query.year
    if (query.date) {
      const m = moment(query.date)
      this.dateSelection.date = m.toDate()
      this.dateSelection.formattedDate = m.format('YYYY-MM-DD')
    }

    this.apiGetCalendarYears(result => {
      this.years = result

      if (result && result.length > 0) {
        if (yearToRestore) {
          this.selectedYear = +yearToRestore
        } else {
          this.selectedYear = result[0]
        }
        this.getForYear(yearToRestore !== undefined)
      }
    })
  }
}
</script>

<style>
</style>
