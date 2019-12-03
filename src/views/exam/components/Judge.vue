<template>
  <div class="judge-main">
    <!-- 题目 -->
    <div class="title">
      <span>【判断题】</span>
      <span v-html="judgeData.content"></span>
    </div>
    <!-- 选项 -->
    <van-radio-group v-model="answer" :disabled="hasAnswer">
      <van-radio
        v-for="(option, index) in judgeData.options"
        :key="index"
        :name="option.value"
        @click="saveAnswer"
        :class="[ judgeData.answer ? (option.isTrue ? 'true' : 'false') : '']"
      >
        {{option.text}}
        <span class="icon"></span>
      </van-radio>
    </van-radio-group>
    <!-- 详解 -->
    <div class="explain-wrapper" v-if="testType && hasAnswer">
      <div class="title">
        <span class="text">试题详解</span>
      </div>
      <p class="explain">{{ judgeData.ext }}</p>
      <!-- 正确选项 -->
      <p class="true-answer">正确答案是：{{ judgeData.key }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "judge",
  props: {
    judgeData: {
      type: Object
    },
    testType: {
      type: Boolean
    }
  },
  data() {
    return {
      answer: "",
      isTrue: false,
      score: 0, // 得分 答错 0 分
      hasAnswer: false
    };
  },
  created() {
    this.__init();
  },
  methods: {
    __init() {
      this.judgeData.options = [
        { value: "Y", text: "正确" },
        { value: "N", text: "错误" }
      ];
      if (this.judgeData.answer) {
        //  查看试卷
        console.log("判断题", this.judgeData);
        this.answer = this.judgeData.answer;
        this.hasAnswer = true;
        
        for(var k in this.judgeData.options) {
          if(this.judgeData.key == this.judgeData.options[k].value) {
            this.judgeData.options[k].isTrue = true
          }else {
            this.judgeData.options[k].isTrue = false
          }
        }
      }
    },
    formatAnswer(index) {
      // 格式化答案
      switch (index) {
        case 0:
          return true;
          break;
        case 1:
          return false;
          break;
      }
    },
    saveAnswer(e) {
      //  获取 radio
      var el = e.path.find(item => item.classList[0] == "van-radio");
      if(this.testType) {
        this.hasAnswer = true;
      }else {
        this.hasAnswer = false;
      }
      if (this.answer == this.judgeData.key) {
        if (this.testType) {
          //  添加正确类名
          el.classList.add("true");
        }else {
          this.$emit('goNext');
        }
        this.isTrue = true;
        this.score = this.judgeData.score;
      } else {
        if (this.testType) {
          //  添加错误类名
          el.classList.add("false");
        }else {
          this.$emit('goNext');
        }
        this.isTrue = false;
        this.score = 0;
      }
      //  发送给父组件
      this.$emit("sendAnswer", {
        id: this.judgeData.id, // 考题ID
        score: this.score, // 得分
        answer: `${this.answer}`,
        flag: `${this.isTrue}` // 正确还是错误的判断依据
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";
.judge-main {
  width: 100%;
  font-size: 16px;
  .title {
    font-family: PingFang SC;
    color: #000;
    text-align: left;
    line-height: 28px;
  }
  .van-radio-group {
    margin-top: 20px;
    .van-radio {
      position: relative;
      margin-bottom: 16px;
      width: 100%;
      height: 40px;
      border-radius: 4px;
      background: rgba(245, 245, 245, 1);
      .icon {
        position: absolute;
        top: 50%;
        right: 16px;
        width: 16px;
        height: 16px;
        @include bgImage;
        transform: translateY(-50%);
      }
      &[aria-checked~="true"] {
        background: $baseColor;
        &.true {
          background: $trueColor;
          .icon {
            background-image: url("~@/assets/imgs/test/question/ans-true@2x.png");
          }
        }
        &.false {
          background: $falseColor;
          .icon {
            background-image: url("~@/assets/imgs/test/question/ans-false@2x.png");
          }
        }
        ::v-deep.van-radio__label {
          color: #fff;
        }
      }
      ::v-deep.van-icon {
        display: none;
      }
      ::v-deep.van-radio__label {
        margin-left: 24px;
        color: #555555;
      }
    }
  }
  .explain-wrapper {
    margin-top: 32px;
    .title {
      position: relative;
      font-size: 12px;
      color: #999;
      text-align: center;
      &::before,
      &::after {
        position: absolute;
        top: 50%;
        display: block;
        content: "";
        width: calc(50% - 44px);
        height: 1px;
        background: #ddd;
        transform: translateY(-50%);
      }
      &::after {
        right: 0;
      }
    }
    p {
      margin: 0;
      text-indent: 2em;
      line-height: 28px;
      text-align: left;
    }
  }
}
</style>