<template>
  <keep-alive>
    <div class="answer-test-main">
      <!-- 头部 -->
      <Header :show-back="true" :show-sub="!isCheck" @doSub="stopExam"></Header>
      <!-- 主体 -->
      <div class="container">
        <div class="top-wrapper">
          <!-- 倒计时 -->
          <div class="count-down">
            <div class="text">剩余时间</div>
            <div class="time">
              <span class="hours">{{hours}}</span>:
              <span class="minutes">{{minutes}}</span>:
              <span class="seconds">{{seconds}}</span>
            </div>
          </div>
          <!-- 题目数量 -->
          <div class="test-count">
            <span class="cur-count">{{ curCount }}</span>
            <span>/</span>
            <span class="all-count">{{ totalCount }}</span>
          </div>
        </div>
        <div class="answer-area">
          <swiper :options="swiperOption" ref="mySwiper">
            <!-- 题目类型渲染 -->
            <swiper-slide v-for="question in questionList" :key="question.id">
              <Single-choose
                :single-data="question"
                :test-type="isTestExam"
                :wrong-type="isWrongType"
                @sendAnswer="saveAnswer"
                @goNext="slideChange"
                v-if="question.type == '1'"
              ></Single-choose>
              <Choose
                :choose-data="question"
                :test-type="isTestExam"
                :wrong-type="isWrongType"
                @sendAnswer="saveAnswer"
                @goNext="slideChange"
                v-if="question.type == '2'"
              ></Choose>
              <Judge
                :judge-data="question"
                :test-type="isTestExam"
                :wrong-type="isWrongType"
                @sendAnswer="saveAnswer"
                @goNext="slideChange"
                v-if="question.type == '3'"
              ></Judge>
              <Fill
                ref="fill"
                :fill-data="question"
                :test-type="isTestExam"
                :wrong-type="isWrongType"
                @sendAnswer="saveAnswer"
                @goNext="slideChange"
                v-if="question.type == '4'"
              ></Fill>
              <Answer
                :answer-data="question"
                :test-type="isTestExam"
                :wrong-type="isWrongType"
                @sendAnswer="saveAnswer"
                @goNext="slideChange"
                v-if="question.type == '5'"
              ></Answer>
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <!-- 查看题目整体情况 -->
      <van-popup v-model="popUpShow" position="bottom">
        <ul class="overall-list">
          <!-- 点击直接跳到当前题目 -->
          <li
            v-for="(item, index) in testView"
            :key="index"
            @click="goSlide(index)"
            class="overall-item"
            :class="[testViewClass(item), index + 1 == curCount ? 'cur' : '']"
          >{{ index + 1 }}</li>
        </ul>
      </van-popup>
      <!-- 底部 -->
      <div class="footer">
        <div class="true-false-wrapper">
          <div class="true-wrapper" v-if="isTestExam">
            <span class="icon true-icon"></span>
            <span class="count true-count">{{ trueCount }}</span>
          </div>
          <div class="false-wrapper" v-if="isTestExam">
            <span class="icon false-icon"></span>
            <span class="count false-count">{{ falseCount }}</span>
          </div>
        </div>
        <div class="all" @click="popUpShow = !popUpShow" :class="{active: popUpShow}"></div>
      </div>
    </div>
  </keep-alive>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

import Header from "@/components/Header";
// 题目类型组件
import Fill from "@/views/exam/components/Fill"; // 填空
import Judge from "@/views/exam/components/Judge"; // 判断
import Answer from "@/views/exam/components/Answer"; // 简答题
import Choose from "@/views/exam/components/Choose"; // 多选
import SingleChoose from "@/views/exam/components/SingleChoose"; // 单选

import examApi from "@/api/exam";
import { mapState } from "vuex";
import { setExamStartTime, getExamStartTime, removeExamTime } from "@/utils/examTime";

export default {
  name: "AnswerTest",
  components: {
    Header,
    swiper,
    swiperSlide,
    Fill,
    Judge,
    Answer,
    Choose,
    SingleChoose
  },
  data() {
    return {
      isCheck: false, // 查看考试信息
      isTestExam: false, // 是否是模拟考试
      isWrongType: false, // 是否时错题练习
      // examData: {}, // 当前考试数据
      paperData: {}, // 当前试卷数据
      duration: null, // 考试时长
      questionList: [], // 题目列表
      totalCount: 0, // 题目数量
      startTime: null, // 前端记录考试开始时间
      curPaper: {}, // 当前试卷对象， 用于提交到后台
      // totalScore: 0, // 试卷总分
      passScore: 0, // 及格分数
      danger: false, // 时间不足提示
      countDownStop: true, // 倒计时暂停标识
      curCount: 1, // 当前题目
      trueCount: 0, // 正确提数
      falseCount: 0, // 错误数量
      swiperOption: {}, // swiper参数
      testView: [], // 整体展示数据
      popUpShow: false // 整体情况弹出层
    };
  },
  computed: {
    ...mapState("exam", {
      examList: state => state.examList,
      nowExamList: state => state.nowExamList
    }),
    hours() {
      return this.formatTime(parseInt((this.duration / 1000 / 60 / 60) % 24));
    },
    minutes() {
      return this.formatTime(parseInt((this.duration / 1000 / 60) % 60));
    },
    seconds() {
      return this.formatTime(Math.ceil((this.duration / 1000) % 60));
    },
    oldCurCount() {
      //  正式考试题目
      return this.curCount - 1;
    }
  },
  created() {
    this.__init();
    // console.log(this.$route.params.exam)
    if (!this.isCheck || !this.$route.params.exam.isPractice && this.$route.params.exam.isPractice != undefined) {
      // console.log(this.$route.params.exam.isPractice)
      console.log("可以开启定时器");
      //  查看试卷不开启定时器
      if (localStorage.getItem("leaveTime")) {
        //  获取当前剩余时间
        // console.log("已开始过");
        // console.log("获得离开时间", localStorage.getItem("leaveTime"));
        this.duration = localStorage.getItem("leaveTime");
        if (localStorage.getItem("leaveTime") != this.getDefault("duration")) {
          //  已经点击过开始做题
          // console.log("倒计时继续");
          this.startExam();
        }
      } else {
        this.startExam();
      }
    }
  },
  mounted() {
    let that = this;

    if (!this.isCheck || !this.$route.params.exam.isPractice) {
      //  查看试卷不开启定时器
      //  后台运行判断，停止定时器
      document.addEventListener("visibilitychange", function() {
        if (document.visibilityState == "hidden") {
          console.log("暂停计时");
          that.suspendExam();
        } else {
          // 进入页面，判断是否开始过答题
          var localTime = localStorage.getItem("leaveTime");
          if (localTime != that.getDefault("duration")) {
            console.log("开始计时");
            that.startExam();
          }
        }
      });
    }
    //  试题滑动
    this.$refs.mySwiper.swiper.on("slideChange", function() {
      that.curCount = this.activeIndex + 1;
    });
  },
  beforeDestroy() {
    this.countDownStop = true;
    localStorage.removeItem("leaveTime")
    removeExamTime(this.paperData.id);
  },
  methods: {
    __init() {
      //  获得试卷参数
      console.log("试卷信息", this.$route.params.exam);

      // this.examData = this.$route.params.exam.examData;
      // 是否是练习, 练习可直接获取试题列表
      var isPractice = this.$route.params.exam.isPractice;
      //  是否时错题练习
      this.isWrongType = this.$route.params.exam.isWrongType;
      //  上级路由传过来的考试数据
      var examData = this.$route.params.exam.examData;

      if (!isPractice) {
        // 非练习状态，包含正式考试和模拟考试
        this.isCheck = this.$route.params.exam.isCheck;
        this.isTestExam = this.$route.params.exam.isTestEaxm;
        //  当前考卷信息
        // console.log("考试数据", examData);
        this.paperData = JSON.parse(examData.quData);
        // this.totalScore = this.paperData.totalscore;
        this.passScore = this.paperData.passscore;
        // console.log("试卷数据", this.paperData)
        this.duration = this.paperData.duration * 60 * 1000;
        //  查看试卷不需要记录考试考试时间
        if(!this.isCheck) {
          this.getStartTime(); // 获取其本地时间
        }
      } else {
      }

      // 当前试卷信息 dataInfo 答案 checkInfo 得分  
      this.curPaper = {
        paperId: examData.paperId,
        endTime: null,
        dataInfo: {},
        checkInfo: {}
      };
      //  考试开始时间
      this.curPaper.startTime = this.startTime;
      //  遍历考题信息
      var list = [];

      if (!this.isCheck && !isPractice && !this.isWrongType) {
        //  正式考试和模拟考试显示
        for (var i = 0; i < this.paperData.sections.length; i++) {
          list.push(...this.paperData.sections[i].questions);
        }
        this.questionList = list;
        this.totalCount = this.questionList.length;
        for (var i in this.questionList) {
          this.testView.push({});
        }
      } 
      else if (isPractice || this.isWrongType) {
        //  练习和错题练习
        this.isCheck = true;
        this.duration = 0;
        this.isTestExam = true;
        this.totalCount = examData.length;
        this.questionList = examData;
        for (var i in this.questionList) {
          this.testView.push({});
        }
      } 
      else {
        //  查看试卷 考题信息
        for (var i = 0; i < this.paperData.sections.length; i++) {
          list.push(...this.paperData.sections[i].questions);
        }
        this.questionList = list;
        //  试卷查看显示
        // console.log("考卷", this.questionList);
        // console.log("答案", JSON.parse(examData.dataInfo));
        for (var i in this.questionList) {
          for (var k in JSON.parse(examData.dataInfo)) {
            //  接口ID 判断
            if ("Q-" + this.questionList[i].id == k) {
              this.questionList[i].answer = JSON.parse(examData.dataInfo)[k];
            }
          }
        }

        this.trueCount = examData.rightNums;
        this.falseCount = examData.errorNums;
        this.totalCount = this.questionList.length;
        //  
        for (var i = 0; i < this.questionList.length; i++) {
          if (this.questionList[i].type == "4") {
            //  填空题特殊判断
            var daan = "";
            for (var j = 0; j < this.questionList[i].blanks.length; j++) {
              if (j == this.questionList[i].blanks.length - 1) {
                daan += this.questionList[i].blanks[j].value;
              } else {
                daan += this.questionList[i].blanks[j].value + "`";
              }
            }
            this.testView.push({
              queFlag: this.questionList[i].answer == daan ? "true" : "false"
            });
          } else if (this.questionList[i].type == "5") {
            //  简答题特殊判断，有答案即为完成
            this.testView.push({
              queFlag: "true"
            });
          } else {
            //  查看整体情况
            this.testView.push({
              queFlag:
                this.questionList[i].answer == this.questionList[i].key
                  ? "true"
                  : "false"
            });
          }
        }
        // console.log("考卷", this.questionList);
      }
    },
    slideChange() {
      this.$refs.mySwiper.swiper.slideNext();
    },
    getStartTime() {
      //  获取考试开始时间
      var localStart = getExamStartTime(this.paperData.id);
      // console.log("本地时间", localStart);
      if (!localStart) {
        setExamStartTime(this.paperData.id, this.getCurTime());
        this.startTime = this.getCurTime();
      } else {
        this.startTime = localStart.startTime;
      }
    },
    getDefault(dataName) {
      return this.$options.data()[dataName];
    },
    startExam() {
      // 结束时间
      var endTime = new Date().getTime() + Number(this.duration);
      var duration = null;
      // 开启倒计时
      this.countDownStop = false; // 倒计时启动标识
      this.timer = setInterval(() => {
        // 当前时间与规定时间的差值
        duration = endTime - new Date().getTime();
        this.duration = duration;
        this.danger = false;
        // this.duration / this.getDefault("duration") < 0.2 ? true : false;
      }, 1000);
      // 超出做题时间，停止定时器
      if (duration < 0) {
        console.log(this.duration);
        console.log("duration小于0提交试卷");
        this.stopExam();
      }
    },
    suspendExam() {
      // 暂停
      clearInterval(this.timer);
      // console.log("结束时间", this.duration);
      if (!this.countDownStop) {
        //  倒计时已开启 保留当前剩余时间
        // console.log("离开保存");
        localStorage.setItem("leaveTime", this.duration);
      }
    },
    stopExam() {
      // 提交试卷
      this.curPaper.endTime = this.getCurTime(new Date(this.startTime).getTime() + this.paperData.duration * 60 * 1000 - this.duration);
      
      clearInterval(this.timer);
      localStorage.removeItem("leaveTime");
      this.duration = this.getDefault("duration");
      this.danger = false;
      this.countDownStop = true;
      //  正式考试发送请求
      if (!this.isTestExam) {
        // console.log('正式考试发送请求');
        var params = {
          paperId: this.paperData.id,
          startTime: this.startTime,
          endTime: this.curPaper.endTime,
          userScore: this.curPaper.userScore,
          rightNums: this.trueCount,
          errorNums: this.falseCount,
          dataInfo: JSON.stringify(this.curPaper.dataInfo),
          checkInfo: JSON.stringify(this.curPaper.checkInfo)
        };
        console.log("正式考试请求的参数", params);
        examApi
          .saveExam(params)
          .then(res => {
            // console.log(res);
            if (res.success === 1) {
              //  清除本地存储的开始时间
              removeExamTime(this.paperData.id);
              this.$toast.success(res.msg);
              //  正式不显示考试结果
              var param = {
                isTestType: false,
                useTime:
                  new Date(this.curPaper.endTime).getTime() -
                  new Date(this.curPaper.startTime).getTime()
              };
              setTimeout(() => {
                this.$router.push({
                  name: "examResult",
                  params: { result: param }
                });
              }, 3000);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        var param = {
          isTestType: true,
          passScore: this.passScore,
          userScore: this.curPaper.userScore,
          trueCount: this.trueCount,
          falseCount: this.falseCount,
          totalCount: this.totalCount,
          useTime:
            new Date(this.curPaper.endTime).getTime() -
            new Date(this.curPaper.startTime).getTime()
        };
        //  清除本地存储的开始时间
        removeExamTime(this.paperData.id);
        //  模拟考试直接显示得分
        this.$router.push({ name: "examResult", params: { result: param } });
      }
    },
    formatTime(time) {
      //  格式化日期
      return time < 10 ? `0${time}` : time;
    },
    getCurTime(time) {
      //  获取系统当前时间
      var now = time ? new Date(time) : new Date();
      var year = now.getFullYear();
      var month = this.formatTime(now.getMonth() + 1);
      var day = this.formatTime(now.getDate());
      var hour = this.formatTime(now.getHours());
      var minute = this.formatTime(now.getMinutes());
      var second = this.formatTime(now.getSeconds());
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    saveAnswer(val) {
      //  保存答案判断, 如果没保存过答案
      var f = this.curPaper.dataInfo[`Q-${val.id}`];
      if (f) {
        // 题目正确数量和错误数量
        if (val.flag == this.testView[this.curCount - 1].queFlag) {
          // console.log('两次答案一致')
        } else {
          // console.log('两次答案不一致');
          if (val.flag == "true") {
            this.trueCount++;
            this.falseCount--;
          } else if (val.flag == "false") {
            this.trueCount--;
            this.falseCount++;
          }
        }
      } else {
        val.flag == "true" ? this.trueCount++ : this.falseCount++;
      }
      if (val.answer) {
        // 答案有值
        if(!this.isTestEaxm) {
          // 正式考试整体展示
          this.testView[this.oldCurCount - 1] = {
            queID: this.oldCurCount,
            queFlag: val.flag
          };
          if(this.testView[this.oldCurCount - 1]) {
            //  针对最后一题的判断
            this.testView[this.curCount - 1] = {
              queID: this.curCount,
              queFlag: val.flag
            };
          }
        }else {
          // 模拟考试整体展示
          this.testView[this.curCount - 1] = {
            queID: this.curCount,
            queFlag: val.flag
          };
        }
        // console.log("整体展示情况", this.testView)
      }
      // 键名为题目 Q + id
      var key = "Q-" + val.id;
      // console.log("当前提交数据", this.curPaper);
      this.curPaper.dataInfo[key] = val.answer;
      this.curPaper.checkInfo[key] = val.score;
      //  用户总得分计算
      var score = 0;
      for (var k in this.curPaper.checkInfo) {
        score += this.curPaper.checkInfo[k];
      }
      this.curPaper.userScore = score;
    },
    goSlide(index) {
      // swiper跳转
      this.popUpShow = false;
      this.$refs.mySwiper.swiper.slideTo(index, 0);
    },
    testViewClass(item) {
      if (this.isTestExam) {
        if (item.queFlag == "true") {
          return "true";
        } else if (item.queFlag == "false") {
          return "false";
        }
      } else {
        if (item.queFlag) {
          return "true";
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.answer-test-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    padding-bottom: 40px;
    padding-left: 22px;
    padding-right: 22px;
    color: $fontColor;
    .top-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 32px;
      box-sizing: border-box;
      .count-down {
        display: flex;
        align-items: center;
        font-size: 12px;
        .time {
          display: flex;
          margin-left: 10px;
          .hours,
          .minutes,
          .seconds {
            margin: 0 4px;
            width: 16px;
            height: 16px;
            color: #fff;
            line-height: 16px;
            background: rgba(51, 51, 51, 1);
            border-radius: 2px;
            border: 1px solid rgba(0, 0, 0, 1);
          }
          .hours {
            margin-left: 0;
          }
        }
      }
      .test-count {
        font-size: 14px;
        color: #999;
        .cur-count {
          font-size: 24px;
          color: #000;
        }
      }
    }
    .answer-area {
      margin-top: 20px;
      padding-bottom: 40px;
      height: 100%;
      box-sizing: border-box;
      .swiper-container {
        padding-bottom: 40px;
        height: 100%;
        box-sizing: border-box;
        .swiper-slide {
          padding: 0 2px;
          overflow-y: auto;
          touch-action: none;
          box-sizing: border-box;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }
  }
  .van-popup {
    padding: 28px 27px 12px 28px;
    bottom: 39px;
    height: 320px;
    box-sizing: border-box;
    .overall-list {
      margin: 0 auto;
      flex-wrap: wrap;
      width: 100%;
      max-width: 320px;
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .overall-item {
        float: left;
        margin-right: 16px;
        margin-bottom: 16px;
        width: 38px;
        height: 38px;
        font-size: 14px;
        color: #999;
        line-height: 39px;
        border-radius: 50%;
        border: 1px solid #ddd;
        &:nth-child(6n) {
          margin-right: 0;
        }
        &.true {
          // 正确样式
          color: $baseColor;
          background: rgba(38, 153, 251, 0.2);
          border: 1px solid rgba(38, 153, 251, 0.2);
        }
        &.false {
          // 错误样式
          color: #ff0000;
          background: rgba(255, 0, 0, 0.2);
          border: 1px solid rgba(255, 0, 0, 0.2);
        }
        &.cur {
          // 当前样式
          background: #eeeeee !important;
        }
      }
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0 24px;
    width: 100%;
    height: 39px;
    box-sizing: border-box;
    border-top: 1px solid rgba(0, 0, 0, 0.07);
    background: #fff;
    z-index: 9999;
    .true-false-wrapper {
      display: flex;
      align-items: center;
      width: 100px;
      .true-wrapper,
      .false-wrapper {
        display: flex;
        .icon {
          width: 17px;
          height: 17px;
          @include bgImage;
          background-size: 16px;
          &.true-icon {
            background-image: url("~@/assets/imgs/test/question/true@2x.png");
          }
          &.false-icon {
            margin-left: 30px;
            background-image: url("~@/assets/imgs/test/question/false@2x.png");
          }
        }
        .count {
          margin-left: 8px;
          font-size: 14px;
          &.true-count {
            color: $baseColor;
          }
          &.false-count {
            color: $falseColor;
          }
        }
      }
    }
    .all {
      width: 30px;
      height: 30px;
      background: 10px no-repeat;
      background-size: 17px;
      background-image: url("~@/assets/imgs/test/question/all@2x.png");
      &.active {
        background-image: url("~@/assets/imgs/test/question/all-act@2x.png");
      }
    }
  }
}
</style>