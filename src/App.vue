<template>
  <div id="app">
    <!-- 页面缓存 -->
    <transition :name="transName" v-if="$route.meta.keepAlive">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <transition :name="transName" v-else>
      <router-view></router-view>
    </transition>
    <Footer v-if="showFooter"></Footer>
  </div>
</template>

<script>
import Footer from "@/components/Footer";

import { closeGuide } from "@/utils/guide";

export default {
  name: "App",
  components: {
    Footer
  },
  data() {
    return {
      transName: "transL",
      showFooter: "true"
    };
  },
  watch: {
    $route(to, from) {
      if (to.name == "examNotes" && from.name == "answerTest") {
        this.$router.replace({ name: "exam" });
      }
      if(to.name == "guide" && from.name == "course") {
        //  首次进入页面，防止路由回退
        this.$router.replace({ name: "home" });
      }
      this.showFooter = to.meta.showFooter;
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transName = toDepth < fromDepth ? "transR" : "transL";
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/font/font.scss";
@import "@/assets/style/reset.scss";
@import "@/assets/style/common.scss";

html,
body {
  font-family: "hyjt";
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  overflow: hidden;
  @include GPU;
  a {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
}
.transL-enter {
  transform: translateX(100%);
}
.transR-enter {
  transform: translateX(-100%);
}
.transL-enter-active,
.transR-enter-active {
  transition: all 0.4s ease;
}

</style>
