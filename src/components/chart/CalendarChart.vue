<!--
  Shows a dropdown for all the years there are images for. Depending on the selected year, a heatmap with number of images per day in that year will be shown.
  Emits:
   - onDateSelected: User selected a date in the heatmap.
-->

<template>
  <div ref="chart" />
</template>

<script>
export default {
  data: function () {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].reverse()
    }
  },
  methods: {
    update: function (result) {
      this.$plotly.purge(this.$refs.chart)

      const z = [
        new Array(31).fill(0),
        new Array(30).fill(0),
        new Array(31).fill(0),
        new Array(30).fill(0),
        new Array(31).fill(0),
        new Array(31).fill(0),
        new Array(30).fill(0),
        new Array(31).fill(0),
        new Array(30).fill(0),
        new Array(31).fill(0),
        new Array(29).fill(0),
        new Array(31).fill(0)
      ]

      const ids = [
        new Array(31).fill(null),
        new Array(30).fill(null),
        new Array(31).fill(null),
        new Array(30).fill(null),
        new Array(31).fill(null),
        new Array(31).fill(null),
        new Array(30).fill(null),
        new Array(31).fill(null),
        new Array(30).fill(null),
        new Array(31).fill(null),
        new Array(29).fill(null),
        new Array(31).fill(null)
      ]

      let max = 0

      result.forEach(date => {
        const d = new Date(date.date)
        z[11 - d.getMonth()][d.getDate() - 1] = date.count
        ids[11 - d.getMonth()][d.getDate() - 1] = date.date

        max = Math.max(max, date.count)
      })

      const data = [{
        z: z,
        x: Array.from(Array(31).keys()).map(i => i + 1),
        y: this.months,
        ids: ids,
        name: '',
        type: 'heatmap',
        hoverongaps: false,
        xgap: 2,
        ygap: 2,
        colorscale: [
          [0, '#efefef'],
          [1, '#f8a631']
        ],
        hovertemplate: '%{x}. %{y}: %{z}'
      }]

      const layout = {
        height: 500,
        xaxis: {
          showgrid: false,
          tickmode: 'array',
          // nticks: 31,
          tickvals: Array.from(Array(31).keys()).map(i => i + 1),
          title: 'Day'
        },
        yaxis: {
          showgrid: false,
          title: 'Month'
        }
      }

      const config = {
        responsive: true,
        displaylogo: false
      }

      this.$plotly.newPlot(this.$refs.chart, data, layout, config)

      this.$refs.chart.on('plotly_click', e => {
        if (e && e.points && e.points.length > 0) {
          const point = e.points[0]

          if (point.id) {
            this.$emit('date-selected', new Date(point.id))
          }
        }
      })
    }
  }
}
</script>

<style>

</style>
