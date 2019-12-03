<template>
  <div class="fill-main">
    <!-- 题目 -->
    <div class="title">
      <span>【填空题】</span>
      <span v-html="fillData.content">
      </span>
    </div>
    <!-- 填空区域 -->
    <div class="fill-answer" v-if="!hasAnswer">
      <van-field
        v-for="(item, index) in fillData.blanks"
        :key="index"
        :placeholder="`请输入第${index + 1}个答案`"
        v-model="answerList[index].value"
      ></van-field>
    </div>
    <!-- 模拟试题与练习显示当前填写的答案 -->
    <div class="my-answer-wrapper" v-else>
      <div class="title">我的答案</div>
      <div class="my-answer" :class="[testType ? isTrue ? 'true' : 'false' : '']" v-html="showDaan(answerList)">
      </div>
    </div>
    <!-- 练习与模拟的提交按钮 -->
    <div class="sub-wrapper" v-if="!hasAnswer">
      <van-button color="#2699fb" class="btn-sub" @click="saveAnswer">确定</van-button>
    </div>
    <!-- 试题详解: 模拟考试与练习时显示 -->
    <div class="explain-wrapper" v-if="testType && hasAnswer">
      <div class="title">
        <span class="text">试题详解</span>
      </div>
      <p class="explain" v-html="fillData.ext"></p>
      <!-- 正确选项 -->
      <div class="answer-wrapper">
        正确答案是:
        <div class="true-answer" v-html="showDaan(fillData.blanks)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Fill",
  props: {
    fillData: {
      type: Object
    },
    testType: {
      type: Boolean
    }
  },
  data() {
    return {
      answer: "",
      answerList: [],
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
      //  查看试卷
      if (this.fillData.answer) {
        this.answer = this.fillData.answer;
        this.hasAnswer = true;

        var fillDaan = ""; //  试题答案
        for (var j = 0; j < this.fillData.blanks.length; j++) {
          if (j == this.fillData.blanks.length - 1) {
            //  试题答案
            fillDaan += this.fillData.blanks[j].value;
          } else {
            fillDaan += this.fillData.blanks[j].value + "`";
          }
        }
        this.isTrue = this.answer == fillDaan ? true : false;

        var value = this.answer.split('`');
        for(var k in value) {
          this.answerList.push({
            value: value[k]
          })
        }
      }
      //  考试传入空对象
      for (var k in this.fillData.blanks) {
        this.answerList.push({
          value: ""
        });
      }
    },
    showDaan(list) {
      var daan = "";
      for (var j = 0; j < list.length; j++) {
        daan += `<p>
                  ${list[j].value}
                 </p>
                `;
      }
      return daan;
    },
    saveAnswer() {
      //  用户是否填写答案判断
      var flag = this.answerList.find(item => item.value);
      if(flag) {
        if(this.testType) {
          this.hasAnswer = true;
        }else {
          this.hasAnswer = false;
          //  切换
          this.$emit('goNext');
        }
        var fillDaan = ""; //  试题答案
        this.answer = "";
        for (var j = 0; j < this.answerList.length; j++) {
          if (j == this.answerList.length - 1) {
            //  用户填写的答案
            this.answer += this.answerList[j].value;
            //  试题答案
            fillDaan += this.fillData.blanks[j].value;
          } else {
            this.answer += this.answerList[j].value + "`";
            fillDaan += this.fillData.blanks[j].value + "`";
          }
        }

        this.isTrue = this.answer == fillDaan ? true : false;
        this.score = this.answer == fillDaan ? this.fillData.score : 0;
        //  发送给父组件
        this.$emit('sendAnswer', {
          id: this.fillData.id, // 考题ID
          score: this.score, // 得分
          answer: this.answer,
          flag: `${this.isTrue}`
        })
      }else {
        this.$notify({ type: "danger", message: "请填写答案" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.fill-main {
  width: 100%;
  font-size: 16px;
  .title {
    font-family: PingFang SC;
    color: #000;
    text-align: left;
    line-height: 28px;
  }
  .fill-answer {
    margin-top: 20px;
    padding: 16px;
    font-size: 15px;
    color: #ccc;
    border-radius: 4px;
    border: 1px solid rgba(221, 221, 221, 1);
    .van-field {
      display: flex;
      align-items: center;
      padding: 0;
      height: 40px;
      &:not(:last-child) {
        border-bottom: 1px solid #eee;
      }
    }
  }
  .my-answer-wrapper {
    margin-top: 20px;
    text-align: left;
    .title {
      font-size: 12px;
      color: #ccc;
    }
    .my-answer {
      margin-top: 9px;
      font-size: 16px;
      &.true {
        color: $trueColor;
      }
      &.false {
        color: $falseColor;
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
    .answer-wrapper {
      margin: 0;
      text-indent: 2em;
      line-height: 28px;
      text-align: left;
    }
  }
  .sub-wrapper {
    .btn-sub {
      margin-top: 30px;
      width: 100%;
      height: 48px;
      font-size: 15px;
    }
  }
}
</style>