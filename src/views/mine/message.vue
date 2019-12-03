<template>
  <div class="message-main">
    <Header :show-back="true" title-text="我的消息"></Header>
    <div class="container">
      <!-- 下拉刷新 -->
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">

        <!-- 触底刷新 -->
        <van-list v-model="loading" :finished="finished" error-text="请求失败，点击重新加载" finished-text="没有更多了" @load="onLoad">

          <!-- 消息列表 -->
          <ul class="msg-list">
            <van-swipe-cell v-for="msg in msgList" :key="msg.id">

              <!-- 消息 -->
              <li @click="goDetail(msg, $event)" class="msg-item" tag="li">
                <div class="title">
                  <span class="title-icon" :class="[msg.type == '0' ? 'test' : 'approval']"></span>
                  <span class="text">{{ msg.msgTitle }}</span>
                </div>
                <div class="desc" v-html="msg.msgContent"></div>
                <div class="time-wrapper">
                  <span class="time">{{ msg.sendTime | formatTime }}</span>
                  <span class="status">{{ msgStatus(msg.msgStatus) }}</span>
                </div>
              </li>

              <!-- 删除按钮 -->
              <template slot="right">
                <van-button square type="danger" text="删除" @click="delMsg(msg)" />
              </template>
            </van-swipe-cell>
          </ul>

        </van-list>

      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

import mineApi from "@/api/mine";
import mixins from "@/mixins/filterTime";

export default {
  name: "Message",
  components: {
    Header
  },
  mixins: [mixins],
  data() {
    return {
      msgList: [],
      list: [],
      pageNum: 1, // 当前页数
      pageSize: 10, // 每一页的数量
      totalCount: 0, // 全部数量
      loading: false,
      finished: false,
      isLoading: false
    };
  },
  methods: {
    getMsg(param) {
      mineApi
        .getMsg(param)
        .then(res => {
          this.$toast.clear();
          this.isLoading = false;
          this.pageNum = 2;
          this.finished = false;
          this.msgList = [];
          if (res.success === 1) {
            this.msgList = res.data;
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.isLoading = false;
          console.log(err);
        });
    },
    goDetail(msg, event) {
      var cell = event.path.find(item => item.className == 'van-swipe-cell__wrapper')
      
      if(cell.style.transform == 'translate3d(0px, 0px, 0px)') {
        var param = {
          rcvMsgId: msg.rcvMsgId
        };
        mineApi
          .changeMsgStatus(param)
          .then(res => {
            console.log("修改消息状态", res);
          })
          .catch(err => {
            console.log(err);
          });
        this.$router.push({ name: "msgDetail", params: { msg } });
      }else {
        //  关闭按钮显示
        cell.style.transform = 'translate3d(0px, 0px, 0px)'
      }
    },
    msgStatus(status) {
      switch (status) {
        // 01-待发送，02-已发送，03-未阅读，04-已阅读，99-已删除
        case "01":
          return "待发送";
          break;
        case "02":
          return "已发送";
          break;
        case "03":
          return "未阅读";
          break;
        case "04":
          return "已阅读";
          break;
        case "99":
          return "已删除";
          break;
      }
    },
    delMsg(msg) {
      var param = {
        rcvMsgId: msg.rcvMsgId
      };
      this.$dialog
        .confirm({
          message: "确定删除吗？"
        })
        .then(() => {
          mineApi
            .delMsg(param)
            .then(res => {
              console.log(res);
              this.initMsg();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
      console.log(msg.rcvMsgId);
    },
    onRefresh() {
      var param = {
        pageNum: 1,
        pageSize: this.pageSize
      }
      this.getMsg(param);
    },
    onLoad() {
      // 异步更新数据
      let param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      mineApi
        .getMsg(param)
        .then(res => {
          this.isLoading = false;
          this.loading = false;
          if (res.success === 1) {
            this.totalCount = res.total;
            this.pageNum++;
            if(res.data) {
              this.msgList = [...this.msgList, ...res.data];
            }
            if(this.msgList.length >= this.totalCount) {
              this.finished = true;
            }
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.loading = false;
          this.finished = true;
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.message-main {
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
      .van-list {
        width: 100%;
        .msg-list {
          width: 100%;
          height: 100%;
          text-align: left;
          overflow: auto;
          &::-webkit-scrollbar {
            display: none;
          }
          .van-swipe-cell {
            .van-button {
              height: 100%;
              font-size: 15px;
              color: #fff;
              border: none;
              background: $falseColor;
            }
            .msg-item {
              padding: 16px 0;
              height: 120px;
              box-sizing: border-box;
              border-bottom: 1px solid #eeeeee;
              .title {
                display: flex;
                align-items: center;
                .title-icon {
                  width: 32px;
                  height: 32px;
                  @include bgImage;
                  &.test {
                    background-image: url("~@/assets/imgs/mine/test@2x.png");
                  }
                  &.approval {
                    background-image: url("~@/assets/imgs/mine/approval@2x.png");
                  }
                }
                .text {
                  margin-left: 8px;
                  font-size: 16px;
                  color: #333;
                }
              }
              .desc {
                margin-top: 15px;
                font-size: 14px;
                color: #555;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .time-wrapper {
                display: flex;
                justify-content: space-between;
                margin-top: 12px;
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
</style>