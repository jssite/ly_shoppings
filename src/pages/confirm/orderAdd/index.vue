<template>
  <div class="backgroundView">
    <div class="invoice_bg">
      <div v-for="(items, index) in invoice_info" :key="index">
        <div class="invoice_bg_list" @click="funcGoBack(index)">
          <div class="invoice_company">
            <!-- <div style="display: flex;justify-content: space-between"> -->
            <div
              class="company_name"
              :class="{activity:items.lightning_info && items.lightning_info.lightning_status == 3}"
            >
              <span>{{items.consignee}}</span>
              <span style="margin-left: 50rpx;">{{items.mobile}}</span>
            </div>
            <div
              class="address_notmatch"
              v-if="items.lightning_info && items.lightning_info.lightning_status == 3"
            >不在配送范围内</div>
            <!-- </div> -->

            <div
              class="company_code"
              :class="{activity:items.lightning_info && items.lightning_info.lightning_status == 3}"
            >
              <span>{{items.add_detail}}</span>
            </div>
          </div>
          <img
            v-if="index == is_select_invoice"
            style="width:36rpx; height:36rpx;"
            src="/static/images/public/publicCircle-checkOn.png"
          >
          <img
            v-else
            style="width:36rpx; height:36rpx;"
            src="/static/images/public/publicCircle-checkOff.png"
          >
        </div>
        <!-- <div class="line"></div> -->
      </div>
    </div>
    <button class="submit_gift" @click="addInvoice">添加新地址</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { gainAddressList } from "@/api";
import { EventBus } from "@/bus/event-bus.js";
export default {
  data() {
    return {
      is_select_invoice: -1,
      invoice_info: [],
      address_select: 0,
      // 0 普通地址   1 闪送
      address_type: 0,
      address_shop: -1
    };
  },

  onLoad(options) {
    console.log(options);
    this.sa_page(this,false,'收货地址','');
    if (options) {
      this.address_select = options.address_id;
      this.address_type = options.address_type;
      this.address_shop = options.address_shop;
    }
  },

  onShow() {
    this.funcGetNetWorkInfo(this.address_select);
  },

  methods: {
    funcGetNetWorkInfo(invoice) {
      gainAddressList({ shop_id: this.address_shop }).then(res => {
        console.log(res);
        if (invoice) {
          res.address_list.some((value, index) => {
            if (value.address_id == invoice) {
              this.is_select_invoice = index;
              return true;
            }
          });
        }
        this.invoice_info = res.address_list;
      });
    },

    funcGoBack(index) {
      let info = this.invoice_info[index];
      if (this.address_type != 0 && info.lightning_info) {
        let temp = info.lightning_info;
        if (temp.lightning_status == 3) {
          return;
        } else {
          // type 为2 是否直接返回首页重新筛选商品信息
          if (this.address_type == 2) {
            if (info.address_id == this.address_select) {
              wx.navigateBack({
                delta: 1
              });
              return;
            }

            let shop = temp.shop_id;
            wx.showModal({
              title: "配送范围限制",
              content: "选择该地址可能需要重新筛选商品",
              success(res) {
                if (res.confirm) {
                  wx.setStorageSync("shan_shop_id", shop);
                  wx.setStorageSync("address_id", info.address_id);
                  let pagecount = getCurrentPages();
                  let pop_level = pagecount.length - 2;
                  wx.navigateBack({
                    delta: pop_level
                  });
                }
              }
            });
            return;
          }
        }
      }
      console.log("发送的事件函数" + info);
      console.log(info);
      wx.navigateBack({
        delta: 1
      });
      EventBus.$emit("addressSubmit", info);
    },

    addInvoice() {
      wx.navigateTo({
        url: "/pages/shipAddress/changeAddress/main"
      });
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

.invoice_bg {
  background: #f3f5f7;
  min-height: 1006rpx;
  width: 100%;
}

.invoice_bg_list {
  /* height: 144rpx; */
  width: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  position: relative;
  border-bottom: 1rpx solid #eeeeee;
}

.line {
  /* position: relative; */
  width: 730rpx;
  height: 2rpx;
  /* left: 20rpx; */
  /* bottom: 0; */
  margin-left: 20rpx;
  background: #eee;
}

.company_name {
  color: #333;
  font-size: 30rpx;
  line-height: 30rpx;
}

.company_name.activity {
  color: #cacaca;
}

.company_code {
  margin-top: 28rpx;
  color: #999;
  font-size: 26rpx;
  width: 600rpx;
}

.company_code.activity {
  color: #cacaca;
}

.address_notmatch {
  position: absolute;
  top: 10rpx;
  right: 60rpx;
  color: #cacaca;
  font-size: 30rpx;
}
</style>