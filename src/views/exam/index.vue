<template>
  <div class="exam-main">
    <!-- 基础头部 -->
    <Header :showBack="false" title-text="考试"></Header>
    <!-- 主体 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 考试推送 -->
      <div class="test-push" v-if="pushExamList && pushExamList.length > 0">
        <swiper :options="pushOption">
          <swiper-slide v-for="(push, index) in pushExamList" :key="index">
            <h3 class="test-title">{{ push.paperName}}</h3>
            <p
              class="test-time"
            >考试时间：{{push.examStartTime | formatTime }} — {{ push.examEndTime | formatTime}}</p>
            <!-- 立即考试按钮 -->
            <van-button
              type="primary"
              size="small"
              round
              class="test-now"
              @click="goExamNote(push)"
            >立即考试</van-button>
          </swiper-slide>
        </swiper>
        <!-- 导航 -->
        <div class="push-pagination"></div>
      </div>
      <div class="container">
        <!-- 考试练习 -->
        <div class="test-classify">
          <div class="title">考试练习</div>
          <div class="classify">
            <!-- 模拟考试 -->
            <router-link :to="{ name: 'testExam'}" tag="div" class="classify-item simulation">模拟考试</router-link>
            <!-- 自测，可选择题型 -->
            <router-link
              :to="{ name: 'questionSelect'}"
              tag="div"
              class="classify-item practice"
            >练习</router-link>
          </div>
        </div>
        <!-- 考试记录 -->
        <div class="test-record">
          <!-- 吸顶效果 -->
          <van-sticky :offset-top="48">
            <div class="title-wrapper">
              <div class="title">考试记录</div>
              <!-- swiper pagination -->
              <div class="record-pagination" slot="pagination"></div>
            </div>
          </van-sticky>
          <swiper :options="recordOption" ref="mySwiper">
            <!-- 已考考试记录 -->
            <swiper-slide>
              <ul class="exam-list" v-if="doneExamList && doneExamList.length > 0">
                <li v-for="exam in doneExamList" :key="exam.id" @click="goExam(exam)" class="exam-item">
                  <div class="exam-title-wrapper">
                    <span class="title">{{ exam.paperName }}</span>
                    <!-- 状态样式绑定 -->
                    <!-- <span
                      class="status"
                      :class="{'under-way': exam.examState =='1' || exam.examState =='0'  ,'done': exam.examState == '2'}"
                    ></span> -->
                  </div>
                  <div class="test-info">
                    <div class="test-time">
                      <div class="done-time">
                        <span class="icon done-icon"></span>
                        <span class="time">{{ exam.examStartTime | formatTime }}</span>
                      </div>
                      <div class="use-time">
                        <span class="icon use-icon"></span>
                        <span class="time">{{ exam.examDuration }}分钟</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <No-data v-else></No-data>
            </swiper-slide>
            <!-- 缺考考试记录 -->
            <swiper-slide>
              <ul class="exam-list" v-if="missExamList && missExamList.length > 0">
                <li
                  v-for="exam in missExamList"
                  :key="exam.id"
                  @click="missExam"
                  class="exam-item"
                >
                  <div class="exam-title-wrapper">
                    <span class="title">{{ exam.paperName }}</span>
                    <!-- 状态样式绑定 -->
                    <!-- <span
                      class="status"
                      :class="{'under-way': exam.examState =='1' || exam.examState =='0'  ,'done': exam.examState == '2'}"
                    ></span> -->
                  </div>
                  <div class="test-info">
                    <div class="test-time">
                      <div class="done-time">
                        <span class="icon done-icon"></span>
                        <span class="time">{{ exam.examStartTime | formatTime }}</span>
                      </div>
                      <div class="use-time">
                        <span class="icon use-icon"></span>
                        <span class="time">{{ exam.examDuration }}分钟</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <No-data v-else></No-data>
            </swiper-slide>
            <!-- 未开始考试记录 -->
            <swiper-slide>
              <ul class="exam-list" v-if="notBeginExamList && notBeginExamList.length > 0">
                <li
                  v-for="exam in notBeginExamList"
                  :key="exam.id"
                  @click="cantExam"
                  class="exam-item"
                >
                  <div class="exam-title-wrapper">
                    <span class="title">{{ exam.paperName }}</span>
                    <!-- 状态样式绑定 -->
                    <!-- <span
                      class="status"
                      :class="{'under-way': exam.examState =='1' || exam.examState =='0'  ,'done': exam.examState == '2'}"
                    ></span> -->
                  </div>
                  <div class="test-info">
                    <div class="test-time">
                      <div class="done-time">
                        <span class="icon done-icon"></span>
                        <span class="time">{{ exam.examStartTime | formatTime }}</span>
                      </div>
                      <div class="use-time">
                        <span class="icon use-icon"></span>
                        <span class="time">{{ exam.examDuration }}分钟</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <No-data v-else></No-data>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import NoData from "@/components/NoData";
import Header from "@/components/Header";
import { swiper, swiperSlide } from "vue-awesome-swiper";

import mixins from "@/mixins/filterTime";
import examApi from "@/api/exam";

export default {
  name: "Exam",
  components: {
    NoData,
    Header,
    swiper,
    swiperSlide
  },
  mixins: [mixins],
  data() {
    return {
      isLoading: false,
      isDone: false, // 考试是否结束
      doneExamList: [],
      pushExamList: [],
      missExamList: [],
      notBeginExamList: [],
      pushOption: {
        autoplay: true,
        // loop: true, // vue 点击事件会失效
        spaceBetween: 8,
        slidesPerView: 1.1,
        centeredSlides: true,
        pagination: {
          el: ".push-pagination"
        }
      },
      recordOption: {
        autoHeight: true,
        // speed: 100,
        pagination: {
          //分页容器的css选择器
          el: ".record-pagination",
          clickable: true,
          renderBullet: function(index, className) {
            var text = "";
            switch (index) {
              case 0:
                text = "已考";
                break;
              case 1:
                text = "缺考";
                break;
              case 2:
                text = "未开始";
                break;
            }
            return '<div class="' + className + '">' + text + "</div>";
          }
        }
      }
    };
  },
  created() {
    this.__init();
  },
  mounted() {
    // var examItems = document.querySelectorAll('.exam-item');
    // for(var i = 0; i < examItems.length; i++) {
    //   examItems[i].ontouchstart = function() {
    //     this.classList.add('active');
    //     this.ontouchend = function() {
    //       this.classList.remove('active');
    //     }
    //   }
    // }
  },
  methods: {
    __init() {
      this.$toast.loading({
        mask: true,
        message: "加载中"
      });
      this.getExamData();
    },
    getExamData() {
      Promise.all([
        examApi.getExamList({ joinState: '0', examState: '1' }),
        examApi.getExamList({ joinState: '1', examState: '-1' }),
        examApi.getExamList({ joinState: '0', examState: '2' }),
        examApi.getExamList({ joinState: '-1', examState: '0' })
      ])
      .then(res => {
        if(res[0].success == 1) {
          this.pushExamList = res[0].data
        }
        if(res[1].success == 1) {
          this.doneExamList = res[1].data
        }
        if(res[2].success == 1) {
          this.missExamList = res[2].data
        }
        if(res[3].success == 1) {
          this.notBeginExamList = res[3].data
        }
        this.$toast.clear();
        this.isLoading = false;
      })
      .catch(err => {
        this.isLoading = false;
        console.log(err);
      })
    },
    onRefresh() {
      this.getExamData();
    },
    goExamNote(exam) {
      // console.log("要去参加的考试", exam)
      examApi.startExam({paperId: exam.paperId})
      .then(res => {
        // console.log(res)
        if(res.success == 1) {
          //  考试须知
          console.log(res.msg);
          var param = {
            isTestEaxm: false,
            examData: exam
          };
          this.$router.push({ name: "examNotes", params: { exam: param } });
        }else {
          this.$toast.fail('已参加过该考试');
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    goExam(exam) {
      console.log("查看试卷",exam);
      var param = {
        isTestEaxm: false,
        examData: exam
      };
      // console.log("当前考试数据", exam);
      if(exam.userExamStatus == 2) {
        //  用户已经考过试
        // new Date().getTime() > new Date((exam.showTime)).getTime()
        if(new Date().getTime() > new Date((exam.showTime)).getTime()) {
          //  试卷可以查看成绩日期
          var param = {
            exam: exam,
            isCheck: true,
            isTestType: false,
            isPractice: true,
            passScore: exam.passScore,
            userScore: exam.userScore,
            trueCount: exam.rightNums,
            falseCount: exam.errorNums,
            totalCount: exam.quNums,
            useTime: new Date(exam.userEndTime).getTime() - new Date(exam.userStartTime).getTime()
          }
        }else {
          //  不可以查看成绩
          var param = {
            isCheck: true,
            cantCheck: true,
            isTestType: false,
            useTime: new Date(exam.userEndTime).getTime() - new Date(exam.userStartTime).getTime()
          }
        }
        this.$router.push({name: 'examResult', params: {result: param}})
        
      }else {
        this.$router.push({ name: "answerTest", params: { exam: param } });
      }
    },
    missExam() {
      this.$toast.fail("考试已结束");
    },
    cantExam() {
      this.$toast.fail("考试尚未开始");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";
.exam-main {
  width: 100%;
  height: 100%;
  .van-pull-refresh {
    padding-top: $headerHeight;
    padding-bottom: $footerHeight + 3px;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    ::v-deep.van-pull-refresh__track {
      // height: 100%;
      height: unset;
    }
    &::-webkit-scrollbar {
      display: none;
    }

    /* 考试推送 */
    .test-push {
      padding-top: 20px;
      width: 100%;
      height: 100%;
      .swiper-container {
        width: 100%;
        height: 120px;
        ::v-deep.swiper-slide {
          color: #fff;
          @include bgImage;
          border-radius: 4px;
          background-image: url("~@/assets/imgs/test/bg-1.png");
          .test-title {
            margin: 0;
            margin-top: 16px;
            font-size: 20px;
          }
          .test-time {
            margin: 0;
            margin-top: 8px;
            // margin-top: 12px;
            font-size: 10px;
          }
          .test-now {
            margin-top: 8px;
            // margin-top: 20px;
            width: 90px;
            height: 30px;
            line-height: 30px;
            font-size: 13px;
            background: rgba(0, 0, 0, 0);
            border-color: #fff;
          }
        }
      }
      .push-pagination {
        margin-top: 10px;
        ::v-deep.swiper-pagination-bullet {
          margin-left: 10px;
          width: 10px;
          height: 10px;
          background: $baseColor;
        }
      }
    }
    /* 考试推送 */
  }
  .container {
    padding: 0 $basePadding;
    height: 100%;
    /* 考试练习 */
    .test-classify {
      padding-top: 20px;
      .title {
        font-size: 24px;
        color: $fontColor;
        text-align: left;
      }
      .classify {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
        width: 100%;
        height: 60px;
        .classify-item {
          width: 164px;
          height: 100%;
          line-height: 60px;
          font-size: 18px;
          color: #fff;
          font-weight: 400;
          border-radius: 4px;
          background-size: cover;
          &.simulation {
            background: url("~@/assets/imgs/test/simulation@2x.png") center
              no-repeat;
          }
          &.practice {
            background: url("~@/assets/imgs/test/practice@2x.png") center
              no-repeat;
          }
        }
      }
    }
    /* 考试练习 */

    /* 考试记录 */
    .test-record {
      position: relative;
      // height: 100%;
      font-size: 24px;
      color: $fontColor;
      box-sizing: border-box;
      .van-sticky--fixed {
        .title-wrapper {
          padding: 0 16px;
          height: 44px;
          line-height: 44px;
          box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          .record-pagination {
            ::v-deep.swiper-pagination-bullet {
              height: 44px;
              line-height: 44px;
            }
          }
        }
      }
      .title-wrapper {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        height: 54px;
        background: #fff;
        .record-pagination {
          display: flex;
          ::v-deep.swiper-pagination-bullet {
            margin-left: 20px;
            width: unset;
            height: 50px;
            line-height: 80px;
            font-size: 15px;
            color: $fontColor;
            border-radius: 0;
            background: none;
            outline: none;
            opacity: 0.5;
            &.swiper-pagination-bullet-active {
              opacity: 1;
            }
          }
        }
      }
      .swiper-container {
        width: 100%;
        overflow: hidden;
        .swiper-slide {
          overflow: hidden;
          .exam-list {
            width: 100%;
            .exam-item {
              position: relative;
              padding: 20px 0;
              border-bottom: 1px solid #eee;
              box-sizing: border-box;
              transition: all .3s ease;
              &.active {
                background: $activeColor;
              }
              .exam-title-wrapper {
                display: flex;
                align-items: center;
                font-size: 18px;
                text-align: left;
                .title {
                  color: #333;
                }
                .status {
                  margin-left: 10px;
                  width: 40px;
                  height: 14px;
                  border-radius: 2px;
                  @include bgImage;
                  &.under-way {
                    background-image: url("~@/assets/imgs/test/underway@2x.png");
                  }
                  &.done {
                    background-image: url("~@/assets/imgs/test/done@2x.png");
                  }
                }
              }
              .test-info {
                .test-time {
                  display: flex;
                  margin-top: 9px;
                  font-size: 12px;
                  color: #999999;
                  overflow: hidden;
                  .icon {
                    display: inline-block;
                    width: 15px;
                    height: 15px;
                  }
                  .done-time {
                    @include vertical;
                    .done-icon {
                      margin-left: 1px;
                      background: url("~@/assets/imgs/test/done-time@2x.png")
                        center no-repeat;
                      background-size: 14px 14px;
                    }
                    .time {
                      margin-left: 8px;
                    }
                  }
                  .use-time {
                    margin-left: 32px;
                    @include vertical;
                    .use-icon {
                      background: url("~@/assets/imgs/test/use-time@2x.png")
                        center no-repeat;
                      background-size: 14px 14px;
                    }
                    .time {
                      margin-left: 8px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    /* 考试记录 */
  }
}
</style>