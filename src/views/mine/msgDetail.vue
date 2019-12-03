<template>
  <div class="msg-detail-main">
    <Header :show-back="true" :hide-border="true" :title-text="msgInfo.msgTitle"></Header>
    <div class="container">
      <div class="time">{{ msgInfo.sendTime | formatTime }}</div>
      <div class="content">
        <p v-html="msgInfo.msgContent"></p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

import mixins from "@/mixins/filterTime";

export default {
  name: "MsgDetail",
  components: {
    Header
  },
  mixins: [mixins],
  data() {
    return {
      msgInfo: {}
    };
  },
  created() {
    this.msgInfo = this.$route.params.msg;
    console.log('消息详情',this.msgInfo);
  },
  methods: {
    init() {}
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.msg-detail-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    padding-bottom: 0;
    font-size: 14px;
    color: #555;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .time {
      font-size: 12px;
      color: #999;
    }
    .content {
      margin-top: 20px;
      width: 100%;
      font-size: 14px;
      color: #555;
      line-height:22px;
      text-align: left;
      text-indent: 2em;
      border-top: 1px solid #eee;
      word-wrap: break-word;
      p {
        margin-top: 20px;
      }
    }
  }
}
</style>