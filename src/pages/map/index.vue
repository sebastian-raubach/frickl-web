<template>
  <div>
    <MultiLocationMap :images="locations" />

    <!-- <v-toolbar>
      <v-range-slider hide-details="auto"
                      class="mt-6 me-6"
                      :label="$t('widgetMapDateRange')"
                      :min="0"
                      :max="totalDays"
                      :thumb-label="true"
                      :step="1"
                      v-model="dateRange"
                      v-if="totalDays">
        <template v-slot:thumb-label="{ modelValue }">
          {{ new Date(minDate + (modelValue * 1000 * 60 * 24)).toLocaleDateString() }}
        </template>
      </v-range-slider>
    </v-toolbar> -->
  </div>
</template>

<script>
  import MultiLocationMap from '@/components/MultiLocationMap.vue'
  import { apiGetLocations } from '@/plugins/api'
  import emitter from 'tiny-emitter/instance'

  export default {
    components: {
      MultiLocationMap,
    },
    data: function () {
      return {
        locations: null,
        totalDays: 0,
        minDate: 0,
        maxDate: 0,
        dateRange: [0, 0],
      }
    },
    computed: {
      // filteredLocations: function () {
      //   if (this.dateRange && (this.dateRange[0] !== 0 || this.dateRange[1] !== this.totalDays)) {
      //     const start = new Date(this.minDate)
      //     start.setDate(start.getDate() + this.dateRange[0])
      //     const end = new Date(this.minDate)
      //     end.setDate(end.getDate() + this.dateRange[1])

      //     return this.locations.filter(l => l.date >= start.getTime() && l.date <= end.getTime())
      //   } else {
      //     return this.locations
      //   }
      // }
    },
    mounted: function () {
      emitter.emit('show-loading', true)
      apiGetLocations(locations => {
        // const dates = []
        // locations.forEach(l => {
        //   let d = null
        //   if (l.exif) {
        //     if (l.exif.dateTimeOriginal) {
        //       d = new Date(l.exif.dateTimeOriginal)
        //     } else if (l.exif.dateTime) {
        //       d = new Date(l.exif.dateTime)
        //     } else {
        //       d = new Date(l.updatedOn)
        //     }
        //   } else {
        //     d = new Date(l.updatedOn)
        //   }

        //   l.date = d ? d.getTime() : null

        //   if (d) {
        //     dates.push(d)
        //   }

        //   if (dates.length > 0) {
        //     this.minDate = Math.min(...dates)
        //     this.maxDate = Math.max(...dates)
        //     this.totalDays = Math.ceil((this.maxDate - this.minDate) / (1000 * 60 * 60 * 24))
        //     this.dateRange = [0, this.totalDays]
        //   }
        // })

        this.locations = locations
      })
    },
  }
</script>

<style>

</style>
