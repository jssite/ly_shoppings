<template>
  <div class="backgroundView">
    <div class="invoice_bg">
      <div
        class="invoice_bg_list"
        @click="funcGoBack(index)"
        v-for="(items, index) in invoice_info"
        :key="index"
      >
        <img
          v-if="index == address_select"
          style="width:36rpx; height:36rpx;"
          src="/static/images/public/publicCircle-checkOn.png"
        >
        <img
          v-else
          style="width:36rpx; height:36rpx;"
          src="/static/images/public/publicCircle-checkOff.png"
        >
        <div class="invoice_company">
          <img :src="items.image" style="height:120rpx;width:120rpx;">
          <div class="company_name">
            <div>{{items.prod_title}}</div>
            <div style="color:#999;font-size:22rpx;margin-top:12rpx">
              <span v-if="items.color">颜色：{{items.color + '  '}}</span>
              <span v-if="items.specifications">尺码：{{items.specifications}}</span>
            </div>
            <div class="company_code">
              <span>{{items.sale_price}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="submit_gift" @click="addInvoice">兑换</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getExchangeCoupon } from "@/api";
import { EventBus } from "@/bus/event-bus.js";
export default {
  data() {
    return {
      invoice_info: [],
      address_select: 0,
      couponInfo: {}
    };
  },

  onLoad(options) {
    this.sa_page(this,false,'兑换商品','');
    this.address_select = 0;
    if (options.couponInfo) {
      this.couponInfo = JSON.parse(options.couponInfo);
      console.log(this.couponInfo);
      this.funcGetNetWorkInfo();
    }
    // let pro_info = {
    //   prod_title: "我是一个商品商品商品",
    //   color: "红色",
    //   specifications: "18cm",
    //   sale_price: '98.00'
    // };
    // this.invoice_info = [pro_info, pro_info, pro_info];
    console.log(this.invoice_info);
  },

  methods: {
    funcGetNetWorkInfo() {
      getExchangeCoupon({ promotion_id: this.couponInfo.promotion_id }).then(
        res => {
          console.log(res);
          this.invoice_info = res.products;
        }
      );
    },

    funcGoBack(index) {
      this.address_select = index;
    },

    addInvoice() {
      let pro_info = this.invoice_info[this.address_select];
      if (pro_info) {
        pro_info.quantity = 1;
        let params = {          
          sku_info: pro_info,
          coupon: this.couponInfo,
          is_use_vip: false
        };
        wx.navigateTo({
          url: "/pages/confirm/main?sender=" + JSON.stringify(params) + '&order_type=6'
        });
      }
    }
  }
};
</script>

<style scoped>
.backgroundView {
  background: #f3f5f7;
  min-height: 1334rpx;
}

.address {
  background: #fff5c8;
  width: 100%;
  min-height: 394rpx;
}

.submit_gift {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 0;
  height: 98rpx;
  /* width: 710rpx; */
  width: 100%;
  /* box-sizing: border-box; */
  background: #ff5000;
  left: 0;
  bottom: 0;
  /* margin-top: 60rpx; */
  /* margin-left: 20rpx; */
  font-size: 30rpx;
}

.invoice_bg {
  background: #f3f5f7;
  min-height: 1006rpx;
  width: 100%;
}

.invoice_bg_list {
  height: 160rpx;
  width: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}

.invoice_company {
  display: flex;
}

.company_name {
  color: #333;
  font-size: 26rpx;
  line-height: 30rpx;
  width: 514rpx;
  margin-left: 20rpx;
}
.company_code {
  margin-top: 12rpx;
  color: #ff5000;
  font-size: 26rpx;
  width: 600rpx;
}
</style>