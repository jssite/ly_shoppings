<template>
  <div style="background:#f2f3f5;min-height:1500rpx;width:100%">
    <div class="top_bg_view">
      <div class="finish_remind">
        <img style="width:50rpx;height:50rpx;" src="/static/images/confirm/order_pay_succeecd.png" />
        <div style="margin-left:16rpx; color:#fff;font-size:40rpx;">{{pay_text}}</div>
      </div>
      <div class="finish_remind" style="margin-top:20rpx;">
        <text style="color:#fff; font-size:26rpx; font-family:PingFangSC-Medium">支付金额：</text>
        <div
          style="margin-left:5rpx; color:#fff; font-size:26rpx; font-family:PingFangSC-Regular"
        >¥{{pay_money}}</div>
      </div>
      <div class="finish_remind">
        <div v-if="isLeVip">
          <button class="fish_button" style="width:280rpx" @click="funclookinfo(3)">查看我的乐享卡</button>
        </div>
        <div v-else-if="isLeNoun">
          <button class="fish_button" style="width:280rpx" @click="funclookinfo(5)">查看我的品牌卡</button>
        </div>
        <div v-else-if="isLeVeb">
          <button class="fish_button" style="width:280rpx" @click="funclookinfo(4)">查看报名详情</button>
        </div>
        <div v-else-if="isLeAngel">
          <button class="fish_button" style="width:280rpx" @click="funclookinfo(6)">查看我的天使会员</button>
        </div>
        <div v-else-if="isNoun" style="display:flex">
          <button class="fish_button" @click="funclookinfo(1)">查看订单</button>
          <button class="fish_button" style="margin-left:60rpx" @click="funclookinfo(2)">返回首页</button>
        </div>
      </div>
    </div>
    <div class="coupon_share">
      <div class="arrival_time_bg" v-if="response_info.lightning_info">
        <div class="arriva_time">
          <span class="time_desc">预计送达时间：</span>
          <span class="time">{{response_info.lightning_info.receiver_time}}</span>
        </div>
        <div class="timeout_remind">{{response_info.lightning_info.lightning_overtime}}</div>
        <div class="goods_not">{{response_info.lightning_info.lightning_desc}}</div>
      </div>
      <div class="coupon_list_bg">
        <div v-for="(item,index) in couponList" :key="index" class="coupon_detail">
          <img class="coupon_icon" :src="item.gift_icon" />
          <span class="coupon_detail_desc">{{item.gift_content}}</span>
          <button
            v-if="item.gift_btn_type == 1"
            class="coupon_button"
            open-type="share"
            @click="funcCounpon(item)"
          >{{item.gift_btn_content}}</button>
          <button v-else class="coupon_button" @click="funcCounpon(item)">{{item.gift_btn_content}}</button>
        </div>
      </div>
    </div>
    <img
      v-if="AD_IMG_URL.url"
      class="ad_view"
      @click="funcGotoLink"
      v-bind:class="{activity:couponList.length}"
      :src="AD_IMG_URL.url"
      alt
    />
    <div
      class="leyou_rmeind"
      :class="{activity:remind_top}"
    >乐友平台不会以任何理由要求您点击网址链接或输入银行卡信息进行退款操作；请认准乐友官方客服电话4006669888，谨防诈骗！</div>
    <promote-title v-if="likeData.length"></promote-title>
    <div class="products_small_wrap">
      <likeGood :mainData="item" v-for="(item,index) in likeData" :key="index"></likegood>
      <!-- <promote-product
        v-on:productViewClick="productClick"
        v-for="(item,index) in response_info.recommend_products"
        :key="index"
        :type="item"
      ></promote-product>-->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { payFinishInfomaiton, daGuanLikeRecomment } from "@/api";

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
  computed: mapState(["BASE_APP_INFO"]),
  data() {
    return {
      isLeVip: false,
      isLeNoun: false,
      isLeVeb: false,
      isLeAngel: false,
      isNoun: false,
      is_show_ad: true,
      pay_money: "",
      pay_text: "支付成功",
      couponList: [],
      response_info: {},
      shareObject: {},
      likeData: [],
      is_presell: false
    };
  },

  computed: {
    AD_IMG_URL() {
      let adList = this.$store.state.BASE_AD_INFO["ad_list"];

      let ad_info = {};
      if (adList) {
        adList.forEach(item => {
          if (item.type == 10011009) {
            ad_info = item;
          }
        });
      }

      console.log(ad_info);
      return ad_info;
    },

    remind_top() {
      return (
        !this.AD_IMG_URL.url &&
        (this.couponList.length || this.response_info.lightning_info)
      );
    }
  },
  created() {
    //this.funcQuery()
  },

  onLoad(options) {
    let res = JSON.parse(decodeURIComponent(options.pay_info));
    this.pay_money = res.payable_amount;
    debugger;
    this.sa_page(this, false, "订单完成", "");
    // options.is_le_vip = "0";
    // options.is_le_veb = "0";
    this.shareObject = {};
    this.is_presell = false;
    if (options.is_presell == "1") {
      this.is_presell = true;
    }
    console.log(options);
    // 1乐享卡
    if (options.is_le_vip == 1) {
      this.isLeVip = true;
      // 2品牌储值卡
    } else if (options.is_le_vip == 2) {
      this.isLeNoun = true;
      this.pay_text = "支付成功";
      // 3乐活动
    } else if (options.is_le_vip == 3) {
      this.isLeVeb = true;
      // this.pay_text = "报名成功"
    } else if (options.is_le_vip == 4) {
      this.isLeAngel = true;
      // this.pay_text = "报名成功"
    } else {
      this.isNoun = true;

      //   let res = JSON.parse(options.pay_info);
      // let res = {"serial_num":"7015638486686657","order_id":40653946,"payable_amount":"0.01"};
      let serial_num = res.serial_num;
      let order_id = res.order_id;
      this.isLeVip = false;
      this.isLeNoun = false;
      this.isLeVeb = false;
      let start = 0;
      let end = 6;
      let request_info = {
        serial_num: serial_num,
        order_id: order_id,
        start: 0,
        end: 20
      };
      payFinishInfomaiton(request_info).then(res => {
        console.log(res);
        if (res.return_gift_list) {
          this.couponList = res.return_gift_list;
        }
        this.response_info = res;
        this.shareObject = res.share_model;
      });
    }
    this.testDaGuan();
  },

  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      // share_title 分享标题
      //       share_pic	String	分享图片
      // share_content	String	分享内容
      // share_url	String	分享链接
      // sharePromptMsg	String	分享描述

      let activity_title = this.BASE_APP_INFO.share_active_prefix;
      let shareTitle = this.shareObject.share_title;
      if (activity_title && activity_title != "") {
        shareTitle = activity_title + shareTitle;
      }
      let link = encodeURIComponent(this.shareObject.share_url);
      let share_info = {
        title: shareTitle,
        imageUrl: this.shareObject.share_pic,
        path: "/pages/transferH5/main?url=" + link
      };
      return share_info;
      console.log(res.target);
      // return {
      //   title: this.shareObject.share_title,
      //   imageUrl: this.shareObject.share_pic
      // };
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

    funcGotoLink() {
      let info = this.AD_IMG_URL;
      if (info.link) {
        wx.setStorageSync("urlH5", info.link);
        wx.navigateTo({
          url: "/pages/transferH5/main"
        });
      }
    },

    // productClick(sender) {
    //   console.log(sender);
    //   if (sender.key == 0) {
    //     let url = "/pages/confirm/finish/main?sku=" + sender.value;

    //     wx.redirectTo({
    //       url: url
    //     });
    //   } else {
    //     wx.showModal({
    //       title: "提示",
    //       content: "找相似功能",
    //       success(res) {
    //         if (res.confirm) {
    //           console.log("用户点击确定");
    //         } else if (res.cancel) {
    //           console.log("用户点击取消");
    //         }
    //       }
    //     });
    //   }
    // },

    funclookinfo(index) {
      if (index === 1) {
        let url = "/pages/confirm/list/main?order_status=3";
        if (this.is_presell) {
          url = "/pages/confirm/list/main?order_status=2";
        }
        wx.redirectTo({
          url: url
        });
      } else if (index == 2) {
        wx.switchTab({
          url: "/pages/index/main"
        });
      } else if (index == 4) {
        // 乐活动
        let url = "https://app.leyou.com.cn/leactivity/signup";
        this.gotoH5page(
          url + "?is_mini=1&token=" + wx.getStorageSync("token") + "&id=2"
        );
      } else if (index == 5) {
        // 品牌储值卡
        let url = "https://app.leyou.com.cn/brand_card/index";
        this.gotoH5page(url + "?is_mini=1&token=" + wx.getStorageSync("token"));
      } else if (index == 6) {
        // 天使会员
        let url = 'https://app.leyou.com.cn/angel/equity?success_type=1';
        //  let url = 'http://192.168.98.194/angel/equity?success_type=1';
        this.gotoH5page(
          url
        );
      } else if (index == 3) {
        // 乐享卡
        let url = "https://app.leyou.com.cn/activity/joyCard";
        this.gotoH5page(
          url +
            "?is_mini=1&token=" +
            wx.getStorageSync("token") +
            "&isRefresh=1"
        );
      }
    },

    gotoH5page(url) {
      //跳转到中转页面
      // http://app.leyou.com.cn/activity/joyCard?isRefresh=1&token=dfcd5c3537e52cab7ca44151f122288f
      console.log(url);
      wx.setStorageSync("urlH5", url);
      wx.navigateTo({ url: "/pages/transferH5/main" });
    },

    testDaGuan() {
      let params = {
        page_index: 1,
        page_size: 20,
        scene_type: "ios_pay"
      };
      daGuanLikeRecomment(params).then(res => {
        let pro_info_list = res.product_list;
        if (pro_info_list && pro_info_list.length) {
          pro_info_list.map(pro_info => {
            pro_info.name = pro_info.prod_title;
            pro_info.price = pro_info.sale_price;
            pro_info.url = pro_info.image;
          });
          this.likeData = pro_info_list;
        }
        console.log(res, "这是支付成功猜你喜欢的数据");
      });
    }
  }
};
</script>

<style scoped>
.top_bg_view {
  background: #ff5000;
  height: 312rpx;
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
  border: 2rpx solid #ffffff;
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

.arriva_time {
  font-size: 30rpx;
  color: #333;
  display: flex;
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