<template>
  <div class="no-net-main">
    <span class="no-net-icon"></span>
    <span class="text">暂无网络</span>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.no-net-main {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  .no-net-icon {
    width: 180px;
    height: 150px;
    @include bgImage;
    background-image: url("~@/assets/imgs/no_data/no-net@2x.png");
  }
  .text {
    font-size: 16px;
    color: #999;
  }
}
</style>