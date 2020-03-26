<template>
    <div class="myCutPage" v-if="sku_list">
        <div class="topMsg" v-if="showTip&&notice_text!=''">
            <span class="tipIcon">
                <img class="img" src="/static/images/public/public_icon_tip02.png">
            </span>
            <span class="cutTip">{{notice_text}}</span>
            <span class="tipClose">
                <img class="img" @click="closeTip" src="/static/images/cutPrice/kan_tip_close.png" alt="">
            </span>
        </div>
        <div class="myCutLists" v-if="sku_list.data&&sku_list.data.length">
            <div class="listContent" v-for="(item, index) in sku_list.data" :key="index">
                <div class="statuImg">
                    <img v-if="item.status===2" class="img" src="/static/images/cutPrice/kan_state01.png" alt="">
                    <img v-else-if="item.status===3" class="img" src="/static/images/cutPrice/kan_state02.png" alt="">
                </div>
                <div class="title">乐商城</div>
                <div class="pdtCnt">
                    <div class="pdtImg">
                        <img class="img" @click="cutPrice(item.sku,item.goods_id)" :src="item.img_url" alt="">
                    </div>
                    <div class="pdtText">
                        <div class="pdtTitle"  @click="cutPrice(item.sku,item.goods_id)">{{item.name}}</div>
                        <div class="priceStatus">
                            <div v-if="item.status==2">
                                砍成价：<span class="orangeText"><money :money="item.current_price"></money>/件</span>
                            </div>
                            <div v-else-if="item.status==1">
                                <div>还可砍：<span class="orangeText"><money :money="item.still_cut_price"></money></span></div>
                                <div>底价：￥{{item.base_price}}</div>
                            </div>
                            <div v-else-if="item.status==3">
                                砍价失败
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn_groups" >
                    <div v-if="item.status==2">
                        <div class="btn" @click="gotoList()">查看更多</div>
                        <div class="btn btnHasColor" @click="gotoDetail(item)">砍价详情</div>
                    </div>
                    <div v-else-if="item.status==1">
                        <div class="timeDown">剩余时间 : <timedown :timeStamp="item.distance_end_time" :size="22"></timedown></div>
                        <div class="btn btnHasColor" @click="gotoDetail(item)">继续砍价</div>
                    </div>
                    <div v-else-if="item.status==3" @click="gotoList()" class="btn">查看更多</div>
                </div>
            </div>
        </div>
        <div class="soldOut" v-else>
            <div class="soldOutImg"><img mode="widthFix" class="img" src="/static/images/public/public_empty_pic.png" alt=""></div>
            <div class="soldtip">暂无订单，快去挑选砍价商品吧</div>
        </div>
    </div>
</template>
<script>
    import { getMyLeyouDetail } from "@/api";
    import money from '@/components/public/money'
    import timedown from '@/components/public/timeDown'
    export default {
        data(){
            return{
                current_page: 1,//当前页
                showTip: true,//是否显示顶部提示
                notice_text: '',//顶部提示内容
                sku_list: "",//商品数据对象
                downTimer: null
            }
        },
        components: {
            money,
            timedown
        },
        onShow(){
            this.current_page=1
            this.showTip = true;
            this.sku_list=""
            this.initMyCutPage();
        },
        onReachBottom(){
            if(this.current_page<this.sku_list.total/10){
                this.current_page++;
                getMyLeyouDetail({'page': this.current_page}).then(res => {
                    if(res.sku_list.data&&res.sku_list.data.length>0){
                        this.sku_list.data.push(res.sku_list.data);
                    }
                })
            }
        },
        computed:{

        },
        methods:{
            cutPrice(sku,goods_id){//开始砍价||继续砍价
                wx.navigateTo({
                    url:"/pages/cutprice/detailed/main?sku="+sku+"&goods_id="+goods_id
                })
            },
            gotoDetail(data){
                    wx.navigateTo({
                        url:'/pages/cutprice/cutShare/main?cut_id='+data.cut_id+'&goods_id='+data.goods_id
                    })
            },
            gotoList(){
                wx.navigateTo({
                    url:'/pages/cutprice/cutList/main'
                })
            },
            closeTip(){
                this.showTip = false;
            },
            initMyCutPage(){
                wx.showLoading({title: '加载中...',});

                getMyLeyouDetail({'page': this.current_page}).then(res =>{
                    wx.hideLoading()
                    this.notice_text = res.notice_text;
                    this.sku_list= res.sku_list;
                });
            }
        }
    }
</script>
<style scoped>
    .soldOut{
        width: 100%;
        text-align: center;
    }
    .soldOutImg{
        display: inline-block;
        margin-top: 152rpx;
        margin-bottom: 40rpx;
        width: 218rpx;
        /*height: 218rpx;*/
    }
    .soldtip{
        color: #333333;
        height: 80rpx;
        margin-bottom: 284rpx;
        font-size: 26rpx;
        line-height: 40rpx;
    }
    .myCutPage{
		width: 750rpx;
        min-height: 100%;
		background-color: rgb(243,245,247);
	}
    .topMsg{
        position: relative;
        display: flex;
		align-items: center;
        height: 64rpx;
        padding: 0 20rpx;
        background-color: #fff;
    }
    .tipIcon, .cutTip, .tipClose{
        display: inline-block;
    }
    .tipIcon{
        height: 30rpx;
        line-height: 30rpx;
        width: 30rpx;
    }
    .cutTip{
        vertical-align: super;
        height: 28rpx;
		line-height: 28rpx;
        font-size: 22rpx;
        color: #FAB400;
        margin-left: 13rpx;
    }
    .img{
        width: 100%;
        height: 100%;
    }
    .tipClose{
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        right: 20rpx;
        top:10rpx;
        z-index: 99;
    }
    .myCutLists{
        padding: 20rpx;
    }
    .listContent{
        position: relative;
        font-size: 26rpx;
        line-height: 32rpx;
        color: #333333;
        padding: 20rpx;
        background-color: #fff;
        margin-bottom: 20rpx;
        border-radius: 16rpx;
        overflow: hidden;
    }
    .statuImg{
        position: absolute;
        width: 84rpx;
        height: 84rpx;
        top: 0;
        right: 0;
        z-index: 99;
    }
    .listContent:last-child{
        margin-bottom: 0;
    }
    .title{
        font-weight: bold;
    }
    .pdtCnt{
        margin-top: 28rpx;
    }
    .pdtImg, .pdtText{
        display: inline-block;
        vertical-align: middle;
    }
    .pdtImg{
        width: 200rpx;
        height: 200rpx;
    }
    .pdtText{
        width: 450rpx;
        height: 200rpx;
        margin-left: 20rpx;
    }
    .pdtTitle{
        margin-bottom: 20rpx;
        line-height: 32px;
        height: 64rpx;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
    }
    .btn_groups{
        text-align: right;
    }
    .timeDown{
        display: inline-block;
        color: #FF5000!important;
        font-size: 22rpx;
    }
    .btn_groups .btn{
        text-align: center;
        display: inline-block;
        margin-left: 22rpx;
        width: 140rpx;
        height: 52rpx;
        line-height: 52rpx;
        border-radius: 30rpx;
        border: 1px solid #666;
    }
    .btnHasColor{
        color: #fff;
        background: -moz-linear-gradient(left, #FF8800, #FF5000);
		background: -webkit-linear-gradient(left, #FF8800, #FF5000);
		background: -o-linear-gradient(left, #FF8800, #FF5000);
        border: none !important;
    }
    .priceStatus{
        font-size: 22rpx;
    }
    .orangeText{
        color: #FF5000;
        font-weight: bold;
    }
</style>
