<template>
    <div class="user_wx_login">
        <div class="user_login">
            <img class="le_login_img" src="../../image/logo.jpg" alt="">
        </div>
        <button type="button" class="user_wx_button" open-type="getPhoneNumber" @getphonenumber="funcGetUserPhone">微信手机号快捷登录</button>
        
        <button type="button" class="user_mobile_button" @click="funcLoginMobile">其他手机号登录</button>
        
    </div>
</template>

<script>
import { getTokenByMobileAndOpenid, getWXPhoneNumber, getTokenByCode } from '@/api';
import { getQueryString } from '@/utils'
const app = getApp();
export default {
    data() {
        return {
            staff_id: ''
        }
    },
    onLoad(opts){
        if(opts.q){
            let decode = decodeURIComponent(opts.q);
            let parseData = getQueryString('staff_id',decode);
            this.staff_id = parseData;
        } else {
            this.staff_id = opts.staff_id;
        }
        this.sa_page(this,false,'登录乐友',this.staff_id);
    },
    onShow(){
        let sourceLength = getCurrentPages().length;
        if(sourceLength <= 1){
            this.funcGoToIndex();
        }
    },
    methods: {
        /**
         * 跳转请求
         */
        funcGoToIndex(){
            wx.login({
            success(res) {
                if (res.code) {
                    let query = {
                        js_code: res.code,
                        wx_type: 2
                    };
                    getTokenByCode(query).then(res => {
                        if (res.header) {
                            wx.setStorageSync("openid", res.body.openid);
                        } else {
                            let { token, openid } = res;
                            wx.setStorageSync("openid", openid);
                            if (token != "") {
                                wx.setStorageSync("token", token);
                                wx.switchTab({
                                    url: '/pages/index/main'
                                })
                            }
                        }
                    });
                }
            }
            });
        },
        /**
         * 跳转到手机登录
         */
        funcLoginMobile(){
            wx.navigateTo({
                url: `/pages/userCenter/login/mobileLogin/main?staff_id=${this.staff_id}`
            })
        },
        /**
         * 获取手机号
         */
        funcGetUserPhone(res){
            let opendId = wx.getStorageSync('openid');
            let { errMsg, encryptedData, iv } = res.mp.detail;
            let ary_query = {
                encrypted_data: encryptedData,
                iv: iv,
                openid: opendId,
                wx_type: 2
            };
            wx.showLoading({
                title: '登录中...',
                mask: true
            });
            if( errMsg != 'getPhoneNumber:ok' ){
                wx.showToast({
                    title: '您已拒绝授权登录！',
                    icon: 'none',
                    duration: 2000
                })
                return false;
            }
            getWXPhoneNumber(ary_query).then(resa => {
                let { res_code, mobile } = resa;
                if ( res_code == 99998 ){
                    wx.login({
                        success(resb){
                            if( resb.code ){
                                let code_query = {
                                    js_code: resb.code,
                                    wx_type: 2
                                }
                                getTokenByCode(code_query).then( resc => {
                                    getWXPhoneNumber(ary_query).then( resd => {
                                        this.funcLogin(resd.mobile)
                                    })
                                });
                            }
                        }
                    });
                } else if( res_code == 99996 ){
                    wx.login({
                        success(rese){
                            if( rese.code ){
                                let code_query = {
                                    js_code: rese.code,
                                    wx_type: 2
                                }
                                getTokenByCode(code_query).then( resf => {
                                    getWXPhoneNumber(ary_query).then( resg => {
                                        this.funcLogin(resg.mobile);
                                    })
                                });
                            }
                        }
                    });
                } else {
                    this.funcLogin(mobile);
                }
                wx.hideLoading();
            })
        },
        funcLogin(phone){
            let opendId = wx.getStorageSync('openid');
            let query = {
                mobile: phone,
                openid: opendId,
                wx_type: 2
            }
            getTokenByMobileAndOpenid(query).then( res => {
                let { body, header } = res;
                 if(header.res_code == 0){
                     let length = getCurrentPages().length;
                     let user_info = {
                         user_id: body.user_id
                     };
                     wx.setStorageSync('token',body.token);
                     wx.setStorageSync('userInfo',user_info);
                     wx.setStorageSync('staff_dgId', body.staff_id);
                     if( length <= 1 ){
                         wx.switchTab({
                             url: '/pages/index/main'
                         })
                     } else {
                         wx.navigateBack({
                            delta: 1
                        });
                     }
                    let group_id = this.$store.state.mp_group_id;
                    let source = this.$store.state.mp_source;
                     app.sensors.track('mp_login', {
                        loginMethod:'微信快捷登录',
                        mp_source:source,
                        mp_group_id:group_id,
                    });
                 } else if(header.res_code == 100999){
                    wx.navigateTo({
                        url:`/pages/userCenter/selectId/main?mobile=${phone}&code=''&staff_id=${this.staff_id}`
                    });
                } else {
                    wx.showToast({
                        title: header.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
                //  else {
                //     if( body.token ){
                //         wx.setStorageSync('token',res.token);
                //         wx.navigateBack({
                //             delta: 2
                //         });
                //         // wx.switchTab({
                //         //     url:`/pages/user/main`
                //         // });
                //     }
                // }
            });
        }
    }
}
</script>

<style scoped>
.le_login_img {
    width: 296px;
    height: 100px;
    display: block;
    margin: auto;
}
.user_login {
    padding: 200px 0 196px;
}
.user_wx_button {
    width: 540px;
    height: 88px;
    margin: 0 auto 40px;
    background: #3CB034;
    border-radius: 12px;
    text-align: center;
    font-size: 30px;
    color: #fff;
    line-height: 88px;
}
.user_mobile_button {
    width: 540px;
    height: 88px;
    margin: auto;
    text-align: center;
    font-size: 30px;
    color: #333333;
    line-height: 88px;
    background: #fff;
    border: 1px solid #333333;
    border-radius: 12px;
}
</style>