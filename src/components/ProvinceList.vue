<template>
    <div>
        <el-table
                :data="tableData"
                border
                style="width: 100%"
                row-key="id"
                :tree-props="{children: 'cities', hasChildren: 'hasChildren'}">
            <el-table-column
                    prop="name"
                    label="地区">
            </el-table-column>
            <el-table-column
                    prop="confirmedCount"
                    label="确诊">
            </el-table-column>
            <el-table-column
                    prop="deadCount"
                    label="死亡">
            </el-table-column>
            <el-table-column
                    prop="curedCount"
                    label="治愈">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope" v-if="scope.row.cities">
                    <el-button @click="showGrow(scope.row)" type="primary" size="small">增长图</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  /* eslint-disable no-console,no-unused-vars */

  import {mapState, mapMutations} from 'Vuex'
  import axios from 'axios'

  export default {
    name: "ProvinceList",
    data() {
      return {
        tableData: [],
        showGrowChart: false
      }
    },
    computed: {
      ...mapState(['provinceData', 'timeLineData'])
    },
    methods: {
      ...mapMutations(['setTimeLineData', 'setProvinceData']),
      showGrow: function(row) {
        this.$router.push({name: 'detail', params: row})
      },
      getLatestProvinceData(provinceData) {
        const keysArray = Object.keys(provinceData)
        const dateReg = /\//g
        keysArray.sort((key1, key2) => {
          return parseInt(key1.replace(dateReg, "")) - parseInt(key2.replace(dateReg, ""))
        })
        return provinceData[keysArray[keysArray.length - 1]]
      }
    },
    async mounted() {
      let provinceData = this.provinceData
      if (Object.keys(this.provinceData).length === 0) {
        const {data} = await axios.get('./json/area.json')
        Object.keys(data).forEach(key => {
          const chinaData = {
            name: "全国",
            provinceShortName: "全国",
            cities: [],
            ...data[key].reduce((total, province) => {
              return {
                confirmedCount: total.confirmedCount + province.confirmedCount,
                deadCount: total.deadCount + province.deadCount,
                curedCount: total.curedCount + province.curedCount
              }
            }, {
              confirmedCount: 0,
              deadCount: 0,
              curedCount: 0
            })
          }
          data[key] = [chinaData, ...data[key]]
        })
        this.setProvinceData(data)
        provinceData = data
      }
      let counter = 1
      const latestProvinceData = this.getLatestProvinceData(provinceData)
      this.tableData = latestProvinceData.map(province => ({
        ...province,
        id: counter++,
        name: province.provinceShortName || province.name,
        cities: province.cities.map(city => ({
          ...city,
          id: counter++,
          name: city.cityName
        }))
      }))
      if (this.timeLineData.length === 0) {
        const {data: timeLineData} = await axios.get('./json/timeline.json')
        this.setTimeLineData(timeLineData)
      }
    }
  }
</script>

<style scoped>

</style>