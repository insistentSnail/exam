<template>
  <div class="course-detail-main">
    <!-- v-if="courseData.filetype != '0'" -->
    <Header :show-back="true" :title-text="courseData.name"></Header>
    <div class="container" :class="{none: courseData.filetype != '1'}">
      <!-- pdf组件 -->
      <!-- http://file.gp58.com/file/2018-11-14/111405.pdf -->
      <MPdf v-if="courseData.filetype == '1'" :pdf-src="url + courseData.file" :course-id="courseData.id"></MPdf>

      <!-- video组件 -->
      <MVideo v-if="courseData.filetype == '0'" :video-src="url + courseData.file" :cover-img="url + courseData.frontCover" :video-title="courseData.name"></MVideo>

      <!-- ppt -->
      <div v-if="courseData.filetype == '2'" class="ppt-tip">
        <h1>文件正在下载，请使用其他工具打开</h1>
        <iframe :src="url + courseData.file" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { URL } from "@/api/url";

import Header from "@/components/Header";
import MPdf from "@/views/course/components/Pdf";
import MVideo from "@/views/course/components/Video";

import courseApi from "@/api/course";

export default {
  name: 'CourseDetail',
  components: {
    Header,
    MPdf,
    MVideo
  },
  data() {
    return {
      url: URL,
      courseData: {},
      updateTime: 20000 // 学习时长更新间隔
    }
  },
  created() {
    var course = this.$route.params.course;
    this.courseData = course;
    console.log(this.courseData)
  },
  mounted() {
    this.updateStudyTime();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    updateStudyTime() {
      //  轮询增加学习时长
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        var param = {
          id: this.courseData.id,
          studytime: this.updateTime / 1000 // 转换为秒
        }
        courseApi.updateStudyTime(param)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
      }, this.updateTime);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.course-detail-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    padding-bottom: 0;
    overflow: hidden;
    &.none {
      padding: 0;
    }
    .ppt-tip {
      padding-top: $headerHeight;
      h1 {
        font-size: 14px;
      }
    }
  }
}
</style>