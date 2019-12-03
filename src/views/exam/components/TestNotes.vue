<template>
  <div class="test-notes-main">
    <Header :show-back="true" title-text="考试须知"></Header>
    <div class="container">
      <div class="test-detail">
        <p class="test-title">考试科目：{{ examData.paperName }}</p>
        <p
          class="test-time"
        >考试时间：{{ examData.startTime | formatTime }}&nbsp;—&nbsp;{{ examData.endTime | formatTime }}</p>
        <p class="test-user">考试人员：{{userInfo.username}}</p>
        <p class="test-user-count">人员编号：{{userInfo.usercode}}</p>
      </div>
      <div class="notes-content">
        <p>{{ examData.examRemark }}</p>
        <p>{{ examData.paperRemark }}</p>
        <p>确定按钮保存答案，右上方为交卷按钮</p>
        <!-- <p>
          所有网上考试的科目，（09 月 09 日和 10 月 01日之前）期间的任意时间完成都是可以的，每门科目都是最多可以考试五次，大家可以先做一次看下考试题的形式及内容，
          如果大家没有把握考及格的话，可以先把题目用截屏工具把考试题保存下来，然后在百度或者查阅教材查找正确答案，然后在第二次考试的时候来认真完成。（切记：每一门
          网上考试都有一次机会，但是系统是以最后一次交卷为你的最终成绩的，大家一定要注意，而且交完卷后不会像在线测试一样显示成绩和对错的，期末考试成绩会在考后 1 个
          月左右下来）。
        </p> -->
        <!-- <p>在考试过程中，有保存和交卷两个按钮，保存只是保存答案，并不是交卷，如果做完了大家一定要点击交卷才算完成这次考试的。</p>
        <p>
          所有网上考试的科目，（09 月 09 日和 10 月 01日之前）期间的任意时间完成都是可以的，每门科目都是最多可以考试五次，大家可以先做一次看下考试题的形式及内容，
          如果大家没有把握考及格的话，可以先把题目用截屏工具把考试题保存下来，然后在百度或者查阅教材查找正确答案，然后在第二次考试的时候来认真完成。（切记：每一门
          网上考试都有一次机会，但是系统是以最后一次交卷为你的最终成绩的，大家一定要注意，而且交完卷后不会像在线测试一样显示成绩和对错的，期末考试成绩会在考后 1 个
          月左右下来）。
        </p> -->
        <div class="sub-wrapper">
          <van-button class="read-done" @click="goExam">我已阅读</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

import { getUserInfo } from "@/utils/user";
import mixins from "@/mixins/filterTime";

export default {
  name: "TestNotes",
  components: {
    Header
  },
  mixins: [mixins], // 过滤时间
  data() {
    return {
      examData: {},
      userInfo: {}
    };
  },
  created() {
    // console.log('用户信息', getUserInfo());
    // console.log(this.$route.params.exam);
    this.userInfo = getUserInfo().sessionUser;
    this.examData = this.$route.params.exam.examData;
  },
  methods: {
    goExam() {
      this.$router.push({name: 'answerTest', params: { exam: this.$route.params.exam }});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";
.test-notes-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    font-size: 15px;
    color: #333333;
    text-align: left;
    line-height: 24px;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    p {
      margin: 0;
    }
    .test-detail {
      padding: 30px 0;
      border-bottom: 1px solid #dddddd;
    }
    .notes-content {
      margin-top: 30px;
      p {
        text-indent: 2em;
      }
      .sub-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 30px;
        .read-done {
          @include baseBtn;
        }
      }
    }
  }
}
</style>