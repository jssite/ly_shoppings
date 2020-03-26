<template>
    <div class="alike card">
        <img class='cardlab' style="width:125rpx;height:32rpx" src="/static/goodsdetail/lecard_label_super.png" alt="">
        <span class="cardawa">{{msg.str}}<i class="num">{{msg.num}}</i></span>
        <img @click='gotoLeVip' class='openCard' src="/static/goodsdetail/lecard_icon_buy.png" alt="">
    </div>
</template>

<script>
    export default {
        name: "alikeCard",
        props:{
            msg:''
        },
        created(){
            console.log(this.msg)
        },
        methods: {
            gotoLeVip() {
                let url = 'https://app.leyou.com.cn/activity/joyCard';
                this.gotoH5page(url+'?is_mini=1&token='+wx.getStorageSync('token')+'&isRefresh=1')
            },
            gotoH5page(url){ //跳转到中转页面
                // http://app.leyou.com.cn/activity/joyCard?isRefresh=1&token=dfcd5c3537e52cab7ca44151f122288f
                console.log(url)
                wx.setStorageSync('urlH5', url);
                wx.navigateTo({url:'/pages/transferH5/main'})
            },
        },
    }
</script>

<style scoped>
    .alike {
        display: flex;
        align-items: center;
        height: 88rpx;
        background: #ffffff;
    }
    .card {
        background: #FFFAEB;
    }
    .card .cardlab {
        margin-left: 20rpx;
        width: 98rpx;
        height: 30rpx;
    }
    .card .cardawa {
        margin-left: 12rpx;
        width: 492rpx;
        height: 32rpx;
        font-family: PingFangSC-Medium;
        font-size: 26rpx;
        color: #333333;
        letter-spacing: 0;
        line-height: 32rpx;
    }
    .cardawa .num{
        display: inline-block;
        color: red;
    }
    .card .openCard {
        height: 88rpx;
        width: 131rpx;
        display: flex;
        align-items: center;
        background: #ffeba2;
    }
</style>
