<template>
  <div class="feed-back-main">
    <Header :show-back="true" title-text="意见反馈"></Header>
    <div class="container">
      <div class="feed-back-form">
        <div class="title">填写意见</div>
        <van-field v-model="feedBackContent" type="textarea" class="content" placeholder="请填写您的宝贵意见" rows="10" autosize></van-field>
      </div>
      <van-button class="btn-sub" @click="doSub">确定</van-button>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

import mineApi from "@/api/mine";

export default {
  name: "FeedBack",
  components: {
    Header
  },
  data() {
    return {
      feedBackContent: '' // 意见内容
    };
  },
  methods: {
    doSub() {
      mineApi.saveAdvice({busiContent: this.feedBackContent})
      .then(res => {
        if(res.success == 1) {
          this.$toast.success("提交成功，感谢您提出的宝贵意见")
          setTimeout(() => {
            this.$router.go(-1);
          }, 3000);
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.feed-back-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    padding-bottom: 0;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .feed-back-form {
      text-align: left;
      .title {
        padding: 20px 0 16px;
        font-size: $fontSize-s;
        color: #999;
      }
      .content {
        background: rgba(245, 245, 245, .5);
        border: 1px solid rgba(153, 153, 153, .5);
        border-radius: 4px;
      }
    }
    .btn-sub {
      margin-top: 50px;
      @include baseBtn;
    }
  }
}
</style>