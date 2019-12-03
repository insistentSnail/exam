<template>
  <div class="mine-main">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="user-info-wrapper">

        <!-- 用户头像和信息 -->
        <router-link :to="{name: 'userInfo'}" class="user-info" tag="div">
          <div class="avatar">
            <van-image
              v-if="userInfo.photo" :src="url + userInfo.photo" alt="头像"
            ></van-image>
            <img v-else src="@/assets/imgs/no_data/avatar.png" alt="">
          </div>
          <div class="info-wrapper">
            <p class="name">{{ userInfo.username }}</p>
            <p class="duty">{{userTypeName}}</p>
          </div>
        </router-link>

        <!-- 考勤情况 -->
        <div class="attendance-wrapper">
          <!-- 骨架屏区域 -->
          <van-skeleton :row="1" row-width="24" :loading="loading" />
          <van-skeleton :row="1" row-width="24" :loading="loading" />
          <van-skeleton :row="1" row-width="24" :loading="loading" />
          <!-- 骨架屏区域 -->

          <div v-for="(item, index) in attendance" :key="index" class="day-wrapper">
            <div class="count-wrapper">
              <p class="count">{{item.days}}</p>
              <p class="unit">天</p>
            </div>
            <p class="text">{{formatName(item.type)}}</p>
          </div>
        </div>
      </div>

      <!-- 功能列表 -->
      <ul class="func-list">
        <router-link :to="{name: 'message'}" class="func-item" tag="li">
          <span class="icon icon-msg"></span>
          <p class="text">我的消息</p>
        </router-link>
        <router-link :to="{name: 'taskList'}" class="func-item" tag="li">
          <span class="icon icon-gd"></span>
          <p class="text">我的工单</p>
        </router-link>
        <router-link :to="{name: 'createRepair'}" class="func-item" tag="li">
          <span class="icon icon-bx"></span>
          <p class="text no-border">设备报修</p>
        </router-link>
        <router-link :to="{name: 'workTable'}" class="func-item" tag="li">
          <span class="icon icon-pb"></span>
          <p class="text">排班记录</p>
        </router-link>
        <router-link :to="{name: 'attendance'}" class="func-item" tag="li">
          <span class="icon icon-vacation"></span>
          <p class="text">请假</p>
        </router-link>
        <li @click="goWrongList" class="func-item">
          <span class="icon icon-error"></span>
          <p class="text no-border">我的错题集</p>
        </li>
        <router-link :to="{name: 'setting'}" class="func-item" tag="li">
          <span class="icon icon-setting"></span>
          <p class="text">设置</p>
        </router-link>
      </ul>

    </van-pull-refresh>
  </div>
</template>

<script>
import { URL } from "@/api/url";

import examApi from "@/api/exam";
import mineApi from "@/api/mine";
import userApi from "@/api/user";

export default {
  name: "mine",
  data() {
    return {
      url: URL,
      isLoading: false,
      loading: true,
      userInfo: {},
      userTypeName: '', // 用户职位
      attendance: []
    };
  },
  created() {
    this.__init();
    this.getAttendance(); // 出勤情况
  },
  methods: {
    __init() {
      userApi.getUserInfo({})
      .then(res => {
        this.loading = false; // 骨架区域控制
        if(res.success == 1) {
          this.userInfo = res.data;
        }
        return mineApi.getCode({typeCode: 'UserType'})
      })
      .then(res => {
        if(res.success == 1) {
          this.isLoading = false;
          this.userTypeList = res.data;
          var user = this.userTypeList.find(item => item.codeVal == this.userInfo.usertype)
          this.userTypeName = user.codeName;
        }
      })
      .catch(err => {
        this.isLoading = false;
        console.log(err);
      })
    },
    getAttendance() {
      mineApi.getCurMonWorkInfo({})
      .then(res => {
        //  考勤情况
        if(res.success == 1) {
          // console.log(res.data);
          this.attendance = res.data
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    goWrongList() {
      examApi.getWrongList({})
      .then(res => {
        var param = {
          isPractice: true,
          isTestExam: true,
          isWrongType: true,
          examData: res.data
        }
        this.$router.push({name: 'answerTest', params: {exam: param}});
      })
      .catch(err => {
        console.log(err);
      })
    },
    onRefresh() {
      this.__init();
    },
    formatName(type) {
      switch (type) {
        case 0:
          return '请假'
          break;
        case 1:
          return '上班'
          break;
        case 2:
          return '休假'
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.mine-main {
  width: 100%;
  height: 100%;
  .van-pull-refresh {
    padding-bottom: $footerHeight;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .user-info-wrapper {
      padding: 30px 16px;
      box-sizing: border-box;
      .van-skeleton {
        .van-skeleton__row {
          height: 20px;
        }
      }
      .user-info {
        display: flex;
        background: url("~@/assets/imgs/mine/arr-l@2x.png") right center no-repeat;
        background-size: 10px;
        .avatar {
          width: 64px;
          height: 64px;
          ::v-deep.van-image {
            width: 100%;
            height: 100%;
            img {
              border-radius: 50%;
            }
            .van-image__error {
              .van-icon {
                &::before {
                  display: block;
                  width: 64px;
                  height: 64px;
                  content: '';
                  @include bgImage;
                  background-image: url("~@/assets/imgs/no_data/avatar.png")
                }
              }
            }
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .info-wrapper {
          display: flex;
          flex-direction: column;
          margin-left: 16px;
          p {
            margin: 0;
            &.name {
              margin-top: 10px;
              text-align: left;
              font-size: 18px;
              color: #333333;
            }
            &.duty {
              margin-top: 8px;
              padding: 4px 10px;
              font-size: 10px;
              color: #555;
              border-radius: 100px;
              background: #eeeeee;
            }
          }
        }
      }
      .attendance-wrapper {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
        padding: 0 63px;
        width: 100%;
        box-sizing: border-box;

        /* 骨架显示 */
        .van-skeleton {
          width: 24px;
          height: 50px;
          .van-skeleton__row {
            height: 50px;
          }
        }
        /* 骨架显示 */

        .day-wrapper {
          margin: 0;
          font-size: 0;
          color: #333;
          .count-wrapper {
            display: flex;
            align-items: center;
            font-size: 24px;
            text-align: right;
            .unit {
              margin-top: 8px;
              font-size: 12px;
            }
          }
          .text {
            font-size: 12px;
            margin-top: 10px;
          }
        }
      }
    }
    .func-list {
      padding-top: 10px;
      width: 100%;
      background: #f5f5f5;
      .func-item {
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 16px;
        height: 50px;
        font-size: 16px;
        color: #333;
        text-align: left;
        line-height: 50px;
        background: #fff;
        border: none;
        box-sizing: border-box;
        transition: all .2s ease;
        &:active {
          background: $activeColor;
        }
        .icon {
          width: 21px;
          height: 21px;
          background: center no-repeat;
          background-size: 19px 19px;
        }
        p {
          margin: 0;
          &.text {
            margin-left: 16px;
            width: calc(100% - 16px);
            height: 49px;
            border-bottom: 1px solid #eeeeee;
          }
          &.no-border {
            border: none;
          }
        }
        &::after {
          position: absolute;
          content: "";
          top: 50%;
          @include bgImage;
          transform: translateY(-50%);
          right: $basePadding;
          width: 10px;
          height: 10px;
          background-image: url("~@/assets/imgs/mine/arr-l@2x.png");
        }
        &:nth-child(1) {
          .icon {
            background-image: url("~@/assets/imgs/mine/msg@2x.png");
          }
        }
        &:nth-child(2) {
          .icon {
            background-image: url("~@/assets/imgs/mine/gongdan@2x.png");
          }
        }
        &:nth-child(3) {
          .icon {
            background-image: url("~@/assets/imgs/mine/baoxiu@2x.png");
          }
        }
        &:nth-child(4) {
          margin-top: 10px;
          .icon {
            background-image: url("~@/assets/imgs/mine/paiban@2x.png");
          }
        }
        &:nth-child(5) {
          .icon {
            background-image: url("~@/assets/imgs/mine/qingjia@2x.png");
          }
        }
        &:nth-child(6) {
          .icon {
            background-image: url("~@/assets/imgs/mine/error@2x.png");
          }
        }
        &:nth-child(7) {
          margin-top: 10px;
          .icon {
            background-image: url("~@/assets/imgs/mine/setting@2x.png");
          }
        }
      }
    }
  }
}
</style>