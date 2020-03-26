
<template>
  <div>
    <div class="scancode_tabbar">
      <div class="list_top_button">
        <div class="list_top_online" @click="funcChangeStatus(1)" :class="{activity:true}">扫码购</div>
        <div class="list_top_shop" @click="funcChangeStatus(0)">扫一扫</div>
      </div>
    </div>
    <div class="backgroundView">
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
      <div>
        <div v-if="baseData.cart_product_type_list">
          <cartShaoma
            :baseData="baseData"
            :shop_id="shop_id"
            :card_id="card_id"
            :add="true"
            @getCartData="getCartData"
          ></cartShaoma>
        </div>
        <div v-else class="scan_content">
          <div class="scan_bottom">
            <img src="../../images/user_explain1.png" style="width:750rpx;height:262rpx;" />
          </div>
          <div class="scan_remind">
            <span>请扫描商品条形码</span>
            <span>服饰类商品请扫价签上第二个条形码</span>
          </div>
        </div>
      </div>
    </div>

    <!-- hhhh -->
    <img
      class="btn_scan_code"
      src="../../images/sao_tabbar_button.png"
      @click.stop="funcChangeScan"
    />
    <div class="bottom_submit_bg">
      <div v-if="!baseData.cart_product_type_list" class="bottom_no_bg">
        <span class="no_data_money">合计：0元</span>
        <div class="gojiesuan">立即下单</div>
      </div>
      <div v-else class="cart-box">
        <div>
          <div class="all-monry">
            合计：
            <span class="money-span">
              <moneySpan :money="baseData.total_money" :iSize="30"></moneySpan>
            </span>
          </div>
          <div class="coupon_money">
            已优惠：
            <span>{{baseData.coupon_money}}</span>
          </div>
        </div>
        <span class="sureBuybtn" @click="subBuy()">立即下单{{num?'('+(num>99?'99':num)+')':''}}</span>
      </div>
    </div>

    <!-- 门店选择弹层 -->
    <div class="toast" @click="funcClose" v-if="show_toast" catchtouchmove="ture">
      <div class="toast_content">
        <div class="toast_content_title">
          <span>当前门店为</span>
          <span style="color:#ff5000">{{shop_name}}</span>
          <span>，请确认是否在门店中</span>
        </div>
        <div class="toast_content_button">
          <div class="toast_content_cancle" @click.stop="funCancle">切换门店</div>
          <div class="toast_content_sure" @click.stop="funSure">开始购物</div>
        </div>
      </div>
    </div>

    <div class="toast" @click="funcClose" v-if="show_toast_writecode" catchtouchmove="ture">
      <!-- 手动输入条码 -->
      <div class="toast_content_input" v-if="show_toast_change_writecode">
        <span style="font-size:34rpx;color:#333;margin-top:28rpx;">输入条码</span>
        <input
          v-model="pro_sku"
          @input="funcString"
          type="text"
          class="write_code"
          placeholder-style="font-size:30rpx;padding:0 130rpx;color:#cacaca;"
          placeholder="服饰类请输入价签上第二个条码"
        />
        <div class="toast_content_button" style="margin-top:72rpx">
          <div class="toast_content_cancle" @click.stop="funcReScan">切换扫码</div>
          <div class="toast_content_sure" @click.stop="funWriteCodeSure">确认</div>
        </div>
      </div>
      <!-- 扫码无结果弹层 -->
      <div class="toast_content" v-else>
        <div style="font-size:34rpx;color:#333;margin-top:28rpx;">
          <span>未找到该商品</span>
        </div>
        <div
          style="margin-top:36rpx;text-align: center;font-size: 30rpx;color: #333;width: 510rpx;"
        >
          <span>服饰类商品请扫价签上第二个条形码</span>
        </div>
        <div class="toast_content_button">
          <div class="toast_content_cancle" @click.stop="funcReScan">重新扫码</div>
          <div class="toast_content_sure" @click.stop="funWriteCode">手动输入</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import cartShaoma from "@/components/cartShaoma";

import { queryDefaultShop, smsynShoppingCart, getsmCartAllData,apiScanCode } from "@/api";
import ordergoods from "@/components/product/ordergoods";
import orderHeader from "@/components/order/header/";
import { EventBus } from "@/bus/event-bus.js";
import wxParse from "mpvue-wxparse";
import { priceFormat } from "@/utils";
import { sa } from "@/utils/sensorsdata.js";
import moneySpan from "@/components/public/money.vue";
const app = getApp();

// import funcGlobalWxpayInfomation from "@/utils/gopay.js";

export default {
  components: {
    ordergoods,
    orderHeader,
    wxParse,
    cartShaoma,
    moneySpan
  },

  data() {
    return {
      shop_name: "",
      shop_id: 0,
      remind_title: "",
      show_toast: false,
      showSmcart: true,
      showCart_sm: false,
      card_id: "",
      baseData: {},
      show_toast_writecode: false,
      show_toast_change_writecode: false,
      pro_sku: "",
      num: 0,
      is_scan_shop:true,
    };
  },

  computed: {
    BASE_IMG_URL() {
      return this.$store.state.BASE_APP_INFO["download_le_image"];
    }

    // 发票信息
  },

  onLoad(options) {
    this.num = 0;
    //
    this.is_scan_shop = true;
    this.funcGetDefaultShops();
  },

  // onUnload() {
  //   EventBus.$off();
  //   console.log("卸载卸载");
  // },

  onShow() {
    if (this.is_scan_shop) {
      this.funcGetShopProList();
    }
  },

  methods: {
    closeModel() {
      this.showSmcart = false;
    },

    funcGetShopProList() {
      let shop_name = wx.getStorageSync("shop_name");
      let shop_id = wx.getStorageSync("shop_id");
      if (!this.showCart_sm) {
        this.showSmcart = true;
        this.showCart_sm = true;
      }
      if (wx.getStorageSync("token")) {
        wx.removeStorageSync("sm_card_id");
      }
      console.log(shop_name, shop_id);
      this.shop_name = shop_name;
      this.shop_id = shop_id;
      this.card_id = wx.getStorageSync("sm_card_id");
      wx.showLoading({ title: "加载中...", mask: true });
      getsmCartAllData({
        shop_id: this.shop_id || 20,
        cart_id: this.cart_id ? this.cart_id : undefined
      }).then(res => {
        this.baseData = res.body;
        this.funcCacluateNum();
        wx.hideLoading();
      });
    },

    funcGetDefaultShops() {
      let info = wx.getStorageSync("locationInfo");
      let params = {
        longitude: info.longitude,
        latitude: info.latitude
      };
      queryDefaultShop(params).then(res => {
        console.log(
          res,
          "扫码购获取默认门店的接口",
          params,
          "获取默认门店的参数"
        );
        if (res.location_shop) {
          this.shop_name = res.location_shop.shop_name;
          this.shop_id = res.location_shop.shop_id;
          wx.setStorageSync("shop_name", res.location_shop.shop_name);
          wx.setStorageSync("shop_id", res.location_shop.shop_id);
          this.show_toast = true;
          this.funcGetShopProList();
        } else {
          // this.funcGoShop();
        }
      });
    },

    subBuy() {
      EventBus.$emit("scanSubmit", this.baseData);
    },

    getCartData(data_cart) {
      this.baseData = data_cart;
      this.funcCacluateNum();
    },

    funcCacluateNum() {
      let num_temp = 0;
      if (this.baseData.cart_product_type_list) {
        this.baseData.cart_product_type_list.map((item, index) => {
          item.cart_info_product_list.map(res => {
            res.cart_product_list.map(data => {
              if (data.is_check) {
                num_temp += data.quantity;
              }
            });
          });
        });
      }
      this.num = num_temp;
    },

    funcString(e) {
      console.log(e);
      //   if (this.pro_sku.length > 0) {
      //   this.enable = true;
      // } else {
      //   this.enable = false;
      // }
    },

    funcClose() {
      this.show_toast = false;
    },

    funSure() {
      this.show_toast = false;
    },

    funCancle() {
      this.funcGoShop();
      this.show_toast = false;
    },

    funcGoShop() {
      let url = "/pages/scanShop/index/main";
      wx.navigateTo({
        url: url
      });
    },

    funcReScan() {
      if (this.show_toast_change_writecode) {
        this.show_toast_change_writecode = false;
      }
      this.show_toast_writecode = false;
      this.funcChangeScan();
    },
    funWriteCode() {
      this.show_toast_change_writecode = true;
    },

    funWriteCodeSure() {
      if (this.pro_sku.length > 0) {
        this.show_toast_writecode = false;
        this.show_toast_change_writecode = false;
        this.funcAddCart(this.pro_sku);
      }
    },

    funcChangeScan() {
      wx.scanCode({
        onlyFromCamera: false,
        scanType: ["qrCode", "barCode", "datamatrix", "pdf417"],
        success: result => {
          this.show_toast = false;
          this.funcAddCart(result.result);
        },
        fail: error => {
          this.show_toast = false;
          console.log(error);
        },
        complete: () => {}
      });
    },

    funcAddCart(sku) {
      let cart_id = wx.getStorageSync("sm_card_id") || this.cart_id;
      let quantity = 1;
      let shop_id = this.shop_id;
      let params = {
        sku: sku,
        cart_id: cart_id ? cart_id : undefined,
        quantity: quantity,
        shop_id: shop_id || 20
      };
      var _this = this;
      console.log(params);
      smsynShoppingCart(params).then(res => {
        if (res.header.res_code == 0) {
          if (!this.cart_id && !wx.getStorageSync("token")) {
            wx.setStorageSync("sm_card_id", res.cart_id);
          }
          this.baseData = res.body;
        } else {
          this.show_toast_writecode = true;
        }
      });
    },
    funcChangeStatus(index) {
      if (index == 0) {
        this.is_scan_shop = false;
        let _this = this;
        wx.scanCode({
          scanType: ["barCode", "qrCode", "datamatrix", "pdf417"],
          success(res) {
            let { result, errMsg } = res;
            if (errMsg == "scanCode:ok") {
              let cart_id = wx.getStorageSync("cart_id");
              let params = {
                code_str: result,
                cart_id: cart_id
              };
              wx.showLoading({ title: "加载中...", mask: true });
              apiScanCode(params).then(res => {
                wx.hideLoading();
                let link = res.action_char;
                if (link.indexOf("url=") != -1) {
                  let h5url = link.split("url=");
                  wx.setStorageSync("urlH5", h5url[1]);
                  wx.navigateTo({ url: "/pages/transferH5/main" });
                } else if (link.indexOf("shop/shoppingCart/main") != -1) {
                  let token = wx.getStorageSync("token");
                  if (token == "" || !token) {
                    if (!cart_id) {
                      let card_id_server = link.split("cart_id=");
                      wx.setStorageSync("cart_id", card_id_server[1]);
                    }
                  }
                  wx.switchTab({
                    url: "/pages/shop/shoppingCart/main"
                  });
                } else {
                  wx.navigateTo({
                    url: link
                  });
                }
              });
            }
          },
          complete: function() {
            _this.is_scan_shop = true;
          }
        });
      }
    },

    funcToastWithTitle(title_str) {
      wx.showToast({
        title: title_str,
        icon: "none"
      });
    }
  }
};
</script>

<style scoped>
.scancode_tabbar {
  height: 80rpx;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  border-bottom: #eeeeee solid 1rpx;
}

.list_top_button {
  display: flex;
}
.list_top_online {
  height: 60rpx;
  width: 160rpx;
  line-height: 56rpx;
  text-align: center;
  font-size: 30rpx;
  border-radius: 30rpx 0 0 30rpx;
  background: #ffffff;
  border: 1px solid #ff5000;
  color: #ff5000;
}

.list_top_online.activity {
  background-image: linear-gradient(90deg, #ff8800 0%, #ff5000 100%);
  color: #fff;
  /* border: none; */
}

.list_top_shop {
  height: 60rpx;
  width: 160rpx;
  line-height: 56rpx;
  border-radius: 0 30rpx 30rpx 0;
  text-align: center;
  font-size: 30rpx;
  background: #ffffff;
  border: 1px solid #ff5000;
  color: #ff5000;
}

.cartImg {
  position: absolute;
  top: -20rpx;
  left: 20rpx;
  width: 100rpx;
  height: 100rpx;
}
.cart-box {
  background: #fff;
  font-size: 26rpx;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
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
  background: #f3f5f7;
  min-height: 1334rpx;
  padding-bottom: 156rpx;
}

.scan_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.scan_remind {
  width: 448rpx;
  height: 69rpx;
  margin-top: 470rpx;
  color: #333;
  font-size: 28rpx;
  display: flex;
  flex-direction: column;
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
  /* background: #fff; */
  border: 1px solid #ff5000;
}
.scan_bottom {
  /* width: 668rpx; */
  /* height: 260rpx; */
  margin-top: 100rpx;
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

.scan_top_style {
  display: flex;
  align-items: center;
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

.toast_content_input {
  width: 590rpx;
  height: 356rpx;
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  padding: 0 20rpx;
  font-size: 26rpx;
  color: #333;
  border-bottom: 1rpx solid #eeeeee;
}

.bottom_submit_bg {
  box-sizing: border-box;
  width: 100%;
  height: 88rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
}

.bottom_no_bg {
  display: flex;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.no_data_money {
  color: #333;
  font-size: 24rpx;
  align-self: center;
  margin-left: 20rpx;
}

.gojiesuan {
  height: 88rpx;
  text-align: center;
  line-height: 88rpx;
  color: #fff;
  background: #cacaca;
  font-size: 30rpx;
  width: 240rpx;
}

.btn_scan_code {
  width: 140rpx;
  height: 140rpx;
  position: fixed;
  bottom: 20rpx;
  left: 306rpx;
  z-index: 5;
}

.sureBuybtn {
  display: inline-block;
  height: 100%;
  width: 240rpx;
  line-height: 98rpx;
  background: #ff5000;
  text-align: center;
  font-size: 30rpx;
  color: #fff;
}
.all-monry {
  font-size: 24rpx;
  padding-top: 13rpx;
  padding-left: 20rpx;
}
.all-monry .money-span {
  color: #ff5000;
}

.coupon_money {
  font-size: 20rpx;
  color: #666666;
  padding-left: 20rpx;
}

.write_code {
  width: 510rpx;
  height: 88rpx;
  background: #f3f5f7;
  border-radius: 16rpx;
  font-size: 30rpx;
  padding: 0 30rpx;
  color: #333;
  margin-top: 40rpx;
}
</style>

