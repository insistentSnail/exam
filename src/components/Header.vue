<template>
  <div class="header-main" :class="{hideboder: hideBorder }">
    <div v-if="showBack" @click="$router.go(-1)" class="back"></div>
    <div class="title">{{ titleText }}</div>
    <div v-if="showSub" class="sub-test" @click="doSub">交卷</div>
    <div v-if="showTask" class="check-task" @click="checkMyTask">我上报的工单</div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    showBack: {
      type: Boolean
    },
    titleText: {
      type: String
    },
    hideBorder: {
      type: Boolean
    },
    showSub: {
      type: Boolean
    },
    showTask: {
      type: Boolean
    }
  },
  data() {
    return {}
  },
  methods: {
    doSub() {
      this.$emit('doSub');
    },
    checkMyTask() {
      this.$router.push({name: 'myOrder'});
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.header-main {
  position: fixed;
  top: 0;
  left: 0;
  padding: 0 16px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  box-sizing: border-box;
  border-bottom: 1px solid #F0EFF4;
  background: #fff;
  z-index: 99;
  &.hideboder {
    border: none;
  }
  .back {
    position: absolute;
    width: 30px;
    height: 100%;
    left: 16px;
    background: url("~@/assets/imgs/icons/back.png") -3px center no-repeat;
    background-size: 21px 21px;
  }
  .title {
    position: absolute;
    left: 50%;
    font-size: 18px;
    color: $fontColor;
    font-weight: 700;
    transform: translateX(-50%);
  }
  .sub-test,
  .check-task {
    position: absolute;
    right: 16px;
  }
  .sub-test {
    font-size: 14px;
    color: $baseColor;
  }
}
</style>