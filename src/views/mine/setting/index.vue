<template>
  <div class="setting-main">
    <Header :show-back="true" title-text="设置"></Header>
    <div class="container">
      <ul class="setting-list">
        <router-link :to="{name: 'changePwd'}" class="setting-item has-arr" tag="li">
          <p class="title">修改密码</p>
        </router-link>
        <router-link :to="{name: 'feedBack'}" class="setting-item has-arr" tag="li">
          <p class="title">意见反馈</p>
        </router-link>
        <li class="setting-item" tag="li">
          <p class="title">关于</p>
          <div class="content">{{ version }}</div>
        </li>
      </ul>
      <!-- 退出按钮 -->
      <van-button @click="doLogout" class="out">退出</van-button>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

import { removeUserInfo } from '@/utils/user';

export default {
  name: "Setting",
  components: {
    Header
  },
  data() {
    return {
      version: "v1.0.0"
    };
  },
  methods: {
    doLogout() {
      removeUserInfo(); // 清除本地token
      this.$router.replace({name: 'login'});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.setting-main {
  width: 100%;
  height: 100%;
  .container {
    padding-top: $headerHeight;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    p {
      margin: 0;
    }
    .setting-list {
      .setting-item {
        padding: 0 16px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        border-bottom: 1px solid #eeeeee;
        box-sizing: border-box;
        overflow: hidden;
        transition: all .2s ease;
        &:active {
          background: $activeColor;
        }
        .title {
          font-size: $fontSize-m-l;
          color: #333;
        }
        .content {
          font-size: $fontSize-m-s;
          color: #999;
        }
        &.has-arr {
          .content {
            margin-right: 20px;
          }
          &::after {
            position: absolute;
            top: 50%;
            right: 16px;
            content: "";
            width: 10px;
            height: 10px;
            background: center no-repeat;
            background-image: url("~@/assets/imgs/mine/arr-l@2x.png");
            background-size: cover;
            transform: translateY(-50%);
          }
        }
      }
    }
    .out {
      margin-top: 20px;
      @include baseBtn;
      background: $falseColor;
    }
  }
}
</style>