<template>
  <div class="test-exam-main">
    <Header :show-back="true" title-text="模拟考试"></Header>
    <div class="container">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <ul v-if="examList && examList.length > 0" class="test-exam-list">
          <li v-for="exam in examList" :key="exam.paperId" @click="goExam(exam)" class="test-exam-item">
            <span class="exam-title">{{ exam.paperName }}</span>
          </li>
        </ul>
        <No-data v-else></No-data>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import NoData from '@/components/NoData';
import Header from "@/components/Header";

import examApi from "@/api/exam";

export default {
  name: "TestExam",
  components: {
    NoData,
    Header
  },
  data() {
    return {
      isLoading: false,
      examList: [],
    };
  },
  created() {
    this.$toast.loading({
      mask: true,
      message: '加载中'
    })
    this.__init();
  },
  methods: {
    __init() {
      examApi.getExamList({})
      .then(res => {
        this.isLoading = false;
        this.$toast.clear();
        if(res.success == 1) {
          this.examList = res.data;
        }
      })
      .catch(err => {
        this.isLoading = false;
        this.$toast.clear();
        this.$toast.fail('网络请求失败,请重试');
        console.log(err);
      })
    },
    onRefresh() {
      this.__init();
    },
    goExam(exam) {
      var param = {
        isTestEaxm: true,
        examData: exam
      }
      this.$router.push({name: 'answerTest', params: {exam: param}})
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.test-exam-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle();
    padding-bottom: 0;
    .van-pull-refresh {
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      ::v-deep.van-pull-refresh__track {
        height: 100%;
      }
    }
    .test-exam-list {
      .test-exam-item {
        display: flex;
        align-items: center;
        height: 58px;
        font-size: 18px;
        color: #333;
        text-align: left;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
      }
    }
  }
}
</style>