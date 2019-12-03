<template>
  <div class="course-main">
    <Header title-text="课程" :hide-border="true"></Header>
    <div class="container">
      <!-- 可滑动导航栏 -->
      <van-tabs v-if="findList && findList.length > 0" v-model="active" swipeable @change="onChange" line-width="12">
        <van-tab v-for="(find, index) in findList" :key="find.codeVal" :title="find.codeName">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <ul class="course-list" v-if="courseList && courseList.length > 0">
              <li
                v-for="(course, index) in courseList"
                :key="index"
                @click="goDetail(course)"
                class="course-item"
              >
                <div class="content-wrapper">
                  <div class="cover-wrapper">
                    <van-image
                      fill
                      v-if="course.frontCover"
                      :src="url + course.frontCover"
                      alt="cover"
                    >
                    </van-image>
                    <img v-else src="@/assets/imgs/no_data/no-pic.png" alt="no-data" />
                  </div>
                  <div class="detail">
                    <p class="title">{{ course.name }}</p>
                    <div class="progress-wrapper">
                      <span class="time">{{ course.addtime | formatTime }}</span>
                      <span class="progress-num">已学{{ course.studyPlan }}</span>
                    </div>
                  </div>
                </div>
                <div class="progress" :style="{ width: course.studyPlan }"></div>
              </li>
            </ul>
            <No-data v-else></No-data>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
      <van-pull-refresh v-else v-model="isLoading1" @refresh="onRefresh">
        <No-data></No-data>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import NoNet from "@/components/NoNet";
import NoData from "@/components/NoData";
import Header from "@/components/Header";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

import { URL } from "@/api/url";
import course from "@/api/course";

export default {
  name: "Course",
  components: {
    NoNet,
    NoData,
    Header,
    swiper,
    swiperSlide
  },
  data() {
    return {
      url: URL,
      isLoading1: false,
      isLoading: false,
      findList: [], // 分类列表
      courseList: [], // 课程列表
      active: 0,
      netErr: false
    };
  },
  created() {
    this.__init();
  },
  computed: {
    curFind() {
      return this.findList[Number(this.active)];
    }
  },
  filters: {
    formatTime(time) {
      return time.slice(0, 10);
    },
    formatPrg(num) {
      return Math.ceil(num);
    }
  },
  methods: {
    __init() {
      //  加载样式
      this.$toast.loading({
        mask: true,
        message: "加载中..."
      });
      this.__getFindList();
    },
    __getFindList() {
      //  初始化
      course
        .getFindList({})
        .then(res => {
          // console.log("列表", res);
          if (res.success === 1) {
            this.$toast.clear();
            //  筛选二级分类
            var list = [];
            for (var i in res.data) {
              for (var k in res.data[i]) {
                if (k == "childs") {
                  list.push(...res.data[i][k]);
                }
              }
            }
            this.findList = list;
            //  初始化分类
            var curFind = this.findList[0];
            //  初始化参数
            // console.log("初始化数据", curFind);
            var params = {
              class: curFind.upCodeVal,
              type: curFind.codeVal
            };
            //  获取当前tab课程
            this.__getCourseList(params);
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.isLoading1 = false;
          this.netErr = true;
        });
    },
    __getCourseList(params) {
      course
        .getCourseList(params)
        .then(res => {
          if (res.success == 1) {
            // console.log('课程', res);
            this.isLoading = false;
            this.isLoading1 = false;
            this.courseList = res.data;
            // console.log("初始化数据", this.courseList);
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.isLoading1 = false;
          console.log(err);
        });
    },
    goDetail(course) {
      this.$router.push({ name: "courseDetail", params: { course } });
    },
    onRefresh() {
      this.__getFindList();
      this.active = 0;
    },
    onChange(name, title) {
      var params = {
        class: this.curFind.upCodeVal,
        type: this.curFind.codeVal
      };
      this.__getCourseList(params);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.course-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    .van-tabs {
      width: 100%;
      height: 100%;
      ::v-deep.van-tab--active {
        color: $baseColor;
      }
      ::v-deep.van-tabs__line {
        background: $baseColor;
      }
      ::v-deep.van-tabs__wrap {
        height: 30px;
        .van-ellipsis {
          height: 30px;
          line-height: 30px;
        }
      }
      ::v-deep.van-tabs__line {
        width: 20px;
      }
      ::v-deep.van-tabs__content {
        height: calc(100% - 30px);
        box-sizing: border-box;
        .van-tab__pane {
          height: 100%;
          .van-pull-refresh {
            height: 100%;
            overflow: auto;
            &::-webkit-scrollbar {
              display: none;
            }
            .van-pull-refresh__track {
              height: 100%;
              .course-list {
                margin: 0 auto;
                padding-top: 20px;
                width: 99%;
                .course-item {
                  position: relative;
                  margin-bottom: 15px;
                  padding: 20px 16px;
                  width: 100%;
                  height: 120px;
                  letter-spacing: 1px;
                  box-sizing: border-box;
                  border-radius: 4px;
                  box-shadow: 0px 1px 5px #ebedf0;
                  // box-shadow: 0px 1px 5px rgba(238, 238, 238, 1);
                  overflow: hidden;
                  p {
                    margin: 0;
                  }
                  .content-wrapper {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    .cover-wrapper {
                      width: 80px;
                      height: 80px;
                      border-radius: 4px;
                      .van-image {
                        width: 100%;
                        height: 100%;
                        .van-image__error {
                          .van-icon {
                            &::before {
                              display: block;
                              width: 80px;
                              height: 80px;
                              content: '';
                              @include bgImage;
                              background-image: url("~@/assets/imgs/no_data/no-pic.png")
                            }
                          }
                        }
                      }
                      img {
                        width: 100%;
                        height: 100%;
                        border-radius: 4px;
                      }
                    }
                    .detail {
                      display: flex;
                      flex-direction: column;
                      justify-content: space-between;
                      padding: 5px 0 5px 16px;
                      width: calc(100% - 80px);
                      height: 100%;
                      text-align: left;
                      box-sizing: border-box;
                      .title {
                        font-size: $fontSize-m-l;
                        color: #333;
                      }
                      .progress-wrapper {
                        display: flex;
                        justify-content: space-between;
                        font-size: 12px;
                        color: #999;
                      }
                      .progress-line {
                        width: 100%;
                        height: 1px;
                      }
                    }
                  }
                  .progress {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    height: 2px;
                    background: $baseColor;
                    border-radius: 0 0 0 4px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .van-pull-refresh {
      width: 100%;
      height: 100%;
      ::v-deep.van-pull-refresh__track {
        height: 100%;
      }
    }
  }
}
</style>