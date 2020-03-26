<template>
  <div class="backgroundView" v-if="is_show_data">
    <div class="bg_view">
      <div class="top">
        <span style="width:80rpx;height:2rpx;background:#cacaca"></span>
        <span style="margin-left:20rpx;">支付金额</span>
        <span style="margin-left:20rpx; width:80rpx;height:2rpx;background:#cacaca" />
      </div>

      <div class="money">
        <span>￥</span>
        <span style="margin-left:10rpx">{{pay_money}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { requestPayment } from "@/utils/pay/cil_minipay.sdk.js";
import { mapState, mapMutations } from "vuex";
import {
  buyVipCard,
  buyBrandVipCard,
  buyBrandVerbVipCard,
  userGetPayInfomaiton,
  userGetXlzfInfomaiton,
  getMyPreOrderCashInfo
} from "@/api";
import { EventBus } from "@/bus/event-bus.js";
var app =  getApp();

export default {
  data() {
    return {
      pay_money: "00.00",
      presellFromConfrim: false,
      is_presell_order: false,
      res: {},
      presell_sku: "",
      is_show_data: false
    };
  },
  computed: {},

  onLoad(options) {
    console.log(options);
    this.sa_page(this, false, "收银台", "");
    this.presellFromConfrim = false;
    this.is_presell_order = false;
    this.res = {};
    if (options.type == 100) {
      this.is_presell_order = true;
      if (options.submit == 100) {
        this.presellFromConfrim = true;
        let resStrdecode = decodeURIComponent(options.res);
        let res = JSON.parse(resStrdecode);
        this.res = res;
        this.presell_sku = options.sku;
      }
      let serial_params = {
        serial_num: options.serial_num
      };
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      getMyPreOrderCashInfo(serial_params).then(res => {
        this.pay_money = res.money_str;
        this.is_show_data = true;
        let pay_info = {
          payable_amount: res.money,
          serial_num: options.serial_num
        };
        this.funcWxpayInfomation(pay_info, "乐友孕婴童");
      });
    } else {
      this.is_show_data = true;
      let request = {};
      let leverb = {};
      // 天使会员
      let business_num = options.business_type;
      if (options.staff_id) {
        request.staff_id = options.staff_id;
      }
      if (options.shop_id) {
        request.shop_id = options.shop_id;
      }
      if (options.sku) {
        request.sku = options.sku;
      }
      if (options.activity_id) {
        // leverb.activity_id = parseInt(options.activity_id);
        leverb.activity_id = parseInt(options.activity_id);
      }
      if (options.coupons_type) {
        leverb.coupons_type = parseInt(options.coupons_type);
      }
      if (options.qty) {
        request.quantity = parseInt(options.qty);
      }
      if (options.quantity) {
        request.quantity = options.quantity;
      } else {
        request.quantity = 1;
      }
      if (options.type == 2) {
        //品牌储值卡支付
        let cardnum = {
          num: 2
        };
        this.funcBuyBrandVipCard(request, cardnum);
      } else if (options.type == 3) {
        //乐活动支付
        console.log("进入乐活动");
        let cardnum = {
          num: 3
        };
        if (options.status == 0) {
          this.funcBuyVenbVipCard(request, leverb, cardnum); //未下过单
        } else if (options.status == 1) {
          console.log("666668888");
          let res = {
            payable_amount: options.payable_amount,
            serial_num: options.serial_num
          };
          this.pay_money = res.payable_amount;
          this.funcWxpayInfomation(res, "乐活动", cardnum); //已下过单
        }
      } else if (options.type == 4) {
        //天使会员
        console.log("进入天使会员");
        let cardnum = {
          num: 4
        };

        this.funcBuyAangleVipCard(request, cardnum, business_num);
      } else {
        let cardnum = {
          num: 1
        };
        this.funcBuyVipCard(request, cardnum); //乐享卡支付
      }
    }
  },

  methods: {
    // 乐享卡
    funcBuyVipCard(request, cardnum) {
      wx.showLoading({
        title: "加载中..."
      });
      buyVipCard({ sku_infos: request }).then(res => {
        this.pay_money = res.payable_amount;
        this.funcWxpayInfomation(res, "乐友乐享卡", cardnum);
      });
    },

    // 品牌储值卡
    funcBuyBrandVipCard(request, cardnum) {
      console.log(request);
      console.log("861861");
      wx.showLoading({
        title: "加载中..."
      });
      buyBrandVipCard({ sku_infos: request }).then(res => {
        console.log(res);
        this.pay_money = res.payable_amount;
        this.funcWxpayInfomation(res, "乐友品牌卡", cardnum);
      });
    },
    // 乐活动卡
    funcBuyVenbVipCard(request, leverb, cardnum) {
      console.log(leverb);
      console.log(request);
      console.log("867867");
      wx.showLoading({
        title: "加载中..."
      });
      buyBrandVerbVipCard({
        order_activity_vo: leverb,
        sku_infos: request,
        business_type: 2
      }).then(res => {
        this.pay_money = res.payable_amount;
        if (Number(this.pay_money) == 0) {
          console.log("0元");
          this.funcGoFinshPage(res, cardnum);
          return;
        } else {
          this.funcWxpayInfomation(res, "乐活动", cardnum);
        }
      });
    },

    // 天使会员
    funcBuyAangleVipCard(request, cardnum, business_num) {
      // console.log(leverb);
      console.log(request);
      console.log("867867");
      wx.showLoading({
        title: "加载中..."
      });
      buyBrandVerbVipCard({
        sku_infos: request,
        business_type: business_num
      }).then(res => {
        console.log("88888");
        console.log(res);
        console.log("777777");
        this.pay_money = res.payable_amount;

        this.funcWxpayInfomation(res, "天使会员", cardnum);
      });
    },

    // 获取微信支付的参数
    funcWxpayInfomation(res, le_card_name, cardnum) {
      // console.log(le_card_name)
      let openid = wx.getStorageSync("openid");
      let product_name = le_card_name;
      let pay_info = {
        serial_num: res.serial_num,
        //detail: res.serial_num,
        // title: product_name,
        // type: "weixin",
        pay_money: res.payable_amount,
        // ipAddress: "0.0.0.0",
        type: "xunlian_small"
        // wx_type: 2,
        // open_id: openid
      };
      // funcGlobalWxpayInfomation(res, pay_info);
      this.funcGoPay(res, pay_info, cardnum);
    },

    //去支付的逻辑
    // funcGoPay(le_order_info, pay_order_info) {
    //   userGetPayInfomaiton(pay_order_info).then(res_pay_info => {
    //     wx.hideLoading();
    //     let self = this;
    //     wx.requestPayment({
    //       timeStamp: res_pay_info.timeStamp,
    //       nonceStr: res_pay_info.nonceStr,
    //       package: res_pay_info.package,
    //       signType: res_pay_info.signType,
    //       paySign: res_pay_info.sign,
    //       success(res_wx_info) {
    //         wx.hideLoading();
    //         console.log(res_wx_info);
    //         self.pay_money = "00.00";
    //         self.funcGoFinshPage(le_order_info);
    //       },
    //       fail(res_wx_info) {
    //         // wx.hideLoading();
    //         self.pay_money = "00.00";
    //         console.log(res_wx_info)
    //         // 此处应该跳转订单列表
    //         self.funcScan();
    //       }
    //     });
    //   });
    // },
    //去迅联支付的逻辑
    funcGoPay(le_order_info, pay_order_info, cardnum) {
      userGetXlzfInfomaiton(pay_order_info).then(res_pay_info => {
        let pay_info_suc = {
          channel_type: 3,
          pay_method: "xunlian_small",
          serial_number: res_pay_info.config.orderNum
        };
        
        wx.hideLoading();
        let self = this;
        console.log(requestPayment);
        requestPayment(
          {
            chcd: res_pay_info.config.chcd,
            appId: res_pay_info.config.appId,
            // consumerId: res_pay_info.config.consumerId,
            orderNum: res_pay_info.config.orderNum,
            mchntid: res_pay_info.config.mchntid,
            inscd: res_pay_info.config.inscd,
            key: res_pay_info.config.key,
            backUrl: res_pay_info.config.backUrl,
            subject: res_pay_info.config.subject,
            goodsList: res_pay_info.config.goodsList
          },
          res_pay_info.txamt,
          {
            success(res_wx_info) {
              self.funcGoFinshPage(le_order_info, cardnum);
            },
            fail(res_wx_info) {
              // 此处应该跳转订单列表
              if (self.is_presell_order) {
                self.funcScan();
              }
            }
          }
        );
      });
    },

    // 支付成功跳转支付成功页面
    funcGoFinshPage(options, cardnum) {
      if (this.presellFromConfrim) {
        this.funcSaOrder(this.res);
        this.funcSaOrderDetail(this.res);
      }
      let a = 0;
      if (cardnum && cardnum.num) {
        a = cardnum.num;
      }
      let is_presell = "0";
      if (this.presellFromConfrim) {
        is_presell = "1";
      }
      let url = "/pages/confirm/finish/main?pay_info=" + JSON.stringify(options) +"&is_le_vip=" + a +
        "&is_presell=" + is_presell;
        wx.redirectTo({
          url:  url
        })
    },

    // 支付失败跳转订单列表
    funcScan() {
      let url = "/pages/confirm/list/main?order_status=2";
      wx.redirectTo({
        url: url
      });
    },

    funcSaOrder(res) {
      let orderType = "快递配送";
      let mp_submit_order = {
        orderID: res.order_id,
        orderType: orderType,
        orderAmount: res.payable_amount,
        orderValue: "预售订单"
      };
      mp_submit_order.paymentMethod = "微信";
      app.sensors.track("mp_payOrder", mp_submit_order);
    },

    funcSaOrderDetail(res) {
      let orderType = "快递配送";
      let mp_submit_order = {
        orderID: res.order_id,
        orderType: orderType,
        orderAmount: res.payable_amount,
        orderValue: "预售订单"
      };
      mp_submit_order.paymentMethod = "微信";
      // 缺少skulist
      let sa_pro = wx.getStorageSync("mp_" + this.sku);
      if (sa_pro && sa_pro != "" && typeof sa_pro == "object") {
        Object.assign(sa_pro, mp_submit_order);
        sa_pro.commodityNumber = pro_item.qty;
        wx.removeStorageSync("mp_" + this.sku);
      } else {
        sa_pro = mp_submit_order;
      }
      app.sensors.track("mp_payOrderDetail", sa_pro);
    }
  }
};
</script>

<style scoped>
.backgroundView {
  background: #f3f5f7;
  min-height: 1334rpx;
  border-top: #f3f5f7 1px solid;
}

.bg_view {
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.top {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: PingFangSC-Medium;
  color: #ff5000;
  font-size: 34rpx;
}

.money {
  font-family: PingFangSC-Medium;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 80rpx;
}

.submit_gift {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 50rpx;
  height: 80rpx;
  width: 710rpx;
  box-sizing: border-box;
  background: #ff5000;
  margin-top: 60rpx;
  margin-left: 20rpx;
  font-size: 26rpx;
  border: none;
}

.coupon_bg_list {
  margin-bottom: 25rpx;
}

.coupon_bg {
  position: relative;
  width: 710rpx;
  height: 216rpx;
  top: 0;
  left: 20rpx;
}

.coupon_content {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  padding-top: 20rpx;
}

.user_coupon_item {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.user_coupon_content {
  display: flex;
}
.user_coupon_tags {
  flex: 1;
}
.user_coupon_tags_1 {
  height: 84px;
  margin-bottom: 22px;
  padding-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fab400;
  font-size: 52px;
  font-weight: 700;
}

.user_conpon_moeny {
  height: 84px;
  margin-bottom: 22px;
  padding-top: 30px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  color: #ff5000;
  font-size: 66rpx;
  font-weight: 700;
}

.user_coupon_tags_1.activity {
  color: #999;
}

.user_conpon_moeny.activity {
  color: #999;
}

.user_coupon_txt {
  width: 470px;
  padding: 30px 19px 0 0;
  font-size: 24px;
  color: #333333;
  line-height: 28px;
}
.user_coupon_footer {
  padding: 0 20px 20px 40px;
  display: flex;
  align-items: flex-end;
  height: 44px;
}
.user_coupon_time {
  font-size: 22px;
  color: #999999;
  line-height: 24px;
}

.coupon_un_use {
  height: 60rpx;
  display: flex;
  align-items: center;
  margin-left: 20rpx;
  padding-left: 20rpx;
  width: 710rpx;
  font-size: 24rpx;
  color: #999;
  border-radius: 8rpx;
  background: #fff;
  box-sizing: border-box;
}
</style>    