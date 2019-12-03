<template>
  <div class="change-tel-main">
    <Header :show-back="true" title-text="修改手机号"></Header>
    <div class="container">
      <div class="cur-tel-wrapper">
        <div class="tel">您当前的手机号：13566666666</div>
        <div class="tip">换绑手机号需要获取新手机号的短信验证码</div>
      </div>
      <div class="input-wrapper">
        <van-field v-model="newTel" placeholder="请输入新手机号" class="tel-input">
        </van-field>
        <van-field v-model="authCode" placeholder="请输入验证码" class="auth-input">
          <van-button slot="button" size="small" type="primary" class="get-code">获取验证码</van-button>
        </van-field>
      </div>
      <div class="sub-wrapper">
        <van-button :disabled="canClick" class="btn-sub" :class="{disable: canClick}">确定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

export default {
  name: 'ChangeTel',
  components: {
    Header
  },
  data() {
    return {
      newTel: '',
      authCode: ''
    }
  },
  computed: {
    canClick() {
      return this.newTel && this.authCode ? false : true;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.change-tel-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    padding-bottom: 0;
    .cur-tel-wrapper {
      margin-top: 30px;
      font-size: 16px;
      color: #333;
      .tip {
        margin-top: 8px;
        font-size: 10px;
        color: #999;
      }
    }
    .input-wrapper {
      margin-top: 40px;
      padding: 0 22px;
      font-size: 15px;
      color: #ccc;
      box-sizing: border-box;
      .van-cell:not(:last-child)::after {
        display: none;
      }
      .tel-input,
      .auth-input {
        display: flex;
        align-items: center;
        padding: 0;  
        height: 50px;
        font-size: 15px;
        border-bottom: 1px solid #EEE;
      }
      .auth-input {
        .get-code {
          padding-left: 12px;
          height: 100%;
          font-size: 15px;
          color: $baseColor;
          line-height: 24px;
          border: none;
          border-left: 1px solid #CCCCCC;
          background: #fff;
        }
      }
    }
    .sub-wrapper {
      margin-top: 50px;
      .btn-sub {
        width: 300px;
        height: 48px;
        font-size: 15px;
        color: #fff;
        border-radius: 4px;
        background: $baseColor;
        &.disable {
          background: #DDDDDD;
        }
      }
    }
  }
}
</style>