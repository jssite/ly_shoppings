<template>
  <div>
    <div class="backgroundView">
      <!-- 发票类型 -->
      <div class="invoice_top">
        <div class="invoice_must_read" @click="funcMustRead">
          <span>发票须知</span>
        </div>
        <div class="invoice_style">发票类型</div>
        <div class="invoice_style_bg">
          <div>
            <button
              @click="funcInvoice(1)"
              class="invoice_button"
              :class="{activity:!is_invoice}"
            >不开发票</button>
          </div>
          <!-- <div style="margin-left:20rpx">
            <button class="invoice_button">普通发票</button>
          </div>-->
          <div style="margin-left:20rpx">
            <button
              @click="funcInvoice(2)"
              class="invoice_button"
              :class="{activity:is_invoice}"
            >电子发票</button>
          </div>
        </div>
      </div>

      <!-- 公司个人 -->
      <div class="invoice_title">
        <span
          style="margin-left:20rpx;margin-top:28rpx;font-size:26rpx;color:#999;height:28rpx;"
        >发票抬头</span>
        <div class="invoice_title_style">
          <img
            @click="funcSelectPerson(1)"
            v-if="is_select_person"
            style="width:36rpx; height:36rpx;"
            src="/static/images/public/publicCircle-checkOn.png"
          >
          <img
            @click="funcSelectPerson(1)"
            v-else
            style="width:36rpx; height:36rpx;"
            src="/static/images/public/publicCircle-checkOff.png"
          >
          <span
            @click="funcSelectPerson(1)"
            style="margin-left:10rpx; color:#333;font-size:26rpx;"
          >个人</span>
          <img
            @click="funcSelectPerson(0)"
            v-if="is_select_company"
            style="width:36rpx; height:36rpx;margin-left:61rpx"
            src="/static/images/public/publicCircle-checkOn.png"
          >
          <img
            @click="funcSelectPerson(0)"
            v-else
            style="width:36rpx; height:36rpx;margin-left:61rpx"
            src="/static/images/public/publicCircle-checkOff.png"
          >
          <span
            @click="funcSelectPerson(0)"
            style="margin-left:10rpx; color:#333;font-size:26rpx;"
          >公司</span>
        </div>
      </div>

      <!-- 发票抬头无发票样式 -->
      <div v-if="is_select_company" @click="funcGoInvoiceList">
        <div
          v-if="(type.invoice_person == 2 && invoice.invoice_id != 0)"
          class="invoice_title_content_bg"
        >
          <div class="invoice_title_content">
            <div style="color:#333;font-size:28rpx;height:28rpx;">{{invoice.invoice_title}}</div>
            <div style="color:#999;font-size:26rpx;margin-top:28rpx;height:28rpx;">
              <span>纳税人识别号：</span>
              <span>{{invoice.invoice_num}}</span>
            </div>
          </div>
          <img style="width:13rpx;height:20rpx;" src="/static/goodsdetail/lecard_arrow_right.png">
        </div>
        <div v-else class="invoice_title_content_bg" style="padding:36rpx 20rpx;">
          <span style="#333;font-size:26rpx;height:28rpx;">请填写发票抬头信息</span>
          <img style="width:13rpx;height:20rpx;" src="/static/goodsdetail/lecard_arrow_right.png">
        </div>
      </div>
      <!-- 发票内容 -->
      <div class="invoice_goods_style">
        <span style="font-size:26rpx;color:#999">发票内容</span>
        <div class="invoice_goods_title">
          <div
            class="invoice_button_content"
            :class="{activity: index===is_content_select}"
            v-for="(item,index) in invoice_style_list"
            :key="index"
            @click="funcInvoiceContentClick(index)"
          >{{item}}</div>
        </div>
      </div>

      <button class="submit_invoice" @click="submitBack">提交</button>
    </div>

    <div class="invoice_toast" v-if="show_toast" catchtouchmove="ture">
      <div class="invoice_toast_content">
        <div class="toast_content_title">发票须知</div>
        <div class="toast_content_content">
          <div v-for="(item, index) in invoice_remind" :key="index" class="toast_text">{{item}}</div>
          <!-- <span class="toast_text">{{invoice_remind}}</span> -->
        </div>
        <div class="toast_content_sure" @click="funcMustRead">我知道了</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { EventBus } from "@/bus/event-bus.js";
export default {
  data() {
    return {
      show_toast: false,

      // false 选中不开发票
      is_invoice: false,
      // 选中内容按钮
      is_content_select: -1,
      // 选中个人
      is_select_person: false,
      // 选中公司
      is_select_company: false,
      type: {},
      invoice: {},
      toast_list: [
        "我是一个弹窗我是一个弹窗我是一个弹窗我是一个弹窗我是一个弹窗我是一个弹窗",
        "是一个弹窗我是一个弹窗我是一个弹窗我是",
        "是一个弹窗我是一个弹窗我是一个弹窗我是是一个弹窗我是一个弹窗我是一个弹窗我是是一个弹窗我是一个弹窗我是一个弹窗我是",
        "是一个弹窗我是一个弹窗我是一个弹窗我是是一个弹窗我是一个弹窗我是一个弹窗我是是一个弹窗我是一个弹窗我是一个弹窗我是是一个弹窗我是一个弹窗我是一个弹窗我是是一个弹窗我是一个弹窗我是一个弹窗我是是一个弹窗我是一个弹窗我是一个弹窗我是"
      ]
    };
  },
  computed: {
    invoice_style_list() {
      let invoice_content = this.$store.state.BASE_APP_INFO["invoices"];
      if (invoice_content) {
        return invoice_content;
      } else {
        return ["母婴用品"];
      }
    },
    invoice_remind() {
      let remind = this.$store.state.BASE_APP_INFO["invoice_note"];
      return remind.split("\\r\\n");
      // return this.$store.state.BASE_APP_INFO["invoice_note"];
    }
  },
  created() {
    //this.funcQuery()
  },

  onShow() {
    // false 选中不开发票
    // is_invoice: false,
    // // 选中内容按钮
    // is_content_select: -1,
    // // 选中个人
    // is_select_person: false,
    // // 选中公司
    // is_select_company: false,
    // 選中公司
    if (this.type.invoice_type == 2) {
      if (this.type.invoice_person == 1) {
        this.is_invoice = true;
        // 选中内容按钮
        this.is_content_select = 0;
        // 选中个人
        this.is_select_person = true;
        // 选中公司
        this.is_select_company = false;
      } else {
        this.is_invoice = true;
        // 选中内容按钮
        this.is_content_select = 0;
        // 选中个人
        this.is_select_person = false;
        // 选中公司
        this.is_select_company = true;
      }
    } else {
      this.is_invoice = false;
      // 选中内容按钮
      this.is_content_select = -1;
      // 选中个人
      this.is_select_person = false;
      // 选中公司
      this.is_select_company = false;
    }
  },

  onLoad(options) {
    this.sa_page(this,false,'发票信息','');
    let sender = JSON.parse(options.invoice_info);
    console.log(sender);
    this.type = sender.type;
    this.invoice = sender.info;
  },

  mounted() {
    EventBus.$on("selectInvoice", res => {
      this.$nextTick(() => {
        this.invoice = res;
      });
    });
  },

  methods: {
    funcMustRead() {
      this.show_toast = !this.show_toast;
    },

    funcInvoice(index) {
      if (index === 1) {
        this.is_invoice = false;
        this.is_select_person = false;
        this.is_select_company = false;
        this.is_content_select = -1;
        this.type.invoice_type = 0;
        let sender = {
          type: this.type,
          info: this.invoice
        };
        EventBus.$emit("invoiceSubmit", sender);
        wx.navigateBack({
          delta: 1
        });
      } else {
        this.is_invoice = true;
        this.is_select_person = true;
        this.is_select_company = false;
        this.is_content_select = 0;
        this.type.invoice_type = 2;
        if(this.type.invoice_person == 0) {
            this.type.invoice_person = 1;
        }
      }
    },

    funcSelectPerson(index) {
      if (this.is_invoice) {
        if (index === 1) {
          this.is_select_person = true;
          this.is_select_company = false;
          this.type.invoice_person = 1;
        } else {
          this.is_select_person = false;
          this.is_select_company = true;
          this.type.invoice_person = 2;
        }
      }
    },

    funcGoInvoiceList() {
      if (this.is_invoice) {
        wx.navigateTo({
          url:
            "/pages/confirm/invoice/invoiceList/main?invoice=" +
            JSON.stringify(this.invoice)
        });
      }
    },

    funcInvoiceContentClick(index) {
      if (this.is_invoice) {
        this.is_content_select = index;
        console.log(index);
      }
    },
    submitBack() {

      if (this.type.invoice_person == 2 && (this.invoice.invoice_num == undefined || this.invoice.invoice_num == '')) {
        wx.showToast({
        title: '请填写发票抬头',
        icon: "none",
        duration: 2000
      });
        return;
      }

      let invoice_content = this.invoice_style_list[this.is_content_select];
      if (this.type.invoice_person == 1) {
        this.type.invoice_content = invoice_content;
      } else {
        this.invoice.invoice_content = invoice_content;
      }
      console.log(invoice_content);
      let sender = {
        type: this.type,
        info: this.invoice
      };
      EventBus.$emit("invoiceSubmit", sender);
      wx.navigateBack({
        delta: 1
      });
      console.log("返回返回");
    }
  }
};
</script>

<style scoped>
.backgroundView {
  background: #f3f5f7;
  min-height: 1334rpx;
  /* padding-bottom: 144rpx; */
}

.invoice_top {
  background: #fff;
  width: 100%;
  height: 184rpx;
  box-sizing: border-box;
  margin-top: 20rpx;
}

.invoice_must_read {
  display: flex;
  margin-right: 20rpx;
  flex-direction: row-reverse;
  text-align: right;
  color: #333;
  font-size: 30rpx;
  /* width: 100%; */
}

.invoice_style {
  color: #999;
  font-size: 26rpx;
  margin-left: 20rpx;
  line-height: 28rpx;
}

.invoice_style_bg {
  display: flex;
  margin-left: 20rpx;
  margin-top: 20rpx;
}

.invoice_button {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  border-radius: 30rpx;
  height: 48rpx;
  box-sizing: content-box;
  background: #fff;
  width: 160rpx;
  padding: 0;
  font-size: 26rpx;
  border: 1px solid #999999;
}

.invoice_button.activity {
  background: #ff5000;
  color: #fff;
  border: none;
}

.invoice_title {
  margin-top: 20rpx;
  height: 141rpx;
  background: #fff;
}

.invoice_title_style {
  margin-top: 21rpx;
  margin-left: 20rpx;
  display: flex;
  align-items: center;
  /* display: flex; */
}

.invoice_title_content_bg {
  padding: 28rpx 20rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.invoice_goods_style {
  margin-top: 20rpx;
  padding: 28rpx 20rpx;
  background: #fff;
  font-size: 0;
}

.invoice_goods_title {
  margin-top: 20rpx;
  display: flex;
  /* justify-content: flex-start; */
  /* align-content: flex-start;  */
  flex-wrap: wrap;
}

.invoice_button_content {
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  color: #333;
  border-radius: 30rpx;
  height: 48rpx;
  box-sizing: border-box;
  background: #fff;
  min-width: 160rpx;
  /* padding: 0; */
  font-size: 26rpx;
  border: 1px solid #999999;
  margin-bottom: 20rpx;
  margin-right: 10rpx;
  padding: 0 20rpx;
}

.invoice_button_content:last-child,
.invoice_button_content:nth-last-child(2) {
  margin-bottom: 0;
}

.invoice_button_content.activity {
  background: #ff5000;
  color: #fff;
  border: none;
}

.submit_invoice {
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

.invoice_toast {
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
/* 促销模态框 */
.invoice_toast_content {
  width: 590rpx;
  height: 710rpx;
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20rpx 28rpx;
}

.toast_content_title {
  /* margin-top: 20rpx; */
  text-align: center;
  font-size: 30rpx;
  color: #333;
  height: 28rpx;
  width: 100%;
}
.toast_content_content {
  padding: 10rpx 20rpx;
}
.toast_content_sure {
  /* position: relative; */
  /* bottom: 20rpx; */
  text-align: center;
  /* left: 0; */
  width: 100%;
  height: 42rpx;
  color: #ff5000;
  font-size: 30rpx;
}

.toast_text {
  margin-top: 28rpx;
  width: 550rpx;
  color: #333;
  font-size: 26rpx;
}
</style>