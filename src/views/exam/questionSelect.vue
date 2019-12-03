<template>
  <div class="question-select-main">
    <Header :show-back="true" title-text="试题选择"></Header>
    <div class="container">
      <ul class="questions" v-if="findList && findList.length > 0">
        <li
          v-for="find in findList"
          :key="find.codeVal"
          @click="goExam(find)"
          class="questions-item"
          v-active
        >
          <span class="icon"></span>
          <span class="text">{{ find.codeName }}</span>
        </li>
        <!-- 元素占位 -->
        <li class="questions-item hidden"></li>
      </ul>
      <No-data v-else></No-data>
    </div>
    <!-- act图片加载 解决切换背景图闪烁问题 -->
    <ul class="img-list">
      <li v-for="(item, index) in 5" :key="index"></li>
    </ul>
  </div>
</template>

<script>
import NoData from '@/components/NoData';
import Header from "@/components/Header";

import examApi from "@/api/exam";

import mixins from '@/mixins/linkActive';

export default {
  name: "QuestionSelect",
  components: {
    NoData,
    Header
  },
  mixins: [mixins],
  data() {
    return {
      isWrongType: false,
      testClassify: "", //  区分考试类型
      findList: [], // 分类列表
      item: {}
    };
  },
  created() {
    this.__init();
  },
  methods: {
    __init() {
      this.isWrongType = this.$route.params.type; // 是否时模拟考试
      this.$toast.loading({
        mask: true,
        message: "加载中"
      });
      examApi
        .getExamFind({})
        .then(res => {
          if (res.success == 1) {
            this.$toast.clear();
            this.findList = res.data;
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
        });
    },
    goExam(find) {
      console.log(find);
      var param = {
        quType: find.codeVal
      };
      examApi
        .getFindList(param)
        .then(res => {
          if(res.success == 1) {
            this.item = res.data;
            var param = {
              isCheck: true,
              isPractice: true,
              isTestEaxm: true,
              examData: this.item
            };
            this.$router.push({ name: "answerTest", params: { exam: param } });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.question-select-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    overflow: auto;
    .questions {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 103px;
      padding: 0 30px;
      box-sizing: border-box;
      overflow: hidden;
      .questions-item {
        display: flex;
        flex-direction: column;
        margin-bottom: 36px;
        width: 80px;
        font-size: 14px;
        color: $fontColor;
        &:nth-child(1) {
          .icon {
            background-image: url("~@/assets/imgs/test/question/select@2x.png");
          }
        }
        &:nth-child(2) {
          .icon {
            background-image: url("~@/assets/imgs/test/question/selects@2x.png");
          }
        }
        &:nth-child(3) {
          .icon {
            background-image: url("~@/assets/imgs/test/question/fill@2x.png");
          }
        }
        &:nth-child(4) {
          .icon {
            background-image: url("~@/assets/imgs/test/question/answer@2x.png");
          }
        }
        &:nth-child(5) {
          .icon {
            background-image: url("~@/assets/imgs/test/question/judge@2x.png");
          }
        }
        &.hidden {
          visibility: hidden;
        }
        .text {
          margin-top: 19px;
        }
        .icon {
          width: 100%;
          height: 80px;
          background: center no-repeat;
          background-size: cover;
        }
        &.active {
          .text {
            color: $baseColor;
          }
          &:nth-child(1) {
            .icon {
              background-image: url("~@/assets/imgs/test/question/select-act@2x.png");
            }
          }
          &:nth-child(2) {
            .icon {
              background-image: url("~@/assets/imgs/test/question/selects-act@2x.png");
            }
          }
          &:nth-child(3) {
            .icon {
              background-image: url("~@/assets/imgs/test/question/fill-act@2x.png");
            }
          }
          &:nth-child(4) {
            .icon {
              background-image: url("~@/assets/imgs/test/question/answer-act@2x.png");
            }
          }
          &:nth-child(5) {
            .icon {
              background-image: url("~@/assets/imgs/test/question/judge-act@2x.png");
            }
          }
        }
      }
    }
  }
  .img-list {
    visibility: hidden;
    li {
      width: 20px;
      height: 20px;
      background: center no-repeat;
      background-size: cover;
      &:nth-child(1) {
        background-image: url("~@/assets/imgs/test/question/select-act@2x.png");
      }
      &:nth-child(2) {
        background-image: url("~@/assets/imgs/test/question/selects-act@2x.png");
      }
      &:nth-child(3) {
        background-image: url("~@/assets/imgs/test/question/fill-act@2x.png");
      }
      &:nth-child(4) {
        background-image: url("~@/assets/imgs/test/question/answer-act@2x.png");
      }
      &:nth-child(5) {
        background-image: url("~@/assets/imgs/test/question/judge-act@2x.png");
      }
    }
  }
}
</style>