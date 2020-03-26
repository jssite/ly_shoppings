<template>
  <div class="user_setting">
    <div class="user_setting_ul">
      <div class="user_setting_li" @click.stop="gotoBabyInfo">
        <span class="user_setting_label">宝宝档案</span>
        <div class="user_setting_content">
          <span class="user_setting_txt ff5000">{{userDataList.baby_file}}</span>
          <div class="user_setting_icon">
            <img class="user_setting_img" src="../image/public_arrow_right.png" alt />
          </div>
        </div>
      </div>
      <div class="user_setting_li" @click="setAddress">
        <span class="user_setting_label">收货地址</span>
        <div class="user_setting_content">
          <div class="user_setting_icon">
            <img class="user_setting_img" src="../image/public_arrow_right.png" alt />
          </div>
        </div>
      </div>
      <div class="user_setting_li" @click="setReceipt">
        <span class="user_setting_label">公司发票抬头</span>
        <div class="user_setting_content">
          <div class="user_setting_icon">
            <img class="user_setting_img" src="../image/public_arrow_right.png" alt />
          </div>
        </div>
      </div>
      <div class="user_setting_li" v-if="show_staff_id">
        <span class="user_setting_label">导购号</span>
        <span class="user_setting_txt" style="padding-right:40rpx;">{{staff_dgid}}</span>
        <!-- <div class="user_setting_content"> -->
        <!-- <span class="user_setting_txt">11111</span> -->
        <!-- <div class="user_setting_icon"> -->
        <!-- <span class="user_setting_img">11111</span> -->
        <!-- <img class="user_setting_img" src="../image/public_arrow_right.png" alt=""> -->
        <!-- </div> -->
        <!-- </div> -->
      </div>
      <div class="user_setting_li" @click.stop="funcGoVeri">
        <span class="user_setting_label">孕妇认证</span>
        <div class="user_setting_content">
          <!-- <span class="user_setting_txt">未认证</span> -->
          <!-- <span class="user_setting_txt" style="color:#999">未认证</span> -->
          <div class="user_setting_icon">
            <img class="user_setting_img" src="../image/public_arrow_right.png" alt />
          </div>
        </div>
      </div>
    </div>
    <div class="user_setting_ul">
      <div class="user_setting_li" @click="tel">
        <span class="user_setting_label">客服电话(09:00-18:00)</span>
        <div class="user_setting_content">
          <span class="user_setting_txt">400-666-9888</span>
          <div class="user_setting_icon">
            <img class="user_setting_img" src="../image/public_arrow_right.png" alt />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userDataList: {},
      show_staff_id: false,
      staff_dgid: ""
    };
  },
  onLoad() {
    this.sa_page(this, false, "设置", "");
    let data = wx.getStorageSync("userinfo");
    this.userDataList = data;
    let staff_id = wx.getStorageSync("staff_dgId");
    if (staff_id && staff_id != "") {
      this.show_staff_id = true;
      this.staff_dgid = staff_id;
    } else {
      this.show_staff_id = false;
    }
  },
  methods: {
    setAddress() {
      //设置默认地址
      wx.navigateTo({
        url: "/pages/userCenter/address/main"
      });
    },
    tel() {
      wx.makePhoneCall({
        phoneNumber: "400-666-9888"
      });
    },
    setReceipt() {
      //设置发票
      wx.navigateTo({
        url: "/pages/userCenter/invoice/list/main"
      });
    },
    funcGoVeri() {
      // let link = "http://192.168.196.229/pregnant/index";
      // let link = 'http://192.168.98.194/pregnant/index';
      let link = 'https://app.leyou.com.cn/pregnant/index';
      wx.setStorageSync("urlH5", link);
      wx.navigateTo({
        url: "/pages/transferH5/main"
      });
    },
    gotoBabyInfo() {
      let link = this.userDataList.baby_file_url;
      wx.setStorageSync("urlH5", link);
      wx.navigateTo({
        url: "/pages/transferH5/main"
      });
    }
  }
};
</script>

<style scoped>
.user_setting {
  min-height: 100vh;
  background: #f3f5f7;
}
.user_setting_ul {
  padding-left: 20px;
  margin-bottom: 20px;
  background: #fff;
}
.user_setting_li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 88px;
  border-bottom: #eeeeee 1px solid;
}
.user_setting_content {
  height: 88px;
  display: flex;
  line-height: 88px;
  /* align-items: center; */
  justify-content: flex-end;
}
.user_setting_label {
  color: #333333;
  font-size: 30px;
  line-height: 88px;
}
.user_setting_txt {
  color: #333333;
  font-size: 30px;
}
.user_setting_txt.ff5000 {
  color: #ff5000;
}
.user_setting_icon {
  width: 18px;
  height: 18px;
  margin: 36px 30px 0 10px;
  display: block;
}
.user_setting_img {
  width: 13px;
  height: 24px;
  display: block;
}
</style>