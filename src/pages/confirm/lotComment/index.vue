<template>
  <div class="backgroundView">
    <!-- 待评价-->
    <div class="product_content">
        <div class="product_bg">
          <div
            class="product_list_bg"
            style=" box-sizing: content-box; padding:20rpx 0 20rpx 20rpx;"
            v-for="(pro_items, pro_index) in order_total_source"
            :key="pro_index"
            @click.stop="funcGoDetail(pro_items)"
          >
            <img :src="BASE_IMG_URL +  pro_items.le_image" style="width:160rpx;height:160rpx;">
            <div class="productContent">
              <div class="productName">{{pro_items.marketing_title}}</div>

              <div
                style="display: flex;justify-content: flex-end; margin-top: 44rpx;height: 52rpx; "
              >
                <div class="list_button" @click.stop="goToComment(pro_items)">评价晒单</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { priceFormat } from "@/utils";
import {
  getOrderListByStore,
  getOrderListByApp,
  userGetPayInfomaiton,
  orderCancle,
  orderAccept,
  orderDelete,
  synAllShoppingCart
} from "@/api";
import { EventBus } from "@/bus/event-bus.js";
export default {
  data() {
    return {
      order_total_source: [],
      order_id: '',
    };
  },

  computed: {
    BASE_IMG_URL() {
      return this.$store.state.BASE_APP_INFO["download_le_image"];
    },
  },

  onLoad(options) {
    this.sa_page(this,false,'评价晒单','');
    this.order_id = options.order_id;
    this.order_total_source = JSON.parse(options.product_info);
  },

 

  methods: {
    goToComment(item) {
      console.log(item);
      let url =
        "/pages/userCenter/comment/main?order_id=" +
        this.order_id +
        "&product=" +
        JSON.stringify(item);
      wx.navigateTo({
        url: url
      });
    },
  }
};
</script>

<style scoped>
.backgroundView {
  background: #f3f5f7;
  /* height: 100%; */
  min-height: 1500rpx;
}

.list_top {
  background: #fff;
  height: 76rpx;
  width: 100%;
  display: flex;
  justify-content: center;
}
.list_top_button {
  display: flex;
}
.list_top_online {
  height: 56rpx;
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
  height: 56rpx;
  width: 160rpx;
  line-height: 56rpx;
  border-radius: 0 30rpx 30rpx 0;
  text-align: center;
  font-size: 30rpx;
  background: #ffffff;
  border: 1px solid #ff5000;
  color: #ff5000;
}

.list_top_shop.activity {
  background-image: linear-gradient(90deg, #ff8800 0%, #ff5000 100%);
  color: #fff;
  /* border: none; */
}

.user_coupon_tabs {
  display: flex;
  background: #ffffff;
  /* justify-content: space-between; */
}
.user_coupon_tab {
  /* width: 187rpx; */
  height: 64px;
  /* box-sizing: border-box; */
  /* margin: 0 20px; */
  flex: 1;
  display: flex;
  font-size: 30px;
  color: #333333;
  justify-content: center;
  /* justify-items: center; */
  align-items: center;
  /* line-height: 64px; */
}

.user_list_content {
  height: 64rpx;
  line-height: 64rpx;
  padding: 0 10rpx;
}

.user_list_content.activity {
  color: #ff5000;
  border-bottom: 4px #ff5000 solid;
}

.product_content {
  padding: 20rpx;
  background: #f3f5f7;
}
.product_bg {
  background: #fff;
  border-radius: 10rpx;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
}
.product_title {
  height: 80rpx;
  font-size: 26rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: PingFangSC-Medium;
}
.productgif {
  width: 32rpx;
  height: 34rpx;
  margin-right: 8rpx;
}

.buttonBg {
  background-color: transparent;
}

.buttonBg::after {
  border: 0;
}

.product_list_bg {
  height: 180rpx;
  display: flex;
  /* flex-direction: row; */
  background: #fafafa;
  box-sizing: border-box;
  background: #fff;
  /* border-bottom: 1rpx solid #f3f5f7; */
}
.product_footer {
  height: 156rpx;
  /* display: flex; */
  /* flex-direction: -reverse; */
}
.product_footer_top {
  margin-top: 20rpx;
  /* flex-direction: row-reverse; */
  /* flex- */
  display: flex;
  justify-content: flex-end;
  font-size: 26rpx;
  color: #333;
  align-items: baseline;
}
.product_footer_bottom {
  /* flex-direction: row-reverse; */
  display: flex;

  justify-content: flex-end;
  margin-top: 28rpx;
  height: 52rpx;
}
/* .product_footer_price {
  display: flex;

} */

.list_button_color {
  border: 1rpx solid #333 !important;
  color: #333 !important;
}

.list_button {
  border: #ff5000 1rpx solid;
  padding: 0 30rpx;
  line-height: 52rpx;
  color: #ff5000;
  background: #fff;
  text-align: center;
  font-size: 26rpx;
  border-radius: 30rpx;
  margin-left: 20rpx;
  height: 52rpx;
  /* width: 150rpx; */
}

.no_list_button {
  margin-top: 60rpx;
  padding: 0 60rpx;
  line-height: 52rpx;
  color: #fff;
  background: #ff5000;
  text-align: center;
  font-size: 26rpx;
  border-radius: 30rpx;
  margin-left: 40rpx;
  /* width: 150rpx; */
}

/* .product {
  height: 160rpx;

  padding: 20rpx;
  display: flex;

  background: #fafafa;
  box-sizing: border-box;
} */

.productIcon {
  margin-top: 10rpx;
  width: 150rpx;
  height: 150rpx;
  background: #fff;
}

.productContent {
  margin-left: 20rpx;
  width: 490rpx;
  height: 160rpx;
  box-sizing: border-box;
}

.productName {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #333;
  height: 73rpx;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.productStyle {
  margin-top: 8rpx;
  color: #999;
  line-height: 24rpx;
  font-size: 24rpx;
  height: 24rpx;
}
.productBottom {
  margin-top: 6rpx;
  display: flex;
  /* flex-direction: row; */
  justify-content: space-between;
  /* line-height: 25rpx; */
  align-items: center;
}

.product_return_status {
  height: 26rpx;
  width: 100%;
  text-align: right;
  font-size: 22rpx;
  color: #fab400;
  margin-top: 10rpx;
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
  color: #999;
  font-size: 24rpx;
}

.ad_bg {
  padding: 20rpx 20rpx 0 20rpx;
}

.ad_content {
  border-radius: 15rpx;
  width: 710rpx;
  vertical-align: bottom;
}
</style>


            <!-- <div class="productPriBg">
                  <div class="productPrice">
                    <span style="font-size:22rpx">¥</span>
                    <span>{{item.sale_price}}</span>
                  </div>
                  <img
                    v-if="(item.price_type === 1)"
                    class="productVipIcon"
                    src="/static/goodsdetail/product_sign_vip.png"
                  >
              </div>-->
