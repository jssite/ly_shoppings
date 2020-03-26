<template>
  <div class="backgroundView">
    <div v-if="invoice_list.length">
      <div>
        <div class="top_button" @click="funcUnuseCoupon">有钱任性，不使用优惠券</div>
      </div>
      <div class="coupon_remind">
        <span>单笔订单仅限使用一张优惠券</span>
        <img class="coupon_remind_img" src="/static/images/public/public_icon_tip01.png" />
      </div>
      <div
        class="coupon_bg_list"
        v-for="(items, index) in invoice_list"
        :key="index"
        @click="funcSelectCoupon(index)"
      >
        <div class="coupon_bg">
          <img
            v-if="items.isusable==1"
            class="user_coupon_item"
            src="../images/order_coupon_bg03.png"
          />
          <img
            v-else-if="items.coupon_type==0"
            class="user_coupon_item"
            src="../images/order_coupon_bg01.png"
          />
          <img v-else class="user_coupon_item" src="../images/order_coupon_bg02.png" />
          <div class="coupon_content">
            <div style="font-size:50rpx;height:196rpx; width:100%;">
              <!-- 优惠券 状态 金额 描述 -->
              <div class="user_coupon_content">
                <div class="user_coupon_tags">
                  <div
                    v-if="items.coupon_type == 0"
                    class="user_conpon_moeny"
                    :class="{activity:items.isusable == 1}"
                  >
                    <div v-if="items.coupon_value_type == 2 && items.value_format">
                      <span style="font-size:66rpx;">{{items.value_format[0]}}</span>
                      <span style="font-size:40rpx;">{{items.value_format[1]}}</span>
                      <span style="font-size:36rpx;">{{items.value_format[2]}}</span>
                    </div>
                    <div v-else>
                      <span style="font-size:32rpx;">¥</span>
                      <spsn>{{items.value}}</spsn>
                    </div>
                  </div>
                  <div
                    v-else
                    class="user_coupon_tags_1"
                    :class="{activity:items.isusable == 1}"
                  >{{items.coupon_type == 1?'包邮券':'兑换券'}}</div>
                </div>
                <div
                  class="user_coupon_txt"
                  :class="{activity:items.isusable == 1}"
                >{{items.prod_title}}</div>
              </div>
              <!-- 优惠券日期限制 -->
              <div class="user_coupon_footer">
                <span class="user_coupon_time">{{items.time_range}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="coupon_use_exlusion" v-if="items.isusable == 0 && items.exclusion">
          <span class="coupon_exclusion">互斥</span> <span style="margin-left:16rpx">{{items.un_useable_reason}}</span>
          </div>
        <div class="coupon_un_use" v-else-if="items.isusable == 1">{{items.un_useable_reason}}</div>
      </div>
    </div>
    <div
      v-else
      style="display: flex; align-items: center; padding-top:220rpx; flex-direction:column"
    >
      <img src="/static/images/public/public_empty_pic.png" style="width:266rpx;height:222rpx;" />
      <span style="color:#333; font-size:30rpx;margin-top:40rpx">暂无可用优惠券</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { EventBus } from "@/bus/event-bus.js";
import { couponSaleFormat } from "@/utils";
export default {
  data() {
    return {
      useable_list: [],
      un_useable_list: [],
      // 区分包邮券 0是优惠券 1包邮券
      is_coupon: ""
    };
  },
  computed: {
    invoice_list() {
      if (this.is_coupon == "0") {
        return [...this.useable_list, ...this.un_useable_list];
      } else {
        return this.useable_list;
      }
    }
  },

  onLoad(options) {
    this.sa_page(this, false, "选择优惠券", "");
    if (options.is_coupon) {
      let coupon = JSON.parse(options.coupon_info);
      this.is_coupon = options.is_coupon;
      coupon.useable_list.map(res => {
        res.isusable = 0;
        if (res.coupon_type == 0 && res.coupon_value_type == 2) {
          res.value_format = couponSaleFormat(res.value);
        }
      });
      this.useable_list = coupon.useable_list;
      if (this.is_coupon == "0") {
        coupon.un_useable_list.map(res => {
          res.isusable = 1;
          if (res.coupon_type == 0 && res.coupon_value_type == 2) {
            res.value_format = couponSaleFormat(res.value);
          }
        });
        this.un_useable_list = coupon.un_useable_list;
      }
    }
  },

  methods: {
    funcSelectCoupon(index) {
      if (index >= this.useable_list.length) {
        return;
      }
      let coupon = this.useable_list[index];
      let coupon_info = {};
      if (this.is_coupon == "0") {
        coupon_info = {
          type: {
            is_use: 0,
            is_coupon: this.is_coupon
          },
          info: coupon
        };
      } else {
        coupon_info = {
          type: {
            is_use: 0,
            is_coupon: this.is_coupon
          },
          info: coupon
        };
      }
      wx.navigateBack({
        delta: 1
      });
      EventBus.$emit("couponClick", coupon_info);
    },

    funcUnuseCoupon() {
      let coupon_info = {
        type: {
          is_use: 1,
          is_coupon: this.is_coupon
        },
        info: {}
      };
      wx.navigateBack({
        delta: 1
      });
      EventBus.$emit("couponClick", coupon_info);
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

.top_button {
  background: #fff;
  border-radius: 10rpx;
  color: #ff5000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  margin-top: 20rpx;
  margin-left: 20rpx;
  height: 80rpx;
  width: 710rpx;
}

.coupon_remind {
  display: flex;
  flex-direction: row-reverse;
  margin-left: 20rpx;
  color: #999;
  font-size: 26rpx;
  align-items: center;
  height: 85rpx;
  width: 710rpx;
}

.coupon_remind_img {
  margin-right: 20rpx;
  width: 26rpx;
  height: 26rpx;
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

.user_coupon_txt.activity {
  color: #999;
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
  border: 1rpx solid #cacaca; 
}

.coupon_use_exlusion {
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
  border: 1rpx solid #FFC8B4; 
}

.coupon_exclusion {
  font-size: 20px;
  color: #FFFFFF;
  background: #FF5000;
  border-radius: 14px;
  text-align: center;
  width: 56rpx;
  height: 28rpx;
}
</style>    