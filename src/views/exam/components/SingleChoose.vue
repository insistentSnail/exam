<template>
  <div class="single-choose-main">
    <!-- 题目 -->
    <div class="title">
      <span>【单选题】</span>
      <span v-html="singleData.content"></span>
    </div>
    <!-- 选项 -->
    <van-radio-group v-model="answer" :disabled="hasAnswer">
      <van-radio
        v-for="(option, index) in singleData.options"
        :key="index"
        :name="formatAnswer(index)"
        @click="saveAnswer"
        :class="[`option-${formatAnswer(index)}`, singleData.answer ?  (option.isTrue ? 'true':'false'): '']"
      >
        {{formatAnswer(index)}}. {{option.text}}
        <span class="icon"></span>
      </van-radio>
    </van-radio-group>
    <!-- 详解 -->
    <div class="explain-wrapper" v-if="testType && hasAnswer">
      <div class="title">
        <span class="text">试题详解</span>
      </div>
      <p class="explain">{{ singleData.ext }}</p>
      <!-- 正确选项 -->
      <p class="true-answer">正确答案是：{{ singleData.key }}</p>
    </div>
  </div>
</template>

<script>
import examApi from "@/api/exam";

export default {
  name: "SingleChoose",
  props: {
    singleData: {
      type: Object
    },
    testType: {
      type: Boolean
    },
    wrongType: {
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
    this.$nextTick(() => {
      this.__init();
    })
  },
  methods: {
    __init() {
      //  查看试卷
      if(this.singleData.answer) {
        this.answer = this.singleData.answer;
        for(var k in this.singleData.options) {
          //  判断当前选项是否等于答案
          if(this.singleData.options[k].alisa == this.singleData.key) {
            this.singleData.options[k].isTrue = true
          }else {
            this.singleData.options[k].isTrue = false
          }
        }
        // console.log(this.singleData.options)
        //  当前被选中的元素
        this.hasAnswer = true;
        if(this.answer == this.singleData.key) {
          this.isTrue = 'true';
        }else {
          this.isTrue = 'false';
        }
      }
    },
    saveAnswer(e) {
      var el = e.path.find(item => item.classList[0] == "van-radio");
      // console.log(el);
      this.hasAnswer = this.testType ? true : false;
      //  答案匹配
      if (this.answer == this.singleData.key) {
        //  添加正确类名
        if(this.testType) {
          el.classList.add("true");
          //  是否错题练习
          if(this.wrongType) {
            console.log('错题集练习');
            examApi.updateWrong({quId: this.singleData.id})
            .then(res => {
              // console.log(res);
            })
            .catch(err => {
              console.log(err);
            })
          }
        }else {
          this.$emit('goNext')
        }
        this.isTrue = `true`;
        this.score = this.singleData.score;
      } else {
        //  添加错误类名
        if(this.testType) {
          el.classList.add("false");
        }else {
          this.$emit('goNext')
        }
        this.isTrue = `false`;
        this.score = 0;
      }
      //  发送给父组件
      this.$emit("sendAnswer", {
        id: this.singleData.id, // k考题ID
        score: this.score, // 得分
        answer: this.answer,
        flag: this.isTrue
      });
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