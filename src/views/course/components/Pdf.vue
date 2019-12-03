<template>
  <div class="pdf-main">
    <div id="container"></div>
  </div>
</template>

<script>
import PdfH5 from "pdfh5";
import "pdfh5/css/pdfh5.css";

export default {
  name: 'MPdf',
  props: {
    pdfSrc: {
      type: String
    }
  },
  data() {
    return {
      pdfh5: null,
      totalNum: 0,
      curNum: 0,
      src: this.pdfSrc,
      // src: "http://doreen.wicp.net:18090/sgphsb/upload/2019101814471547152019100116322532251.pdf",
    };
  },
  mounted() {
    var that = this;
    this.pdfh5 = new PdfH5("#container", {
      pdfurl: this.src,
      renderType: "canvas",
      lazy: true,
      URIenable: true,
      type: 'fetch',
      cMapUrl: "https://unpkg.com/browse/pdfjs-dist@2.0.489/cmaps/" ,
      cMapPacked: true
    });
    this.pdfh5.on("ready", function() {
      that.totalNum = this.totalNum;
      // that.$toast.loading({
      //   mask: true,
      //   message: "加载中..."
      // });
    });
    this.pdfh5.on("render", function() {
      // that.$toast.clear();
    });
    this.pdfh5.on("scroll", function() {
      that.curNum = this.currentNum;
    });
  },
  methods: {
    URLDecode(src) {
      return decodeURI(src);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.pdf-main {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  ::v-deep.pdfjs {
    .loadingBar {
      display: none;
      .progress {
        display: none;
      }
    }
    .viewerContainer {
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>