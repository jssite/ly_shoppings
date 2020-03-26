<template>
  <div class="body_files">
    <div class="body_files_header">
      <img src="../image/Login_HuaiYun@2x.png" alt class="body_files_photo" />
      <div class="body_files_txt">怀孕</div>
    </div>
    <div class="body_files_ul">
      <div class="body_files_li">
        <div class="body_files_label">预产期</div>
        <div class="body_files_content">
          <div :class="[baby_date=='点击选择'?'body_files_select_none':'body_files_select']">
            <picker mode="date" :value="baby_date" start="2000-01-01" @change="bindDateChange">
              <view>{{baby_date}}</view>
            </picker>
          </div>
          <!-- <div class="body_files_select" v-if="baby_date">{{baby_date}}</div> -->
          <div class="body_files_arrow"></div>
        </div>
      </div>
    </div>
    <template v-if="bady_time == ''">
      <span class="body_files_sbumit">完成</span>
    </template>
    <template v-else>
      <span class="body_files_sbumit active" @click="funcSubmitForm">完成</span>
    </template>
  </div>
</template>

<script>
import { appRegister, getRegisterToken } from "@/api";
const app = getApp();

export default {
  data() {
    return {
      baby_date: "点击选择",
      bady_time: "",
      formToken: "",
      isFlag: "",
      info: {},
      staff_id: ""
    };
  },
  onLoad(opts) {
    this.staff_id = opts.staff_id;
    this.sa_page(this, false, "填写怀孕信息", this.staff_id);
  },
  onShow() {
    getRegisterToken().then(res => {
      this.formToken = res.form_token;
    });
    if (wx.getStorageSync("BASE_WOMAN_INFO")) {
      this.info = wx.getStorageSync("BASE_WOMAN_INFO");
      wx.removeStorageSync("BASE_WOMAN_INFO");
    }
  },
  methods: {
    bindDateChange(e) {
      this.baby_date = e.mp.detail.value;
      this.bady_time = e.mp.detail.value;
    },
    funcSubmitForm() {
      let query = {
        mobile: this.info.mobile,
        staff_id: this.staff_id,
        validate_code: this.info.code,
        form_token: this.formToken,
        type_sel: 0,
        baby_birthday: "",
        gender: "",
        baby_name: "",
        babyedoc: this.baby_date,
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
          staff_id: _this.staff_id,
          user_phone: _this.info.mobile,
          mp_group_id: group_id,
          mp_source: source
        });
        if (token) {
          wx.setStorageSync("userInfo", res);
          wx.setStorageSync("token", token);
          wx.setStorageSync('staff_dgId', res.staff_id);
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
  height: 80px;
  display: block;
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
.body_files_select_none {
  height: 119px;
  width: 100%;
  line-height: 119px;
  font-size: 34px;
  color: #dddddd;
  text-align: right;
}
.body_files_arrow {
  width: 25px;
  height: 25px;
  border-top: #dddddd 1px solid;
  border-right: #dddddd 1px solid;
  transform: rotate(45deg);
}
</style>