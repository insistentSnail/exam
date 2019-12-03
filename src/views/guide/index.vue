<template>
  <div class="guide-main">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(guide, index) in guideImgs" :key="index">
        <div class="guide-page-wrapper">
          <img :src="guide.src" alt="引导页" />
          <!-- swiper pagination -->
          <div class="swiper-pagination" slot="pagination"></div>
        </div>
        <div class="desc-wrapper">
          <div class="desc">
            <p>{{ guide.text1 }}</p>
            <p>{{ guide.text2 }}</p>
          </div>
          <!-- 立即体验按钮 -->
          <div class="btn-wrapper">
            <van-button v-if="index == guideImgs.length-1" @click="goNow" class="go-now">立即体验</van-button>
            <van-button v-else @click="goNow" class="jump-index">跳过</van-button>
            <!-- <router-link v-if="index == guideImgs.length-1" :to="{name: 'home'}" replace class="go-now" tag="van-button">立即体验</router-link>
            <router-link v-else :to="{name: 'home'}" replace class="jump-index" tag="van-button">跳过</router-link> -->
          </div>
        </div>
      </swiper-slide>
      
    </swiper>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

import { closeGuide } from "@/utils/guide";

export default {
  name: "Guide",
  components: {
    swiper,
    swiperSlide
  },
  mounted() {
    // closeGuide(); // 设置 guideShow
  },
  data() {
    return {
      guideShow: false,
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        }
      },
      guideImgs: [
        { id: 1, text1: '在线学习', text2: '随时随地上名校', src: require("@/assets/imgs/guide/page-1@2x.png") },
        { id: 2, text1: '在线考试', text2: '方便快捷轻松考', src: require("@/assets/imgs/guide/page-2@2x.png") },
        { id: 3, text1: '在线办公', text2: '工单消息漏不了', src: require("@/assets/imgs/guide/page-3@2x.png") }
      ]
    };
  },
  methods: {
    goNow() {
      closeGuide();
      this.$router.replace({name: 'home'})
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.guide-main {
  width: 100%;
  height: 100%;
  background: #fff;
  .swiper-container {
    height: 100%;
    .swiper-pagination {
      margin-top: 20px;
      width: 100%;
      height: 10px;
      ::v-deep.swiper-pagination-bullet {
        margin-right: 20px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: $baseColor;
        opacity: 0.2;
        transition: all 0.3s ease;
        &:last-child {
          margin-right: 0;
        }
        &.swiper-pagination-bullet-active {
          width: 20px;
          border-radius: 10px;
          opacity: 1;
        }
      }
    }
    .swiper-slide {
      position: relative;
      .guide-page-wrapper {
        height: 78%;
        background: bottom no-repeat;
        background-size: 120% 100%;
        background-image: url("~@/assets/imgs/guide/bg@2x.png");
        overflow: hidden;
        img {
          margin-top: 60px;
          width: 247px;
          height: 75%;
        }
      }
      .desc-wrapper {
        margin-top: 8px;
        height: 22%;
        .desc {
          p {
            margin: 0;
            color: #333;
            &:nth-child(1) {
              font-size: 24px;
            }
            &:nth-child(2) {
              font-size: 15px;
            }
          }
        }
        .btn-wrapper {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .go-now {
            margin: 0 auto;
            width: 200px;
            height: 44px;
            font-size: 16px;
            color: #fff;
            border-radius: 100px;
            background: $baseColor;
          }
          .jump-index {
            align-self: flex-end;
            margin-top: -4px;
            margin-right: 20px;
            width: 80px;
            height: 40px;
            font-size: 16px;
            color: #ddd;
            line-height: 40px;
            box-sizing: border-box;
            border-radius: 100px;
          }
        }
      }
    }
  }
}
</style>