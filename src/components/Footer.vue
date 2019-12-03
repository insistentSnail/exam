<template>
  <div class="footer-main">
    <div class="nav">
      <router-link :to="{name: 'course'}" replace class="nav-item course">
        <div class="icon course-icon"></div>
        <div class="text">课程</div>
      </router-link>
      <router-link :to="{name: 'exam'}" replace class="nav-item test">
        <div class="icon test-icon"></div>
        <div class="text">考试</div>
      </router-link>
      <router-link :to="{name: 'mine'}" replace class="nav-item mine">
        <div class="icon mine-icon"></div>
        <div class="text">我的</div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.footer-main {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid #eee;
  background: #fff;
  box-sizing: border-box;
  z-index: 99;
  .nav {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 8px;
      width: 50px;
      height: 100%;
      color: #bbb;
      line-height: 50px;
      text-decoration: none;
      &.router-link-active {
        color: #2699fb;
      }
      .icon {
        width: 20px;
        height: 20px;
        @include bgImage;
      }
      .text {
        margin-top: 2px;
        line-height: 1;
      }
      &.course {
        .course-icon {
          background-image: url("~@/assets/imgs/icons/course@2x.png");
        }
        &.router-link-active {
          .course-icon {
            @include bgImage;
            background-image: url("~@/assets/imgs/icons/course-active@2x.png");
          }
        }
      }
      &.test {
        .test-icon {
          background-image: url("~@/assets/imgs/icons/test@2x.png");
        }
        &.router-link-active {
          .test-icon {
            @include bgImage;
            background-image: url("~@/assets/imgs/icons/test-active@2x.png");
          }
        }
      }
      &.work {
        .work-icon {
          background-image: url("~@/assets/imgs/icons/work@2x.png");
        }
        &.router-link-active {
          .work-icon {
            background-image: url("~@/assets/imgs/icons/work-active@2x.png");
          }
        }
      }
      &.mine {
        .mine-icon {
          background-image: url("~@/assets/imgs/icons/mine@2x.png");
        }
        &.router-link-active {
          .mine-icon {
            background-image: url("~@/assets/imgs/icons/mine-active@2x.png");
          }
        }
      }
    }
  }
}
</style>