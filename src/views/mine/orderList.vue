<template>
  <div class="work-order-main">
    <Header :show-back="true" title-text="我的工单" :hide-border="true" :show-task="true"></Header>
    <div class="container">
      <van-tabs v-model="active" swipeable @change="onChange" line-width="12">
        <van-tab title="待处理">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <ul class="work-order-list" v-if="pendingList && pendingList.length > 0">
              <li
                v-for="(order, index) in pendingList"
                :key="index"
                @click="goOrder(order)"
                class="work-order-item"
              >
                <div class="title">{{ order.ordermemo }}</div>
                <div class="content">{{ order.repcontent }}</div>
                <div class="time-wrapper">
                  <div class="time">{{ order.reptime | formatTime }}</div>
                  <div class="order-number">工单号：{{ order.ordercode }}</div>
                </div>
              </li>
            </ul>
            <No-data v-else></No-data>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="进行中">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <ul class="work-order-list" v-if="underwayList && underwayList.length > 0">
              <li
                v-for="(order, index) in underwayList"
                :key="index"
                @click="goOrder(order, true)"
                class="work-order-item"
              >
                <div class="title">{{ order.ordermemo }}</div>
                <div class="content">{{ order.repcontent }}</div>
                <div class="time-wrapper">
                  <div class="time">{{ order.reptime | formatTime }}</div>
                  <div class="order-number">工单号：{{ order.ordercode }}</div>
                </div>
              </li>
            </ul>
            <No-data v-else></No-data>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="已完成">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <ul class="work-order-list" v-if="doneList && doneList.length>0">
              <li
                v-for="(order, index) in doneList"
                :key="index"
                @click="goOrder(order, true)"
                class="work-order-item"
              >
                <div class="title">{{ order.ordermemo }}</div>
                <div class="content">{{ order.repcontent }}</div>
                <div class="time-wrapper">
                  <div class="time">{{ order.reptime | formatTime }}</div>
                  <div class="order-number">工单号：{{ order.ordercode }}</div>
                </div>
              </li>
            </ul>
            <No-data v-else></No-data>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import NoData from "@/components/NoData";
import Header from "@/components/Header.vue";

import mineApi from "@/api/mine";
import mixins from "@/mixins/filterTime";

export default {
  name: "workOrder",
  components: {
    Header,
    NoData
  },
  mixins: [mixins],
  data() {
    return {
      active: 0,
      isLoading: false,
      orderList: [],
      pendingList: [],
      underwayList: [],
      doneList: []
    };
  },
  created() {
    this.$toast.loading({
      mask: true,
      message: "加载中"
    });
    this.__init();
  },
  methods: {
    __init() {
      Promise.all([
        mineApi.getTaskList({ typeCode: "" }),
        mineApi.getTaskList({ typeCode: "1" }),
        mineApi.getTaskList({ typeCode: "2" })
      ])
        .then(res => {
          this.isLoading = false;
          this.$toast.clear();
          if (res[0].success == 1) {
            this.pendingList = res[0].data;
          }
          if (res[1].success == 1) {
            this.underwayList = res[1].data;
          }
          if (res[2].success == 1) {
            this.doneList = res[2].data;
          }
        })
        .catch(err => {
          this.isLoading = false;
          console.log(err);
        });
    },
    onChange() {},
    onRefresh() {
      this.__init();
    },
    goOrder(order, check) {
      var param = {
        orderid: order.orderid,
        flowtype: order.flowtype,
        check
      };
      this.$router.push({ name: "order", params: { order: param } });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.work-order-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0;
    .van-tabs {
      height: 100%;
      ::v-deep.van-tabs__wrap {
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #eee;
        .van-tab {
          line-height: 30px;
          &.van-tab--active {
            color: $baseColor;
          }
        }
        .van-ellipsis {
          height: 30px;
        }
        .van-tabs__line {
          background: $baseColor;
        }
      }
      ::v-deep.van-tabs__content {
        height: calc(100% - 31px);
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
              .work-order-list {
                padding: 0 $basePadding;
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                overflow: auto;
                &::-webkit-scrollbar {
                  display: none;
                }
                .work-order-item {
                  padding: 16px 0;
                  text-align: left;
                  box-sizing: border-box;
                  border-bottom: 1px solid #eeeeee;
                  .title {
                    font-size: 16px;
                    color: #333;
                  }
                  .content {
                    margin: 10px 0 16px;
                    font-size: 14px;
                    color: #555;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  .time-wrapper {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #999;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>