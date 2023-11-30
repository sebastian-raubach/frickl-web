<template>
  <v-container>
    <h1 class="text-h4 mb-3">
      Statistics
    </h1>
    <v-divider class="mb-3" />

    <v-chip-group v-model="selectedYear" column selected-class="text-primary">
      <v-chip label v-for="year in years" :key="`year-${year.year}`" filter>{{ year.year }} <v-badge :content="year.count" inline /></v-chip>
    </v-chip-group>
    
    <ImageHeatmapChart :chartData="chartData" v-if="chartData && chartData.length > 0" @date-selected="setDate" />

    <template v-if="selectedDate">
      <h1 class="text-h4 mb-3 mt-6">
        {{ $t('pageStatisticsCalendarImagesTitle', { date: selectedDate.toLocaleDateString() }) }}
      </h1>
      <v-divider class="mb-3" />
      <ImageGallery :getData="getImages" ref="imageGallery" />
    </template>
  </v-container>
</template>

<script>
import ImageGallery from '@/components/ImageGallery.vue'
import ImageHeatmapChart from '@/components/charts/ImageHeatmapChart.vue'
import { apiGetStatsYears, apiGetStatsYearData, apiPostImages } from '@/plugins/api'

export default {
  components: {
    ImageHeatmapChart,
    ImageGallery
  },
  data: function () {
    return {
      chartData: [],
      selectedYear: null,
      years: [],
      selectedDate: null
    }
  },
  watch: {
    selectedYear: function (){
      this.getImageCounts()
    }
  },
  methods: {
    setDate: function (date) {
      this.selectedDate = date

      if (this.$refs.imageGallery) {
        this.$refs.imageGallery.reset()
      }
    },
    getImageCounts: function () {
      apiGetStatsYearData(this.years[this.selectedYear].year, result => {
        this.chartData = result
      })
    },
    getImages: function (params) {
      const adjusted = this.selectedDate ? Object.assign({}, params, { albumId: -1, date: this.selectedDate.toISOString().substring(0, 10) }) : params
      return apiPostImages(adjusted)
    }
  },
  mounted: function () {
    apiGetStatsYears(result => {
      this.years = result
    })
  }
}
</script>

<style>

</style>
