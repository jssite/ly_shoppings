<template>
  <div style="background:#f2f3f5;min-height:1500rpx;width:100%">
    <div v-if="is_show_giftcard" class="gift_pic_bg">
      <img src="../images/order_giftcard_bg.png" class="gift_pic">
      <div class="gift_content">
        <div style="color:#fff;font-size:30rpx;margin-top:40rpx;margin-left:40rpx; z-index:10">
          <span>乐友：</span>
          <span style="margin-left:10rpx">LEYOU</span>
        </div>
        <div style="color:#fff;font-size:50rpx;margin-top:20rpx;margin-left:40rpx;">
          <span>¥</span>
          <span style="margin-left:10rpx">{{card_server_price}}</span>
        </div>
        <div style="color:#fff;font-size:30rpx;margin-top:60rpx;margin-left:40rpx;">
          <span>卡号：</span>
          <span style="margin-left:10rpx">{{card_server_num}}</span>
        </div>
      </div>
      <!-- </i> -->
    </div>
    <div v-else>
      <div class="top_bg_view">
        <img class="top_bg_icon" src="/static/images/public/public_icon_tip02.png">
        <span class="top_bg_title">暂不支持一单使用多张礼金卡，请在有效期内使用</span>
      </div>
      <div class="gift_bg">
        <div class="card">
          <span class="card_title">卡号</span>
          <input
            v-model="card_num"
            type="text"
            class="card_content"
            placeholder="8-10位数字（卡片右下方）"
            placeholder-style="color:#dddddd;"
          >
        </div>
        <div class="card">
          <span class="card_title">密码</span>
          <input
            v-model="card_pwd"
            type="text"
            class="card_content"
            placeholder="请输入密码"
            placeholder-style="color:#dddddd;"
          >
        </div>
      </div>
    </div>
    <button @click="vaildGiftcard" class="submit_giftcard">{{is_show_giftcard?"使用礼金卡":"确定"}}</button>
  </div>
</template>

<script>
import { vailGidtCard } from "@/api";
import { calcuMD5 } from "@/utils";
import {EventBus} from "@/bus/event-bus.js"
export default {
  data() {
    return {
      is_show_giftcard: false,
      card_num: "",
      card_pwd: "",
      request_info: {},
      card_server_num: "",
      card_server_price: ""
    };
  },

  created() {
    //this.funcQuery()
  },

  onLoad(options) {
  console.log(options)
    // Object.assign(this, this.$options.data());
    this.sa_page(this,false,'使用礼金卡','');
    this.card_num = '';
    this.card_pwd = '';
    
    if(options.card_num == "" || options.card_price =='' || options.card_num == "undefined" || options.card_price =='undefined') {
      this.is_show_giftcard = false;
    } else {
      this.is_show_giftcard = true;
      this.card_server_num = options.card_num;
      this.card_server_price = options.card_price;
    }
    // this.is_show_giftcard = options.giftcard;
  },

  methods: {
    vaildGiftcard() {
      let card_info = {
          card_num:this.card_server_num,
          card_price:this.card_server_price,
      }
      if(this.request_info.card_password && this.request_info.card_password != '')  {
          card_info.card_pwd = this.request_info.card_password;
      }
      if (this.is_show_giftcard) {
        wx.navigateBack({
          delta:1
        });
        EventBus.$emit('giftcardSubmit',card_info);
      } else {
        if (this.card_num && this.card_num != "") {
          this.request_info.card_num = this.card_num;
        } else {
          wx.showToast({
            title: "请输入礼金卡账号！",
            icon: "none",
            duration: 2000
          });
          return;
        }

        if (this.card_pwd && this.card_pwd != "") {
          this.request_info.card_password = calcuMD5(this.card_pwd);
        } else {
          wx.showToast({
            title: "请输入礼金卡密码！",
            icon: "none",
            duration: 2000
          });
          return;
        }
        vailGidtCard(this.request_info).then(res => {
          // res.cardnum 卡号
          // res.gift_cart_price
          this.card_server_num = res.cardnum;
          this.card_server_price = res.gift_cart_price;
          this.is_show_giftcard = true;
        });
      }
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
}

.card_content {
  height: 42rpx;
  padding-left: 40rpx;
  line-height: 34rpx;
  display: block;
  box-sizing: border-box;
  color: #333333;
  font-size: 30px;
  width: 600rpx;
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
  top: 40rpx;
  position: relative;
  /* display: flex; */
  margin-left: 28rpx;
  /* padding: 2rpx; */
  box-sizing: border-box;
  width: 694rpx;
  height: 364rpx;
  /* background-image: url() */
  /* justify-content: center; */
}

.gift_pic {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.gift_content {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
}
</style>