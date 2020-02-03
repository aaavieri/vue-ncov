<template>
    <div>
        <el-page-header @back="goBack" :content="title" style="margin-bottom: 20px; ">
        </el-page-header>
        <v-chart :options="chartOption"></v-chart>
    </div>
</template>

<script>
  /* eslint-disable no-unused-vars,no-console */

  import ECharts from 'vue-echarts'
  import echarts from 'echarts'
  import {mapState} from 'Vuex'

  export default {
    name: "ProvinceChart",
    components: {
      "v-chart": ECharts
    },
    data() {
      return {
        title: '',
        chartOption: {
          title: {
            text: ''
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '确诊',
              type: 'bar',
              barWidth: '60%',
              data: []
            }
          ]
        }
      }
    },
    computed: {
      ...mapState(['timeLineData', 'provinceData'])
    },
    methods: {
      dateFormat: (date, fmt) => {
        if (!date) return ''
        if (typeof date === 'number') date = new Date(date)
        let attributes = {
          "M+": date.getMonth() + 1, //月份
          "d+": date.getDate(), //日
          "h+": date.getHours(), //小时
          "m+": date.getMinutes(), //分
          "s+": date.getSeconds(), //秒
          "S": date.getMilliseconds() //毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
        for (let attr in attributes)
          if (new RegExp(`(${attr})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (attributes[attr]) : (("00" + attributes[attr]).substr(("" + attributes[attr]).length)))
          }
        return fmt
      },
      goBack() {
        this.$router.go(-1)
      },
      findPrevDay(key) {
        const date = new Date(key)
        const prevDay = new Date(date.getTime() - 24 * 60 * 60 * 1000)
        return this.provinceData[this.dateFormat(prevDay, "yyyy/MM/dd")]
      },
      findOneProvince(name, allProvinces) {
        if (!allProvinces) return null
        return allProvinces.find(province => province.provinceShortName === name)
      }
    },
    mounted() {
      const {name} = this.$route.params
      const titleReg = /新增\s*(\d+)\s*例/
      const dateReg = /\//g
      let chartData = Object.keys(this.provinceData).map(key => ({
        date: key,
        data: this.findOneProvince(name, this.provinceData[key]),
        prevData: this.findOneProvince(name, this.findPrevDay(key))
      }))
      chartData = chartData.filter(item => item.data && item.prevData).map(item => ({
        date: item.date,
        dateInt: parseInt(item.date.replace(dateReg, "")),
        count: item.data.confirmedCount - item.prevData.confirmedCount,
        src: 1
      }))
      this.timeLineData.filter(timeLine =>
        timeLine.title.indexOf(name) > -1 && timeLine.title.search(titleReg) > -1).map(timeLine => ({
        count: parseInt(timeLine.title.match(titleReg)[1]),
        date: this.dateFormat(timeLine.pubDate, 'yyyy/MM/dd'),
        src: 2
      })).forEach(item => {
        item.dateInt = parseInt(item.date.replace(dateReg, ""))
        const itemInChartData = chartData.find(chart => item.date === chart.date)
        if (!itemInChartData) {
          chartData.push(item)
        } else if (itemInChartData.count < item.count) {
          Object.assign(itemInChartData, item)
        }
      })
      chartData.sort((item1, item2) => item1.dateInt - item2.dateInt)
      this.title = `${name}确诊人数趋势图`
      this.chartOption.xAxis[0].data = chartData.map(timeLine => timeLine.date)
      this.chartOption.series[0].data = chartData.map(timeLine => timeLine.count)
    }
  }
</script>

<style scoped>

</style>