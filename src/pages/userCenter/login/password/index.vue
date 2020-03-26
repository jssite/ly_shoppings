<template>
    <div class="user_login_wrap">
        <div class="user_mobile_wrap">
            <span class="user_mobile_txt" v-if="username">账号</span>
            <span class="user_mobile_clear" v-if="username" @click="funcClearVal">
                <icon type="clear" size="18" color="#dddddd" />
            </span>
            <input class="user_mobile_value" :class="{'active': usernameFocus}" @focus="funcUserName" @blur="funcUserName" v-model="username" type="text" placeholder="请输入手机注册或登录" placeholder-style="color:#dddddd;">
        </div>
        <div class="user_mobile_wrap">
            <span class="user_mobile_txt" v-if="codeFocus || code">验证码</span>
            <input class="user_mobile_code" :class="{'active': codeFocus}" @focus="funcCode" @blur="funcCode" v-model="code" type="text" placeholder="请输入验证码" placeholder-style="color:#dddddd;">
            
            <template v-if="isSendCode">
                <div class="user_get_code" @click="funcLoginSendSms">获取验证码</div>
            </template>
            <template v-else>
                <div class="user_get_code">{{time}}s</div>
            </template>
        </div>
        
        <div class="user_mobile_tips">没有收到验证码？可以点击<span class="user_mobile_tel" @click="funcPutVoiceValidateCode">获取语音验证码</span></div>
        <div class="user_mobile_wrap">
            <span class="user_mobile_txt" v-if="passFocus || password">密码</span>
            <template v-if="passShow">
                <div class="user_show_pass" @click="funcPasswordTag">
                    <img class="user_login_pass_show" src="../../image/login-passShow@2x.png" alt="">
                </div>
            </template>
            <template v-else>
                <div class="user_show_pass" @click="funcPasswordTag">
                    <img class="user_login_pass_show" src="../../image/login-passHide@2x.png" alt="">
                </div>
            </template>
            <template v-if="passShow">
                <input class="user_mobile_password" :class="{'active': passFocus}" v-model="password" @focus="funcPassWord" @blur="funcPassWord" type="text" placeholder="请输入6-20位密码" placeholder-style="color:#dddddd;">
            </template>
            <template v-else>
                <input class="user_mobile_password" :class="{'active': passFocus}" v-model="password" @focus="funcPassWord" @blur="funcPassWord" type="password" placeholder="请输入6-20位密码" placeholder-style="color:#dddddd;">
            </template>
        </div>
        <template v-if="code&&username&&password">
            <button class="user_login_button" :class="{'active':code&&username&&password}" @click="" type="button">完成</button>
        </template>
        <template v-else>
            <button class="user_login_button" type="button">完成</button>
        </template>
        
    </div>
</template>

<script>
import { putChangePwd, putVoiceValidateCode } from '@/api';
import md5 from 'md5'
import { setInterval, clearInterval } from 'timers';
export default {
    data() {
        return {
            username: '',
            password: '',
            code: '',
            passShow: false,
            usernameFocus: false,
            passFocus: false,
            codeFocus: false,
            time: 59,
            timer: null,
            isSendCode: true
        }
    },
    onLoad() {
        this.sa_page(this,false,'找回密码','');
    },
    methods: {
        /**
         * 获取验证码
         */
        funcLoginSendSms(){
            let that = this;
            let mobile = this.username;
            let reg = /^1[34578]\d{9}$/;
            let sign =  md5(`mobile=${this.mobile}&transtype=reg_m&key=leyou`);
            if( !mobile ){
                wx.showToast({
                    icon:'none',
                    title:'手机号不能为空'
                });
                return false;
            }
            if( !reg.test(mobile) ){
                wx.showToast({
                    icon:'none',
                    title:'请输入正确的手机号'
                });
                return false;
            }
            wx.request({
                url:`${process.env.BASE_APPAPI}/system/sendSms/?mobile=${this.mobile}&transtype=reg_m&sign=${sign}`,
                success(res){
                    let { res_code, message } = res.data.header;
                    if( res_code == 0 ){
                        that.isSendCode = false;
                        that.timer = setInterval(function(){
                            that.time--;
                            if( that.time < 1 ){
                                that.time = 59;
                                that.isSendCode = true;
                                clearInterval(that.timer);
                            }
                        },1000)
                    } else {
                        wx.showToast({
                            icon:'none',
                            title: message
                        });
                    }
                }
            })
        },
        /**
         * 语音验证码
         */
        funcPutVoiceValidateCode(){
            let mobile = this.mobile;
            let reg = /^1[34578]\d{9}$/;
            
            if( !mobile ){
                wx.showToast({
                    icon:'none',
                    title:'手机号不能为空'
                });
                return false;
            }
            if( !reg.test(mobile) ){
                wx.showToast({
                    icon:'none',
                    title:'请输入正确的手机号'
                });
                return false;
            }
            let query = {
                mobile: this.mobile,
                type: 'reg_m'
            }
            putVoiceValidateCode(query).then( res => {
                let { prompt } = res;
                wx.showToast({
                    icon:'none',
                    title:prompt
                });
            })
        },
        /**
         * 提交表单
         */
        funcSubmit(){
            let query = {
                mobile: this.username,
                password: this.password,
                form_token: this.form_token,
                validate_code: this.code
            }
            putChangePwd(query).then( res => {
                console.log(res)
                wx.navigateTo({
                    url:`/pages/userCenter/passwordLogin/main`
                });
            });
        },
        /**
         * 清除内容
         */
        funcClearVal(){
            this.username = ''
        },
        /**
         * 显示密码
         */
        funcPasswordTag(){
            this.passShow = !this.passShow;
        },
        /**
         * 用户名获取/失去焦点切换
         */
        funcUserName(){
            this.usernameFocus = !this.usernameFocus;
        },
        /**
         * 密码获取/失去焦点切换
         */
        funcPassWord(){
            this.passFocus = !this.passFocus;
        },
        /**
         * 验证码获取/失去焦点切换
         */
        funcCode(){
            this.codeFocus = !this.codeFocus;
        }
    }
}
</script>

<style scoped>
.user_login_wrap {
    padding: 100px 60px 0;
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
.user_mobile_value,.user_mobile_code,.user_mobile_password {
    height: 120px;
    padding-top: 30px;
    line-height: 34px;
    display: block;
    box-sizing: border-box;
    color: #333333;
    font-size: 34px;
    border-bottom: 1px solid #dddddd;
}
.init_class{
    color: red;
}
.user_mobile_value.active,.user_mobile_code.active,.user_mobile_password.active {
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
.user_pass_txt navigator {
    display: inline;
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
    z-index: 9;
}
.user_mobile_clear,.user_show_pass {
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