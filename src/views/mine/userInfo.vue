<template>
  <div class="user-info-main">
    <Header :show-back="true" title-text="个人信息"></Header>
    <div class="container">
      <ul class="info-list">
        <li class="info-item hasarr">
          <div class="content-wrapper">
            <span class="title">头像</span>
            <span class="content avatar">
              <van-image v-if="userInfo.photo" :src="url + userInfo.photo" alt></van-image>
              <img v-else src="@/assets/imgs/no_data/avatar.png" alt />
            </span>
          </div>
        </li>
        <router-link :to="{name: 'changeName'}" class="info-item hasarr" tag="li">
          <div class="content-wrapper">
            <span class="title">姓名</span>
            <span class="content name">{{ userInfo.username }}</span>
          </div>
        </router-link>
        <!-- <router-link :to="{name: 'changeTel'}" class="info-item hasarr" tag="li">
          <span class="title">手机号</span>
          <span class="content tel">{{ userInfo.mobilephone }}</span>
        </router-link>-->
        <li class="info-item hasarr">
          <div class="content-wrapper">
            <span class="title">手机号</span>
            <span class="content mail">{{ userInfo.mobilephone }}</span>
          </div>
        </li>
        <li class="info-item hasarr">
          <div class="content-wrapper">
            <span class="title">邮箱</span>
            <span class="content mail">{{ userInfo.email }}</span>
          </div>
        </li>
        <li class="info-item">
          <div class="content-wrapper">
            <span class="title">工号</span>
            <span class="content number">{{ userInfo.jobnumber }}</span>
          </div>
        </li>
        <li class="info-item">
          <div class="content-wrapper">
            <span class="title">所属部门</span>
            <span class="content department">{{ userInfo.orgname }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

import { URL } from "@/api/url";
import userApi from "@/api/user";

export default {
  name: "UserInfo",
  components: {
    Header
  },
  data() {
    return {
      url: URL,
      userInfo: {}
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      userApi
        .getUserInfo()
        .then(res => {
          if (res.success == 1) {
            this.userInfo = res.data;
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

.user-info-main {
  width: 100%;
  height: 100%;
  .container {
    padding-top: $headerHeight;
    height: 100%;
    box-sizing: border-box;
    .info-list {
      width: 100%;
      .info-item {
        position: relative;
        padding: 0 $basePadding;
        height: 44px;
        font-size: 15px;
        color: #999;
        line-height: 44px;
        box-sizing: border-box;
        .content-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          border-bottom: 1px solid #eee;
          .content {
            color: #333;
            &.avatar {
              width: 32px;
              height: 32px;
              ::v-deep.van-image {
                width: 100%;
                height: 100%;
                img {
                  border-radius: 50%;
                }
                .van-image__error {
                  .van-icon {
                    &::before {
                      display: block;
                      width: 32px;
                      height: 32px;
                      content: "";
                      @include bgImage;
                      background-image: url("~@/assets/imgs/no_data/avatar.png");
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
          }
        }
        &:active {
          background: $activeColor;
        }
        &.hasarr {
          &::after {
            position: absolute;
            content: "";
            top: 50%;
            right: $basePadding;
            width: 10px;
            height: 10px;
            @include bgImage;
            background-image: url("~@/assets/imgs/mine/arr-l.png");
            transform: translateY(-50%);
          }
          .content {
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>