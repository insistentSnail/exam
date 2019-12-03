<template>
  <div class="single-choose-main">
    <!-- 题目 -->
    <div class="title">
      <span>【多选题】</span>
      <span v-html="chooseData.content"></span>
    </div>
    <!-- 多选题选项 -->
    <van-checkbox-group v-model="result" :disabled="hasAnswer">
      <van-checkbox
        v-for="(item, index) in chooseData.options"
        :key="index"
        :name="item.alisa"
        :class="[chooseData.answer ? (item.isTrue ? 'true':'false'): '', `option${item.alisa}`]"
      >
        {{item.alisa}}. {{item.text}}
        <span class="icon"></span>
      </van-checkbox>
    </van-checkbox-group>

    <!-- 多选题确认 -->
    <div class="sub-wrapper" v-if="!hasAnswer">
      <van-button color="#2699fb" class="btn-sub" @click="saveAnswer">确定</van-button>
    </div>
    <!-- 详解 -->
    <div class="explain-wrapper" v-if="testType && hasAnswer">
      <div class="title">
        <span class="text">试题详解</span>
      </div>
      <p class="explain">{{ chooseData.ext }}</p>
      <!-- 正确选项 -->
      <p class="true-answer">正确答案是：{{ chooseData.key }}</p>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Choose",
  props: {
    chooseData: {
      type: Object
    },
    testType: {
      type: Boolean
    }
  },
  data() {
    return {
      result: [],
      answer: {
        // 多选题答案
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: ""
      },
      isTrue: false,
      score: 0,
      hasAnswer: false
    };
  },
  created() {
    this.__init();
  },
  methods: {
    __init() {
      if (this.chooseData.answer) {
        //  查看试卷
        // console.log("多选", this.chooseData);
        this.hasAnswer = true;
        var answerArr = this.chooseData.answer.split("");
        for (var k in answerArr) {
          this.result.push(answerArr[k]);
        }

        for (var k in this.chooseData.options) {
          if (this.chooseData.key.includes(this.chooseData.options[k].alisa)) {
            this.chooseData.options[k].isTrue = true;
          } else {
            this.chooseData.options[k].isTrue = false;
          }
        }
      }
    },
    formatAnswer(index) {
      // 格式化答案
      switch (index) {
        case 0:
          return "A";
          break;
        case 1:
          return "B";
          break;
        case 2:
          return "C";
          break;
        case 3:
          return "D";
          break;
      }
    },
    doChoose(option, e) {},
    saveAnswer(e) {
      var chooseAnswer = this.result;
      if(this.testType) {
        this.hasAnswer = true;
      }else {
        this.hasAnswer = false;
      }
      console.log(this.hasAnswer);
      //  考试答案字符串
      var answerArr = [];
      for (var k in chooseAnswer) {
        answerArr.push(chooseAnswer[k]);
        //  模拟考试选项样式显示
        var el = document.querySelector(`.option${chooseAnswer[k]}`);
        if (this.testType) {
          if (this.chooseData.key.includes(chooseAnswer[k])) {
            el.classList.add("true");
          } else {
            console.log("错误答案", chooseAnswer[k]);
            el.classList.add("false");
          }
        }
      }
      //  最后提交的字符串
      var answer = answerArr.sort().join("");
      //  答案匹配
      if (answer == this.chooseData.key) {
        this.isTrue = `true`;
        this.score = this.chooseData.score;
      } else {
        this.isTrue = `false`;
        this.score = 0;
      }
      //  切换
      if(!this.testType) {
        this.$emit('goNext');
      } 
      //  发送答案给父组件
      this.$emit("sendAnswer", {
        id: this.chooseData.id, // 考题ID
        score: this.score, // 得分
        answer: answer,
        flag: this.isTrue
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";
.single-choose-main {
  width: 100%;
  font-size: 16px;
  .title {
    font-family: PingFang SC;
    color: #000;
    text-align: left;
    line-height: 28px;
  }
  .van-checkbox-group {
    margin-top: 20px;
    .van-checkbox {
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
      ::v-deep.van-icon {
        display: none;
      }
      ::v-deep.van-radio__label {
        margin-left: 24px;
        color: #555555;
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
        ::v-deep.van-checkbox__label {
          color: #fff;
        }
      }
    }
  }
  
  .btn-sub {
    width: 100%;
    height: 44px;
    font-size: 15px;
    border-radius: 4px;
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