<template>
    <div class="user_login_wrap">
        <h1 class="user_mobile_h1">你好</h1>
        <h4 class="user_mobile_h4">欢迎来到乐友！</h4>
        <div class="user_mobile_wrap" :class="{'active': mobileFocus}">
            <span class="user_mobile_txt" v-if="mobile || mobileFocus ">账号</span>
            <span class="user_mobile_clear" v-if="mobile" @click="funcClearMobile">
                <icon type="clear" size="18" color="#dddddd" />
            </span>
            <input class="user_mobile_value" maxlength="11" @focus="funcUserName" @blur="funcUserName" v-model="mobile" type="number" placeholder="请输入手机注册或登录" placeholder-style="color:#dddddd;">
        </div>
        <div class="user_mobile_wrap" :class="{'active': codeFocus}" >
            <span class="user_mobile_txt" v-if="code || codeFocus">验证码</span>
            <input class="user_mobile_code" @focus="funcCode" @blur="funcCode" v-model="code" maxlength="4" type="number" placeholder="请输入验证码" placeholder-style="color:#dddddd;">
            <template v-if="isSendCode">
                <template v-if="!is_loading">
                    <div class="user_get_code" @click="funcLoginSendSms">获取验证码</div>
                </template>
                <template v-if="is_loading">
                    <div class="user_get_code">发送中</div>
                </template>
            </template>
            <template v-else>
                <div class="user_get_code">{{time}}s</div>
            </template>
        </div>

        <div class="user_mobile_tips">没有收到验证码？可以点击<span class="user_mobile_tel" @click="funcPutVoiceValidateCode">获取语音验证码</span></div>
        <template v-if="mobile && code">
            <button class="user_login_button active" type="button" @click="funcLogin">登录</button>
        </template>
        <template v-else>
            <button class="user_login_button" type="button">登录</button>
        </template>
        <!-- 图形验证码 -->
        <div class="validate_code_wrap" v-if="validate_hide">
            <div class="validate_code_center">
                <div class="validate_code_title">为了您的安全，图形验证码不可少</div>
                <div class="validate_code_input">
                    <span class="number_wrap"><input type="number" v-model="validate_code" placeholder="请输入右侧图形验证码" class="validate_code_value"></span>
                    <span class="validate_code_number" @click="funcLoginSendSms">{{validate_code_number}}</span>
                </div>
                <div class="validate_code_txt">看不清图片？点击图片换一张</div>
                <div class="validate_code_footer">
                    <span class="validate_code_clear" @click="funcValidateClose">取消</span>
                    <span class="validate_code_enter" @click="funcValidateEnter">确定</span>
                </div>
            </div>
        </div>
        <!-- <div class="user_pass_login">
            已有账号密码？<span class="user_pass_txt"><navigator url="/pages/userCenter/login/passwordLogin/main" open-type="redirect">登录</navigator></span>
        </div> -->
    </div>
</template>

<script>
import { getUserByUserName,loginSendSms, fastLogin, appRegister, putVoiceValidateCode, getValidateCode, putValidateCode, getTokenByMobileAndOpenid, getMobileIdentifyCode } from '@/api'
import md5 from 'md5'
var app =  getApp();

export default {
    data() {
        return {
            mobile: '',
            staff_id: '',
            code: '',
            validate_code: '',
            validate_code_number: '',
            validate_hide: false,
            isFocus:false,
            time: 59,
            timer: null,
            isSendCode: true,
            ifValidete: true,
            ifValideteSubmit: true,
            isSuccessCode: true,
            mobileFocus: false,
            codeFocus: false,
            source: '',
            opendId: wx.getStorageSync('openid'),
            is_loading: false
        }
    },
    onLoad(opts){
        this.staff_id = opts.staff_id;
        this.sa_page(this,false,'登录乐友',this.staff_id);
    },
    onShow(){
        let _this = this;
        if(_this.timer){
            clearInterval(_this.timer);
            _this.timer = null;
        }
        this.validate_code = '';
        this.validate_code_number = '';
        this.validate_hide = false;
        this.isFocus = false;
        this.time = 59;
        this.isSendCode = true;
        this.ifValidete = true;
        this.ifValideteSubmit = true;
        this.isSuccessCode = true;
        this.mobileFocus = false;
        this.codeFocus = false;
        this.source = '';
    },
    methods: {
        /**
         * 清楚手机号
         */
        funcClearMobile(){
            this.mobile = ''
        },
        /**
         * 获取验证码
         */
        funcLoginSendSms(){
            let mobile = this.mobile;
            let reg = /^1[34578]\d{9}$/;
            this.source = 'mobile';
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
            if( this.ifValidete ){
                this.ifValidete = false;
                getValidateCode({
                    mobile: this.mobile,
                    type: 'reg'
                }).then( res => {
                    let { code } = res;
                    if( !code ){
                        this.funcMobileCode();
                    } else {
                        this.validate_code_number = code;
                        this.validate_hide = true;
                    }
                    this.ifValidete = true;
                })
            }
        },
        //隐藏图形验证
        funcValidateClose(){
            this.validate_code_number = '';
            this.validate_hide = false;
            this.validate_code = '';
        },
        //校验图形验证
        funcValidateEnter(){
            let _this = this;
            if( _this.validate_code == '' ){
                wx.showToast({
                    icon:'none',
                    title:'图形验证码不能为空'
                });
                return false;
            }
            if( _this.ifValideteSubmit ){
                _this.ifValideteSubmit = false;
                putValidateCode({
                    code: _this.validate_code,
                    type: 'reg'
                }).then(res => {
                    let { code } = res;
                    if( !code ){
                        _this.validate_code_number = '';
                        _this.validate_hide = false;
                        _this.validate_code = '';
                        if( _this.source == 'mobile' ){
                             _this.funcMobileCode();
                        } else {
                            _this.funcVoiceValidateCode();
                        }
                    } else {
                        wx.showToast({
                            icon:'none',
                            title: '验证码错误'
                        });
                        _this.validate_code_number = code;
                        _this.validate_hide = true;
                    }
                    _this.ifValideteSubmit = true;
                });
            }
        },
        //短信验证码
        funcMobileCode(){
            let _this = this;
            let sign =  md5(`mobile=${this.mobile}&transtype=reg_m&key=leyou`);
            let query = {
                type: 'reg_m',
                mobile: this.mobile
            }
            if( this.isSuccessCode ){
                this.isSuccessCode = false;
                this.is_loading = true;
                // getMobileIdentifyCode(query).then( res => {
                //     _this.isSendCode = false
                //     _this.timer = setInterval(function(){
                //         _this.time--;
                //         if( _this.time < 1 ){
                //             _this.time = 59;
                //             _this.isSendCode = true;
                //             clearInterval(_this.timer);
                //         }
                //     },1000)
                //     _this.isSuccessCode = true;
                // })
                wx.request({
                    url:`${process.env.BASE_APPAPI}/system/sendSms/?mobile=${this.mobile}&transtype=reg_m&sign=${sign}`,
                    success(res){
                        let { res_code, message } = res.data.header;
                        if( res_code == 0 ){
                            wx.showToast({
                                icon:'none',
                                title: message
                            });
                            _this.isSendCode = false
                            _this.timer = setInterval(function(){
                                _this.time--;
                                if( _this.time < 1 ){
                                    _this.time = 59;
                                    _this.isSendCode = true;
                                    clearInterval(_this.timer);
                                }
                            },1000)
                        } else {
                            wx.showToast({
                                icon:'none',
                                title: message
                            });
                        }
                        _this.is_loading = false;
                        _this.isSuccessCode = true;
                    }
                })
            }
        },
        /**
         * 跳转身份选择
         */
        funcGoToSelect(){
            wx.navigateTo({
                url:`/pages/userCenter/selectId/main?mobile=${this.mobile}&code=${this.code}&staff_id=${this.staff_id}`
            });
        },
        /**
         * 登录
         */
        funcLogin(){
            let query = {
                username: this.mobile,
                validate_code: this.code,
                push_id: '',
                operation_page: 1
            }
            fastLogin(query).then( res => {
                let { res_code, message } = res;
                if( res_code == '100701' ){
                    this.funcGoToSelect();
                }
                if( res_code == 100708 ){
                    wx.showToast({
                        icon:'none',
                        title: message
                    });
                }
                if( !res_code ){
                    wx.setStorageSync('userInfo', res);
                    this.funcBindOpenid();
                    // wx.setStorageSync('token', res.token);
                    // wx.setStorageSync('userInfo', res);
                    // wx.navigateBack({
                    //     delta: 2
                    // });
                }
                
            })
        },
        /**
         * 语音验证码
         */
        funcPutVoiceValidateCode(){
            let mobile = this.mobile;
            let reg = /^1[34578]\d{9}$/;
            this.source = 'audio'
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
            if( this.ifValidete ){
                this.ifValidete = false;
                getValidateCode({
                    mobile: this.mobile,
                    type: 'reg'
                }).then( res => {
                    let { code } = res;
                    if( code ){
                        this.validate_code_number = code;
                        this.validate_hide = true;
                    }else {
                        this.funcVoiceValidateCode();
                    }
                    this.ifValidete = true;
                })
            }
            
        },
        //绑定opedid
        funcBindOpenid(){
            let opendId = wx.getStorageSync('openid');
            let query = {
                mobile: this.mobile,
                openid: opendId,
                wx_type: 2
            }
            getTokenByMobileAndOpenid(query).then( res => {
                let { body, header } = res;
                 if(header.res_code == 999999){
                    wx.showToast({
                        title: header.message,
                        icon: 'none',
                        duration: 2000
                    });
                } else if(header.res_code == 100905 ){
                    wx.showToast({
                        title: header.message,
                        icon: 'none',
                        duration: 2000
                    });
                } else {
                    let length = getCurrentPages().length;
                    wx.setStorageSync('token',body.token);
                    wx.setStorageSync('staff_dgId', body.staff_id);
                    let group_id = this.$store.state.mp_group_id;
                    let source = this.$store.state.mp_source;
                     app.sensors.track('mp_login', {
                        loginMethod:'账号密码登录',
                        mp_source:source,
                        mp_group_id:group_id,
                    });
                    if(length <= 2){
                        wx.switchTab({
                            url: '/pages/index/main'
                        })
                    } else {
                        wx.navigateBack({
                            delta: 2
                        });
                    }
                    
                }
            });
        },
        funcVoiceValidateCode(){
            let query = {
                mobile: this.mobile,
                type: 'reg_m'
            }
            putVoiceValidateCode(query).then( res => {
                let { prompt } = res;
                wx.showToast({
                    icon:'none',
                    title: prompt
                });
            })
        },
        /**
         * 用户名获取/失去焦点切换
         */
        funcUserName(){
            this.mobileFocus = !this.mobileFocus;
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
    border-bottom: 1px solid #dddddd;
}
.user_mobile_txt {
    font-size: 24px;
    color: #999999;
    position: absolute;
    left: 0;
    top: 15px;
}
.user_mobile_value {
    width: 80%;
}
.user_mobile_code {
    width: 70%;
}
.user_mobile_value,.user_mobile_code {
    height: 120px;
    padding-top: 30px;
    line-height: 34px;
    display: block;
    box-sizing: border-box;
    color: #333333;
    font-size: 34px;
    
}
.init_class{
    color: red;
}
.user_mobile_value.active,.user_mobile_code.active,.user_mobile_wrap.active {
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
.user_mobile_clear {
    padding: 20px;
    position: absolute;
    right: 0;
    top: 35px;
    z-index: 99;
}
.validate_code_wrap {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, .5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}
.validate_code_center {
    width: 600px;
    border-radius: 16px;
    background: #ffffff;
}
.validate_code_title {
    font-size: 30px;
    color: #333333;
    text-align: left;
    padding: 40px 0 50px 40px;
}
.validate_code_input {
    height: 78px;
    display: flex;
    /* padding-left: 40px; */
    align-items: center;
}
.validate_code_txt {
    padding: 28px 0 68px 40px;
    font-size: 26px;
    color: #999999;
}
.number_wrap {
    padding-left: 40px;
}
.validate_code_value {
    width: 360px;
    border: #dddddd 1px solid;
    height: 78px;
    line-height: 78px;
    box-sizing: border-box;
    border-right: 0;
    font-size: 24px;
    padding: 0 10px;
}
.validate_code_number {
    width: 160px;
    height: 78px;
    line-height: 78px;
    text-align: center;
    font-size: 40px;
    white-space: 20px;
    background: #dddddd;
    color: #333333;
}
.validate_code_footer {
    display: flex;
    border-top: #dddddd 1px solid;
}
.validate_code_clear,.validate_code_enter{
    flex: 1;
    text-align: center;
    font-size: 30px;
    line-height: 95px;
}
.validate_code_clear {
    color: #999999;
    border-right: #dddddd 1px solid;
}
.validate_code_enter {
    color: #ff5000;
}
</style>
