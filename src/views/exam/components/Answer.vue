<template>
  <div class="answer-main">
    <!-- 题目 -->
    <div class="title">
      <span>【简答题】</span>
      <span v-html="answerData.content"></span>
    </div>
    <!-- 填空区域 -->
    <div class="fill-answer" v-if="!hasAnswer">
      <van-field v-model.trim="answer" type="textarea" placeholder="请输入你的答案" rows="6" autosize />
    </div>
    <!-- 模拟试题与练习显示当前填写的答案 -->
    <div class="my-answer-wrapper" v-else>
      <div class="title">我的答案</div>
      <div class="my-answer">{{ answer }}</div>
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
      <p class="explain">{{ answerData.ext }}</p>
      <!-- 正确选项 -->
      <p class="true-answer">正确答案是：{{ answerData.key }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Answer',
  props: {
    answerData: {
      type: Object
    },
    testType: {
      type: Boolean
    }
  },
  data() {
    return {
      answer: '',
      isTrue: false,
      score: 0,
      hasAnswer: false
    }
  },
  created() {
    this.__init();
  },
  methods: {
    __init() {
      //  查看试卷
      if(this.answerData.answer) {
        this.answer = this.answerData.answer;
        this.hasAnswer = true;
      }
    },
    saveAnswer() {
      if(this.answer) {
        if(this.testType) {
          this.hasAnswer = true;
        }else {
          this.hasAnswer = false;
          //  切换
          this.$emit('goNext');
        }
        this.isTrue = true;
        this.score = Math.ceil(this.answerData.score * this.compareString(this.answer, this.answerData.key) / 100);
        //  发送给父组件
        this.$emit('sendAnswer', {
          id: this.answerData.id,
          score: this.score,
          answer: this.answer,
          flag: `${this.isTrue}`
        })
      }else {
        this.$notify({ type: 'danger', message: '请填写答案' });
      }
    },
    compareString(x, y) {
        // 字符串内容匹配  
        var z = 0;
        //判断是否为字符串
        if(typeof x == "string"){
        x=x.split("");
        y=y.split("");
        }
        var s = x.length + y.length;;
        x.sort();
        y.sort();
        var a = x.shift();
        var b = y.shift();
        while(a !== undefined && b !== undefined) {
            if (a === b) {
                z++;
                a = x.shift();
                b = y.shift();
            } else if (a < b) {
                a = x.shift();
            } else if (a > b) {
                b = y.shift();
            }
        }
        return z/s * 200;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.answer-main {
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
    .van-cell {
      padding: 16px;
      font-size: 15px;
      color: #ccc;
      &.van-field {
        border-radius: 4px;
        border:1px solid rgba(221,221,221,1);
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