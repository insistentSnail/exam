<template>
  <div class="login-main">
    <div class="avatar">
      <van-image
        v-if="userInfo.photo" :src="url + userInfo.photo" alt=""
      ></van-image>
      <img v-else src="@/assets/imgs/no_data/avatar.png" alt="">
    </div>
    <div class="form">
      <van-field
        v-model.trim="userForm.userCode"
        @blur="checkName"
        :error-message="nameErrMsg"
        clearable
        placeholder="用户名"
        class="name"
      ></van-field>
      <van-field
        v-model.trim="userForm.userPwd"
        @blur="checkPass"
        :error-message="userPwdErrMsg"
        clearable
        placeholder="密码"
        class="password"
        type="password"
      ></van-field>
      <van-button class="btn-login" @click="doLogin">登录</van-button>
    </div>
    <!-- <div class="forget-wrapper">
      <router-link :to="{name: ''}" tag="span" class="forget">忘记密码</router-link>
      <span class="line"></span>
      <router-link :to="{name: ''}" tag="span" class="register">快速注册</router-link>
    </div> -->
  </div>
</template>

<script>
import _ from "lodash";

import {URL} from '@/api/url';
import loginApi from "@/api/login";

import { mapState, mapMutations } from 'vuex';
import { setUserInfo, getUserInfo } from "@/utils/user";

export default {
  name: "Login",
  data() {
    return {
      url: URL,
      userReg: /^[a-zA-Z0-9_-]{4,16}$/,
      passWordReg: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/,
      userForm: {
        userCode: "",
        userPwd: ""
      },
      userInfo: {},
      nameErrMsg: "",
      userPwdErrMsg: ""
    };
  },
  created() {
    this.getUserInfo();
  },
  computed: {
    ...mapState('user', {
      userFormVuex: state => state.userForm
    })
  }, 
  methods: {
    ...mapMutations('user', ['setUserForm']),
    getUserInfo() {
      if(getUserInfo()) {
        this.userInfo = getUserInfo().sessionUser;
        this.userForm = this.userFormVuex;
      }
    },
    checkName() {
      this.nameErrMsg = !this.userForm.userCode
        ? "请输入用户名"
        : this.userReg.test(this.userForm.userCode)
        ? ""
        : "请输入正确的用户名";
    },
    checkPass() {
      this.userPwdErrMsg = !this.userForm.userPwd
        ? "请输入密码"
        : this.passWordReg.test(this.userForm.userPwd)
        ? ""
        : "必须包含字母、数字，长度为6-16个字符";
    },
    doLogin: _.debounce(function() {
      //  防抖检测
      this.checkName();
      this.checkPass();
      if (this.userForm.userCode && this.userForm.userPwd && !this.userPwdErrMsg && !this.nameErrMsg) {
        this.$toast.loading({
          message: '登录中，请稍后...',
          forbidClick: true
        })
        loginApi
          .doLogin(this.userForm)
          .then(res => {
            this.$toast.clear()
            if(res.success === 1) {
              //  登录成功，本地保存token
              setUserInfo(res.data)
              this.setUserForm(this.userForm);
              //  跳转到首页
              this.$router.replace({name: 'home'})
            }else {
              //  登陆错误状态
              this.$toast.fail(res.msg)
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }, 500)
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.login-main {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  .avatar {
    position: absolute;
    top: 82px;
    left: 50%;
    // margin-top: 82px;
    width: 100px;
    height: 100px;
    transform: translateX(-50%);
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
            width: 100px;
            height: 100px;
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
  .form {
    position: absolute;
    top: 238px;
    left: 50%;
    width: 300px;
    transform: translateX(-50%);
    .van-cell {
      position: relative;
      height: 48px;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #eee;
      ::v-deep.van-cell__value {
        overflow: visible;
      }
      ::v-deep.van-field__control {
        text-indent: 36px;
      }
      ::v-deep.van-field__clear {
        width: 16px;
        height: 16px;
        line-height: 16px;
      }
      &::after {
        display: none;
      }
      &::before {
        position: absolute;
        content: "";
        width: 16px;
        height: 16px;
        @include bgImage;
      }
      &.name {
        &::before {
          background-image: url("~@/assets/imgs/login/user.png");
        }
      }
      &.password {
        margin-top: 20px;
        &::before {
          background-image: url("~@/assets/imgs/login/lock.png");
        }
      }
    }
  }
  .btn-login {
    margin-top: 42px;
    @include baseBtn;
  }
  .forget-wrapper {
    display: flex;
    align-items: center;
    margin-top: 193px;
    .forget {
      margin-right: $basePadding;
    }
    .line {
      width: 1px;
      height: 70%;
      background: #000;
    }
    .register {
      margin-left: $basePadding;
    }
  }
}
</style>