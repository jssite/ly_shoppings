<template>
  <div class="user_select_id">
    <div class="user_select_tit">请选择您目前的状态</div>
    <div class="user_select_list">
      <div class="user_select_item" @click="funcUserRegister(2)">
        <dir class="user_select_img">
          <img src="../image/Login_BeiYun@2x.png" class="user_select_img" alt />
        </dir>
        <h1 class="user_select_txt">备孕中</h1>
      </div>
      <div class="user_select_item" @click="funcGoToWomanInfo">
        <dir class="user_select_img">
          <img src="../image/Login_HuaiYun@2x.png" class="user_select_img" alt />
        </dir>
        <h1 class="user_select_txt">怀孕中</h1>
      </div>
      <div class="user_select_item" @click="funcGoToAddBodyInfo">
        <dir class="user_select_img">
          <img src="../image/Login_Baby@2x.png" class="user_select_img" alt />
        </dir>
        <h1 class="user_select_txt">有宝宝</h1>
      </div>
      <div class="user_select_item" @click="funcUserRegister(3)">
        <dir class="user_select_img">
          <img src="../image/Login_NoPlan@2x.png" class="user_select_img" alt />
        </dir>
        <h1 class="user_select_txt">没计划造人</h1>
      </div>
    </div>
    <div class="user_recomm_bg">
      <div class="user_recomm" v-if="!user_staff_id_save">
        <input
          v-model="user_staff_id"
          type="number"
          class="user_recomm_input"
          placeholder="请填写推荐码(非必填)"
        />
        <span class="staff_sure" @click="consoleStaffId">确定</span>
      </div>
      <span
        v-else
        style="color:#333;font-size:30rpx;height:60rpx;line-height:0rpx;"
      >您的导购推荐码：{{user_staff_id}}</span>
    </div>
    <div class="user_agreement">
      <icon type="success" size="25" :color="[isFlag?'#FF5000':'#dddddd']" @click="funcAgreement" />
      <div class="user_agreement_txt">
        我同意
        <span class="user_link_agreement"  @click="toFw">《乐友隐私权与服务条款》</span>
      </div>
    </div>
  </div>
</template>

<script>
import { appRegister, getRegisterToken } from "@/api";
const app = getApp();

export default {
  data() {
    return {
      mobile: "",
      code: "",
      staff_id: "",
      openid: wx.getStorageSync("openid"),
      formToken: "",
      isFlag: true,
      user_staff_id: "",
      user_staff_id_save: ""
    };
  },
  onLoad(opts) {
    this.mobile = opts.mobile;
    this.code = opts.code;
    this.staff_id = opts.staff_id;
    this.user_staff_id = "";
    this.user_staff_id_save = "";
    this.sa_page(this, false, "选择身份", this.staff_id);
    console.log(opts);
  },
  onShow() {
    getRegisterToken().then(res => {
      this.formToken = res.form_token;
    });
  },
  methods: {
    //协议
    funcAgreement() {
      this.isFlag = !this.isFlag;
    },
      toFw(){
           wx.setStorageSync("urlH5",'https://www.leyou.com.cn/special/leyou-sh/index.php?from=singlemessage&isappinstalled=0')
          wx.navigateTo({
              url:`/pages/transferH5/main`
          });
      },
    //注册
    funcUserRegister(n) {
      if (!this.isFlag) {
        wx.showToast({
          title: "请先同意乐友注册协议",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      let query = {
        mobile: this.mobile,
        validate_code: this.code,
        form_token: this.formToken,
        staff_id: this.staff_id,
        type_sel: n,
        baby_birthday: "",
        gender: "",
        baby_name: "",
        babyedoc: "",
        openid: this.openid,
        wx_type: 2
      };
      //   if (this.user_staff_id_save && this.user_staff_id_save != "") {
      //     query.staff_id = this.user_staff_id_save;
      //   }
      //   else {

      //   }
        wx.showLoading({
            title:"加载中",
        })
      appRegister(query).then(res => {
        let { token, user_id } = res;
        let _this = this;
        let group_id = this.$store.state.mp_group_id;
        let source = this.$store.state.mp_source;
        app.sensors.track("mp_registSuccess", {
          mp_user_id: user_id,
          staff_id: _this.staff_id,
          user_phone: _this.mobile,
          mp_group_id: group_id,
          mp_source: source
        });
        wx.hideLoading()
        if (token) {
          wx.setStorageSync("userInfo", res);
          wx.setStorageSync("token", token);
          wx.setStorageSync('staff_dgId', res.staff_id);
          wx.navigateBack({
                delta: 3
            });
        //   wx.switchTab({
        //     url: `/pages/user/main`
        //   });
        }
      });
    },
    /**
     * 跳转宝宝信息
     */
    funcGoToAddBodyInfo() {
      let info = {
        mobile: this.mobile,
        code: this.code,
        openId: this.openid
      };
      wx.navigateTo({
        url: `/pages/userCenter/babyFiles/main?staff_id=${this.staff_id}`
      });
      wx.setStorageSync("BASE_BABY_INFO", info);
    },
    /**
     * 跳转怀孕
     */
    funcGoToWomanInfo() {
      let info = {
        mobile: this.mobile,
        code: this.code,
        openId: this.openid
      };
      wx.navigateTo({
        url: `/pages/userCenter/woman/main?staff_id=${this.staff_id}`
      });
      wx.setStorageSync("BASE_WOMAN_INFO", info);
    },

    consoleStaffId() {
      if (this.user_staff_id && this.user_staff_id != "") {
        this.user_staff_id_save = this.user_staff_id;
        this.staff_id = this.user_staff_id;
      } else {
        wx.showToast({
          title: "请输入导购推荐码",
          icon: "none"
        });
      }
    }
  }
};
</script>

<style scoped>
.user_select_tit {
  padding: 90px 0;
  font-size: 34px;
  color: #333333;
  text-align: center;
  line-height: 48px;
}
.user_select_list {
  padding: 0 25px;
  display: flex;
  flex-wrap: wrap;
}
.user_select_item {
  width: 230px;
  margin: 0 60px 100px;
}
.user_select_img {
  width: 230px;
  height: 230px;
  border-radius: 50%;
  display: block;
}
.user_select_txt {
  padding-top: 20px;
  color: #333333;
  font-size: 34px;
  text-align: center;
  line-height: 48px;
  font-family: "PingFangSC-Regular";
}

.user_recomm {
  display: flex;
  height: 78rpx;
  width: 580rpx;
}

.user_recomm_bg {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user_recomm_input {
  color: #333;
  font-size: 30rpx;
  border: #ddd solid 1rpx;
  width: 460rpx;
  padding-left: 20rpx;
  height: 100%;
  box-sizing: border-box;
  background: #f8f8f8;
}

.user_recomm_input_placeholder {
  /* font-size: 26rpx; */
  color: #999;
}

.staff_sure {
  width: 120rpx;
  height: 100%;
  text-align: center;
  line-height: 78rpx;
  font-size: 30rpx;
  color: #fff;
  background: #ff5000;
}

.user_agreement {
  /* position: absolute; */
  /* bottom: 47rpx; */
  /* width: 100%; */
  padding-top: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user_agreement_txt {
  padding-left: 13px;
  text-align: center;
  font-size: 26px;
  color: #333333;
  line-height: 40px;
}
</style>