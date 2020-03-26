<template>
  <div style="background:#f2f3f5;min-height:1500rpx;width:100%">
    <div class="top_bg_view">
      <img class="top_bg_icon" src="/static/images/public/public_icon_tip02.png">
      <span class="top_bg_title">请准确填写”纳税人识别号“,以免影响您的发票报销</span>
    </div>
    <div class="gift_bg">
      <div class="card">
        <span class="card_title">公司名称</span>
        <input
          v-model="company_name"
          type="text"
          class="card_content"
          placeholder="必填"
          placeholder-style="color:#dddddd;"
        >
      </div>
      <div class="card">
        <span class="card_title" style="width:270rpx">纳税人识别号</span>
        <input
          v-model="company_code"
          type="text"
          class="card_content"
          placeholder="必填"
          placeholder-style="color:#dddddd;"
        >
      </div>
      <div class="card">
        <span class="card_title">注册电话</span>
        <input
          v-model="company_tel"
          type="text"
          class="card_content"
          placeholder="非必填"
          placeholder-style="color:#dddddd;"
        >
      </div>
      <div class="card">
        <span class="card_title">注册地址</span>
        <input
          v-model="company_add"
          type="text"
          class="card_content"
          placeholder="非必填"
          placeholder-style="color:#dddddd;"
        >
      </div>
      <div class="card">
        <span class="card_title">开户银行</span>
        <input
          v-model="company_bank"
          type="text"
          class="card_content"
          placeholder="非必填"
          placeholder-style="color:#dddddd;"
        >
      </div>
      <div class="card">
        <span class="card_title">银行账号</span>
        <input
          v-model="company_account"
          type="text"
          class="card_content"
          placeholder="非必填"
          placeholder-style="color:#dddddd;"
        >
      </div>
    </div>
    <button class="submit_giftcard" @click="save_invoice">保存</button>
  </div>
</template>

<script>
import { alertInvoice } from "@/api";

export default {
  data() {
    return {
      company_name: "",
      company_code: "",
      company_tel: "",
      company_add: "",
      company_bank: "",
      company_account: "",
      add_invoice_info: {}
    };
  },

  onLoad(options) {
    this.sa_page(this,false,'发票信息','');
    console.log(options.invoice_info);
  },

  methods: {
    save_invoice() {
      if (this.company_name && this.company_name != "") {
        this.add_invoice_info.invoice_title = this.company_name;
      } else {
        wx.showToast({
          title: "请输入公司名称！",
          icon: "none",
          duration: 2000
        });

        return;
      }
      if (this.company_code && this.company_code != "") {
        this.add_invoice_info.invoice_num = this.company_code;
      } else {
        wx.showToast({
          title: "请输入纳税人识别号！",
          icon: "none",
          duration: 2000
        });
        return;
      }

      if (this.company_tel && this.company_tel != "") {
        this.add_invoice_info.invoice_title = this.company_tel;
      }

      if (this.company_add && this.company_add != "") {
        this.add_invoice_info.invoice_telephone = this.company_add;
      }

      if (this.company_bank && this.company_bank != "") {
        this.add_invoice_info.invoice_bank = this.company_bank;
      }

      if (this.company_account && this.company_account != "") {
        this.add_invoice_info.invoice_bank_account = this.company_account;
      }
      console.log(
        this.company_name,
        this.company_code,
        this.company_tel,
        this.company_add,
        this.company_bank,
        this.company_account
      );
      wx.showLoading({
        title: "加载中"
      });
      alertInvoice(this.add_invoice_info).then(res => {
        wx.hideLoading();
        // wx.showToast({ title: "保存成功", icon: "none" });
        wx.navigateBack({
          delta: 1
        });
        // console.log("添加成功并且返回上级页面", res);
      });
    }
  }
};
</script>

<style scoped>
.top_bg_view {
  background: #fff;
  height: 80rpx;
  width: 100%;
  display: flex;
  align-items: center;
}

.top_bg_icon {
  margin-left: 20rpx;
  width: 26rpx;
  height: 26rpx;
}

.top_bg_title {
  margin-left: 11rpx;
  height: 37rpx;
  /* width: 600rpx; */
  color: #fab400;
  font-size: 26rpx;
}

.gift_bg {
  margin-top: 20rpx;
  background: #fff;
}

.card {
  display: flex;
  width: 100%;
  height: 100rpx;
  align-items: center;
}
.card_title {
  margin-left: 20rpx;
  font-size: 30rpx;
  color: #333;
  width: 160rpx;
}

.card_content {
  height: 42rpx;
  padding-left: 40rpx;
  line-height: 34rpx;
  display: block;
  box-sizing: content-box;
  color: #333333;
  font-size: 30rpx;
  width: 100%;
  /* border-bottom: 1px solid #dddddd; */
}
.submit_giftcard {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 50rpx;
  height: 80rpx;
  box-sizing: border-box;
  background: #ff5000;
  width: 670rpx;
  margin-top: 60rpx;
  margin-left: 40rpx;
  font-size: 26rpx;
  border: none;
}

.gift_pic_bg {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
}

.gift_pic {
  width: 680rpx;
  height: 340rpx;
  background: #fab400;
  border-radius: 50rpx;
}
</style>