<template>
    <div class="dialog" @click="closeDialog" catchtouchmove='true'>
        <div v-if="!showImg" class="share-box" @click.stop>
            <image class="close" @click.stop="closeDialog" src="/static/images/public_pop_close.png"></image>

            <div class="share-title">分享给好友</div>
            <div>
                <!--{{shareData.commissionRate}}  -->
                <span class="tipmoney">返利比例：<i class="n">{{shareData.commission_rate||shareData.commissionMax}}</i><i class="s">%</i></span>
                <span class="tipmoney">预计返现：<i class="n">{{shareData.commission_money||shareData.commissionRatio}}</i><i class="s">元</i></span>
                <div class="time">活动截止日期：{{shareData.end_date}}<!--times :timeStamp="shareData.end_date"></!--times --></div>
                <div class="rule">
                    <span class="rule-span">计算规则：</span>分享赚佣金等于分享赚商品的实际支付金额乘以下单时的佣金比例；
                </div>
                <div class="rule">
                    <span  class="rule-span">提现规则：</span>在您根据规则提供个人信息及提现账号后，可将佣金提现，提现所涉及的手续费及个人所得税，均由个人承担；
                </div>
                <div class="rule">
                    <span  class="rule-span">同意分享：</span>您继续分享商品的行为视为您已知悉并同意上述全部内容。
                </div>
                <div  class="rule-span" @click="gotoH">点击查看详细规则></div>
            </div>
            <div class="share-box-dialog">
                <div class="content-list" @click.stop>
                    <button class="shareBtn" open-type='share' data-type="1">
                        <img class="shareImg" src="/static/images/share_product_wechat.png" alt="">
                    </button>
                    <p class="shareWechat">微信好友</p>
                </div>
                <div  class="content-list" @click.stop="getTu">
                    <img class="shareImg" src="/static/images/cutPrice/kan_share_pic.png" alt="">
                    <p>图文分享</p>
                </div>
                <!--<div class="iamge-share-box">-->
                    <!--<image class="iamge-share" src="/static/images/cutPrice/kan_share_pic.png"></image>-->
                    <!--<div>微信好友</div>-->
                <!--</div>-->
                <!--<div class="iamge-share-box">-->
                    <!--<image class="iamge-share" src="/static/images/cutPrice/kan_share_wechat.png"></image>-->
                    <!--<div>图文分享</div>-->
                <!--</div>-->
            </div>
        </div>
        <div class="showimg" v-if="showImg" @click.stop>
            <image mode="widthFix" style="width: 750rpx;" :src="qrimg_url"></image>
            <div class="saveBtn" @click="holdposter">保存图片</div>
        </div>
    </div>
</template>
<script>
    import {getSkuShareImg,getUserinfo} from '@/api'
    import times from '@/components/public/timeFormat'
    export default {
        name: "index",
        props:{
            shareData:"",
            goodsData:"",
        },
        components:{
            times
        },
        data(){
            return{
                showImg:false,
                qrimg_url:""
            }
        },
        methods:{
            gotoH(){
                wx.setStorageSync("urlH5","https://app.leyou.com.cn/activity/shareEarnings")
                wx.navigateTo({
                    url:`/pages/transferH5/main`
                });
            },
            holdposter(){ //保存图片
                let that = this;
                wx.getSetting({
                    success(res) {

                        if (!res.authSetting['scope.writePhotosAlbum']) {
                            wx.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success() {//这里是用户同意授权后的回调
                                    wx.showToast({
                                        title: '保存中...',
                                        icon: 'none'
                                    })
                                    that.save(that);
                                },
                                fail() {//这里是用户拒绝授权后的回调
                                    wx.showToast({
                                        title: '授权后才能保存至手机相册',
                                        icon: 'none'
                                    })
                                    that.setData({
                                        btnShow: 'authorize'
                                    })
                                    return
                                }
                            })
                        } else {//用户已经授权
                            wx.showToast({
                                title: '保存中...',
                                icon: 'none'
                            })
                            that.save(that);
                        }
                    }
                })
            },
            save(obj){//保存图片到相册
                let that = obj;
                if (!that.qrimg_url) {
                    return;
                }
                wx.downloadFile({
                    url: that.qrimg_url,
                    success:function (res) {
                        wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success(result) {
                                wx.showToast({
                                    title: '保存成功',
                                    icon: 'none'
                                })
                                that.showImg=false
                                that.$emit('closeShare')
                            }
                        })
                    }
                })
            },
            closeDialog(){
                this.showImg=false
                this.$emit('closeShare')
            },
            getTu(){
                let token = wx.getStorageSync('token');
                if( !token ){
                    wx.navigateTo({
                        url:'/pages/userCenter/login/wxLogin/main'
                    });
                    return false;
                }
                getUserinfo().then(res=> {
                    wx.setStorageSync('userinfo', res) //缓存用户信息
                    this.qrimg_url=""
                    var pra={
                        sku_img_url:this.goodsData.image_colors[0].main_image,// true 普通参数 string sku图片连接
                        sku_name:encodeURIComponent(this.goodsData.marketing_title), //true 普通参数 string sku名称
                        sku_price:this.goodsData.sale_price, //true 普通参数 float 商品售价
                        share_url:this.shareData.share_url,// true 普通参数 string 分享连接
                        head_img: wx.getStorageSync('userinfo').avatar, //true 普通参数 string 用户头像
                        nick_name:encodeURIComponent(wx.getStorageSync('userinfo').nick_name), //true 普通参数 string 用户昵称

                    }
                    wx.showLoading({
                        title: '生成中...',
                        mask: true
                    })
                    getSkuShareImg(pra).then(res=>{
                        wx.hideLoading();
                        let { body, header } = res;
                        if( header.res_code == 0 ){
                            this.showImg=true
                            this.qrimg_url=res.body.qrimg_url
                        } else {
                            wx.showModal({
                                content: '海报生成失败，请重新生成！',
                                showCancel: false,
                                confirmText: '确定',
                                confirmColor: '#ff5000'
                            })
                        }

                    }).catch(res => {
                        wx.showModal({
                            content: '海报生成失败，请重新生成！',
                            showCancel: false,
                            confirmText: '确定',
                            confirmColor: '#ff5000'
                        })
                    })
                })

            },
        }
    }
</script>

<style scoped>
    .saveBtn{
        background: #FF5000;
        height:100rpx;
        text-align:center;
        line-height: 100rpx;
        font-size: 28rpx;
        color: #fff;
    }
    .showimg{
        position: absolute;
        bottom: 0;
        width: 100%;
    }
    .close{
        position: absolute;
        z-index: 999;
        right:0;
        top: calc(100% - 800rpx);
        height: 40rpx;
        width: 40rpx;
        padding: 20rpx;
    }
    .shareWechat{
        padding-top: 8rpx;
    }
    .shareImg{
        height: 88rpx;
        width: 88rpx;
    }
    .shareBtn{
        height:88rpx;
        width:88rpx;
        border: 0;
        background: #fff;
        border-radius: 50%;
        padding: 0;
    }
    .content-list{
        margin: 0;
        background: #fff;
        border: 1px solid transparent;
        display: block;
        position: relative;
        width: 33%;
        text-align: center;
        font-size: 26rpx;
    }
    .iamge-share{
        height: 88rpx;
        width: 88rpx;
        padding-bottom: 20rpx;
    }

    .iamge-share-box{
        text-align: center;
        width:120rpx;
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
        line-height: 26rpx;
    }
    .share-box-dialog{
        display: flex;
        justify-content: space-around;
        padding: 40rpx;
        padding-top: 80rpx;
    }
    .rule{
        font-size: 26rpx;
        color: #333333;
        letter-spacing: 0;
        line-height: 36rpx;
        padding-bottom: 20rpx;
    }
    .rule-span{
        font-size: 26rpx;
        color: #333333;
        letter-spacing: 0;
        font-weight: bold;
    }
    .time{
        font-size: 26rpx;
        color: #333333;
        letter-spacing: 0;
        line-height: 36rpx;
        padding-top: 10px;
        padding-bottom: 30rpx;
    }
    .tipmoney{
        font-size: 26rpx;
        color: #333333;
        letter-spacing: 0;
        line-height: 36px;
    }
    .tipmoney:nth-of-type(2){
        margin-left: 50rpx;
    }
    .n,.s{
        font-family: PingFangSC-Medium;
        font-size: 34rpx;
        color: #ff5000;
        letter-spacing: 0;
        display: inline;
    }
    .s{
        font-size: 26rpx!important;
    }
    .share-title{
        nt-family: PingFangSC-Medium;
        font-size: 30rpx;
        color: #333333;
        text-align: center;
        height: 80rpx;
        line-height: 60rpx;
        font-weight: bold;
    }
    .dialog{
        position:fixed ;
        height: 100%;
        width: 100%;
        background: rgba(0,0,0,0.6);
        top:0;
        left:0;
    }
    .share-box{
        height: 760rpx;
        padding: 20rpx;
        position: absolute;
        bottom: 0;
        background: #fff;
        border-top-left-radius: 15rpx;
        border-top-right-radius: 15rpx;
        overflow: hidden;
    }
</style>
