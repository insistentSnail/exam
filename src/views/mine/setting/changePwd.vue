<template>
  <div class="change-pass-main">
    <Header :show-back="true" title-text="修改密码"></Header>
    <div class="container">
      <div class="pass-form">
        <van-field v-model="pwdForm.oldPwd" placeholder="请输入原密码" type="password"></van-field>
        <van-field v-model="pwdForm.newPwd" placeholder="请输入新密码" type="password"></van-field>
        <van-field
          v-model="newPwd2"
          placeholder="请再次输入新密码"
          type="password"
          :error-message="passError"
          @focus="passError = ''"
        ></van-field>
      </div>
      <van-button class="btn-sub" @click="doChangePwd">确定</van-button>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

import userApi from "@/api/user";

export default {
  name: "changePass",
  components: {
    Header
  },
  data() {
    return {
      pwdForm: {
        oldPwd: "",
        newPwd: ""
      },
      newPwd2: "",
      passError: ""
    };
  },
  methods: {
    doChangePwd() {
      if(!this.pwdForm.newPwd || !this.pwdForm.oldPwd || !this.newPwd2) {
        this.$toast.fail("请填写完整密码信息")
      }else {
        //  检查两次新密码输入是否一致
        if (this.pwdForm.newPwd != this.newPwd2) {
          this.passError = "两次输入密码不一致";
        } else {
          userApi.changePwd(this.pwdForm)
          .then(res => {
            //  操作提示信息
            if(res.success === 1) {
              // 成功重新登陆
              this.$toast.success(res.msg)
              setTimeout(() => {
                this.$router.replace({name: 'login'})
              }, 3000)
            }
          })
          .catch(err => {
            console.log(err)
          })
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.change-pass-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    padding-bottom: 0;
    .pass-form {
      padding: 0 22px;
      box-sizing: border-box;
      .van-cell {
        display: flex;
        align-items: center;
        padding: 0;
        height: 50px;
        border-bottom: 1px solid #eeeeee;
        &::after {
          display: none;
        }
        ::v-deep.van-field__control {
          font-size: $fontSize-m-s;
        }
      }
    }
    .btn-sub {
      margin-top: 50px;
      @include baseBtn;
    }
  }
}
</style>