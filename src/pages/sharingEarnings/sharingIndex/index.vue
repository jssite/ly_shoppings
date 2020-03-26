<template>
    <div class="content" :class="phonestyleShow?'full_screen_content':''">
        <div :class="(baseData.recommend&&baseData.recommend.length)?'top-box':'no-top-box'">
            <div class="homeTopSelect">
                <img class="position selectImg" src="/static/images/navbar_search.png" />
                <navigator url="/pages/sharingEarnings/search/main?channel=share" hover-class="none">
                    <div class="input">搜索乐友商品</div>
                </navigator>
            </div>
            <div class="top-content">
                <swiper class="swiper-box"
                        circular="true"
                        indicator-dots="true"
                        autoplay="true"
                        indicator-color="rgba(255,255,255,1)"
                        indicator-active-color="#FF4614"
                        v-if="baseData.banner&&baseData.banner.length"
                >
                    <block v-for="item in baseData.banner" :key="index" >
                        <swiper-item>
                            <image @click="gotoH(item.link)" class="swiper-img" mode="aspectFill" :src="item.url" />
                        </swiper-item>
                    </block>
                </swiper>
                <div class="content-bottom">

                    <div class="laba" v-if="baseData.tips&&baseData.tips.length">
                        <image class="icon_message" src="/static/images/share_index_icon_message.png"></image>
                        <swiper class="displayTips" autoplay="true" vertical="true" circular="true" interval="2000">
                            <swiper-item v-for="item in  baseData.tips" :key="index">
                            <span>
                            {{item}}
                            </span>
                            </swiper-item>
                        </swiper>
                    </div>
                    <span class="tip-btn" @click="showDialog">分享赚规则</span>
                </div>
            </div>
            <div class="tuijin-title" v-if="baseData.recommend&&baseData.recommend.length">
                <span>为你推荐</span>
                <span class="swiperIndex">{{current+1}}/{{baseData.recommend.length}}</span>
            </div>
            <div class="tuijin-box"
                 :class="current===2?'right1':'left1'"
                 v-if="baseData.recommend&&baseData.recommend.length">
                <swiper class="swiper-box1"
                        indicator-color="rgba(255,255,255,1)"
                        style="height:240rpx"
                        :next-margin="current!=2?'30rpx':'0'"
                        :previous-margin="current==2?'30rpx':'0'"
                        @change="swiperChange"
                >
                    <block v-for="item in baseData.recommend" :key="index" >
                        <swiper-item>
                            <div class="tuijin-list" :class="current===2?'left':'right'">
                                <image mode="aspectFill"  class="tuijin-list-img" @click="gotoGoods(item.sku)" :src="item.img"></image>
                                <div>
                                    <div class="tuijin-list-title">
                                        <span class="ratio_tip">佣金{{item.commission_ratio}}%</span>
                                        {{item.name}}
                                    </div>
                                    <div >
                                        <span class="tuijin-tip">最高可赚{{item.commission_max}}元</span>
                                    </div>
                                    <div class="tuijin-bottom">
                                        <div style="padding-left: 20rpx;color: #333"><moneySpan :money="item.price" :iSize="40"></moneySpan></div>
                                        <span class="share-btn" @click="gotoGoods(item.sku)">立即分享</span>
                                    </div>
                                </div>
                            </div>
                            <image @click="gotoH(item.link)" class="swiper-img" mode="aspectFill" :src="item.url" />
                        </swiper-item>
                    </block>
                </swiper>
            </div>
        </div>
        <div :class="(baseData.recommend&&baseData.recommend.length)?'center':'centerNorecomen'">
            <image class="ad" v-if="baseData.dissertation&&baseData.dissertation.length" @click="gotoH(baseData.dissertation[0].link)" mode="widthFix" :src="baseData.dissertation[0].url"> </image>
            <div style="height: 80rpx;" >
                <div :class="fixed?'sort fixed':'sort'">
                    <div @click="sort(1)" :class="type===1?'act sort-list':'sort-list'">
                        <span>综合</span>
                        <!-- <image v-if="type!==1" style="width: 16rpx;height: 20rpx;padding-top: 4rpx;padding-left: 10rpx;" src="/static/images/search/search_icon_price.png" alt="">></image>
                        <image v-if="type===1&&comprehensive" style="width: 16rpx;height: 20rpx;padding-top: 4rpx;padding-left: 10rpx;" src="/static/images/search/search_icon_price_up.png" alt="">></image>
                        <image v-if="type===1&&!comprehensive" style="width: 16rpx;height: 20rpx;padding-top: 4rpx;padding-left: 10rpx;;" src="/static/images/search/search_icon_price_down.png" alt="">></image> -->
                    </div>
                    <div @click="sort(2)" :class="type===2?'act sort-list':'sort-list'">
                        <span>价格</span>
                        <image v-if="type!==2" style="width: 16rpx;height: 20rpx;padding-top: 2rpx;padding-left: 10rpx;" src="/static/images/search/search_icon_price.png" alt="">></image>
                        <image v-if="type===2&&price" style="width: 16rpx;height: 20rpx;padding-top: 2rpx;padding-left: 10rpx;" src="/static/images/search/search_icon_price_up.png" alt="">></image>
                        <image v-if="type===2&&!price" style="width: 16rpx;height: 20rpx;padding-top: 2rpx;padding-left: 10rpx;" src="/static/images/search/search_icon_price_down.png" alt="">></image>
                    </div>
                    <div @click="sort(3)" :class="type===3?'act sort-list':'sort-list'">
                        <span>佣金</span>
                        <image v-if="type!==3" style="width: 16rpx;height: 20rpx;padding-top: 2rpx;padding-left: 10rpx;" src="/static/images/search/search_icon_price.png" alt="">></image>
                        <image v-if="type===3&&brokerage" style="width: 16rpx;height: 20rpx;padding-top: 2rpx;padding-left: 10rpx;" src="/static/images/search/search_icon_price_up.png" alt="">></image>
                        <image v-if="type===3&&!brokerage" style="width: 16rpx;height: 20rpx;padding-top: 2rpx;padding-left: 10rpx;" src="/static/images/search/search_icon_price_down.png" alt="">></image>
                    </div>
                </div>
            </div>
            <div class="goods-box" v-if="searchData&&searchData.length">
                <div class="goods-list" v-for="item in searchData" :key="index" @click="gotoGoods(item.sku)">
                    <image mode="aspectFill" style="height: 350rpx;width: 350rpx;" :src="BASE_IMG_URL+item.le_image"></image>
                    <div class="goods-name">{{item.title}}</div>
                    <div style="font-size: 0;padding:0 10rpx">
                        <span class="tip-bf">佣金{{item.product_brokerage_dis}}%</span>
                        <span class="tip-money">最高可赚{{item.brokerage}}元</span>
                    </div>
                    <div style="padding-left: 20rpx;color: #333"><moneySpan :money="item.price" :iSize="34"></moneySpan></div>
                </div>
            </div>
            <div class="zanwei"  v-if="searchData&&!searchData.length">
                <img class="zanwei-img" src="/static/images/public/public_empty_pic.png" alt="" />
                <p class="zanwei-tip">竟然被抢光了！紧急上架中，请稍候再试~</p>
            </div>
        </div>
        <div class="footer" :class="phonestyleShow?'full_screen':''">
            <div class="foot_nav">
                <img class="img" src="../image/share_tabbar_index_on.png" alt="" mode="widthFix">
                <div class="nav_txt orange_txt">首页</div>
            </div>
            <div class="foot_nav border_left" @click="funcGoToUserConter">
                <img class="img" src="../image/share_tabbar_money_off.png" alt="" mode="widthFix">
                <div class="nav_txt">我的佣金</div>
            </div>
        </div>
        <div class="dialog" v-if="showRule" @click="closeDialog">
            <div class="dialog-content" @click.stop>
                <image class="close" @click="closeDialog" src="/static/images/public_pop_close.png"></image>
                <div class="share-title">分享赚规则</div>
                <div class="rule"><text class="rule-list" v-for="item in baseData.rule" :key="index">
                        {{item}}
                    </text>
                </div>
                <div class="rule-btn" @click="closeDialog">我知道了</div>
            </div>
        </div>
        <!--<div id="ruleDialog" v-show="showRuleDialog" catchtouchmove='true' >-->
            <!--<div class="ruleDialog" >-->
                <!--<div class="dialog_header">-->
                    <!--<div class="close_btn" >-->
                        <!--<img src="/static/images/public_pop_close.png" @click="closeRule" class="closeImg">-->
                    <!--</div>-->
                    <!--{{rule.title}}-->
                <!--</div>-->
                <!--<scroll-view scroll-y="true" class="dialog_content" >-->
                    <!--<rich-text :nodes="cssRule" class="ruleTxt"></rich-text>-->
                <!--</scroll-view>-->
                <!--<div class="dialog_footer" @click="closeRule">我知道了</div>-->
            <!--</div>-->
        <!--</div>-->
        <!--<shareModal @closeShare="closeShare"  v-if="goodsDynamicData.share_flag&&shareBtn" :shareData="baseData.recommend[shareIndex]"></shareModal>-->

    </div>

</template>

<script>
    import {
        getDistributionIndex,
        shareProductQuery
    } from '@/api'
    import shareModal from "@/components/product/shareModal"
    import moneySpan from '@/components/public/money.vue'
    import { mapMutations, mapState } from 'vuex';

    export default {
        name: "index",
        data(){
            return{
                baseData:"",
                searchData:[],
                curr_page:1,
                rows:10,
                total:0,
                comprehensive:false,
                price:'',
                brokerage:'',
                shareIndex:0,
                showRule:false,
                type:1,
                top:0,
                fixed:false,
                selectBtn:true,
                current:0,
                phonestyleShow: false
            }
        },
        components:{
            shareModal,
            moneySpan
        },
        computed:{
            BASE_IMG_URL() {
                return this.$store.state.BASE_APP_INFO["download_le_image"];
            },
        },
        onLoad(){
            getDistributionIndex({}).then(res=>{
                this.baseData=res.body
                 let that = this;
                setTimeout(function () {//等待页面渲染完成
                        let query = wx.createSelectorQuery();
                        query.select('.sort').boundingClientRect(function (rect) {
                            console.log(rect)
                            that.top = rect.top;
                        }).exec();
                    },1000)
                })
            wx.showLoading({
                title:'加载中'
            })
            this.searchData=[]
            this.curr_page=1
            this.funcQuerySearch()
            this.fixed=false
            let _this = this;
            wx.getSystemInfo({
              success(res) {
                if(res.model.indexOf('iPhone X')>-1 || res.model.indexOf('unknown<iPhone11,8>')>-1){
                    _this.phonestyleShow = true;
                }else{
                    _this.phonestyleShow = false;
                }
              }
            })
        },

        onPageScroll:function(e){
            if(e.scrollTop>=this.top){
                this.fixed = true;
            }else{
                this.fixed = false;
            }
        },
        onReachBottom(){
            console.log(1)
            if((this.curr_page*this.rows>=this.total)||!this.selectBtn){
                return
            } else{
                this.selectBtn=false
                this.curr_page=this.curr_page+1;
                wx.showLoading({
                    title:'加载中'
                })
                console.log(this.curr_page)
                this.funcQuerySearch()
            }
        },
        methods:{
            swiperChange(e){
                this.current=e.target.current
                console.log(e)
            },
            gotoH(link){
                wx.setStorageSync("urlH5",link)
                wx.navigateTo({
                    url:`/pages/transferH5/main`
                });
            },
            closeDialog(){
                this.showRule=false
            },
            showDialog(){
                this.showRule=true
            },
            funcGoToUserConter(){
                wx.redirectTo({
                    url:'/pages/sharingEarnings/myCommission/main'
                });
            },
            gotoGoods(sku){
                wx.navigateTo({
                    url:'/pages/goodsdetailed/main?sku='+sku
                });
            },
            sort(type){
                if(!this.selectBtn){
                   return
                }
                this.selectBtn=false
                this.curr_page=1
                this.searchData=[]
                this.type=type
                if(type===1){
                    this.comprehensive=false;
                    this.price='';
                    this.brokerage='';
                }else if (type===2){
                    this.comprehensive='';
                    this.price=this.price?false:true;
                    this.brokerage='';
                }else{
                    this.comprehensive='';
                    this.price='';
                    this.brokerage=this.brokerage?false:true;
                }
                this.funcQuerySearch()
            },
            funcQuerySearch(type){
                let queryCategory = '';
                let queryMfctcode = '';
                console.log(this.curr_page)

                let query = {
                    channel: 0,
                    queryList: [
                        `comblex_search:`
                    ],
                    sortList: [
                        `comprehensive:${this.comprehensive}`,
                        `price:${this.price}`,
                        `prodcutsellamount:`,
                        `addtime:`,
                        `brokerage:${this.brokerage}`
                    ],
                    filterList: [
                        `price:0-*`,
                        `category:`,
                        `mfctcode:`,
                        `shopIdList:`
                    ],
                    start: this.curr_page,
                    rows: this.rows
                }
                shareProductQuery(query).then(res=>{
                    if(this.curr_page===1){
                        this.searchData=[]
                    }
                    this.selectBtn=true
                    wx.hideLoading()
                    this.searchData=this.searchData.concat(res.body.data)
                    this.total=res.body.rows
                });
            },

        }
    }
</script>

<style scoped>
    .zanwei-tip{
        font-size: 30rpx;
        padding-bottom:20rpx;
    }
    .zanwei-img{
        width: 266rpx;
        height: 222rpx;
        display: inline-block;
        padding: 40rpx;
    }
    .zanwei{
        text-align: center;
    }
    .swiperIndex{
        font-size: 24rpx;
        background: rgba(0,0,0,0.1);
        border-radius: 16rpx;
        width: 72rpx;
        height: 32rpx;
        line-height: 32rpx;
        display: inline-block;
        text-align: center;
    }
    .displayTips{
        display: flex;
        align-items: center;
        height: 50rpx;
        width: 450rpx;
        line-height: 50rpx;
    }
    .sort-list{
        display: flex;
        align-items: center;
    }
    .sort.fixed{
        position: fixed;
        top: 0;
        width: 100%;
        left: 0;
        background: #fff;
    }
    .icon_message{
        width: 28rpx;
        height: 28rpx;
        vertical-align: center;
        padding-right: 20rpx;
    }
    .rule-list{
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        color: #505050;
        padding: 10rpx;
        line-height: 50rpx;
        display: block;
        margin-top: -60rpx;
    }
    .share-title{
        font-family: PingFangSC-Medium;
        font-size: 36rpx;
        color: #333333;
        text-align: center;
        height: 80rpx;
        line-height: 80rpx;
        font-weight: bold;
    }
    .rule-btn{
        height: 100rpx;
        font-family: PingFangSC-Medium;
        font-size: 30rpx;
        color: #FF5000;
        letter-spacing: 0;
        text-align: center;
        line-height: 100rpx;
    }
    .rule{
        max-height: 560rpx;
        min-height: 300rpx;
        overflow: auto;
        padding:0 20rpx;

    }
    .close{
        position: absolute;
        z-index: 999;
        right:0;
        top: 0;
        height: 40rpx;
        width: 40rpx;
        padding: 20rpx;
    }
    .dialog{
        position:fixed ;
        height: 100%;
        width: 100%;
        background: rgba(0,0,0,0.6);
        top:0;
        left:0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    .dialog-content{
        width: 660rpx;
        position: relative;
        background: #fff;
        border-radius: 16rpx;
        max-height: 800rpx;
    }

    .sort{
        display: flex;
        padding: 20rpx;
        justify-content: space-around;
        font-family: PingFangSC-Medium;
        font-size: 26rpx;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
    }
    .sort .act{
        color: #FF5000;
    }
    .tuijin-bottom{
        display: flex;
        justify-content: space-between;
        padding-top: 10rpx;
    }
    .share-btn{
        font-family: PingFangSC-Medium;
        font-size: 26rpx;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        height: 52rpx;
        width: 148rpx;
        line-height: 52rpx;
        background-image: linear-gradient(-90deg, #FF5000 0%, #FF8800 100%);
        border-radius: 28rpx;
        margin-right: 20rpx;
    }
    .tuijin-tip{
        font-family: PingFangSC-Regular;
        font-size: 24rpx;
        color: #FF5000;
        letter-spacing: 0;
        padding: 3rpx 10rpx;
        border: 1rpx solid #FF5000;
        border-radius: 20rpx;
        margin-left: 20rpx;
    }
    .tuijin-list-title{
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin: 20rpx;
    }
    .tuijin-list-img{
        height:240rpx;
        width:240rpx;
        flex-shrink: 0;

    }
    .goods-box{
        display: flex;
        flex-wrap: wrap;
    }
    .tip-bf,.tip-money{
        font-family: PingFangSC-Regular;
        font-size: 20rpx;
        color: #FFFFFF;
        padding: 3rpx 10rpx;
        display: inline-block;
    }
    .tip-money{
        background: #FF5000;
        border-bottom-right-radius: 15rpx;
        border-top-right-radius: 15rpx;
    }
    .tip-bf{
        color: #FF5000!important;
        border-bottom-left-radius: 15rpx;
        border-top-left-radius: 15rpx;
        background: #FFF0EA ;
    }
    .ratio_tip{
        background: #FFF0EA;
        color: #FF5000;
        padding: 0 8rpx;
        border-radius: 4rpx;
        font-size: 20rpx;
    }
    .goods-name{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        color: #333333;
        letter-spacing: 0;
        padding: 10rpx;
    }
    .goods-list{
        flex-shrink: 0;
        width: 346rpx;
        height:500rpx;
        border-radius:15rpx;
        background:#fff;
        margin: 5rpx;
        overflow: hidden;
    }
    .content{
       background: #f3f5f7;
       padding-bottom: 98rpx;
        position: relative;
    }
    .full_screen_content{
        padding-bottom: 120rpx;
    }
    .center{
        padding: 170rpx 20rpx 0;
    }
    .centerNorecomen{
        padding: 20rpx 20rpx 0;
    }
    .ad{
        width: 100%;
        border-radius: 15rpx;
    }
    .tuijin-box{
        position: absolute;
        bottom: -143rpx;
        display: flex;
        overflow: auto;
        width: 730rpx;
    }
    .tuijin-list{
        display: flex;
        width: 680rpx;
        height: 240rpx;
        background:#fff;
        border-radius: 15rpx;
        flex-shrink: 0;
        overflow: hidden;
    }
    .tuijin-title{
        display: flex;
        justify-content: space-between;
        font-family: PingFangSC-Medium;
        font-size: 32rpx;
        color: #FFFFFF;
        padding-left: 20rpx;
        line-height: 40rpx;
        padding-top: 28rpx;
    }
    .laba{
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 24rpx;
        color: #FFFFFF;
    }
    .content-bottom{
        display: flex;
        justify-content:space-between;
        align-items:center;
        padding:10rpx 20rpx;
    }
    .tip-btn{
        font-family: PingFangSC-Regular;
        font-size: 22rpx;
        color: #333333;
        padding:5rpx 10rpx;
        background:#fff;
        border-radius: 20rpx;
    }
    .top-content{
        background: rgba(0,0,0,0.1);
        border-radius: 15rpx;
    }
    .top-box{
        padding:20rpx;
        position: relative;
        padding-bottom: 120rpx;
        background: #FF266E;
        padding-top: 0;
    }
    .no-top-box{
        padding:20rpx;
        position: relative;
        padding-bottom: 50rpx;
        background: #FF266E;
    }
    .swiper-box{
        width: 710rpx;
        height: 268rpx;
        margin:auto;
        border-radius: 16rpx;
        overflow: hidden;
    }
    .swiper-box1{
        width: 730rpx;
        height: 268rpx;
        margin:auto;
        overflow: hidden;
    }
    .right1{
        right: 20rpx;
    }
    .left1{
        left: 20rpx;
    }
    .right{
        margin-right: 20rpx;
        right: 20rpx;
    }
    .left{
        margin-left: 20rpx;
        left: 20rpx;
    }
    .swiper-img{
        width: 710rpx;
        height: 268rpx;
        border-radius: 16rpx;
    }
    .footer{
        position: fixed;
        background-color: #fff;
        bottom: 0;
        width: 750rpx;
        height: 98rpx;
        overflow: hidden;
        z-index: 999;
        box-shadow: 0 -1rpx 4rpx rgb(228, 228, 228);
    }
    .full_screen{
        height: 120rpx;
    }
    .foot_nav{
        margin: 15rpx 0 12rpx 0;
        display: inline-block;
        width: 50%;
        text-align: center;
    }
    .border_left{
        position: relative;
    }
    .border_left::after{
        content: '';
        position: absolute;
        display: block;
        height: 100%;
        width: 2px;
        left: 0;
        top: 0;
        background-color: #F3F5F7;
    }
    .foot_nav .img{
        height: 40rpx;
        width: 42rpx;
    }
    .nav_txt{
        font-size: 20rpx;
        line-height: 20rpx;
        color: #333;
    }
    /* 搜索栏 */
.homeTopSelect {
  /* height: 76rpx; */
  margin-bottom: 20px;
  position: relative;
}
.homeTopSelect .input {
  height: 63rpx;
  box-sizing: border-box;
  background: #f2f2f2;
  border-radius: 40px;
  padding-left: 71rpx;
  font-size: 26rpx;
  line-height: 63px;
  color: #999999;
}
.position {
  position: absolute;
}
.homeTopSelect .selectImg {
  width: 30rpx;
  height: 30rpx;
  left: 30rpx;
  top: 16rpx;
}
.orange_txt{
    color: #FF5000;
}
</style>
