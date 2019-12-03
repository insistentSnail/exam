<template>
  <div class="my-order-main">
    <Header :show-back="true" title-text="我上报的工单"></Header>
    <div class="container">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <ul class="work-order-list" v-if="orderList.length>0">
          <li
            v-for="(order, index) in orderList"
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
    </div>
  </div>
</template>

<script>
import NoData from "@/components/NoData";
import Header from "@/components/Header";

import mineApi from "@/api/mine";
import mixins from "@/mixins/filterTime";

export default {
  name: "MyOrder",
  components: {
    Header,
    NoData
  },
  mixins: [mixins],
  data() {
    return {
      isLoading: false,
      orderList: []
    };
  },
  created() {
    this.$toast.loading({
      mask: true,
      message: '加载中'
    })
    this.__init();
  },
  methods: {
    __init() {
      mineApi
        .getTaskList({typeCode: '3'})
        .then(res => {
          this.$toast.clear();
          console.log(res);
          if(res.success == 1) {
            this.isLoading = false;
            this.orderList = res.data;
          }
        })
        .catch(err => {
          this.isLoading = false;
          console.log(err);
        });
    },
    onRefresh() {
      this.__init();
    },
    goOrder(order) {
      var param = {
        orderid: order.orderid,
        flowtype: order.flowtype,
        check: true
      }
      this.$router.push({name: 'order', params: {order: param}});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.my-order-main {
  width: 100%;
  height: 100%;
  .container {
    @include containerStyle;
    padding-bottom: 0;
    .van-pull-refresh {
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      ::v-deep.van-pull-refresh__track {
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
</style>