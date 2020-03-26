
<template>
  <div>
    <div class="backgroundView" :style="{'padding-bottom':global_margin_bottom + 'px'}">
      <div class="scanshop" @click.stop="funcGoShop">
        <div class="scan_top_style">
          <img src="/static/images/twohr_icon_location.png" style="width:28rpx;height:28rpx;" />
          <span style="font-size:30rpx;margin-left:12rpx">{{shop_name?shop_name:'请选择门店'}}</span>
        </div>
        <div class="scan_top_style">
          <span style="margin-left:20rpx">切换门店</span>
          <img
            src="/static/goodsdetail/lecard_arrow_right.png"
            style="margin-left:20rpx;width:13rpx;height:23rpx;"
          />
        </div>
      </div>
      <div class="scan_content">
        <div class="scan_remind">
          <span style="color:#fff">服饰类商品请输入价签上第二个条形码</span>
        </div>
        <div class="scan_write_code">
          <img src="../../images/scan_code03.png" class="scan_bg" />
          <input
            v-model="pro_sku"
            @input="funcString"
            type="text"
            class="write_code"
            placeholder-style="font-size:30rpx;padding:0 130rpx;color:#cacaca;"
            placeholder="请输入商品条形码"
          />
        </div>
        <div class="scan_button_bg">
          <div @click.stop="funcChangeScan">
            <img src="../../images/guide_scan.png" style="width:240rpx;height:72rpx" />
          </div>
          <!-- class="add_cart" :class="{acti:enable}" -->
          <div @click.stop="funcAddCart">
            <img
              v-show="!enable"
              src="../../images/guide_scan_confirm1.png"
              style="width:240rpx;height:72rpx"
            />
            <img
              v-show="enable"
              src="../../images/guide_scan_confirm2.png"
              style="width:240rpx;height:72rpx"
            />
          </div>
        </div>
        <div class="scan_bottom">
          <img src="../../images/user_explain1.png" style="width:750rpx;height:262rpx;" />
        </div>
      </div>

      <cartShaoma :add="showSmcart" :shop_id="shop_id" :card_id="card_id"></cartShaoma>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {
  getSubmitOrderInfo,
  userSubmitOrder,
  userGetPayInfomaiton,
  getHaiTaoSubmitOrderInfo,
  userHaiTaoSubmitOrder,
  checkHaiTaoIdCard,
  getSmgSubmitOrder,
  userSmgSubmitOrder,
  smsynShoppingCart
} from "@/api";
import cartShaoma from "@/components/cartShaoma";
import ordergoods from "@/components/product/ordergoods";
import orderHeader from "@/components/order/header/";
import { EventBus } from "@/bus/event-bus.js";
import wxParse from "mpvue-wxparse";
import { priceFormat } from "@/utils";
import { sa } from "@/utils/sensorsdata.js";
const app = getApp();

// import funcGlobalWxpayInfomation from "@/utils/gopay.js";

export default {
  components: {
    ordergoods,
    orderHeader,
    wxParse,
    cartShaoma
  },

  data() {
    return {
      shop_name: "",
      shop_id: 0,
        card_id:"",
      pro_sku: "",
      enable: false,
      showSmcart: false//刷新购物车
    };
  },

  computed: {
    BASE_IMG_URL() {
      return this.$store.state.BASE_APP_INFO["download_le_image"];
    }

    // 发票信息
  },

  onLoad(options) {
    this.pro_sku = "";
  },

  onShow() {
    let shop_name = wx.getStorageSync("shop_name");
    let shop_id = wx.getStorageSync("shop_id") || 20;
    this.showSmcart = true;
      if(wx.getStorageSync("token")){
          wx.removeStorageSync("sm_card_id")
      }
      console.log(shop_name, shop_id);
    this.shop_name = shop_name;
    this.shop_id = shop_id;
    this.card_id = wx.getStorageSync("sm_card_id");
  },

  onUnload() {
    console.log('卸载卸载');
  },

  methods: {

    funcGoShop() {
      let url = "/pages/scanShop/index/main";
      wx.navigateTo({
        url: url
      });
    },

    funcString(e) {
      console.log(e);


        if (this.pro_sku.length > 0) {
        this.enable = true;
      } else {
        this.enable = false;
      }
    },

    funcChangeScan() {
      console.log("切换扫码购");
      wx.scanCode({
        onlyFromCamera: false,
        scanType: ["qrCode", "barCode", "datamatrix", "pdf417"],
        success: result => {
          this.pro_sku = result.result;
          this.funcAddCart();
        },
        fail: error => {
          console.log(error);
        },
        complete: () => {}
      });
    },

    funcAddCart() {
        wx.showLoading()
        this.showSmcart=false
      if (!this.enable) {
        return;
      }
      let sku = this.pro_sku;
      let cart_id = wx.getStorageSync("sm_card_id");
      let quantity = 1;
      let shop_id = this.shop_id;
      let params = {
        sku: sku,
        cart_id: cart_id ? cart_id : undefined,
        quantity: quantity,
        shop_id: shop_id || 20
      };
      console.log(params);
      smsynShoppingCart(params).then(res => {
        if(!this.cart_id && !wx.getStorageSync("token")){
            wx.setStorageSync("sm_card_id",res.cart_id)
            this.cart_id=res.cart_id
        }
        this.pro_sku=""
        this.showSmcart = true;
        wx.hideLoading()
        wx.showToast({
            title:'添加成功',
            icon:'none'
        })
      });
    }
  }
};
</script>

<style scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.cartImg {
  position: absolute;
  top: -20rpx;
  left: 20rpx;
  width: 100rpx;
  height: 100rpx;
}
.cart-box {
  height: 90rpx;
  width: 600rpx;
  padding-left: 150rpx;
  background: #fff;
  line-height: 90rpx;
  font-size: 26rpx;
  position: fixed;
  bottom: 0;
}
.gotoJie {
  float: right;
  width: 240rpx;
  background: #ff5000;
  text-align: center;
  height: 100%;
  line-height: 90rpx;
  font-size: 30rpx;
  color: #fff;
  font-weight: bold;
}
.gotoJie.gray {
  background: #cacaca;
}
.backgroundView {
  background: #222;
  min-height: 1334rpx;
  padding-bottom: 156rpx;
}

.scan_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.scan_write_code {
  width: 590rpx;
  height: 116rpx;
  position: relative;
  margin-top: 38rpx;
}

.scan_bg {
  position: absolute;
  left: 0;
  right: 0;
  width: 590rpx;
  height: 116rpx;
}

.scan_remind {
  width: 476rpx;
  height: 34rpx;
  margin-top: 120rpx;
  color: #333;
  font-size: 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scan_button_bg {
  width: 560rpx;
  height: 72rpx;
  display: flex;
  justify-content: space-between;
  margin-top: 36rpx;
  font-size: 28rpx;
}

.scan_top_style {
  display: flex;
  align-items: center;
}

.button_scan {
  margin-top: 80rpx;
  font-family: PingFangSC-Medium;
  background: #ff5000;
  border-radius: 40rpx;
  width: 590rpx;
  height: 80rpx;
  color: #fff;
  font-size: 30rpx;
  line-height: 80rpx;
  text-align: center;
}

.button_write {
  font-family: PingFangSC-Medium;
  border-radius: 40rpx;
  margin-top: 28rpx;
  width: 590rpx;
  height: 80rpx;
  font-size: 30rpx;
  color: #ff5000;
  line-height: 80rpx;
  text-align: center;
  background: #fff;
  border: 1px solid #ff5000;
}
.scan_bottom {
  /* width: 668rpx; */
  /* height: 260rpx; */
  margin-top: 222rpx;
}

.add_cart {
  width: 180rpx;
  height: 80rpx;
  background: #666;
}

.acti {
  background: #fff;
}

.write_code {
  width: 590rpx;
  height: 116rpx;
  z-index: 10;
  font-size: 30rpx;
  padding: 0 30rpx;
  color: #333;
}

.write_codep {
  text-align: center;
  color: red;
  font-size: 30rpx;
  padding: 0 100rpx;
}

.orderSource {
  line-height: 80rpx;
  height: 80rpx;
  font-size: 30rpx;
  width: 710rpx;
  color: #666;
  padding-left: 20rpx;
  padding-right: 20rpx;
  margin-top: 20rpx;
  background: #fff;
}

.orderSource.sea {
  /* line-height: 0rpx; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product {
  height: 160rpx;
  /* width: 100%; */
  padding: 20rpx;
  display: flex;
  /* flex-direction: row; */
  background: #fafafa;
  box-sizing: border-box;
  border-bottom: #eee 1rpx solid;
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
  box-sizing: border-box;
}

.productName {
  font-size: 26rpx;
  color: #333;
  line-height: 30rpx;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.productStyle {
  margin-top: 12rpx;
  color: #999;
  line-height: 24rpx;
  font-size: 24rpx;
  height: 24rpx;
}
.productBottom {
  margin-top: 12rpx;
  display: flex;
  /* flex-direction: row; */
  justify-content: space-between;
  /* line-height: 25rpx; */
  align-items: center;
}

.productPriBg {
  display: flex;
  align-items: center;
}
.productPrice {
  color: #ff5000;
  font-size: 30rpx;
  display: flex;
  align-items: baseline;
}
.productVipIcon {
  width: 48rpx;
  height: 30rpx;
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
  color: #333;
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
  z-index: 91;
  border-top: #dddddd solid 1rpx;

  /* align-items: baseline; */
}

.submit_left {
  margin-left: 20rpx;
  font-size: 26rpx;
  color: #333;
}

.submit_mid {
  font-size: 34rpx;
  color: #ff5000;
  font-family: PingFangSC-Medium;
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
  /* bottom: 88rpx; */
  height: 244rpx;
  left: 0;
  width: 100%;
  /* background: #fff; */
  line-height: 68rpx;

  z-index: 90;
}

.popViewTopBg {
  position: absolute;
  width: 100%;
  height: 88rpx;
  left: 0;
  z-index: -1;
}

.popViewTop {
  height: 88rpx;
  display: flex;
  flex-direction: row;
  padding: 0 20rpx;
  justify-content: space-between;
  position: relative;
}

.pop_select_way {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #333;
  padding-left: 20rpx;
  box-sizing: border-box;
  background: #fff;
}
.remindTitle {
  /* margin-top: 8rpx; */
  color: #884c00;
  font-size: 26rpx;
}
.remindIcon {
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
  width: 13rpx;
  height: 23rpx;
  margin-left: 20rpx;
}

.pro_sale_style {
  font-size: 18rpx;
  color: #ff5000;
  border: 1rpx solid #ff5000;
  background: #fff;
  border-radius: 6rpx;
  padding: 0 4rpx;
  margin-right: 10rpx;
}

.leVipBgView {
  padding: 20rpx 20rpx 28rpx 20rpx;
  margin-top: 20rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* height: 142rpx; */
  /* line-height: 142rpx; */
  background: #fff;
  box-sizing: border-box;
  align-items: center;
}

.leVipLeft {
  /* height: 114rpx; */
}
.leVipLeftTop {
  display: flex;
  /* align-items: baseline; */
  /* align-items: center; */
}
.leVipLeftBottom {
  margin-top: 20rpx;
}

.accountList {
  margin-top: 17rpx;
}

.accountListDetail {
  padding: 0 20rpx;
  display: flex;
  justify-content: space-between;
  background: #fff;
  height: 60rpx;
  line-height: 60rpx;
}

/* 模态框背景 */

.toast {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.toast_content {
  width: 590rpx;
  height: 292rpx;
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding: 20rpx 28rpx; */
}

/* 取消订单模态框 */

.toast_content_title {
  margin-top: 60rpx;
  text-align: center;
  font-size: 30rpx;
  color: #333;
  height: 84rpx;
  width: 510rpx;
}

.toast_content_button {
  margin-top: 60rpx;
  width: 100%;
  height: 88rpx;
  display: flex;
  font-size: 30rpx;
  align-items: center;
  border-top: #eeeeee 1px solid;
}
.toast_content_sure {
  text-align: center;
  flex: 1;
  height: 42rpx;
  color: #ff5000;
  font-size: 30rpx;
}

.toast_content_cancle {
  text-align: center;
  height: 42rpx;
  font-size: 30rpx;
  flex: 1;
  color: #333;
  border-right: #eeeeee 1px solid;
}

/* 缺货模态框 */

.toast_exit {
  position: absolute;
  top: 28rpx;
  right: 27rpx;
  width: 30rpx;
  height: 30rpx;
  background: #999;
}
.toast_pro_bg {
  padding: 0 40rpx;
  width: 710rpx;
  box-sizing: border-box;
  height: 320rpx;
}
.toast_button_bg {
  width: 100%;
  margin-top: 60rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.toast_go_pay {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 30rpx;
  height: 72rpx;
  box-sizing: content-box;
  background: #ff5000;
  width: 280rpx;
  padding: 0;
  font-size: 26rpx;
  border: none;
}

.toast_content_express {
  width: 100%;
  /* height: 292rpx; */
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 0;

  /* border-radius: 16rpx; */
  /* display: flex; */
  /* flex-direction: column; */
  /* align-items: center; */
}

/* 运费模态框 */

.toast_express_title {
  height: 88rpx;
  width: 100%;
  line-height: 88rpx;
  font-size: 30rpx;
  color: #333;
  text-align: center;
}

.toast_content_pro {
  /* height: 208rpx; */
  width: 100%;
  padding-bottom: 20rpx;
}
.toast_express_pro_title {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 20rpx 0 20rpx;
  font-size: 26rpx;
}

.toast_express_pro_bg {
  /* display: flex; */
  /* flex-direction: row; */
  /* flex-wrap:  */
  padding-left: 20rpx;
  padding-right: 10rpx;
  margin-top: 28rpx;
  height: 120rpx;
  white-space: nowrap;
}

.toast_express_pro_content {
  margin-right: 10rpx;
  width: 120rpx;
  height: 120rpx;
  display: inline-block;
}

.toast_express_bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  width: 710rpx;
  margin-top: 20rpx;
  padding: 0 20rpx;
}

.return_coupon {
  width: 100%;
  background: #fff;
  align-items: center;
  color: #333;
  font-size: 26rpx;
  padding: 0 20rpx;
  display: flex;
  height: 80rpx;
}

.coupon_content {
  background: #ff5000;
  color: #fff;
  font-size: 22rpx;
  height: 32rpx;
}

/* 闪送弹层 */

.toast_time_bg {
  height: 600rpx;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #f3f5f7;
  box-shadow: inset 0 -1rpx 0 0 #eeeeee;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
}

.toast_time_title_bg {
  height: 88rpx;
  width: 100%;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  /* box-shadow: inset 0 -1px 0 0 #EEEEEE; */
  background: #fff;
  font-size: 26rpx;
  text-align: center;
  line-height: 88rpx;
}

.toast_time_close {
  position: absolute;
  right: 28rpx;
  top: 28rpx;
}
.toast_time_content_bg {
  width: 100%;
  height: 512rpx;
  display: flex;
  font-size: 26rpx;
  color: #333;
}
.toast_time_content_left {
  width: 200rpx;
  height: 100%;
}

.toast_time_content_right {
  /* flex: 1; */
  width: 550rpx;

  /* display: flex; */
}

.toast_time_content_detail {
  display: flex;
  padding-left: 40rpx;
  padding-right: 28rpx;
  height: 88rpx;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}

.toast_time_content_detail.activity {
  color: #ff5000;
}

.toast_time_content_time {
  line-height: 88rpx;
  height: 88rpx;
  text-align: center;
}
.toast_time_content_time.activity {
  background: #fff;
}

.product_icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 120rpx;
  height: 120rpx;
}

.icon_bg {
  position: relative;
  width: 120rpx;
  height: 120rpx;
}

.icon_desc {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 28rpx;
  background: #000;
  color: #fff;
  font-size: 22rpx;
  line-height: 28rpx;
  width: 100%;
  text-align: center;
  opacity: 0.5;
}

.pop_view_top_content {
  margin-top: 20rpx;
  height: 68rpx;
  display: flex;
  width: 710rpx;
  align-items: center;
  justify-content: space-between;
}

/* 扫码购样式表 */

.scanshop {
  background: #fff;
  height: 88rpx;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10rpx;
  font-size: 26rpx;
  color: #333;
  border-bottom: 1rpx solid #eeeeee;
}
</style>

