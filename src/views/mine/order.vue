<template>
  <div class="order-main">
    <Header :show-back="true" :title-text="orderData.flowtypeid != '03' ? '请假' : '设备报修'"></Header>
    <div class="container">
      <!-- 请假页面 -->
      <div class="attendance-main" v-if="orderData.flowtypeid != '03'">
        <div class="attendance-wrapper">
          <div class="attendance-user">
            <van-field v-model="orderData.userName" label="申请人" readonly></van-field>
          </div>
          <div class="attendance-type">
            <van-field v-model="orderData.levelTypeName" label="请假类型" readonly></van-field>
          </div>
          <div class="attendance-start">
            <van-field v-model="orderData.starttime" label="开始时间" readonly></van-field>
          </div>
          <div class="attendance-end">
            <van-field v-model="orderData.endtime" label="结束时间" readonly></van-field>
          </div>
          <div class="attendance-days">
            <van-field v-model="orderData.days" label="请假天数" readonly></van-field>
          </div>
          <div class="desc">
            <p class="title">请假事由</p>
            <van-field
              v-model="orderData.reason"
              class="content"
              rows="1"
              type="textarea"
              readonly
              autosize
            ></van-field>
          </div>
        </div>
        <div class="space"></div>
        <div class="approval-wrapper">
          <div class="desc">
            <p class="title">审批意见</p>
            <van-field
              v-model="orderData.clcontent"
              class="content"
              rows="1"
              type="textarea"
              autosize
              :readonly="orderData.nodecode =='99' || isCheck"
              placeholder="请填写审批意见，没有可以不填写"
            ></van-field>
          </div>
        </div>
      </div>
      <!-- 工单页面 -->
      <div class="order-main" v-else>
        <div class="repair-info">
          <div class="order-code">
            <van-field v-model="orderData.ordercode" label="工单编号" readonly></van-field>
          </div>
          <div class="name">
            <van-field v-model="orderData.terminalno" label="设备编号" readonly></van-field>
          </div>
          <div class="desc">
            <p class="title">故障描述</p>
            <van-field
              v-model="orderData.repcontent"
              class="content"
              rows="1"
              type="textarea"
              autosize
              placeholder="请输入故障描述"
              readonly
            ></van-field>
          </div>
          <!-- <div class="pic-wrapper">
          <p class="title">现场图片</p>
          <div class="pic-upload">
            <van-uploader v-model="fileList" preview-size="99px" multiple class="pic-view" />
          </div>
          </div>-->
        </div>
        <div class="space"></div>
        <div class="contact-wrapper">
          <div class="user">
            <van-field v-model="orderData.repuser" label="上报人员" placeholder="上报人员" readonly></van-field>
          </div>
          <div class="tel">
            <van-field v-model="orderData.repphone" label="上报人员电话" placeholder="上报人员电话" readonly></van-field>
          </div>
        </div>
        <div class="space"></div>
        <!-- 接单预计处理 -->
        <div class="order-rec-wrapper" v-if="orderData.nodecode >= '02'">
          <div class="plan-time has-arr">
            <van-field
              v-model="orderData.plantime"
              @click="timerPickerShow=true"
              label="预计处理时间"
              placeholder="请选择预计处理时间"
              readonly
              class="time-pciker"
            ></van-field>
            <van-popup
              v-if="orderData.nodecode == '02'"
              v-model="timerPickerShow"
              position="bottom"
            >
              <van-datetime-picker
                title="请选择预计处理时间"
                type="datetime"
                :min-date="minDate"
                :max-date="maxDate"
                @cancel="timerPickerShow = false"
                @confirm="confirmPlanTime"
                :formatter="formatDate"
              />
            </van-popup>
          </div>
          <div class="desc">
            <p class="title">接单说明</p>
            <van-field
              v-model="orderData.recvmemo"
              class="content"
              rows="1"
              type="textarea"
              autosize
              placeholder="请填写接单说明"
              :readonly="orderData.nodecode > '02'"
            ></van-field>
          </div>
        </div>
        <div class="space" v-if="orderData.nodecode >= '02'"></div>
        <!-- 处理方式 -->
        <div class="deal-wrapper" v-if="orderData.nodecode >= '03'">
          <div class="deal-method has-arr">
            <van-field
              v-model="orderData.disposetypeName"
              label="处理方式"
              @click="openDispose"
              readonly
              placeholder="请选择处理方式"
            ></van-field>
            <van-popup v-if="orderData.nodecode == '03'" v-model="disposeShow" position="bottom">
              <van-picker
                show-toolbar
                :columns="disposeList"
                @cancel="disposeShow = false"
                @confirm="confirmDispose"
              />
            </van-popup>
          </div>
          <div class="deal-result has-arr">
            <van-field
              v-model="orderData.disresultName"
              @click="openResult"
              label="处理结果"
              readonly
              placeholder="请选择处理结果"
            ></van-field>
            <van-popup v-if="orderData.nodecode == '03'" v-model="resultShow" position="bottom">
              <van-picker
                show-toolbar
                :columns="resultList"
                @cancel="resultShow = false"
                @confirm="confirmResult"
              />
            </van-popup>
          </div>
          <div class="arrive-time has-arr">
            <van-field
              v-model="orderData.arrivetime"
              @click="arriveTimeShow=true"
              label="到达现场时间"
              placeholder="请选择到达现场时间"
              readonly
              class="time-pciker"
            ></van-field>
            <van-popup v-if="orderData.nodecode == '03'" v-model="arriveTimeShow" position="bottom">
              <van-datetime-picker
                title="请选择到达现场时间"
                type="datetime"
                :min-date="minDate"
                :max-date="maxDate"
                @cancel="arriveTimeShow = false"
                @confirm="confirmArriveTime"
                :formatter="formatDate"
              />
            </van-popup>
          </div>
          <div class="desc">
            <p class="title">处理内容说明</p>
            <van-field
              v-model="orderData.dismemo"
              class="content"
              rows="1"
              type="textarea"
              autosize
              :readonly="orderData.nodecode > '03'"
              placeholder="请填写处理内容"
            ></van-field>
          </div>
        </div>
        <div class="space" v-if="orderData.nodecode >= '03'"></div>
        <!-- 验收结果 -->
        <div class="check-wrapper" v-if="orderData.nodecode >= '04'">
          <div class="check-result has-arr">
            <van-field
              v-model="orderData.checkresultName"
              @click="openCheckResult"
              label="验收结果"
              readonly
              placeholder="请选择验收结果"
            ></van-field>
            <van-popup
              v-if="orderData.nodecode == '04' && !isCheck"
              v-model="checkResultShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="checkResultList"
                @cancel="checkResultShow = false"
                @confirm="confirmCheckResult"
              />
            </van-popup>
          </div>
          <div class="order-level has-arr">
            <van-field
              v-model="orderData.faultlevelName"
              @click="openLevel"
              label="故障等级"
              readonly
              placeholder="请选择故障等级"
            ></van-field>
            <van-popup
              v-if="orderData.nodecode == '04' && !isCheck"
              v-model="levelShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="levelList"
                @cancel="levelShow = false"
                @confirm="confirmLevel"
              />
            </van-popup>
          </div>
        </div>
        <div class="space" v-if="orderData.nodecode >= '04'"></div>

      </div>
      <!-- 处理进度 -->
      <div class="order-progress">
        <p class="text">处理进度</p>
        <ul class="progress-list">
          <li v-for="(item, index) in orderData.logList" :key="index" class="progress-item">
            <div class="avatar">
              <van-image
                v-if="item.userPhoto" :src="url + item.userPhoto" alt="头像"
              >
              </van-image>
              <!-- <img v-if="item.userPhoto" :src="url + item.userPhoto" alt="头像" /> -->
              <img v-else src="@/assets/imgs/no_data/avatar.png" alt />
            </div>
            <div class="info">
              <div class="status">
                <p class="name">{{item.userName}}</p>
                <p class="type">{{item.nodename}}</p>
              </div>
              <div class="time">{{getTime(new Date(item.cltime))}}</div>
            </div>
          </li>
        </ul>
      </div>

      <div class="btn-wrapper" v-if="orderData.nodecode !='99' && !isCheck">
        <div class="attendance-btn-wrapper" v-if="orderData.flowtypeid != '03'">
          <van-button class="no-pass" @click="doSubAttendance(false)">不通过</van-button>
          <van-button class="pass" @click="doSubAttendance(true)">通过</van-button>
        </div>
        <div class="order-btn-wrapper" v-else>
          <van-button class="btn-sub" @click="doSub" v-if="!orderData.nodecode">提交</van-button>
          <van-button
            class="btn-sub"
            @click="doRec"
            v-else
          >{{orderData.nodecode == '02' ? '确认接单' : '确定'}}</van-button>
        </div>
      </div>

      <!-- <div class="sub-wrapper" v-if="orderData.nodecode != '99' && !isCheck">
        
      </div> -->
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

import { URL } from "@/api/url";
import mineApi from "@/api/mine";
import mixins from "@/mixins/timerPicker";
import { getUserInfo } from "@/utils/user";

export default {
  name: "Order",
  components: {
    Header
  },
  mixins: [mixins],
  data() {
    return {
      url: URL,
      isCheck: false, // 整体只读状态

      timerPickerShow: false, // 预计处理时间选择
      arriveTimeShow: false, // 到达现场时间
      disposeShow: false, // 处理方式
      disposeList: [],
      dispose: "",

      resultShow: false, // 处理结果
      resultList: [],
      result: "",

      checkResultShow: false, // 验收结果
      checkResultList: [],
      checkResult: "",

      levelShow: false, // 故障等级
      levelList: [],
      level: "",

      terminalNoErr: "", // 设备编号错误信息
      orderData: {},
      minDate: new Date("2019-01-01"),
      maxDate: new Date("2100-01-01"),

      avatar: require("@/assets/imgs/no_data/avatar.png"),
      fileList: [
        // { url: "https://img.yzcdn.cn/vant/cat.jpeg" }
        // Uploader 根据文件后缀来判断是否为图片文件
        // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
      ]
    };
  },
  created() {
    console.log(URL);
    this.__init();
  },
  methods: {
    __init() {
      var param = this.$route.params.order;
      this.isCheck = this.$route.params.order.check;

      this.$toast.loading({
        mask: true,
        message: "加载中"
      });
      mineApi
        .getOrderInfo(param)
        .then(res => {
          this.$toast.clear();
          console.log("返回结果", res);
          if (res.success == 1) {
            this.orderData = res.data;
            if (this.orderData != "03") {
              this.orderData.starttime = this.getTime(
                new Date(this.orderData.starttime)
              );
              this.orderData.endtime = this.getTime(
                new Date(this.orderData.endtime)
              );
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    doSubAttendance(flag) {
      //  请假审批提交
      var param = {
        orderid: this.orderData.orderid,
        flowtypeid: this.orderData.flowtypeid,
        workflowid: this.orderData.workflowid,
        nodecode: this.orderData.nodecode,
        nodename: this.orderData.nodename,
        clcontent: this.orderData.clcontent
      };
      param.isPass = flag ? "01" : "02";
      // console.log(param);
      mineApi
        .saveOrderInfo(param)
        .then(res => {
          console.log("请假审批", res);
          if (res.success == 1) {
            this.$toast.success("保存成功");
            setTimeout(() => {
              this.$route.go(-1);
            }, 3000);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    doSub() {
      // 提交工单
      // console.log("工单信息", this.orderData);
      if (
        !this.orderData.repuser ||
        !this.orderData.terminalno ||
        !this.orderData.repcontent ||
        !this.orderData.repphone ||
        !this.orderData.reptime
      ) {
        this.$toast.fail("请填写完整工单信息");
      } else {
        mineApi
          .createOrderInfo(this.orderData)
          .then(res => {
            if (res.success == 1) {
              this.$toast.success("提交成功");
              setTimeout(() => {
                this.$route.go(-1);
              }, 3000);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    doRec() {
      // 工单流程保存
      var param = {
        orderid: this.orderData.orderid,
        flowtypeid: this.orderData.flowtypeid,
        workflowid: this.orderData.workflowid,
        nodecode: this.orderData.nodecode,
        nodename: this.orderData.nodename
      };
      if (this.orderData.nodecode == "02") {
        this.orderData.recvtime = this.getTime(new Date());
        this.orderData.recvuserid = getUserInfo().sessionUser.id;
        param.recvtime = this.orderData.recvtime;
        param.recvuserid = this.orderData.recvuserid;
        param.recvmemo = this.orderData.recvmemo;
        param.plantime = this.orderData.plantime;
      } else if (this.orderData.nodecode == "03") {
        param.disposeuser = getUserInfo().sessionUser.id;
        param.disposetype = this.orderData.disposetype;
        param.disresult = this.orderData.disresult;
        param.dismemo = this.orderData.dismemo;
      } else if (this.orderData.nodecode == "04") {
        param.checkuser = getUserInfo().sessionUser.id;
        param.checkresult = this.orderData.checkresult;
        param.faultlevel = this.orderData.faultlevel;
      }
      mineApi
        .saveOrderInfo(param)
        .then(res => {
          if (res.success == 1) {
            this.orderData.nodecode == "02"
              ? this.$toast.success("接单成功")
              : this.$toast.success("保存成功");
            setTimeout(() => {
              this.$route.go(-1);
            }, 3000);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    openDispose() {
      this.disposeShow = true;
      this.getCode("DisposeType");
    },
    openResult() {
      this.resultShow = true;
      this.getCode("DisposeResult");
    },
    openCheckResult() {
      this.checkResultShow = true;
      this.getCode("CheckResult");
    },
    openLevel() {
      this.levelShow = true;
      this.getCode("FaultLevel");
    },
    confirmPlanTime(val) {
      this.orderData.plantime = this.getTime(val);
      this.timerPickerShow = false;
    },
    confirmArriveTime(val) {
      this.orderData.arrivetime = this.getTime(val);
      this.arriveTimeShow = false;
    },
    confirmDispose(val) {
      this.orderData.disposetypeName = val.text;
      this.orderData.disposetype = val.codeVal;
      this.disposeShow = false;
    },
    confirmResult(val) {
      this.orderData.disresultName = val.text;
      this.orderData.disresult = val.codeVal;
      this.resultShow = false;
    },
    confirmCheckResult(val) {
      this.orderData.checkresultName = val.text;
      this.orderData.checkresult = val.codeVal;
      this.checkResultShow = false;
    },
    confirmLevel(val) {
      this.orderData.faultlevelName = val.text;
      this.orderData.faultlevel = val.codeVal;
      this.levelShow = false;
    },
    getCode(type) {
      var list = [];
      mineApi
        .getCode({ typeCode: type })
        .then(res => {
          if (res.success == 1) {
            for (var k in res.data) {
              list.push({
                text: res.data[k].codeName,
                codeVal: res.data[k].codeVal
              });
            }
            if (type == "DisposeType") {
              this.disposeList = list;
            } else if (type == "DisposeResult") {
              this.resultList = list;
            } else if (type == "FaultLevel") {
              this.levelList = list;
            } else if (type == "CheckResult") {
              this.checkResultList = list;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.order-main {
  width: 100%;
  height: 100%;
  .container {
    padding-top: $headerHeight;
    width: 100%;
    height: 100%;
    text-align: left;
    box-sizing: border-box;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }

    .van-cell {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0;
      height: 100%;
      &::after {
        display: none;
      }
      ::v-deep.van-cell__title {
        font-size: 12px;
        color: #999;
      }
      ::v-deep.van-field__control {
        font-size: 16px;
        color: #333;
        line-height: 24px;
        text-align: right;
        &::placeholder {
          color: #ccc;
        }
      }
    }
    p {
      margin: 0;
      &.title {
        font-size: 12px;
        color: #999;
      }
    }
    .content {
      padding: 0;
      margin-top: 12px;
      font-size: 16px;
      color: #333;
      line-height: 24px;
    }
    .has-arr {
      .van-cell {
        background: url("~@/assets/imgs/mine/arr-l@2x.png") right center
          no-repeat;
        background-size: 10px;
        ::v-deep.van-field__control {
          padding-right: 20px;
        }
      }
    }
    /* 请假 */
    .attendance-main {
      .attendance-wrapper {
        padding: 0 $basePadding;
        box-sizing: border-box;
        .attendance-user,
        .attendance-type,
        .attendance-start,
        .attendance-end,
        .attendance-days {
          height: 44px;
          border-bottom: 1px solid #eee;
        }
        .desc {
          padding: $basePadding 0;
          ::v-deep.van-field__control {
            text-align: left;
          }
        }
      }
      .approval-wrapper {
        padding: 0 $basePadding;
        box-sizing: border-box;
        .desc {
          padding: $basePadding 0;
          border-bottom: 1px solid #eee;
          ::v-deep.van-field__control {
            text-align: left;
          }
        }
      }
      
    }
    /* 请假 */

    /* 工单样式 */
    .order-main {
      height: unset;
      .repair-info {
        padding: 0 $basePadding;
        .content {
          ::v-deep.van-field__control {
            text-align: left;
          }
        }
        .order-code,
        .name {
          height: 44px;
          border-bottom: 1px solid #eeeeee;
        }
        .desc {
          padding: $basePadding 0;
          border-bottom: 1px solid #eeeeee;
        }
        .pic-wrapper {
          margin-top: 16px;
          .pic-upload {
            margin-top: 16px;
          }
          ::v-deep.van-uploader__wrapper {
            width: 100%;
            .van-uploader__preview {
              margin: 0 22px 16px 0;
              &:nth-child(3n) {
                margin-right: 0;
              }
            }
            .van-uploader__upload {
              margin: 0 0 16px;
            }
          }
        }
      }
      .space {
        height: 10px;
        background: #f5f5f5;
      }
      .contact-wrapper {
        padding: 0 $basePadding;
        box-sizing: border-box;
        background: #fff;
        .user,
        .tel {
          height: 44px;
          .van-cell {
            ::v-deep.van-field__control {
              text-align: right;
            }
          }
        }
        .user {
          border-bottom: 1px solid #eeeeee;
        }
      }
      .order-rec-wrapper {
        padding: 0 $basePadding;
        .plan-time {
          height: 44px;
          border-bottom: 1px solid #eeeeee;
        }
        .desc {
          padding: $basePadding 0;
          .content {
            ::v-deep.van-field__control {
              text-align: left;
            }
          }
        }
      }
      .deal-wrapper {
        padding: 0 $basePadding;
        .deal-method,
        .deal-result,
        .arrive-time {
          height: 44px;
          border-bottom: 1px solid #eeeeee;
        }
        .desc {
          padding: $basePadding 0;
          .content {
            ::v-deep.van-field__control {
              text-align: left;
            }
          }
        }
      }
      .check-wrapper {
        padding: 0 $basePadding;
        .check-result,
        .order-level {
          height: 44px;
        }
        .check-result {
          border-bottom: 1px solid #eeeeee;
        }
      }
    }
    /* 工单样式 */

    /* 进度 */
    .order-progress {
      padding: $basePadding;
      padding-bottom: 0;
      p {
        color: #999;
      }
      .progress-list {
        margin-top: 20px;
        .progress-item {
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          &:last-child {
            .avatar {
              &::after {
                display: none;
              }
            }
          }
          .avatar {
            position: relative;
            width: 40px;
            height: 40px;
            &::after {
              position: absolute;
              top: 40px;
              left: 50%;
              content: "";
              width: 1px;
              height: 33px;
              background: #ddd;
              transform: translateX(-50%);
            }
            .van-image {
              width: 100%;
              height: 100%;
              .van-image__error {
                .van-icon {
                  &::before {
                    display: block;
                    width: 40px;
                    height: 40px;
                    content: '';
                    @include bgImage;
                    background-image: url("~@/assets/imgs/no_data/avatar.png")
                  }
                }
              }
            }
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-left: 8px;
            width: calc(100% - 48px);
            .name {
              font-size: 16px;
              color: #333;
            }
            .type {
              margin-top: 10px;
            }
          }
        }
      }
    }
    /* 进度 */

    /* 底部按钮样式 */
    .btn-wrapper {
      margin: 40px 0 10px;
      padding: 0 20px;
      box-sizing: border-box;
      .attendance-btn-wrapper {
        display: flex;
        justify-content: space-between;
        .van-button {
          width: 150px;
          height: 48px;
          font-size: 15px;
          color: #fff;
          border-radius: 4px;
          &.no-pass {
            background: $falseColor;
          }
          &.pass {
            background: $baseColor;
          }
        }
      }
      .order-btn-wrapper {
        display: flex;
        justify-content: center;
        .van-button {
          width: 300px;             
          height: 48px;
          font-size: 15px;
          color: #fff;
          border-radius: 4px;
          background: $baseColor;  
        }
      }
    }
    /* 底部按钮样式 */
  }
}
</style>