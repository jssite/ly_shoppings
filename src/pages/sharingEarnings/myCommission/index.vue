<template>
    <div class="page">
        <div class="header">
            <div class="cash1">
                <img class="wallet_icon" src="../image/share_money_icon_wallet.png" mode="widthFix">
                <div class="cash_box">
                    <div class="cash_txt">可提现佣金(元)</div>
                    <div class="cash_quota"><money :money="withdrawal_available"></money></div> 
                </div>
                <img class="toCash_btn" src="../image/share_money_button.png" alt="" mode="widthFix" @click="open">
            </div>
            <div class="diver"></div>
            <div class="cash2">
                <span class="all_account">累计到账佣金(元) </span>
                <span class="money_num"><money :money="withdrawal_total"></money></span>
                <span class="today_account">待到账佣金(元) </span>
                <span class="money_num"><money :money="withdrawal_today"></money></span>
            </div>
        </div>
        <div class="tab" :class="fixed?'fixed_tab':''">
            <div class="tab_btn" :class="page_type=='0'?'active':''" @click="clickTabs('0')">待到账</div>
            <div class="tab_btn" :class="page_type=='1'?'active':''" @click="clickTabs('1')">已到账</div>
            <div class="tab_btn" :class="page_type=='2'?'active':''" @click="clickTabs('2')">已失效</div>
        </div>
        <div class="tab_box" v-show="fixed"></div>
        <div class="show_empty" v-if="show_empty">
            <img class="empty_img" src="/static/images/public/public_empty_pic.png" alt=""  mode="widthFix">
            <div class="empty_txt">您还没有订单呢，赶紧去分享吧~</div>
        </div>
        <div class="main" :class="phonestyleShow?'full_screen_content':''" v-else>
            <div class="product_panel" v-for="(item, index) in list" :key="index">
                <div class="flex_box1">
                    订单编号: {{item.order_no}}
                </div>
                <div class="flex_box2">
                    <span>下单手机号: {{item.order_phone}}</span> 
                    <span>下单时间:  <timeformat :timeStamp="item.order_create_time"></timeformat></span>
                </div>
                <div class="prdt_list" v-for="(item1, index1) in item.product_list" :key="index1">
                    <div class="pdt_info">
                        <img class="pdt_img" :src="item1.main_image" alt="暂无图片" mode="widthFix">
                        <div class="pdt_cont">
                            <span class="title">{{item1.product_name}}</span>
                            <span class="pdt_num">×{{item1.quantity}}</span>
                        </div>
                    </div>
                    <div class="account_info">
                        <div>
                            <div class="info_type">实付款</div>
                            <div class="info_cont"><money :sign="money_sign" :money="item1.disbursements"></money></div>
                        </div>
                        <div>
                            <div class="info_type">佣金比例</div>
                            <div class="info_cont"><money :position="false" :sign="ratio_sign" :money="item1.commission_ratio*100"></money></div>
                        </div>
                        <div>
                            <div class="info_type" v-show="page_type=='0'">待到账金额</div>
                            <div class="info_type" v-show="page_type=='1'">已到账金额</div>
                            <div class="info_type" v-show="page_type=='2'">已失效金额</div>
                            <div class="info_cont orange_txt"><money :sign="money_sign" :money="item1.withdrawing"></money></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" :class="phonestyleShow?'full_screen':''">
            <div class="foot_nav" @click="funcGoToSharIndex">
                <img class="img" src="../image/share_tabbar_index_off.png" alt="" mode="widthFix">
                <div class="nav_txt">首页</div>
            </div>
            <div class="foot_nav border_left">
                <img class="img" src="../image/share_tabbar_money_on.png" alt="" mode="widthFix">
                <div class="nav_txt orange_txt">我的佣金</div>
            </div>
        </div>
        <div id="dialog" v-show="visibile" catchtouchmove='true'>
            <div class="dialog">
                <div class="dialog_content">小主，请移步乐友APP提现哦！</div>
                <div class="dialog_footer">
                    <span class="dialog_btn sure_btn" @click="toCash">去看看</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getOrderCommissionLists, getMyCommissionInfo } from '@/api/'
import timeformat from '@/components/public/timeFormat'
import money from '@/components/public/moneyFormat'
export default {
    data(){ 
        return{
            visibile: false,
            page_type: '0',//佣金类型
            cur_page: 1,//当前页数
            top: 0,
            fixed: false,
            list: [],
            isEnd: true,//是否有下一页
            withdrawal_total: '',
            withdrawal_available: '',
            withdrawal_today: '',
            show_empty: false,
            money_sign: '￥',
            ratio_sign: '%',
            phonestyleShow: false
        }
    },
    components: {
        timeformat,
        money
    },
    onLoad(){
        this.fixed = false;
        let query = wx.createSelectorQuery();
        let that = this;
        query.select('.tab').boundingClientRect(function (rect) {
            that.top = rect.top;
        }).exec();
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
        if(e.scrollTop>=this.top+12){
            this.fixed = true;
        }else{
            this.fixed = false;
        }
    },
    onShow(){
        this.visibile = false;
        this.withdrawal_total = 0;
        this.withdrawal_available = 0;
        this.withdrawal_today = 0;
        this.list = [];
        this.page_type = '0';
        this.cur_page = 1;
        wx.showLoading({title: '加载中...',});
        this.getLists();
    },
    onReachBottom(){
        if(!this.isEnd){
            this.cur_page += 1;
            wx.showLoading({title: '加载中...',});
            let param = {
                page_index: this.cur_page,
                page_size: '10',
                type: this.page_type
            }
            getOrderCommissionLists(param).then(res => {
                wx.hideLoading();
                this.list.concat(res.commission_order_list);
                this.isEnd = res.is_end;
            });
        }
    },
    methods:{
        funcGoToSharIndex(){
            wx.redirectTo({
                url:'/pages/sharingEarnings/sharingIndex/main'
            });
        },
        open(){//打开模态框
            this.visibile = true;
        },
        close(){//关闭模态框
            this.visibile = false;
        },
        toCash(){//提现
            this.visibile = false;
        },
        clickTabs(index){//佣金类型切换
            this.fixed = false;
            this.list = [];
            this.cur_page = 1;
            this.page_type = index;
            this.show_empty = false;
            this.getLists();
        },
        getLists(){
            wx.showLoading({title: '加载中...',});
            let param = {
                page_index: this.cur_page,
                page_size: '10',
                type: this.page_type
            }
            getOrderCommissionLists(param).then(res => {
                wx.hideLoading();
                this.list = res.commission_order_list;
                this.isEnd = res.is_end;
                if(this.list&&this.list.length){
                    this.show_empty = false;
                }else{
                    this.show_empty = true;
                }
                this.getMoneyInfo();
            });
        },
        getMoneyInfo(){
            getMyCommissionInfo().then(res => {
                wx.hideLoading();
                this.withdrawal_total = res.withdrawal_total;
                this.withdrawal_available = res.withdrawal_available;
                this.withdrawal_today = res.withdrawal_today;
            });
        }
    }
}
</script>

<style scoped>
    .page{
        position: relative;
        width: 750rpx;
		min-height: 100%;
		background-color: rgb(243,245,247);
    }
    .header{
        height: 260rpx;
        padding-right: 20rpx;
        padding-left: 28rpx;
        background: -webkit-linear-gradient(left, rgb(245,230,174), rgb(239,187,93)); 
        background: -o-linear-gradient(right, rgb(245,230,174), rgb(239,187,93)); 
        background: -moz-linear-gradient(right, rgb(245,230,174), rgb(239,187,93)); 
        background: linear-gradient(to right, rgb(245,230,174), rgb(239,187,93)); 
    }
    .cash1{
        display: flex;
        align-items: center;
        padding: 40rpx 0;
    }
    .wallet_icon{
        height: 96rpx;
        width: 88rpx;
        margin-right: 20rpx;
    }
    .cash_box{
        width: 444rpx;
    }
    .cash_txt{
        font-size: 24rpx;
        line-height: 30rpx;
        color: #6A3523;
        font-weight: bold;
    }
    .cash_quota{
        font-size: 60rpx;
        color: #6A3523;
        line-height: 64rpx;
        font-weight: bold;
    }
    .toCash_btn{
        height: 68rpx;
        width: 180rpx;
    }
    .diver{
        height: 2rpx;
        background-color: #6A3523;
        opacity: 0.06;
    }
    .cash2{
        color: #6A3523;
        margin-top: 17rpx;
    }
    .all_account, .today_account{
        font-size: 20rpx;
        vertical-align: middle;
    }
    .today_account{
        margin-left: 40rpx;
    }
    .cash2 .money_num{
        font-size: 34rpx;
        vertical-align: middle;
        font-weight: bold;
    }
    .tab{
        height: 88rpx;
        background-color: #fff;
        margin-bottom: 20rpx;
    }
    .tab_box{
        height: 108rpx;
        width: 100%;
    }
    .fixed_tab{
        position: fixed;
        height: 64rpx;
        top: 0;
        width: 100%;
    }
    .tab_btn{
        position: relative;
        display: inline-block;
        width: 33.3%;
        text-align: center;
        color: #333333;
        font-size: 30rpx;
        padding-top: 24rpx;
        line-height: 64rpx;
    }
    .fixed_tab .tab_btn{
        padding-top: 0;
    }
    .active{
        color: #FF5000;
    }
    .active::before{
        content: '';
        position: absolute;
        display: block;
        width: 110rpx;
        height: 4rpx;
        background-color: #FF5000;
        left: 50%;
        bottom: -2rpx;
        transform: translateX(-50%);
    }
    .show_empty{
        text-align: center;
    }
    .main{
        padding: 0 20rpx;
        padding-bottom: 98rpx;
    }
    .full_screen_content{
        padding-bottom: 120rpx;
    }
    .empty_img{
        margin-top: 25%;
        width: 266rpx;
        height: 222rpx;
    }
    .empty_txt{
        font-size: 26rpx;
        margin-top: 20rpx;
        color: #333;
    }
    .product_panel{
        margin-bottom: 20rpx;
        background-color: #fff;
        border-radius: 16rpx;
        padding: 0 20rpx;
        padding-top: 28rpx;
        padding-bottom: 10rpx;
    }
    .flex_box1, .flex_box2{
        display: flex;
        justify-content: space-between;
    }
    .flex_box1{
        font-size: 26rpx;
        color: #333333;
        line-height: 32rpx;
        margin-bottom: 16rpx;
        font-weight: bold;
    }
    .flex_box2{
        font-size: 22rpx;
        color: #999999;
        line-height: 26rpx;
        margin-bottom: 24rpx;
    }
    .prdt_list{
        overflow: hidden;
        background-color: #F8F8F8;
        padding: 0 20rpx;
        margin-bottom: 10rpx;
    }
    .pdt_info{
        display: flex;
		align-items: center;
        height: 140rpx;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #eee;
    }
    .pdt_img{
        height: 140rpx;
        width: 140rpx;
        border-radius: 8px;
        overflow: hidden;
    }
    .pdt_cont{
        width: 510rpx;
        height: 140rpx;
        margin-left: 20rpx;
    }
    .pdt_cont .title{
        width: 370rpx;
        font-size: 26rpx;
        height: 64rpx;
        line-height: 32rpx;
        color: #333333;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        float: left;
    }
    .pdt_num{
        float: right;
        width: 100rpx;
        height: 64rpx;
        line-height: 64rpx;
        text-align: right;
        font-size: 26rpx;
        color: #333333;
    }
    .account_info{
        display: flex;
		align-items: center;
        justify-content: space-around;
        padding: 20rpx;
        height: 70rpx;
        overflow: hidden;
    }
    .info_type{
        font-size: 22rpx;
        color: #999999;
        line-height: 26rpx;
        margin-bottom: 8rpx;
    }
    .info_cont{
        font-size: 26rpx;
        line-height: 32rpx;
        color: #333333;
        font-weight: bold;
    }
    .info_cont, .info_type{
        text-align: center;
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
    .orange_txt{
        color: #FF5000;
    }
    #dialog{
        position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		z-index: 9999;
        overflow: hidden;
    }
    .dialog{
        position: absolute;
        width: 590rpx;
        background-color: #fff;
        border-radius: 16rpx;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
    .dialog_content{
        padding: 60rpx 0;
        font-size: 30rpx;
        color: #333333;
        text-align: center;
    }
    .dialog_footer{
        display: flex;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        border-top: 1rpx solid #eee;
    }
    .dialog_footer .dialog_btn{
        flex: 1;
        font-size: 30rpx;
        color: #333333;
        width: 100%;
        font-weight: bold;
    }
    .dialog_footer .sure_btn{
        color: #FF5000;
    }
</style>
