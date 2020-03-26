<template>
  <div style="background:#f2f3f5;min-height:1500rpx;width:100%">
    <div class="top_bg_view">
      <div class="finish_remind">
        <img style="width:50rpx;height:50rpx;" src="/static/images/confirm/order_pay_succeecd.png" />
        <div style="margin-left:16rpx; color:#fff;font-size:40rpx;">支付成功</div>
      </div>
      <div class="finish_remind" style="margin-top:20rpx;">
        <text style="color:#fff; font-size:26rpx; font-family:PingFangSC-Medium">支付金额：</text>
        <div
          style="margin-left:5rpx; color:#fff; font-size:26rpx; font-family:PingFangSC-Regular"
        >¥{{response_info.cost_money}}</div>
      </div>
      <div
        class="finish_remind"
        style="margin-top:12rpx; font-size:22rpx;color:rgba(255,255,255,0.6)"
      >
        <span>支付时间：</span>
        <span>{{response_info.order_time}}</span>
      </div>
      <div class="finish_remind">
        <div v-if="isLeVip">
          <button class="fish_button" style="width:280rpx" @click="funclookinfo(3)">查看我的乐享卡</button>
        </div>
        <div v-else style="display:flex">
          <button class="fish_button" @click="funclookinfo(1)">查看订单</button>
          <button class="fish_button" style="margin-left:60rpx" @click="funclookinfo(2)">返回首页</button>
        </div>
      </div>
    </div>
    <div class="coupon_share">
      <div class="scancode_remind">请向工作人员出示此码，检验后即可离店</div>
      <canvas class="canva_s" canvas-id="scancode"></canvas>
      <div class="scancode_ser">{{response_info.order_bar_code}}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { smgPayFinishInfomation, daGuanLikeRecomment } from "@/api";
import { creatBarcode } from "@/utils";
// import promoteProduct from "@/components/product/promote";
import likeGood from "@/components/public/likeGood";
import promoteTitle from "@/components/product/promote/title";
const app = getApp();

export default {
  components: {
    // promoteProduct,
    promoteTitle,
    likeGood
  },
  data() {
    return {
      isLeVip: true,
      is_show_ad: true,
      pay_money: "",
      couponList: [],
      response_info: {},
      shareObject: {},
      likeData: []
    };
  },

  computed: {
    AD_IMG_URL() {
      let adList = this.$store.state.BASE_AD_INFO["ad_list"];

      let ad_info = {};
      adList.forEach(item => {
        if (item.type == 10011009) {
          ad_info = item;
        }
      });
      console.log(ad_info);
      return ad_info;
    },

    // remind_top() {
    //   return (
    //     !this.AD_IMG_URL.url &&
    //     (this.couponList.length || this.response_info.lightning_info)
    //   );
    // }
  },
  created() {
    //this.funcQuery()
  },

  onLoad(options) {
    options.is_le_vip = "0";
    this.shareObject = {};
    console.log(options);
    if (options.is_le_vip === "1") {
      this.isLeVip = true;
    } else {
      let res = JSON.parse(options.pay_info);
      // let res = {
      //   serial_num: "9915572294329900",
      //   order_id: 39456728,
      //   payable_amount: "0.00"
      // };
      let serial_num = res.serial_num;
      let order_id = res.order_id;
      this.pay_money = res.payable_amount;
      this.isLeVip = false;
      let start = 0;
      let end = 6;
      let request_info = {
        serial_num: serial_num
      };
      smgPayFinishInfomation(request_info).then(res => {
        console.log(res, "支付完成");
        this.response_info = res;
        this.funcOperationData(res);
      });
    }
  },

  methods: {
    funcCounpon(index) {
      // let gift_info = this.couponList[index];
      //  1  红包  2 执行链接
      if (index.gift_btn_type != 1) {
        let url = index.gift_btn_link;
        wx.redirectTo({
          url: url
        });
      }
      console.log(gift_info.gift_btn_type);
    },

    funcOperationData(res) {
      if (res.order_bar_code) {
        creatBarcode("scancode", res.order_bar_code , 590, 170);
      }
    },

    funcGotoLink() {
      let info = this.AD_IMG_URL;
      if (info.link) {
        wx.setStorageSync("urlH5", info.link);
        wx.navigateTo({
          url: "/pages/transferH5/main"
        });
      }
    },
    
    funclookinfo(index) {
      if (index === 1) {
        let url = "/pages/confirm/list/main?order_status=3";
        wx.redirectTo({
          url: url
        });
      } else if (index == 2) {
        wx.switchTab({
          url: "/pages/index/main"
        });
      } else {
        // let url = "https://app.leyou.com.cn/activity/joyCard";
        // this.gotoH5page(
        //   url +
        //     "?is_mini=1&token=" +
        //     wx.getStorageSync("token") +
        //     "&isRefresh=1"
        // );
      }
    }
  }
};
</script>

<style scoped>
.top_bg_view {
  background: #ff5000;
  /* height: 312rpx; */
  padding-bottom: 74rpx;
  width: 100%;
  overflow: hidden;
}

.finish_remind {
  display: flex;
  /* line-height: 50rpx; */
  justify-content: center;
  margin-top: 40rpx;
}

.fish_button {
  border-radius: 30rpx;
  border: 1px solid #ffffff;
  height: 60rpx;
  width: 200rpx;
  color: #fff;
  background: #ff5000;
  font-size: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coupon_share {
  position: relative;
  /* top: 278rpx;
   */
  top: -34rpx;
  width: 710rpx;
  left: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.arrival_time_bg {
  padding: 28rpx 28rpx 20rpx 28rpx;
  height: 174rpx;
  box-sizing: border-box;
  /* background: #fff; */
}

.scancode_remind {
  text-align: center;
  margin-top: 40rpx;
  font-size: 30rpx;
  color: #333;
  margin-bottom: 40rpx;
}

.scancode_ser {
  text-align: center;
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 40rpx;
}

.arriva_time {
  font-size: 30rpx;
  color: #333;
  display: flex;
}

.canva_s {
  display: flex;
  /* text-align : center;
   */
  margin: auto;
  align-self: center;
  width: 590rpx;
  height: 170rpx;
}

.time {
  margin-left: 5rpx;
  color: #ff5000;
}
.timeout_remind {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #999;
}
.goods_not {
  color: #333;
  font-size: 26rpx;
  margin-top: 20rpx;
}

.coupon_list_bg {
  /* margin-top: 2rpx; */
  /* height: 244rpx; */
  width: 100%;
}

.coupon_detail {
  display: flex;
  /* background: #fff; */
  padding: 24rpx 28rpx;
  /* width: 100%; */
  align-items: center;
  height: 122rpx;
  box-sizing: border-box;
}

.coupon_icon {
  width: 74rpx;
  height: 74rpx;
  border-radius: 35rpx;
}

.coupon_detail_desc {
  width: 380rpx;
  margin-left: 20rpx;
  height: 74rpx;
  color: #333;
  font-size: 26rpx;
}

.coupon_button {
  border-radius: 30rpx;
  border: 1px solid #ff5000;
  height: 56rpx;
  width: 160rpx;
  color: #ff5000;
  box-sizing: border-box;
  background: #fff;
  font-size: 26rpx;
  padding-left: 0;
  padding-right: 0;
  margin-left: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ad_view {
  width: 710rpx;
  height: 150rpx;
  border-radius: 12rpx;
  margin-top: 20rpx;
  margin-left: 20rpx;
  vertical-align: middle;
}

.ad_view.activity {
  margin-top: -14rpx;
}

.leyou_rmeind {
  height: 56rpx;
  /* line-height: 28; */
  margin-top: 20rpx;
  margin-left: 20rpx;
  font-size: 22rpx;
  color: #999;
  width: 710rpx;
  padding-bottom: 40rpx;
  /* vertical-align: top; */
}

.leyou_rmeind.activity {
  margin-top: -14rpx;
}

.products_small_wrap {
  padding-top: 6px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.addressText {
  margin: 0 50rpx 0 50rpx;
  font-size: 26rpx;
}

.addressContentBottom {
  display: flex;
  flex-direction: row;
  line-height: 88rpx;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 50rpx 0 50rpx;
}
.addressArrivalDesc {
  font-size: 26rpx;
  color: rgb(65, 43, 43);
}
.addressArrivalTime {
  color: #ff5000;
  font-size: 26rpx;
}
.shopBgarrow {
  position: absolute;
  left: 75rpx;
  top: 68rpx;
  height: 21rpx;
  width: 36rpx;
}

.line {
  background: #eeeeee;
  margin-left: 50rpx;
  height: 2rpx;
  /* overflow: hidden; */
  width: 660rpx;
}

.orderSource {
  line-height: 80rpx;
  height: 80rpx;
  font-size: 30rpx;
  width: 100%;
  color: #666;
  padding-left: 20rpx;
  margin-top: 30rpx;
  background: #fff;
}

.product {
  height: 160rpx;
  width: 100%;
  padding: 20rpx;
  display: flex;
  flex-direction: row;
  background: #fafafa;
}

.productIcon {
  width: 120rpx;
  height: 120rpx;
  background: #fff;
}

.productContent {
  margin-left: 20rpx;
  width: 570rpx;
  height: 120rpx;
}

.productName {
  font-size: 26rpx;
  color: #333;
  line-height: 30rpx;
}
.productStyle {
  margin-top: 8rpx;
  color: #999;
  line-height: 24rpx;
  font-size: 24rpx;
}
.productBottom {
  margin-top: 20rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 25rpx;
}

.productPriBg {
  display: flex;
  flex-direction: row;
}
.productPrice {
  color: #ff5000;
  font-size: 30rpx;
}
.productVipIcon {
  width: 40rpx;
  height: 24rpx;
  margin-left: 8rpx;
  background: #000;
}
.productCount {
  color: #333;
  font-size: 24rpx;
}

.payView {
  margin-top: 20rpx;
  background: #fff;
}

.payViewContent {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 88rpx;
  line-height: 88rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
}

.submitBgView {
  position: fixed;
  flex-direction: row;
  bottom: 0;
  height: 98rpx;
  left: 0;
  width: 100%;
  background: #fff;
  line-height: 98rpx;
  display: flex;
  z-index: 1001;
}

.submit_left {
  margin-left: 20rpx;
  font-size: 26rpx;
  color: #333;
}

.submit_mid {
  font-size: 26rpx;
  color: #ff5000;
}

.submit_right {
  position: absolute;
  right: 0;
  height: 98rpx;
  line-height: 98rpx;
  color: #fff;
  text-align: center;
  font-size: 30rpx;
  background: #ff5000;
  width: 240rpx;
}

.remindPopView {
  position: fixed;
  bottom: -78rpx;
  height: 244rpx;
  left: 0;
  width: 100%;
  background: #fff;
  line-height: 68rpx;
  display: flex;
  z-index: 1000;
}

.popViewTopBg {
  position: absolute;
  width: 100%;
  height: 68rpx;
  left: 0;
  z-index: -1;
}

.popViewTop {
  height: 48rpx;
  display: flex;
  flex-direction: row;
  padding: 0 20rpx;
  justify-content: space-between;
}
.remindTitle {
  margin-top: 8rpx;
  color: #884c00;
  font-size: 26rpx;
}
.remindIcon {
  position: absolute;
  top: 28rpx;
  right: 10rpx;
  width: 32rpx;
  height: 32rpx;
}

.couponRight {
  line-height: 88rpx;
  height: 88rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.arrow {
  width: 32rpx;
  height: 32rpx;
  margin-left: 10rpx;
}

.leVipBgView {
  padding: 28rpx 20rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 142rpx;
  line-height: 142rpx;
  background: #fff;
}

.leVipLeft {
  height: 114rpx;
}
.leVipLeftTop {
  display: flex;
}
.leVipLeftBottom {
  margin-top: 28rpx;
}

.accountListDetail {
  padding: 0 20rpx;
  display: flex;
  justify-content: space-between;
  background: #fff;
  height: 60rpx;
  line-height: 60rpx;
}
</style>