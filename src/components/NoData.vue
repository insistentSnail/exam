<template>
  <div class="no-data-main">
    <span class="no-data-icon"></span>
    <span class="text">暂无数据</span>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.no-data-main {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 220px;
  .no-data-icon {
    width: 180px;
    height: 150px;
    @include bgImage;
    background-image: url("~@/assets/imgs/no_data/no-data@2x.png");
  }
  .text {
    font-size: 16px;
    color: #999;
  }
}
</style>