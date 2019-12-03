<template>
  <div class="change-name-main">
    <Header :show-back="true" title-text="修改姓名"></Header>
    <div class="container">
      <div class="input-wrapper">
        <van-field v-model="username" placeholder="请输入新的姓名" class="name-input">
        </van-field>
      </div>
      <div class="sub-wrapper">
        <van-button :disabled="canClick" @click="doChange" class="btn-sub" :class="{disable: canClick}">确定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

import userApi from "@/api/user";

export default {
  name: 'ChangeName',
  components: {
    Header
  },
  data() {
    return {
      username: ''
    }
  },
  computed: {
    canClick() {
      return this.username ? false : true;
    }
  },
  methods: {
    doChange() {
      userApi.changeInfo({username: this.username})
      .then(res => {
        if(res.success === 1) {
          this.$toast.success(res.msg)
          setTimeout(() => {
            this.$router.replace({name: 'userInfo'})
          }, 3000)
        }else {
          this.$toast.fail(res.msg)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.change-name-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    padding-bottom: 0;
    .input-wrapper {
      padding: 0 22px;
      box-sizing: border-box;
      .name-input {
        display: flex;
        align-items: center;
        padding: 0;  
        height: 50px;
        font-size: 15px;
        border-bottom: 1px solid #EEE;
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