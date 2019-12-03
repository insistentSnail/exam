<template>
  <div class="vacation-main">
    <Header :show-back="true" title-text="请假"></Header>
    <div class="container">
      <ul class="vacation-list">
        <li class="vacation-item type has-arr">
          <van-field
            v-model="attendanceInfo.type"
            @click="typeShow=true"
            label="请假类型"
            placeholder="请选择请假类型"
            readonly
          ></van-field>
          <van-popup v-model="typeShow" position="bottom">
            <van-picker
              show-toolbar
              title="请选择请假类型"
              :columns="vacationType"
              @cancel="typeShow = false"
              @confirm="confirmType"
            />
          </van-popup>
        </li>
        <li class="vacation-item start has-arr">
          <van-field
            v-model="attendanceInfo.starttime"
            @click="startShow=true"
            label="开始时间"
            placeholder="请选择开始时间"
            readonly
            class="time-pciker"
          ></van-field>
          <van-popup v-model="startShow" position="bottom">
            <van-datetime-picker
              title="请选择开始时间"
              type="datetime"
              :min-date="minDate"
              :max-date="maxDate"
              @cancel="startShow = false"
              @confirm="confirmStart"
              :formatter="formatDate"
            />
          </van-popup>
        </li>
        <li class="vacation-item end has-arr">
          <van-field
            v-model="attendanceInfo.endtime"
            @click="endShow=true"
            label="结束时间"
            placeholder="请选择结束时间"
            readonly
            class="time-pciker"
          ></van-field>
          <van-popup v-model="endShow" position="bottom">
            <van-datetime-picker
              title="请选择结束"
              type="datetime"
              :min-date="minDate"
              :max-date="maxDate"
              @cancel="endShow = false"
              @confirm="confirmEnd"
              :formatter="formatDate"
            />
          </van-popup>
        </li>
        <li class="vacation-item day">
          <van-field v-model="attendanceInfo.days" label="请假天数" placeholder="请填写请假天数"></van-field>
        </li>
        <li class="vacation-item reason">
          <div class="label">请假事由</div>
          <van-field
            v-model="attendanceInfo.reason"
            type="textarea"
            placeholder="请填写请假事由"
            rows="1"
            autosize
          ></van-field>
        </li>
      </ul>
      <div class="sub-wrapper">
        <van-button class="btn-sub" @click="doSub">提交</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

import mineApi from "@/api/mine";
import mixins from "@/mixins/timerPicker";
import { getUserInfo } from "@/utils/user";

export default {
  name: "attendance",
  components: {
    Header
  },
  mixins: [mixins],
  data() {
    return {
      attendanceInfo: {},
      typeShow: false,
      startShow: false,
      endShow: false,
      vacationType: ["请假", "休班", "换班", "加班"],
      minDate: new Date("2019-01-01"),
      maxDate: new Date("2100-01-01"),
      vacation: {}
    };
  },
  created() {
    
  },
  methods: {
    confirmType(val) {
      this.attendanceInfo.type = val;
      this.typeShow = false;
    },
    confirmStart(val) {
      this.attendanceInfo.starttime = this.getTime(val);
      this.startShow = false;
    },
    confirmEnd(val) {
      this.attendanceInfo.endtime = this.getTime(val);
      this.endShow = false;
    },
    doSub() {
      if(!this.attendanceInfo.type || !this.attendanceInfo.starttime || !this.attendanceInfo.endtime || !this.attendanceInfo.days || !this.attendanceInfo.reason) {
        this.$toast.fail("请填写完成请假信息");
      }else {
        this.attendanceInfo.type = this.formatType(this.attendanceInfo.type);
        
        console.log(this.attendanceInfo);
        mineApi
          .saveAttendance(this.attendanceInfo)
          .then(res => {
            // console.log(res);
            if(res.success == 1) {
              this.$toast.success("提交成功");
              setTimeout(() => {
                this.$router.go(-1);
              }, 3000);
            }else {
              this.$toast.fail("提交失败，请重试")
            }
          })
          .catch(err => {
            this.$toast.fail("提交失败，请重试")
            console.log(err);
          });
      }
    },
    formatType(type) {
      switch (type) {
        case "请假":
          return 22
          break;
        case "休假":
          return 23
          break;
        case "换班":
          return 24
          break;
        case "加班":
          return 25
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.vacation-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .vacation-list {
      .vacation-item {
        height: 44px;
        line-height: 44px;
        font-size: 12px;
        text-align: left;
        border-bottom: 1px solid #eeeeee;
        .van-cell:not(:last-child)::after {
          display: none;
        }
        .label {
          color: #999;
        }
        &.reason {
          padding: 16px 0;
          height: unset;
          line-height: unset;
          .van-cell {
            margin-top: 12px;
            ::v-deep.van-field__control {
              text-align: left;
              line-height: 22px;
            }
          }
        }
        &.has-arr {
          .van-cell {
            background: url("~@/assets/imgs/mine/arr-l@2x.png") right center
              no-repeat;
            background-size: 10px;
            ::v-deep.van-field__control {
              padding-right: 20px;
            }
          }
        }
        .van-cell {
          display: flex;
          align-items: center;
          padding: 0;
          height: 100%;
          ::v-deep.van-cell__title {
            font-size: 12px;
            color: #999;
          }
          ::v-deep.van-field__control {
            font-size: 16px;
            color: #333;
            text-align: right;
            &::-webkit-input-placeholder {
              color: #ccc;
            }
            &:-moz-placeholder {
              /* Firefox 18- */
              color: #ccc;
            }
            &::-moz-placeholder {
              /* Firefox 19+ */
              color: #ccc;
            }
            &:-ms-input-placeholder {
              color: #ccc;
            }
          }
        }
        .van-popup {
          height: 275px;
          ::v-deep.van-picker {
            .van-picker__cancel {
              font-size: 14px;
              color: #999;
            }
            .van-picker__confirm {
              font-size: 14px;
              color: $baseColor;
            }
            .van-picker__title {
              font-size: 16px;
              color: #333;
            }
          }
        }
      }
    }
    @include bottomBtn;
  }
}
</style>