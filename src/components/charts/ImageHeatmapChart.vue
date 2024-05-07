<template>
  <div ref="chart" />
</template>

<script>
import { mapGetters } from 'vuex'

import Plotly from 'plotly.js-dist-min'

export default {
  props: {
    chartData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters([
      'storeLocale',
      'storeTheme'
    ]),
    dateFormat: function () {
      return new Intl.DateTimeFormat(this.storeLocale || 'en', { month: 'short' })
    },
    months: function () {
      if (this.dateFormat) {
        return [...Array(12).keys()].map(m => this.dateFormat.format(new Date(Date.UTC(2000, m, 1, 0, 0, 0)))).reverse()
      } else {
        return []
      }
    },
    isHorizontal: function () {
      return this.windowWidth < 720
    }
  },
  watch: {
    isHorizontal: function () {
      this.update()
    },
    storeTheme: function () {
      this.update()
    },
    chartData: function () {
      this.update()
    }
  },
  methods: {
    update: function () {
      const horizontal = window.innerWidth < 720

      Plotly.purge(this.$refs.chart)

      let z = [
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

      let ids = [
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

      this.chartData.forEach(date => {
        const d = new Date(date.date)
        z[11 - d.getMonth()][d.getDate() - 1] = date.count
        ids[11 - d.getMonth()][d.getDate() - 1] = date.date

        max = Math.max(max, date.count)
      })

      const x = Array.from(Array(31).keys()).map(i => i + 1)
      const y = this.months

      if (horizontal) {
        z = z[0].map((col, i) => z.reverse().map(row => row[i]))
        ids = ids[0].map((col, i) => ids.reverse().map(row => row[i]))
      }

      const data = [{
        z: z,
        x: horizontal ? y.reverse() : x,
        y: horizontal ? x : y,
        ids: ids,
        name: '',
        type: 'heatmap',
        hoverongaps: false,
        xgap: 1,
        ygap: 1,
        colorscale: [
          [0, this.storeTheme === 'fricklDark' ? '#2f2f2f' : '#e4e4e4'],
          [1, '#009432']
        ],
        colorbar: {
          title: {
            side: 'right',
            font: { color: this.storeTheme === 'fricklDark' ? 'white' : 'black' }
          },
          tickfont: { color: this.storeTheme === 'fricklDark' ? 'white' : 'black' },
          orientation: window.innerWidth < 768 ? 'h' : 'v'
        },
        hovertemplate: '%{x}. %{y}: %{z}'
      }]

      let xAxis = {
        showgrid: false,
        tickmode: 'array',
        // nticks: 31,
        tickvals: Array.from(Array(31).keys()).map(i => i + 1),
        title: { text: this.$t('widgetChartHeatmapAxisTitleDay'), font: { color: this.storeTheme === 'fricklDark' ? 'white' : 'black' } },
        tickfont: { color: this.storeTheme === 'fricklDark' ? 'white' : 'black' }
      }
      let yAxis = {
        showgrid: false,
        title: { text: this.$t('widgetChartHeatmapAxisTitleMonth'), font: { color: this.storeTheme === 'fricklDark' ? 'white' : 'black' } },
        tickfont: { color: this.storeTheme === 'fricklDark' ? 'white' : 'black' }
      }

      if (horizontal) {
        [xAxis, yAxis] = [yAxis, xAxis]
      }

      const layout = {
        height: horizontal ? 800 : 500,
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        xaxis: xAxis,
        yaxis: yAxis
      }

      const config = {
        responsive: true,
        displaylogo: false
      }

      Plotly.newPlot(this.$refs.chart, data, layout, config)

      this.$refs.chart.on('plotly_click', e => {
        if (e && e.points && e.points.length > 0) {
          const point = e.points[0]

          if (point.id) {
            this.$emit('date-selected', new Date(point.id))
          }
        }
      })
    }
  },
  mounted: function () {
    this.update()
  }
}
</script>

<style>

</style>
