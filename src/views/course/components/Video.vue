<template>
  <div class="video-main">
    <div class="video-container">
      <video-player
        ref="video"
        id="video-player-box"
        :playsinline="true"
        :options="playerOptions"
        x5-video-player-type="h5"
        :events="events"
        @play="btnFullEvent($event)"
        @pause="videoPause"
        @fullscreenchange="onPlayerFullScreenchange($event)"
      ></video-player>
    </div>
  </div>
</template>

<script>
import videojs from "video.js";
import "videojs-contrib-hls";
import "video.js/dist/video-js.css";

import { videoPlayer } from "vue-video-player";

export default {
  name: "Video",
  props: {
    videoSrc: {
      type: String
    },
    coverImg: {
      type: String
    },
    videoTitle: {
      type: String
    }
  },
  components: {
    videoPlayer
  },
  data() {
    return {
      clientType: "",
      events: ["fullscreenchange"],
      playerOptions: {
        muted: false, // 静音
        language: "zh-CN", // 语言
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        aspectRatio: "16:9",
        sources: [
          {
            type: "video/mp4",
            src: ""
            // src: "https://www.runoob.com/try/demo_source/movie.mp4"
          }
        ],
        poster: '',
        fluid: true, // 流体大小，按比例缩放适应容器
        width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 无法播放显示默认信息
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      }
    };
  },
  computed: {
    player() {
      return this.$refs.video.player;
    }
  },
  created() {
    // console.log(this.videoTitle);
    this.playerOptions.sources[0].src = this.videoSrc;
    this.playerOptions.poster = this.coverImg;
  },
  mounted() {
    this.createTitle();
    this.fullOfAndroid();
  },
  methods: {
    createTitle() {
      // 自定义标题组件
      var Component = videojs.getComponent("Component");
      var TitleBar = videojs.extend(Component, {
        constructor: function(player, options) {
          Component.apply(this, arguments);
          if (options.text) {
            this.updateTextContent(options.text);
          }
        },
        createEl: function() {
          return videojs.dom.createEl("div", {
            className: "vjs-title-bar"
          });
        },
        updateTextContent: function(text) {
          if (typeof text !== "string") {
            text = "Title Unknown";
          }
          videojs.dom.emptyEl(this.el());
          videojs.dom.appendContent(this.el(), text);
        }
      });

      videojs.registerComponent("TitleBar", TitleBar);
      //  插入视频标题
      this.player.addChild("TitleBar", { text: this.videoTitle });
    },
    videoPause() {
      //  获取暂停时间
      // console.log(this.player.currentTime());
    },
    btnFullEvent() {
      //  进入全屏
      var btnFull = document.querySelector(".vjs-fullscreen-control");
      btnFull.click();
    },
    onPlayerFullScreenchange(player) {
      // IOS全屏方式
      if (this.clientType == "IOS") {
        var el = document.webkitFullscreenElement;
        // console.log("全屏元素", el);
        if (el) {
          plus.screen.lockOrientation("landscape");
        } else {
          plus.screen.lockOrientation("portrait-primary");
        }
      }
    },
    fullOfAndroid() {
      //  安卓全屏方式
      this.clientType = plus.os.name;
      if (window.plus) {
        var self = plus.webview.currentWebview();
        // console.log("当前webview", self.getURL());
        self.setStyle({
          videoFullscreen: "landscape"
        });
      } else {
        document.addEventListener("plusready", that.plusReady(), false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

@media all and (orientation: landscape) {
  html,
  body {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}

.video-main {
  width: 100%;
  height: 100%;
  .video-container {
    position: relative;
    padding-top: 50px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    #video-player-box {
      ::v-deep.vjs-title-bar {
        opacity: 0;
        font-size: 15px;
        padding: 16px 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        color: white;
        text-align: left;
        background: rgba(0, 0, 0, 0.5);
      }
      ::v-deep.vjs-title-bar {
        margin-left: 30px;
      }
      ::v-deep.video-js.vjs-paused.vjs-has-started,
      ::v-deep.video-js.vjs-user-active.vjs-has-started {
        .vjs-title-bar {
          opacity: 1;
        }
      }
      ::v-deep.video-js {
        .vjs-control-bar {
          .vjs-time-control {
            display: block;
            padding: 0;
            min-width: 1em;
          }
        }
        .vjs-remaining-time {
          display: none;
        }
        &.vjs-playing {
          .vjs-big-play-button {
            display: none;
          }
        }
        //  暂停时显示播放大按钮
        &.vjs-paused {
          .vjs-big-play-button {
            display: block;
          }
        }
      }
      // 播放按钮位置
      ::v-deep.vjs-big-play-button {
        top: 50%;
        left: 50%;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>