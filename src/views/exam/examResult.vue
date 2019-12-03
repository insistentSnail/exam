<template>
  <div class="test-result-main" :class="{fail: (testResult.userScore || testResult.userScore == 0) && testResult.userScore < testResult.passScore}">
    <!-- 头部 -->
    <!-- 主体 -->
    <div class="container">
      <!-- 考试得分 -->
      <div class="score-wrapper">
        <div class="count">{{ testResult.userScore == 0 ? '0分' : (testResult.userScore ? `${testResult.userScore}分` : '阅卷中') }}</div>
        <div class="text">{{ testResult.userScore == 0 ? '本次考试成绩' : (testResult.userScore ? '本次考试成绩' : '请耐心等待') }}</div>
      </div>
      <!-- 考试结果详情 -->
      <div class="result-detail">
        <!-- 正确率 -->
        <div class="accuracy-wrapper">
          <p class="count-wrapper">
            <span class="count">{{ testResult.isTestType || testResult.isCheck && !testResult.cantCheck ? Math.ceil(testResult.trueCount / testResult.totalCount * 100) : "*" }}</span><span class="unit">%</span>
          </p>
          <p class="text">正确率</p>
        </div>
        <!-- 考试用时 -->
        <div class="test-time">
          <p class="count-wrapper">
            <span class="count">{{ Math.ceil(testResult.useTime/60/1000) }}</span><span class="unit">min</span>
          </p>
          <p class="text">考试用时</p>
        </div>
        <!-- 考试排名 -->
        <div class="test-rank">
          <p class="count-wrapper">
            <span class="count">{{ testResult.isTestType || testResult.isCheck && !testResult.cantCheck ? testResult.falseCount : "*" }}</span><span class="unit">题</span>
          </p>
          <p class="text">错题数</p>
        </div>
      </div>
      <!-- 查看试题 -->
      <div class="btn-view-wrapper">
        <van-button class="btn-view" @click="doNext">{{ testResult.exam ? "查看试卷" : "返回" }}</van-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "test-result",
  data() {
    return {
      testResult: {}
    };
  },
  created() {
    this.__init();
    // console.log('查看试卷', this.testResult);
  },
  beforeRouteLeave (to, from, next) {
    // ...
    // console.log('当前类型', this.testResult.isTestType);
    if(this.testResult.isTestType && to.name == 'answerTest') {
      this.$router.go(-1);
    }else {
      next();
    }
  },
  methods: {
    __init() {
      this.testResult = this.$route.params.result;
    },
    doNext() {
      if(this.testResult.isCheck) {
        if(this.testResult.exam) {
          var param = {
            isCheck: true,
            isTestEaxm: true,
            examData: this.testResult.exam
          }
          this.$router.replace({name: 'answerTest', params: { exam: param }})
        }else {
          this.$router.go(-1)
        }
      }else {
        if(this.testResult.isTestType) {
          // 模拟考试
          this.$router.go(-2);
        }else {
          this.$router.go(-3);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.test-result-main {
  width: 100%;
  height: 100%;
  @include bgImage;
  background-image: url("~@/assets/imgs/test/test-success-bg.png");
  &.fail {
    background-image: url("~@/assets/imgs/test/test-fail-bg.png");
  }
  .header,
  .container {
    padding: 0 16px;
    box-sizing: border-box;
  }
  .header {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: $headerHeight;
    z-index: 99;
    .back {
      width: 12px;
      height: 21px;
      @include bgImage;
      background-image: url("~@/assets/imgs/icons/back-w.png");
    }
  }
  .container {
    position: relative;
    padding-top: $headerHeight;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    .score-wrapper {
      margin-top: 50px;
      font-size: 14px;
      color: #fff;
      .count {
        margin-bottom: 12px;
        font-size: 48px;
        letter-spacing: 2px;
      }
    }
    .result-detail {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
      padding: 0 56px;
      font-size: 12px;
      color: #fff;
      box-sizing: border-box;
      p {
        margin: 0;
        &.count-wrapper {
          font-size: 0px;
          letter-spacing: 1px;
          .count {
            font-size: 24px;
          }
          .unit {
            font-size: 12px;
          }
        }
        &.text {
          margin-top: 10px;
        }
      }
    }
    .btn-view-wrapper {
      position: absolute;
      bottom: 40px;
      left: 50%;
      width: 300px;
      height: 48px;
      border-radius: 4px;
      transform: translateX(-50%);
      .btn-view {
        width: 100%;
        height: 100%;
        font-size: 15px;
        color: $baseColor;
      }
    }
  }
}
</style>