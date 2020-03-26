<template>
  <div class="backgroundView">
    <div class="invoice_bg">
      <div class="invoice_bg_list" @click="funcGoBack(index)" v-for="(items, index) in invoice_info" :key="index">
        <div lass="invoice_company">
          <div class="company_name">{{items.invoice_title}}</div>
          <div class="company_code">
            <span>纳说人识别号：</span>
            <span>{{items.invoice_num}}</span>
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
    </div>
    <button class="submit_gift" @click="addInvoice">添加开票公司</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getInvoiceList } from "@/api";
import {EventBus} from "@/bus/event-bus.js";
export default {
  data() {
    return {
      is_select_invoice: -1,
      invoice_info: [],
      invoice_select:{},
    };
  },

  onLoad(options) { 
    this.sa_page(this,false,'发票列表','');
    console.log(options);
    console.log(JSON.parse(options.invoice));
    this.invoice_select = JSON.parse(options.invoice);
  },

  onShow() {
    this.funcGetNetWorkInfo(this.invoice_select);
  },

  methods: {
    funcGetNetWorkInfo(invoice) {
      let self = this;
      getInvoiceList().then(res => {
        console.log(res.invoice_list);
        self.invoice_info = res.invoice_list;
        if (invoice) {
          res.invoice_list.some((value, index) => {
            if (value.invoice_id === invoice.invoice_id) {
              self.is_select_invoice = index;
              return true;
            }
          });
        }
      });
    },

    funcGoBack(index) {
      let info = this.invoice_info[index];
      EventBus.$emit('selectInvoice',info);
      wx.navigateBack({
        delta:1,
      })
    },

    addInvoice() {
      wx.navigateTo({
        url: "/pages/confirm/invoice/invoiceEdit/main?is_add=true"
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
  height: 144rpx;
  width: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}

.invoice_company {
  height: 88rpx;
  width: 600rpx;
}
.company_name {
  color: #333;
  font-size: 30rpx;
}
.company_code {
  margin-top: 28rpx;
  color: #999;
  font-size: 26rpx;
}
</style>