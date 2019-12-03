<template>
  <div class="work-table-main">
    <Header :show-back="true" title-text="排班"></Header>
    <div class="container">
      <el-table :data="counterData.dataList" border style="width: 100%">
        <el-table-column label="日期\柜台" prop="dateName" :formatter="formatDate" width="90" fixed align="center"></el-table-column>
        <el-table-column
          v-for="(item, index) in counterData.dataHead" :key="index"
          :prop="`userName_${index}`"
          :label="item"
          size="auto"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row[`userName_${reutnMock(index)}`] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

import mineApi from "@/api/mine";

export default {
  name: "workTable",
  components: {
    Header
  },
  data() {
    return {
      counterData: [],
      startDate: null,
      endDate: null
    };
  },
  created() {
    this.getWeekDate();
    this.__init();
  },
  methods: {
    reutnMock(index) {
      return index.substr(index.length-1 ,1);
    },
    __init() {
      let params = {
        startDate: this.startDate,
        endDate: this.endDate
      }
      mineApi.getWorkDayInfo(params)
      .then(res => {
        if(res.success === 1) {
          this.counterData = res.data;
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    getWeekDate() {
      var now = new Date();
      var nowTime = now.getTime();
      var day = now.getDay(); // 周几
      var oneDayTime = 24 * 60 * 60 * 1000;
      
      var monday = new Date(nowTime - (day - 1) * oneDayTime); // 周一
      var sunday = new Date(nowTime + (7 - day) * oneDayTime); // 周日

      this.startDate = this.getTime(monday);
      this.endDate = this.getTime(sunday);
    },
    formatWeek(row) {
      var week = new Date(row.dateName).getDay();
      switch (week) {
        case 0:
          return '星期日'
          break;
        case 1:
          return '星期一'
          break;
        case 2:
          return '星期二'
          break;
        case 3:
          return '星期三'
          break;
        case 4:
          return '星期四'
          break;
        case 5:
          return '星期五'
          break;
        case 6:
          return '星期六'
          break;
      }
    },
    formatDate(row) {
      return row.dateName.substring(5).replace("-","月");
    },
    formatTime(time) {
      //  格式化日期
      return time < 10 ? `0${time}` : time;
    },
    getTime(date) {
      //  格式化当前时间
      var year = date.getFullYear();
      var month = this.formatTime(date.getMonth() + 1);
      var day = this.formatTime(date.getDate());
      return `${year}-${month}-${day}`;
    },
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.work-table-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    padding-bottom: 0;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .el-table {
      margin-top: 11px;
    }
  }
}
</style>