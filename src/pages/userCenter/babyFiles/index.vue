<template>
  <div class="body_files">
    <div class="body_files_header">
      <img src="../image/Login_Baby@2x.png" alt class="body_files_photo">
      <div class="body_files_txt">有宝宝</div>
    </div>
    <div class="body_files_ul">
      <div class="body_files_li">
        <div class="body_files_label">宝宝昵称</div>
        <div class="body_files_content">
          <input type="text" v-model="baby_name" class="body_files_input">
          <div class="body_files_placeholder" v-if="!baby_name ">点击输入</div>
          <div class="body_files_input_clear" v-if="baby_name" @click="funcClearValue">
            <icon type="clear" size="18" color="#dddddd"/>
          </div>
          <div class="body_files_arrow">
            <img class="shop_arrow_img" src="../../../../static/images/public_arrow_right.png" alt>
          </div>
        </div>
      </div>
      <div class="body_files_li">
        <div class="body_files_label">宝宝生日</div>
        <div class="body_files_content">
          <div :class="[baby_date=='点击选择'?'body_files_select_none':'body_files_select']">
            <picker mode="date" :value="baby_date" start="2000-01-01" @change="bindDateChange">
              <view>{{baby_date}}</view>
            </picker>
          </div>
          <!-- <div class="body_files_select" v-if="baby_date">{{baby_date}}</div> -->
          <div class="body_files_arrow">
            <img class="shop_arrow_img" src="../../../../static/images/public_arrow_right.png" alt>
          </div>
        </div>
      </div>
      <div class="body_files_li">
        <div class="body_files_label">宝宝性别</div>
        <div class="body_files_content">
          <div class="body_files_wrap" @click="funcSetBabySewx('m')">
            <span class="body_sex_radio">
              <template v-if="sex == 'm'">
                <img
                  style="width: 36rpx;height: 36rpx; vertical-align: middle;display:block;"
                  src="../../../../static/images/public/publicCircle-checkOn.png"
                  alt
                >
              </template>
              <template v-else>
                <img
                  style="width: 36rpx;height: 36rpx; vertical-align: middle;display:block;"
                  src="../../../../static/images/public/publicCircle-checkOff.png"
                  alt
                >
              </template>
            </span>
            <span class="body_sex_username">小王子</span>
          </div>
          <div class="body_files_wrap" @click="funcSetBabySewx('f')">
            <span class="body_sex_radio">
              <template v-if="sex == 'f'">
                <img
                  style="width: 36rpx;height: 36rpx; vertical-align: middle;display:block;"
                  src="../../../../static/images/public/publicCircle-checkOn.png"
                  alt
                >
              </template>
              <template v-else>
                <img
                  style="width: 36rpx;height: 36rpx; vertical-align: middle;display:block;"
                  src="../../../../static/images/public/publicCircle-checkOff.png"
                  alt
                >
              </template>
            </span>
            <span class="body_sex_username">小公主</span>
          </div>
        </div>
      </div>
    </div>
    <template v-if="baby_name == '' && bady_time == '' && sex == ''">
      <span class="body_files_sbumit">完成</span>
    </template>
    <template v-else>
      <span class="body_files_sbumit active" @click="funcSubmitForm">完成</span>
    </template>
  </div>
</template>

<script>
import { appRegister, getRegisterToken } from "@/api";
const app =  getApp();

export default {
  data() {
    return {
      baby_name: "",
      baby_date: "点击选择",
      formToken: "",
      bady_time: "",
      isFlag: "",
      sex: "",
      info: {},
      staff_id: ""
    };
  },
  onLoad(opts) {
    this.staff_id = opts.staff_id;
    this.sa_page(this,false,'宝宝信息',this.staff_id);
  },
  onShow() {
    getRegisterToken().then(res => {
      this.formToken = res.form_token;
    });
    if (wx.getStorageSync("BASE_BABY_INFO")) {
      this.info = wx.getStorageSync("BASE_BABY_INFO");
      wx.removeStorageSync("BASE_BABY_INFO");
    }
  },
  methods: {
    bindDateChange(e) {
      this.baby_date = e.mp.detail.value;
      this.bady_time = e.mp.detail.value;
    },
    funcClearValue() {
      this.baby_name = "";
    },
    funcSetBabySewx(n) {
      this.sex = n;
    },
    funcSubmitForm() {
      let query = {
        mobile: this.info.mobile,
        staff_id: this.staff_id,
        validate_code: this.info.code,
        form_token: this.formToken,
        type_sel: 1,
        baby_birthday: this.baby_date,
        gender: this.sex,
        baby_name: this.baby_name,
        babyedoc: "",
        openid: this.info.openId || "",
        wx_type: 2
      };
      appRegister(query).then(res => {
        let { token, user_id } = res;
        let _this = this;
        let group_id = this.$store.state.mp_group_id;
        let source = this.$store.state.mp_source;
        app.sensors.track("mp_registSuccess", {
          mp_user_id: user_id,
          staff_id:_this.staff_id,
          user_phone:_this.info.mobile,
          mp_group_id:group_id,
          mp_source:source
        });
        if (token) {
            wx.setStorageSync("userInfo", res);
          wx.setStorageSync("token", token);
          wx.navigateBack({
                delta: 4
            });
        //   wx.switchTab({
        //     url: `/pages/user/main`
        //   });
        }
      });
    }
  }
};
</script>

<style scoped>
.body_files {
  padding: 0 60px;
}
.body_files_header {
  padding: 60px 0 0;
}
.body_files_photo {
  width: 230px;
  height: 230px;
  display: block;
  margin: auto;
  border-radius: 50%;
}
.body_files_txt {
  padding: 28px 0 60px;
  font-size: 34px;
  color: #333333;
  text-align: center;
  line-height: 40px;
}
.body_files_sbumit {
  display: block;
  height: 80px;
  margin-top: 100px;
  background: #cacaca;
  border-radius: 40px;
  line-height: 80px;
  text-align: center;
  font-size: 30px;
  color: #ffffff;
}
.body_files_sbumit.active {
  background: #ff5000;
}
.body_files_li {
  height: 120px;
  box-sizing: border-box;
  border-bottom: 1px solid #dddddd;
  display: flex;
  align-items: center;
}
.body_files_label {
  line-height: 119px;
  font-size: 34px;
  color: #333333;
}
.body_files_content {
  display: flex;
  flex: 1;
  padding-left: 70px;
  align-items: center;
  position: relative;
}
.body_files_input,
.body_files_select {
  width: 100%;
  height: 119px;
  line-height: 119px;
  font-size: 34px;
  color: #333333;
}
.body_files_select {
  text-align: right;
}
.body_files_placeholder {
  height: 119px;
  line-height: 119px;
  font-size: 34px;
  color: #dddddd;
  position: absolute;
  top: 0;
  right: 25px;
}
.body_files_input_clear {
  position: absolute;
  top: 38px;
  right: 45px;
  z-index: 9;
}
.body_files_select_none {
  height: 119px;
  width: 100%;
  line-height: 119px;
  font-size: 34px;
  color: #dddddd;
  text-align: right;
}
.body_files_arrow {
  margin-left: 10px;
  width: 25px;
  height: 25px;
}
.body_files_wrap {
  margin-right: 80px;
  display: flex;
  align-items: center;
}
.body_files_wrap:last-child {
  margin-right: 0;
}
.body_sex_radio {
  width: 36px;
  height: 36px;
  padding-right: 10px;
  margin-right: 4px;
}
.shop_arrow_img {
  width: 12.2px;
  height: 22.3px;
  display: block;
}
</style>