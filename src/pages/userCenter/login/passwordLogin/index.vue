<template>
  <div class="user_login_wrap">
    <h1 class="user_mobile_h1">你好</h1>
    <h4 class="user_mobile_h4">欢迎来到乐友！</h4>
    <div class="user_mobile_wrap">
      <span class="user_mobile_txt" v-if="username || usernameFocus">账号</span>
      <span class="user_mobile_clear" v-if="username" @click="funcClearVal">
        <icon type="clear" size="18" color="#dddddd" />
      </span>
      <input
        class="user_mobile_value"
        :class="{'active': usernameFocus}"
        @focus="funcUserName"
        @blur="funcUserName"
        v-model="username"
        type="text"
        placeholder="请输入用户名/手机号"
        placeholder-style="color:#dddddd;"
      />
    </div>
    <div class="user_mobile_wrap">
      <span class="user_mobile_txt" v-if="passFocus || password">密码</span>
      <template v-if="passShow">
        <div class="user_show_pass" @click="funcPasswordTag">
          <img class="user_login_pass_show" src="../../image/login-passShow@2x.png" alt />
        </div>
      </template>
      <template v-else>
        <div class="user_show_pass" @click="funcPasswordTag">
          <img class="user_login_pass_show" src="../../image/login-passHide@2x.png" alt />
        </div>
      </template>
      <template v-if="passShow">
        <input
          class="user_mobile_password"
          :class="{'active': passFocus}"
          v-model="password"
          @focus="funcPassWord"
          @blur="funcPassWord"
          type="text"
          placeholder="请输入6-20位密码"
          placeholder-style="color:#dddddd;"
        />
      </template>
      <template v-else>
        <input
          class="user_mobile_password"
          :class="{'active': passFocus}"
          v-model="password"
          @focus="funcPassWord"
          @blur="funcPassWord"
          type="password"
          placeholder="请输入6-20位密码"
          placeholder-style="color:#dddddd;"
        />
      </template>
    </div>
    <template v-if="username && password">
      <button class="user_login_button active" type="button" @click="funcPassWordLogin">登录</button>
    </template>
    <template v-else>
      <button class="user_login_button" type="button">登录</button>
    </template>
    <div class="user_pass_login">
      <navigator url="/pages/userCenter/login/password/main" open-type="redirect">找回密码</navigator>
    </div>
  </div>
</template>

<script>
import { passwordLogin } from "@/api";
import md5 from "md5";
export default {
  data() {
    return {
      username: "",
      password: "",
      passShow: false,
      usernameFocus: false,
      passFocus: false
    };
  },
  onLoad() {
      this.sa_page(this,false,'账号密码登录','');
  },

  methods: {
    /**
     * 密码登录
     */
    funcPassWordLogin() {
      let query = {
        username: this.username,
        password: md5(this.password),
        push_id: this.push_id,
        staff_id: this.staff_id,
        operation_page: 2
      };
      passwordLogin(query).then(res => {
        wx.setStorageSync("token", res.token);
        wx.setStorageSync("userInfo", res);
        wx.navigateBack({
          delta: 4
        });
      });
    },
    /**
     * 清除内容
     */
    funcClearVal() {
      this.username = "";
    },
    /**
     * 显示密码
     */
    funcPasswordTag() {
      this.passShow = !this.passShow;
    },
    /**
     * 用户名获取/失去焦点切换
     */
    funcUserName() {
      this.usernameFocus = !this.usernameFocus;
    },
    /**
     * 密码获取/失去焦点切换
     */
    funcPassWord() {
      this.passFocus = !this.passFocus;
    }
  }
};
</script>

<style scoped>
.user_login_wrap {
  padding: 0 60px;
}
.user_mobile_h1 {
  padding: 86px 0 40px;
  line-height: 80px;
  font-size: 72px;
  color: #333333;
}
.user_mobile_h4 {
  padding-bottom: 70px;
  font-size: 36px;
  color: #999999;
  line-height: 40px;
}
.user_mobile_wrap {
  position: relative;
}
.user_mobile_txt {
  font-size: 24px;
  color: #999999;
  position: absolute;
  left: 0;
  top: 15px;
}
.user_mobile_value,
.user_mobile_password {
  height: 120px;
  padding-top: 30px;
  line-height: 34px;
  display: block;
  box-sizing: border-box;
  color: #333333;
  font-size: 34px;
  border-bottom: 1px solid #dddddd;
}
.init_class {
  color: red;
}
.user_mobile_value.active,
.user_mobile_password.active {
  border-bottom: 1px solid #ff5000;
}
.user_mobile_tips {
  display: block;
  font-size: 28px;
  color: #dddddd;
  line-height: 130px;
  text-align: center;
}
.user_mobile_tel {
  color: #ff5000;
}
.user_login_button {
  height: 80px;
  margin-top: 100px;
  border-radius: 40px;
  background: #cacaca;
  text-align: center;
  font-size: 30px;
  color: #ffffff;
  line-height: 80px;
}
.user_login_button.active {
  background: #ff5000;
}
.user_pass_login {
  padding-top: 60px;
  font-size: 28px;
  color: #999999;
  line-height: 30px;
  text-align: right;
}
.user_pass_txt {
  color: #ff5000;
}
.user_get_code {
  width: 190px;
  height: 60px;
  border-radius: 30px;
  background: #f6f6f6;
  font-size: 28px;
  color: #333333;
  line-height: 60px;
  text-align: center;
  position: absolute;
  right: 0;
  bottom: 18px;
}
.user_mobile_clear,
.user_show_pass {
  position: absolute;
  right: 0;
  top: 55px;
  z-index: 9;
}
.user_login_pass_show {
  width: 36px;
  height: 36px;
  display: block;
}
</style>
