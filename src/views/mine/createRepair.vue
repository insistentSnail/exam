<template>
  <div class="repair-main">
    <Header :show-back="true" title-text="设备报修"></Header>
    <div class="container">
      <div class="repair-info">
        <div class="name">
          <p class="title">终端编号</p>
          <van-field v-model="repairInfo.terminalno" :error-message="terminalNoErr" class="content" @blur="checkTerminal(repairInfo.terminalno)" placeholder="请输入终端编号"></van-field>
        </div>
        <div class="desc">
          <p class="title">故障描述</p>
          <van-field
            v-model="repairInfo.repcontent"
            class="content"
            rows="1"
            type="textarea"
            autosize
            placeholder="请输入故障描述"
          ></van-field>
        </div>
        <!-- <div class="pic-wrapper">
          <p class="title">现场图片</p>
          <div class="pic-upload">
            <van-uploader v-model="fileList" preview-size="99px" multiple class="pic-view" />
          </div>
        </div> -->
      </div>
      <div class="space"></div>
      <div class="contact-wrapper">
        <div class="user">
          <van-field v-model="repairInfo.repuser" label="上报人员" placeholder="上报人员"></van-field>
        </div>
        <div class="tel">
          <van-field v-model="repairInfo.repphone" label="上报人员电话" placeholder="上报人员电话"></van-field>
        </div>
        <div class="time has-arr">
          <van-field
            v-model="repairInfo.reptime"
            @click="timerPickerShow=true"
            label="开始时间"
            placeholder="请选择开始时间"
            readonly
            class="time-pciker"
          ></van-field>
          <van-popup v-model="timerPickerShow" position="bottom">
            <van-datetime-picker
              title="请选择开始时间"
              type="datetime"
              :min-date="minDate"
              :max-date="maxDate"
              @cancel="timerPickerShow = false"
              @confirm="confirmTime"
              :formatter="formatDate"
            />
          </van-popup>
        </div>
      </div>
      <div class="sub-wrapper">
        <van-button class="btn-sub" @click="doSub">提交</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

import _ from "lodash";
import mineApi from "@/api/mine";
import mixins from "@/mixins/timerPicker";
import { getUserInfo } from "@/utils/user";

export default {
  name: "Repair",
  components: {
    Header
  },
  mixins: [mixins],
  data() {
    return {
      timerPickerShow: false,
      terminalNoErr: '', // 设备编号错误信息
      repairInfo: {
        linkorder: ''
      },
      minDate: new Date("2019-01-01"),
      maxDate: new Date("2100-01-01"),
      fileList: [
        // { url: "https://img.yzcdn.cn/vant/cat.jpeg" }
        // Uploader 根据文件后缀来判断是否为图片文件
        // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
      ]
    };
  },
  created() {
    if(typeof this.$route.params.order == "object") {
      console.log()
    }
    //  获取登录用户名
    var userInfo = getUserInfo();
    this.repairInfo.repuser = userInfo.sessionUser.username;
  },
  methods: {
    confirmTime(val) {
      this.repairInfo.reptime = this.getTime(val);
      this.timerPickerShow = false;
    },
    checkTerminal(terminal) {
      console.log(terminal)
      mineApi.checkTerminal({terminalno: terminal})
      .then(res => {
        console.log(res);
        if(res.success == 0) {
          //  编号有误
          this.terminalNoErr = res.msg;
        }else {
          this.terminalNoErr = '';
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    doSub() {
      console.log("工单信息", this.repairInfo);
      if(!this.repairInfo.repuser || !this.repairInfo.terminalno || !this.repairInfo.repcontent || !this.repairInfo.repphone || !this.repairInfo.reptime) {
        this.$toast.fail("请填写完整工单信息")
      }else {
        mineApi.createOrderInfo(this.repairInfo)
        .then(res => {
          if(res.success == 1) {
            this.$toast.success('提交成功');
          }
        })
        .catch(err => {
          console.log(err);
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.repair-main {
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
    ::v-deep.van-field__control {
      font-size: 16px;
      color: #333;
      line-height: 24px;
      &::placeholder {
        color: #ccc;
      }
    }
    .repair-info {
      padding: 0 $basePadding;
      background: #fff;
      box-sizing: border-box;
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
      .name {
        padding: $basePadding 0;
        box-sizing: border-box;
        border-bottom: 1px solid #eeeeee;
      }
      .desc {
        padding: $basePadding 0;
        box-sizing: border-box;
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
      .tel,
      .time {
        height: 44px;
        border-bottom: 1px solid #eeeeee;
        &.has-arr {
          .van-cell {
            background: url("~@/assets/imgs/mine/arr-l@2x.png") right center
              no-repeat;
            background-size: 10px;
            ::v-deep.van-field__control {
              padding-right: 20px;
            }
          }
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
            text-align: right;
          }
        }
      }
    }
    @include bottomBtn;
  }
}
</style>