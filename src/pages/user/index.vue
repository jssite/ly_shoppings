<template>
    <div class="user">
        <!-- 顶部 -->
        <div class="userHeader">
            <template v-if="notToken">
                <span v-for="item in userDataList.user_tags" :key="item">
                    <img src="/static/images/userCenter/userhead.png" class="headertitle" v-if="item == 3">
                    <img src="/static/images/userCenter/userheadle.png" v-if="item == 4" class="headerLe">
                </span>
            </template>
           <!-- <img src="/static/images/userCenter/userqiye.png" class="headerLe"> -->
           <template v-if="notToken">
               <template v-if="userDataList.avatar">
                   <img class="userheadImg" :src="userDataList.avatar"  alt="">
               </template>
               <template v-else>
                   <img class="userheadImg" src="/static/images/photo_user.png"  alt="">
               </template>

           </template>
           <template v-else>
               <img class="userheadImg" @click.stop="userLogin" src="/static/images/photo_user.png"  alt="">
           </template>
           <div :class="['userDasicinfo', {'usernotLoginTop':!notToken}]">
               <span v-if="!notToken" class="userLogin" @click.stop="userLogin">登录/注册</span>
               <div class="userTopheadImg" v-if="notToken">
                    <div class="userName">{{userDataList.nick_name}}</div>
                    <img v-if='usergoodsvip' @click="gotoVIP" class="userTopvip" src="/static/images/userCenter/userterVIP.png" alt="">
                    <img v-if="lexiangVip" class="userTopvip"  src="/static/images/userCenter/price_vipicon_other_le.png" alt="">
               </div>

               <span v-if="notToken" class="userAge" @click="gotoBabyInfo">{{userDataList.baby_file}}</span>
               <!-- <img  v-if="notToken" class= 'userAgeImg' src="/static/images/userCenter/userbaby.png" alt=""> -->
           </div>
           <div class="userSetinfo">
               <div class="userSetinfo_topImg">
                    <img class= 'userSetToolImg' @click.stop="gotoSetUset" src="/static/images/userCenter/usertool.png">
                    <img class= 'userSetVipImg' @click.stop="gotoCode()" src="/static/images/userCenter/uservip.png">
               </div>
               <img  class="userSetinfo_vipImg" @click="gotoaddVIP" src="/static/images/userCenter/user_vipcard_buy_le.png">
           </div>
        </div>

        <!-- 我的订单 -->
        <div v-if="notToken" class="userContent orderfixed">
            <div class="userContetnName orderBox" @click.stop="funcGoList(0)">
                <span>我的订单</span>
                <div  style="display: flex;align-items: center;">
                    <span class="ordermore">全部订单</span>
                    <img class="ordermoreimg" src="/static/goodsdetail/lecard_arrow_right.png">
                </div>
            </div>
            <div class="userContentdel">
                <div @click.stop="funcGoList(index + 1)" class="userContentdata" v-for="(item,index) in orderList" :key='index'>
                    <img class="img" :src="item.src" alt="">
                    <span class="text2">{{item.name}}</span>
                    <div v-if="item.orderNum!=0" class="redorb">{{item.orderNum}}</div>
                </div>
            </div>
            <div class="userexpress" v-if="userDataList.newest_express" @click.stop="gotoGsLocation">
                <div class="expressTime">
                    <span class="font22">最新物流</span>
                    <span class="font22">{{usergoodsmessage.express_time}}</span>
                </div>
                <div class="expresssInfo">
                    <img class="exprssInfoIMG" :src="usergoodsmessage.product_imgs[0]" alt="">
                    <div>
                        <div class="expresscomtent" v-if="expess_status_icon.length">
                            <img class="comImg" :src= expess_status_icon[1]>
                            <span class="font26">{{expess_status_icon[0]}}</span>
                        </div>
                        <span v-if="usergoodsmessage.express_desc" class="font24">{{usergoodsmessage.express_desc}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!notToken" class="userContent orderfixed">
            <div class="userContetnName orderBox" @click.stop="userLogin">
                <span>我的订单</span>
                <div  style="display: flex;align-items: center;">
                    <span class="ordermore">全部订单</span>
                    <img class="ordermoreimg" src="/static/goodsdetail/lecard_arrow_right.png">
                </div>
            </div>
            <div class="userContentdel">
                <div @click.stop="userLogin" class="userContentdata" v-for="(item,index) in orderList" :key='index'>
                    <img class="img" :src="item.src" alt="">
                    <span class="text2">{{item.name}}</span>
                </div>
            </div>
        </div>
        <!-- 未登录显示 -->
        <div v-if="!notToken" class="information">
            <div class="information_Box" @click="funcAboutUrl">
                <span class="info_name">关于乐友</span>
                <img  class="info_moreimg" src="/static/goodsdetail/lecard_arrow_right.png">
            </div>
            <div class="information_Box" @click="funcCallPhone">
                <span class="info_name" style="width:440rpx;">客服电话(09:00-18:00)</span>
                <span>400-666-9888</span>
                <img  class="info_moreimg" src="/static/goodsdetail/lecard_arrow_right.png">
            </div>
            <div class="information_Box">
                <span class="info_name" style="width:550rpx;">当前版本</span>
                <span>4.5.6</span>
                <img  class="info_moreimg" src="/static/goodsdetail/lecard_arrow_right.png">
            </div>
        </div>
        <!-- 登录内容 -->
        <div v-if="orderListAll">
            <!-- 我的钱包 -->

            <img @click.stop="funcGoAngle" v-if="userDataList.shop_url" src="/static/images/user_angel_pic.png" class="angele_vip marginTop192" :class="{'marginTop377':userDataList.newest_express}" />

            <div :class="['userContent',{'marginTop192':!userDataList.shop_url},{'marginTop377':(userDataList.newest_express && !userDataList.shop_url)}]">
                
                <div class="userContetnName">我的钱包</div>
                <div class="userContentdel">
                    <div class="userContentdata" @click.stop="gotoCoupon">
                        <span class="text1">{{userDataList.coupon_num}}</span>
                        <span class="text2">优惠券</span>
                    </div>

                    <div class="userContentdata" @click.stop="gotoPointShop">
                        <span class="text1">{{userDataList.points}}</span>
                        <span class="text2">积分</span>
                    </div>

                    <div class="userContentdata">
                        <span class="text1">{{userDataList.balance}}</span>
                        <span class="text2">余额</span>
                    </div>

                    <div class="userContentdata" @click.stop="gotoLeVip">
                        <span class="text1">{{userDataList.back_cash_balance || '0.00'}}</span>
                        <span class="text2">乐享返现</span>
                    </div>
                </div>
            </div>
            <!-- 百宝箱 -->
            <div class="userContent">
                <div class="userContetnName">百宝箱</div>
                <div class="userContentdel" v-if="toolBoxList[1001]">
                    <div class="userContentdata" v-for="(item,index) in toolBoxList[1001]" @click.stop="onUserContent(item.link,item.title)" v-if="item.title!='投诉建议'" :key='index' >
                        <img class="img" :src="item.url[0]" alt="">
                        <span class="text2">{{item.title}}</span>
                    </div>
                </div>
            </div>
            <!-- 精品推荐 -->
            <div class="userContent" v-if="toolBoxList[1002]&&toolBoxList[1002].length">
                <div class="userContetnName">精选推荐</div>
                <div class="userContentdel">
                    <div class="userContentdata" v-for="(item,index) in toolBoxList[1002]" @click.stop="onUserContent(item.link)"  :key='index'>
                        <img class="img" :src="item.url[0]" alt="">
                        <span class="text2">{{item.title}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 推荐图片 -->
        <div class="recommendImg" v-if="advertList.url" @click="funcGoToH5">
            <img class="recommendImg_img" mode="widthFix" :src="advertList.url">
        </div>
        <!-- 猜你喜欢 -->
        <div style="margin-top:10rpx;">
            <promote-title :title_aaa_bbb="'猜你喜欢'"></promote-title>
        </div>
        <div class= 'resemble' >
            <likeGood :mainData="item" v-for="(item,index) in likeData" :key="index"></likegood>
        </div>
        <div class="weui-loadmore">
            <div v-if="!bottom" class="weui-loading"></div>
            <div class="weui-loadmore__tips">{{bottom?"已经到底啦":"正在加载..."}}</div>
        </div>
    </div>
</template>

<script>
	import likeGood from '@/components/public/likeGood';
    import promoteTitle from '@/components/product/promote/title';
    import { getUserinfo , getLikeInfo,getAdverInfo,getFunctional} from '@/api';
    const app = getApp();
    export default {
        components:{
            likeGood,
            promoteTitle
        },

        computed: {
            expess_status_icon () {
                let expressinfo = [];
                if (this.usergoodsmessage) {
                    let tag = this.usergoodsmessage.express_tag;
                    let imgurl = '';
                    let text = '';
                    if (tag == 0) {
                        text = '出库中';
                        imgurl = '/static/images/userCenter/user_express_icon01.png';
                    } else if (tag == 1) {
                        text = '已揽件';
                        imgurl = '/static/images/userCenter/user_express_icon01.png';
                    } else if (tag == 2) {
                        text = '运输中';
                        imgurl = '/static/images/userCenter/user_express_icon02.png';
                    } else if (tag == 3) {
                        text = '派件中';
                        imgurl = '/static/images/userCenter/user_express_icon03.png';
                    } else if (tag == 4) {
                        text = '已签收';
                        imgurl = '/static/images/userCenter/user_express_icon04.png';
                    } else if (tag == 10) {
                        text = '待接单';
                        imgurl = '/static/images/userCenter/user_express_icon05.png';
                    } else if (tag == 11) {
                        text = '骑手已接单';
                        imgurl = '/static/images/userCenter/user_express_icon06.png';
                    } else if (tag == 12) {
                        text = '派件中';
                        imgurl = '/static/images/userCenter/user_express_icon03.png';
                    } else if (tag == 13) {
                        text = '已签收';
                        imgurl = '/static/images/userCenter/user_express_icon04.png';
                    } else {
                        text = '出库中';
                        imgurl = '/static/images/userCenter/user_express_icon01.png';
                    }
                    expressinfo = [text, imgurl];
                }
                return expressinfo;
            },

        },


        data(){
            return{
                lexiangVip:false,
                usergoodsvip:false,
                orderListAll:false,//数据加载完毕再显示我的订单
                advertList:{},  //广告图片
                notToken:false,
                bottom:false,  //是否到底
                page_index:0,  //页数
                page_size:10,  //个数
                likeData:[],   //获取数据
                count:10,    //总页数
                userDataList:{},
                usergoodsmessage:{},   //物流信息
                orderList:[
                    {src:'/static/images/userCenter/order1.png',name:'待支付'},
                    {src:'/static/images/userCenter/order2.png',name:'待收货'},
                    {src:'/static/images/userCenter/order3.png',name:'待评价'},
                    {src:'/static/images/userCenter/order4.png',name:'退货/售后'},
                ],   //我的订单
                toolBoxList:[],   //百宝箱+精品推荐
                recommendList:[
                    {src:'/static/images/userCenter/rec1.png',name:'乐活动'},
                    {src:'/static/images/userCenter/rec2.png',name:'乐妈圈'},
                    {src:'/static/images/userCenter/rec3.png',name:'宝宝装扮'},
                    {src:'/static/images/userCenter/rec4.png',name:'育学园会员'},
                    {src:'/static/images/userCenter/rec5.png',name:'购物全免单'},
                    {src:'/static/images/userCenter/rec6.png',name:'养育指南'},
                ],   //精品推荐
                imgUrls: [
                    "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640",
                    "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640",
                    "https://images.unsplash.com/photo-1551446591-142875a901a1?w=640"
                ],
            }
        },
        onLoad(){
            // this.sa_page(this,false,'个人中心','');
            wx.showLoading({title: '正在加载中',mask:true})
            // this.funUserinfo();

            this.getMore();

        },
        onShow(){
            let tokenId = wx.getStorageSync('token')
            if(tokenId){
                wx.showLoading({title: '正在加载中',mask:true})
                this.notToken = true
                this.funUserinfo(); //调取用户信息
                //调取百宝箱接口
                this.getToolBoxList();
                // this.getMore();
                this.advert();
            }
             this.getMore();

        },
        methods:{
            funcGoToH5(){
                wx.setStorageSync('urlH5', this.advertList.link);
                wx.navigateTo({
                    url:'/pages/transferH5/main'
                })
            },
            funcCallPhone(){
                wx.makePhoneCall({
                    phoneNumber: '400-666-9888'
                })
            },
            funcAboutUrl(){
                let appinfo = wx.getStorageSync('appInfo');
                wx.setStorageSync('urlH5', appinfo.about_url);
                wx.navigateTo({
                    url:'/pages/transferH5/main'
                })
            },
            getToolBoxList(){
                 getFunctional({}).then(res=>{  //获取列表
                    this.toolBoxList= res.functional_list;
                 })
            },
            gotoBabyInfo() {
                let link =  this.userDataList.baby_file_url;
                wx.setStorageSync('urlH5', link);
                wx.navigateTo({
                    url:'/pages/transferH5/main'
                });
            },
            funcGoAngle() {
                let link =  this.userDataList.shop_url;
                wx.setStorageSync('urlH5', link);
                wx.navigateTo({
                    url:'/pages/transferH5/main'
                });
            },
            gotoCode(){
                let token = wx.getStorageSync('token');
                if( token ){
                    wx.navigateTo({url: `/pages/userCenter/barcode/main`})
                } else {
                    this.userLogin();
                }

            },
            userLogin(){ //用户去登录
                wx.navigateTo({url: `/pages/userCenter/login/wxLogin/main`})
            },
            gotoCoupon(){ //去优惠卷
                wx.navigateTo({url: `/pages/userCenter/coupon/main`})
            },
            gotoPointShop(){ //跳转积分商城
                // wx.setStorageSync('urlH5', 'https://m.leyou.com.cn/benefits?page=integral');
                // wx.navigateTo({
                //     url:'/pages/transferH5/main'
                // })
            },
            gotoLeVip() {
                let url = 'https://app.leyou.com.cn/activity/joyCard';
                this.gotoH5page(url+'?is_mini=1&token='+wx.getStorageSync('token')+'&isRefresh=1')
            },
            gotoSetUset(){ //去用户设置页面
                let token = wx.getStorageSync('token');
                if(token){
                    wx.navigateTo({url: `../../pages/userCenter/setting/main`})
                } else {
                    this.userLogin();
                }

            },
             funUserinfo(){ //获取用户信息
                getUserinfo().then(res=>{

                    wx.setStorageSync('userinfo',res) //缓存用户信息
                    this.userDataList = res;
                    res.avatar = res.avatar ==''?'/static/goodsdetail/default_pic_user.png':res.avatar.indexOf('gif')>-1?'/static/goodsdetail/default_pic_user.png':res.avatar
                    // console.log(this.userDataList,'123456')
                    res.user_tags.map(r=>{
                        console.log(r)
                        if(r==4){
                            this.lexiangVip = true;
                        }
                        if(r==3){
                            this.usergoodsvip = true;
                        }
                    })
                    if(res.newest_express){
                        this.usergoodsmessage = res.newest_express[0]  //物流信息
                    }
                    this.orderList[0].orderNum = res.paying_num>99?'99+':res.paying_num;//待支付订单
                    this.orderList[1].orderNum = res.receiving_num>99?'99+':res.receiving_num; //待收货
                    this.orderList[2].orderNum = res.evaluating_num>99?'99+':res.evaluating_num;   //待评价订单数
                    this.orderList[3].orderNum = res.sale_after_num>99?'99+':res.sale_after_num;  //售后服务订单数
                    this.orderListAll = true;
                    wx.hideLoading();
                })
             },
             getMore(){ //获取更多相似商品
                 if(this.count<this.page_index+this.page_size){
                    this.bottom = true;
        			return false
        		}
        		getLikeInfo({page_index:this.page_index,page_size:this.page_size,is_daguan_data:1}).then(res=>{
        			this.count=res.count
	        		this.likeData=this.likeData.concat(res.product_list)
                    this.page_index+=this.page_size;
                    wx.hideLoading();
        		})
             },
             funcGoList(index) {
                 if(index==4){
                     wx.navigateTo({url:'/pages/confirm/customerService/main'})
                 }else{
                    let url = "/pages/confirm/list/main?order_status=" + (index + 1);
                    wx.navigateTo({
                        url:url
                    });
                 }
            },
            onUserContent(url,tit){ //百宝箱点击 edit by feng
                if(tit=='收藏夹'){
                     wx.navigateTo({
                        url:'/pages/userCenter/mycollect/main'
                    })
                }else{
                    //判断是否是原生页
                    console.log(url+'?is_mini=1&token='+wx.getStorageSync('token'));
                    if(url.indexOf('?') < 0 ){
                        this.gotoH5page(url+'?is_mini=1&token='+wx.getStorageSync('token'));
                    } else {
                        this.gotoH5page(url+'&is_mini=1&token='+wx.getStorageSync('token'));
                    }

                }
            },
            advert(){ //中间广告
                getAdverInfo().then(res=>{
                    if(res.ad_list){
                    res.ad_list.forEach((res,index) => {
                        if(res.type == '10011003'){
                        this.advertList = res;
                    }
                 });
                    }

                    console.log(this.advertList);
                })
            },
            gotoaddVIP(){ //点击乐享卡
                //判断是否登录
                let token = wx.getStorageSync('token');
                if(token){
                    let url = wx.getStorageSync('appInfo').le_vip_info_url;
                    this.gotoH5page(url+'? is_mini=1&token='+wx.getStorageSync('token'));
                } else {
                    this.userLogin();
                }
            },
            gotoH5page(url){ //跳转到中转页面
                // http://app.leyou.com.cn/activity/joyCard?isRefresh=1&token=dfcd5c3537e52cab7ca44151f122288f
                console.log(url)
                wx.setStorageSync('urlH5', url);
                wx.navigateTo({url:'/pages/transferH5/main'})
            },
            gotoGsLocation(){ //跳转物流地址
                console.log(this.usergoodsmessage)
                wx.setStorageSync('usercenterLocation',this.usergoodsmessage)
                wx.navigateTo({url:'/pages/userCenter/logisticMsg/main?usercenter=true'})
            },
            gotoVIP(){ //去VIP页面 H5
                let url = wx.getStorageSync('appInfo').vip_info_url + '?token='+ wx.getStorageSync('token');
                wx.setStorageSync('urlH5', url);
                wx.navigateTo({url:'/pages/transferH5/main'})
            },
            
        },
        onReachBottom(){ //加载更多数据
            this.getMore()
            // console.log(12345679)
        },
        onHide(){
            this.likeData=[];
        }, // 生命周期函数--监听页面隐藏
        onUnload(){
        } //生命周期函数--监听页面卸载
    }
</script>

<style scoped>
/* 未登录显示 */
.userLogin{
    font-size: 34rpx;
}
.userHeader .usernotLoginTop{
    margin-top: 95rpx !important;
}
.information{
    margin: 200px 20px 0 20px;
    font-size: 26px;
    color: #333333;
    background: #ffffff;
    width: 710rpx;
    border-radius: 16px;
    overflow: hidden;
}
.information_Box{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    line-height: 88rpx;
    border-bottom: 1rpx solid #f3f5f7;
    background: #fff;
    font-size: 26rpx;
    color: #333333;
}

.angele_vip {
    margin: 19rpx 20rpx 0rpx 20rpx;
    width: 710rpx;
    height: 100rpx;
    box-sizing: border-box;
    border-radius: 10rpx;
}


.information_Box .info_moreimg{
    width: 12rpx;
    height: 22rpx;
    margin-right: 20rpx;
}
.information_Box  .info_name{
    margin-left: 20rpx;
    font-size: 26rpx;
    color: #333333;
}

/* 相似 */
.resemble{
    padding-top: 6px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.userName{
    max-width: 260rpx;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}

/* 我的订单 */
.orderfixed{
    position: absolute;
    top: 225rpx;
    overflow: hidden;
}
.orderBox{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.ordermore{
    font-size: 24px;
    color: #999999;
}
.ordermoreimg{
    margin-left: 10rpx;
    width: 12rpx;
    height: 22rpx;
    margin-right: 20rpx;
}
.redorb{
    background: #FF5000;
    border: 2px solid #FFFFFF;
    border-radius: 50%;
    font-size: 24px;
    color: #FFFFFF;
    text-align: center;
    line-height: 34rpx;
    height: 34rpx;
    min-width: 34rpx;
    position: absolute;
    top: 8rpx;
    right: 45rpx;
}
/* 订单下物流信息 */
.userexpress{
    height: 144rpx;
    width: 662rpx;
    margin-left: 20rpx;
    background: #F6F6F6;
    border-radius: 16px;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
}
.userexpress .expressTime{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.userexpress .expresssInfo{
    display: flex;
    align-items: center;
}
.userexpress .expresssInfo .exprssInfoIMG{
    height: 68rpx;
    width: 68rpx;
    border-radius: 16rpx;
    margin: 20rpx;
}
.userexpress .expresssInfo .expresscomtent{
    display: flex;
    align-items: center;
    /* margin-bottom: 20rpx; */
}
.userexpress .expresssInfo .expresscomtent .comImg{
    height: 32rpx;
    width: 32rpx;
    margin-right: 12rpx;
}
.font26{
    font-size: 26rpx;
    color: #0D96FD;
}
.font24{
    font-size: 24rpx;
    color: #999999;
    width: 544rpx;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    display: block;
}
.font22{
    font-size: 22rpx;
    color: #999999;
    margin-top: 20rpx;
    margin-left: 20rpx;
    margin-right: 20rpx;
}


/* 我的钱包 */
.userContent{
    width: 710rpx;
    margin-left: 20rpx;
    background: #ffffff;
    border-radius: 16rpx;
    margin-top: 20rpx;
}
.marginTop377{
    margin-top: 377rpx !important;
}
.marginTop192{
    margin-top: 192rpx;
}
.userContent .userContetnName{
    font-size: 26px;
    height: 74rpx;
    line-height: 74rpx;
    padding-left: 20rpx;
    box-sizing: border-box;
    /* box-sizing: content-box; */
    border-bottom: 1rpx solid #f3f5f7;
}
.userContent .userContentdel{
    display: flex;
    align-items: center;
    /* justify-content:space-between; */
    flex-wrap: wrap;
    text-align: center;
}
.userContent .userContentdel .userContentdata{
   width: 177.5rpx;
   display: flex;
   flex-direction: column;
   align-items: center;
   position: relative;
}
.userContent .userContentdel .userContentdata .text1{
    margin-top: 28rpx;
    font-size: 34rpx;
    font-weight: 700;
}
.userContent .userContentdel .userContentdata .text2{
    font-size: 24rpx;
    margin-top: 26rpx;
    margin-bottom: 28rpx;
}
.userContent .userContentdel .userContentdata .img{
    height: 50rpx;
    width: 50rpx;
    margin-top: 28rpx;
}
/* 推荐图片 */
.recommendImg{
    width: 710rpx;
    margin-left: 20rpx;
    /* height: 178rpx; */
    margin-top: 20rpx;
    /* border-radius: 16rpx; */
}
.recommendImg_img {
    width: 100%;
    display: block;
}

/* 顶部 */
.headertitle{
    position: absolute;
    top: 50rpx;
    left: 36rpx;
    height: 36rpx;
    width: 44rpx;
    transform: rotate(-8deg)
}
.headerLe{
    position: absolute;
    top: 150rpx;
    left: 125rpx;
    height: 30rpx;
    width: 30rpx;
}

.userHeader{
    height: 305rpx;
    width: 750rpx;
    display: flex;
    background: #FFD232;
}
.userHeader .userheadImg{
    height: 119rpx;
    width: 119rpx;
    margin-left: 43rpx;
    margin-top: 65rpx;
    margin-right: 24rpx;
    border-radius: 50%;
}

.userTopheadImg{
    display: flex;
    align-items: center;
}

.userTopvip{
    width: 46rpx;
    height: 20rpx;
    margin-left: 10rpx;
}

.userHeader .userDasicinfo{
    height: 119rpx;
    width:400rpx;
    margin-top: 75rpx;
}
.userHeader .userDasicinfo .userAge{
    font-size: 26px;
    margin-top: 12rpx;
    vertical-align: middle;
}
.userHeader .userDasicinfo .userAgeImg{
    height: 30rpx;
    width: 30rpx;
    vertical-align: middle;
    margin-left: 7rpx;
}
.userAgeImg{
    height: 20rpx;
    width: 20rpx;
}
.userHeader .userSetinfo{
    display: flex;
    flex-direction: column;
}
.userSetinfo .userSetinfo_topImg{
    display: flex;
    align-items: center;
    margin-top: 17rpx;
}
.userSetToolImg{
    height: 69rpx;
    width: 55rpx;
     margin-left: 20rpx;
}
.userSetVipImg{
    height: 69rpx;
    width: 55rpx;
    margin-left: 40rpx;
}
.userSetinfo_vipImg{
    height: 155rpx;
    width: 165rpx;
    margin-top: 45rpx;
    margin-left: 20rpx;
 -webkit-transform: translate(-50%, 0);
  -ms-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  -webkit-animation: upDown_anim 8s ease-in-out infinite;
  animation: upDown_anim 8s ease-in-out infinite;
}
@-webkit-keyframes upDown_anim {
  0%, 100% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  50% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
  }
}
@keyframes upDown_anim {
  0%, 100% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  50% {
    -webkit-transform: translate(0, 10px);
    transform: translate(0, 10px);
  }
}

.user{
    font-family: PingFangSC-Regular;
    font-size: 36px;
    color: #333333;
    letter-spacing: 0;
    background: #f3f5f7;
}
</style>
