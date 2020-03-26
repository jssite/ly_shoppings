<template>
  <div v-if="is_show_data" class="content-cop">
    <!-- <div class="top">
      <img @click="funcInvite" class="top-img" src="../image/coupon_recom_invite.png" alt>
      <img @click="gotoPointShop" class="top-img" src="../image/coupon_recom_integral.png" alt>
    </div>
    <p class="gotoDetail">
      <img class="link" src="../image/coupon_center_link.png" alt>
      <span class="link-text" @click="goToMy()">查看我的优惠券</span>
    </p>-->
    <div class="list-j" v-for="(item,index) in dataList" :key="index">
      <div :class="item.c!=1?'img-box':'img-box gray'">
        <img class="img-left" v-if="item.c!=1" src="../image/coupon_center_red_left.png" alt />
        <img class="img-left" v-if="item.c==1" src="../image/coupon_center_gray_left.png" alt />
        <img class="img-right" src="../image/coupon_center_right.png" alt />
        <div class="text-left">
          <span :class="item.c!=1?'money':'money gray'">
            <moneySpan :money="item.num_cost" :iSize="50" :fSize="28"></moneySpan>
          </span>
          <span class="text-msg">
            <div class="text-msg-box">{{item.info}}</div>
          </span>
        </div>
        <div class="text-right">
          <div class="clip-box">
            <div class="clip" v-if="!item.has_receive&&item.c<1">
              <p class="hasl">已领</p>
              <p class="cirnum">{{item.has_receive_percentage}}</p>
            </div>
            <div
              v-if="!item.has_receive&&item.c<1"
              :class="item.c<0.5?'clip-l':'clip-l red'"
              :style="'transform:rotate('+(360*(item.c<0.5?item.c:0))+'deg)'"
            ></div>
            <div
              v-if="!item.has_receive&&item.c<1"
              class="clip-r"
              :style="'transform:rotate('+(360*(item.c>0.5?(item.c-0.5):0))+'deg)'"
            ></div>
            <img
              v-if="item.has_receive"
              class="no-img"
              src="/static/images/public/public_state02.png"
              alt
            />
            <img
              v-if="!item.has_receive&&item.c==1"
              class="no-img"
              src="/static/images/public/public_state01.png"
              alt
            />
          </div>
          <p class="gotol" v-if="!item.has_receive&&item.c<1" @click="gotol(item)">立即领取</p>
          <p class="gotol" v-if="item.has_receive" @click="gotoUse(item)">去使用</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFreeCouponsList, getFreeCoupons } from "@/api";
import moneySpan from "@/components/public/moneyNo.vue";
var app = getApp();

export default {
  name: "index",
  components: {
    moneySpan
  },
  data() {
    return {
      c: 0.3,
      dataList: [],
      is_show_data: false
    };
  },
  onLoad() {
    this.sa_page(this,false,'领券中心','');
  },
  computed: {
    getC(value) {
      return 0.5;
    }
  },
  methods: {
    goToMy() {
      wx.navigateTo({
        url: "/pages/userCenter/coupon/main"
      });
    },
    gotol(data) {
      console.log(data);
      // type	string	true	优惠券ID
      // num_cost
      getFreeCoupons({ type: data.type, num_cost: data.num_cost }).then(res => {
        wx.showToast({
          title: "领取成功",
          icon: "none"
        });
        getFreeCouponsList({}).then(res => {
          this.dataList = res.receive_coupon_vo;
          this.dataList.map(item => {
            item.c = parseInt(item.has_receive_percentage) / 100;
          });
        });
        let source = this.$store.state.mp_source;
        let group_id = this.$store.state.mp_group_id;
        let sa_coupon = {
          'mp_source':source,
          'mp_group_id':group_id,
          'conponName':data.info,
          'conponValue':data.num_cost,
          'fromType':'领券中心',
          'promotionID':data.promotion_id,
          'conponID':data.type
        };
        app.sensors.track('mp_getConpon', sa_coupon);
      });
    },

    gotoUse(coupon_info) {
      console.log(coupon_info);
      let url =
        "/pages/search/salesPromotion/main?content=" +
        coupon_info.info +
        "&promotion_id=" +
        coupon_info.promotion_id +
        "&title=" +
        coupon_info.title;
      wx.navigateTo({ url: url });
    },

    gotoPointShop() {
      //跳转积分商城
      wx.setStorageSync(
        "urlH5",
        "https://m.leyou.com.cn/benefits?page=integral"
      );
      wx.navigateTo({
        url: "/pages/transferH5/main"
      });
    },
    //d兑换
    funcInvite() {
      wx.setStorageSync("urlH5", "https://m.leyou.com.cn/invitefriend/share");
      wx.navigateTo({
        url: "/pages/transferH5/main"
      });
    }
  },
  onLoad() {
    this.is_show_data = false;
    getFreeCouponsList({}).then(res => {
      this.is_show_data = true;
      this.dataList = res.receive_coupon_vo;
      this.dataList.map(item => {
        item.c = parseInt(item.has_receive_percentage) / 100;
      });
    });
  }
};
</script>

<style scoped>
.content-cop {
  background: #eee;
  padding: 20rpx 0;
}
.link {
  height: 34rpx;
  width: 34rpx;
  vertical-align: middle;
  padding-right: 12rpx;
}
.link-text {
  vertical-align: middle;
}
.gotoDetail {
  height: 80rpx;
  border-bottom: 20rpx solid #eee;
  line-height: 80rpx;
  background: #fff;
  font-size: 24rpx;
  text-align: center;
  color: #ff5000;
}
.top-img {
  width: 345rpx;
  height: 160rpx;
}
.top-img:nth-of-type(1) {
  padding-right: 20rpx;
}
.btn-img {
  height: 40rpx;
  width: 30rpx;
  vertical-align: middle;
}
.btn-go {
  display: inline-block;
  vertical-align: middle;
  font-size: 22rpx;
  border-radius: 5rpx;
  color: #fff;
  border: 1px solid #fff;
  padding: 5rpx 10rpx;
}
.gray {
  color: #999 !important;
}
.no-img {
  height: 100rpx;
  width: 100rpx;
}
.clip-box {
  height: 100rpx;
  width: 100rpx;
  margin: 20rpx 25rpx 0;
  position: relative;
}
.gotol {
  font-size: 20rpx;
  width: 110rpx;
  height: 40rpx;
  border-radius: 20rpx;
  text-align: center;
  line-height: 40rpx;
  background: #ff5000;
  color: #fff;
  margin: 10rpx 20rpx;
}
.hasl {
  padding-top: 10rpx;
}
.hasl,
.cirnum {
  font-size: 22rpx;
  text-align: center;
  color: #ff5000;
}
.clip {
  width: 80rpx;
  height: 80rpx;
  border: 10rpx solid #ff5000;
  position: absolute;
  border-radius: 50%;
}
.clip-l,
.clip-r {
  width: 80rpx;
  height: 80rpx;
  position: absolute;
  border-radius: 50%;
}
.clip-r {
  border: 10rpx solid #ffaf7b;
  clip: rect(0, 100rpx, 100rpx, 50rpx);
}
.red.clip-l {
  border: 10rpx solid #ff5000 !important;
  z-index: 99;
}
.clip-l {
  border: 10rpx solid #ffaf7b;
  clip: rect(0, 50rpx, 100rpx, 0);
}
.ff {
  font-size: 33rpx;
  vertical-align: middle;
  position: absolute;
  left: 35rpx;
  top: 0;
}
.text-msg {
  display: inline-block;
  vertical-align: middle;
  width: 350rpx;
  font-size: 24rpx;
  padding: 20rpx;
}
.text-msg-box {
  display: -webkit-box;
  width: 350rpx;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.money {
  position: relative;
  font-size: 40rpx;
  font-weight: bold;
  text-align: center;
  line-height: 180rpx;
  width: 140rpx;
  padding-left: 20rpx;
  display: inline-block;
  vertical-align: middle;
  color: #ff5000;
}
.img-left {
  width: 558rpx;
  height: 182rpx;
  position: absolute;
  left: 20rpx;
  top: 0;
}
.text-left {
  width: 558rpx;
  padding-left: 20rpx;
  z-index: 1;
}
.text-left,
.text-right {
  height: 182rpx;
  position: absolute;
  display: inline-block;
  float: left;
}
.text-right {
  width: 170rpx;
  right: 0;
}
.img-right {
  height: 182rpx;
  left: 575rpx;
  top: 0;
  position: absolute;
  width: 150rpx;
}
.list-j {
  margin-bottom: 10rpx;
  height: 180rpx;
}
.img-box {
  position: relative;
}
.title {
  font-size: 30rpx;
  padding: 10rpx 20rpx 5rpx;
}
.content {
  font-size: 22rpx;
  padding: 0 20rpx;
}
.top {
  height: 160rpx;
  background: #fff;
  padding: 20rpx;
}
.top-list:nth-of-type(2) {
  background: linear-gradient(#56b9fd, #8d85fe);
}
.top-list:nth-of-type(3) {
  margin-right: 0;
  background: linear-gradient(#ff81cf, #fe5c98);
}
.top-list {
  display: inline-block;
  color: #fff;
  height: 160rpx;
  width: 230rpx;
  border-radius: 10rpx;
  margin-right: 10rpx;
  vertical-align: middle;
  background: linear-gradient(#fc702b, #fe4a31);
}
</style>
