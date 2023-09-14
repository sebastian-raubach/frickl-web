<template>
  <div>
    <MultiLocationMap :images="locations" />
  </div>
</template>

<script>
import MultiLocationMap from '@/components/MultiLocationMap.vue'
import { apiGetLocations } from '@/plugins/api'

export default {
  components: {
    MultiLocationMap
  },
  data: function () {
    return {
      locations: null
    }
  },
  mounted: function () {
    apiGetLocations(locations => {
      this.locations = locations
    })
  }
}
</script>

<style>

</style>