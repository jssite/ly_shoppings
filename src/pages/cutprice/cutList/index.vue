<template>
	<div  class="cutList" :class="hasCutProduction?'haslists':'nolists'">
		<div v-if="goods_list">
			<div class="cutHeader">
				<!--<swiper class="displayTips" autoplay="true" vertical="true" circular="true" interval="2000">-->
					<!--<swiper-item v-for="item in  buyer_messages" :key="index">-->
						<!--<span class="userImg"><img class="img" :src="item.avatar"></span>-->
						<!--<span class="displayTxt">-->
						<!--{{item.text}}-->
											<!--</span>-->

					<!--</swiper-item>-->

				<!--</swiper>-->
				<swiper class="swiper-box"
						v-if="banners&&banners.length"
						circular="true"
						:indicator-dots="banners.length===1?false:true"
						:autoplay="autoplay"
						:interval="interval"
						:indicator-color="indColor"
						:indicator-active-color="indColor_active"
						:duration="duration">
					<block v-for="(item, index) in banners" :key="index">
						<swiper-item>
							<image mode="aspectFill"  :src="img_config+'/'+item.image" class="slide-image" @click="clickBanner(item.url)"/>
						</swiper-item>
					</block>
				</swiper>
			</div>
			<div class="cutRulesBar_box">
				<div id="cutRulesBar" class="cutRulesBar" >
				<span class="cutTimer">
					<span class="cutTxt">距离本场砍价结束仅剩</span><!-- 本场砍价已结束-->
					<span class="cutendDay" v-if="d!='00'">{{d}}天 </span>
					<span class="cutEndTimer">{{h}}</span> :
					<span class="cutEndTimer">{{m}}</span> :
					<span class="cutEndTimer">{{s}}</span>
				</span>
					<span class="cutRule" @click="showRule()">
					砍价规则
				</span>
				</div>
			</div>
			<div class="cutContent">
				<div v-if="hasCutProduction" class="listContent"><!-- v-if="hasCutProduction"-->
					<div class="cutPdtLists" v-for="(item, index) in goods_list.data" :key="index">
						<div class="imgBox">
							<img class="img" mode="aspectFill" @click="cutPrice(item.sku,item.goods_id)" :src="item.img_url">
						</div>
						<div class="pdtTxt">
							<div class="pdtTitle"  @click="cutPrice(item.sku,item.goods_id)">{{item.name}}</div>
							<div class="startPrice" >开砍价:￥<span class="line-through">{{item.price}}</span></div>
							<div class="lowPrice">
								<span v-if="item.already_cut_price>0" class="tip1">08:08:08 后结束</span>
								<span v-else class="tip2">底价：<span class="orangeText"><money :iSize="30" :money="item.base_price"></money>/件</span></span>
								<span class="cut_btn" @click="cutPrice(item.sku,item.goods_id)" :class="isCutTimeEnd?'btn_disabled':''">{{isCutTimeEnd?'已结束':'去砍价'}}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="soldOut" v-else>
					<div class="soldOutImg"><img mode="widthFix" class="img" src="/static/images/public/public_empty_pic.png" alt=""></div>
					<div class="soldtip">哇，我们的乐砍价商品竟然被抢光了！我们正在紧急上架，请稍后再试</div>
				</div>
			</div>
			<div class="myCutPrice" >
				<img class="img" @click="toMyCutPrice" mode="widthFix"  src="/static/images/cutPrice/kan_index_user.png">
			</div>
			<div id="ruleDialog" v-show="showRuleDialog" catchtouchmove='true' >
				<div class="ruleDialog" >
					<div class="dialog_header">
						<div class="close_btn" >
							<img src="/static/images/public_pop_close.png" @click="closeRule" class="closeImg">
						</div>
						{{rule.title}}
					</div>
					<scroll-view scroll-y="true" class="dialog_content" >
						<rich-text :nodes="cssRule" class="ruleTxt"></rich-text>
					</scroll-view>
					<!-- <div class="dialog_content">
                        <div class="ruleTxt">1. 连续签到10天为一个周期，奖金累计到10元，自动兑换为10元优惠券（APP除1段奶粉外全场通用，有效期7天），则当期累积中的奖金清零。</div>
                        <div class="ruleTxt">2. 签到所得10元券满30元可用</div>
                        <div class="ruleTxt">3. 可以使用乐友积分来补签任意两天，补签第一次、第二次分别需消耗100、150积分</div>
                        <div class="ruleTxt">4. 若累计三天漏签，则当期累计签到奖金清零（已兑换部分不受影响）。</div>
                        <div class="ruleTxt">5. 对于任何通过不正当手段参与活动者，乐友有权取消其签到资格并收回签到所得优惠券。</div>
                    </div> -->
					<div class="dialog_footer" @click="closeRule">我知道了</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

	import { getProductCutPageDetail, getCutPrdtLists, getPrdtStatus } from "@/api";	import money from "@/components/public/money"
	export default{
		data(){
			return {
			    img_config:"https://oss-cn-beijing.aliyuncs.com/leyoutest1",
				current_page: 1,
				scrollTop: 0,
			    indicatorDots: true,
			    autoplay: true,
			    interval: 5000,
			    duration: 1000,
				indColor_active: '#EE721D',
				showRuleDialog: false,
				dialogHeight: 0,
				dialogContentTop: 0,
				ruleIsFixed: false,
				domTop: 0,
				banners: [],
				buyer_messages: [],
				d: '00',
				h: '00',
				m: '00',
				s: '00',
				isCutTimeEnd: true,
				goods_list: '',
				rule: [],
				buyerTimer: null,//购买消息定时器
				displayBuyerMsg: '',//购买消息
				ruleHtml: [],
				downTimer: null
			}
		},
		components: {
			money
		},
		onLoad() {
		},
		onShow(){
            this.current_page=1;
            this.goods_list="";
            this.showRuleDialog=false
            this.initPage();
            this.d = "00";
            this.h = "00";
            this.m = "00";
            this.s = "00";
        },
		onHide(){
            clearInterval(this.downTimer);
        },
        onPullDownRefresh(){
            wx.stopPullDownRefresh()
        },
		onReachBottom(){
            if(this.current_page<(this.goods_list.total/10)){
                this.current_page+=1;
                wx.showLoading({title: '加载中...',});
                getProductCutPageDetail({'page': this.current_page}).then(res => {
                    wx.hideLoading()
					if(res.goods_list.data&&res.goods_list.data.length>0){
                        this.goods_list.data=this.goods_list.data.concat(res.goods_list.data);
						console.log(this.goods_list.data)
					}
				})
			}
		},
		computed:{
			hasCutProduction(){
				let flag  = false;
				if(this.goods_list.data&&this.goods_list.data.length){
					flag = this.goods_list.data.length>0?true:false;
				}else{
					flag = false;
				}
				return flag;
			},
			cssRule(){
				let html = "";
				if(this.rule.content){
					html = this.rule.content.replace(/<p/gi, '<p style="line-height:40rpx;"');
				}
				return html;
			}
		},
		methods:{
			initTimeDown(endTime){//初始化砍价结束倒计时
				clearInterval(this.downTimer);
				let end = new Date(endTime*1000);
				let _now = new Date();
				if(end - _now <= 0){
					this.isCutTimeEnd = true;
				}else{
					this.isCutTimeEnd = false;
					this.downTimer = setInterval(()=>{
						let now = new Date();
						let deltaTime = end - now; //到期时间和当前时间相差的毫秒数
						if (deltaTime < 0) {//结束停止
							clearInterval(this.downTimer);
							this.isCutTimeEnd = true;
							return;
						}
						let d = Math.floor(deltaTime / (60*1000*60*24));
						let h = Math.floor(deltaTime / (60*1000*60)%24);
						let m = Math.floor(deltaTime / (60*1000)%60);
						let s = Math.floor(deltaTime / 1000 % 60);
						this.d = d<10?"0"+d:d;
						this.h = h<10?"0"+h:h;
						this.m = m<10?"0"+m:m;
						this.s = s<10?"0"+s:s;
					}, 1000);
				}
			},

            gotoMy(){
                wx.navigateTo({url:'/pages/cutprice/myCutPage/main'})
			},
			buyer_messages_timer(){//购买消息轮换
				clearInterval(this.buyerTimer);
				let len = this.buyer_messages.length;
				let n = 0;
				this.displayBuyerMsg = this.buyer_messages[n];
				this.buyerTimer = setInterval(() => {
					if(n >= (len-1)){
						n = 0;
					}else{
						n += 1;
					}
					this.displayBuyerMsg = this.buyer_messages[n];
				}, 5000);
			},
			initPage(){
                wx.showLoading({title: '加载中...',});

                getProductCutPageDetail({'page': this.current_page}).then(res => {
                    wx.hideLoading()
                    this.banners = res.banners;
					this.buyer_messages = res.buyer_messages;
					this.goods_list = res.goods_list;
                this.rule = res.rule;
					// this.buyer_messages_timer();
					// let goods_data = res.goods_list.data;
					// if(goods_data&&goods_data.length){
					// 	let len = goods_data.length;
					// 	if(len > 0){
					// 		let sku_temp = [];
					// 		for(let i = 0; i < len; i++){
					// 			sku_temp.push(goods_data[i].sku);
					// 		}
					// 		getPrdtStatus({'skus': sku_temp}).then(res => {
					// 			console.log(res);
					// 		});
					// 		getCutPrdtLists({'skus': sku_temp}).then(res => {
					// 			console.log(res);
					// 		});
					// 	}
					// }
					this.initTimeDown(res.distance_end_time);
				})
			},
			clickBanner(item){//点击轮播图跳转至相应模块
				wx.setStorageSync("urlH5",item)
				wx.navigateTo({
					url:`/pages/transferH5/main`
				});
			},
			cutPrice(sku,goods_id){//开始砍价||继续砍价
				wx.navigateTo({
					url:"/pages/cutprice/detailed/main?sku="+sku+"&goods_id="+goods_id
				})
			},
			closeRule(){//关闭规则
				this.showRuleDialog = false;
			},
			showRule(){//查看规则
				this.dialogHeight = wx.getSystemInfoSync().windowHeight+this.scrollTop;
				this.showRuleDialog = true;
			},
			toMyCutPrice(){//跳转至我的砍价
				let token = wx.getStorageSync('token');
                if(!token){
                    wx.navigateTo({
                        url:'/pages/userCenter/login/wxLogin/main'
                    });
                }else{
                    wx.navigateTo({
                        url:'/pages/cutprice/myCutPage/main'
                    });
				}
			}
		},
		mounted(){
		}
	}
</script>

<style scoped>
	.cutList{
		width: 750rpx;
		min-height: 100%;
		padding-bottom: 20rpx;
		background-color: rgb(243,245,247);
	}
	.haslists{
		background-color: #FFF6D2;
	}
	.displayTips{
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		height: 64rpx;
		background-color: #fff;
	}

	.userImg .img{
		width: 52rpx;
		height: 52rpx;
		border-radius: 50%;
	}
	.displayTxt{
		vertical-align: super;
		height: 28rpx;
		line-height: 66rpx;
		font-size: 22rpx;
		width: 658rpx;
		text-indent: 8rpx;
	}
	.swiper-box{
		height: 268rpx;
	}
	.slide-image{
		width: 100%;
		height: 100%;
	}
	.cutRulesBar_box{
		height: 100rpx;
	}
	.cutRulesBar{
		height: 100rpx;
		padding: 0 28rpx;
		color: #633923;
		background-color: #FFF6D2;
		display: flex;
		align-items: center;
		position: relative;
	}
	.rlueFxied{
		position: fixed;
		width: 694rpx;
		top: 0;
	}
	.cutTimer{
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
	}
	.cutTxt{
		display: inline-block;
		margin-right: 16rpx;
	}
	.cutendDay{
		font-weight: bold;
	}
	.cutEndTimer{
		text-align: center;
		display: inline-block;
		width: 40rpx;
		height: 40rpx;
		border-radius: 4rpx;
		background-color: #F7D79A;
		font-weight: bold;

	}
	.cutRule{
		display: block;
		width: 120rpx;
		height: 40rpx;
		margin-top: 30rpx;
		line-height: 40rpx;
		border-radius: 20rpx;
		font-size: 22rpx;
		text-align: center;
		background-color: #F7D79A;
		position: absolute;
		right: 20rpx;
		top: 0;
	}
	.cutRule::after{
		content: '';
		clear: both;
	}
	#ruleDialog{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		z-index: 99;
	}
	.ruleDialog{
		position: absolute;
		left: 50%;
		top: 50%;
		width: 630rpx;
		margin-left: -315rpx;
		margin-top: -350rpx;
		border-radius: 16rpx;
		background-color: #fff;
	}
	.ruleDialog .dialog_header{
		text-align: center;
		position: relative;
		font-size: 34rpx;
		height: 48rpx;
		line-height: 48rpx;
		margin-bottom: 40rpx;
		margin-top: 28rpx;
		font-weight: bold;
	}
	.close_btn{
		position: absolute;
		width: 44rpx;
		height: 44rpx;
		line-height: 29rpx;
		right: 30rpx;
		top: 0;
		z-index: 100;
	}
	.close_btn .closeImg{
		width: 44rpx;
		height: 44rpx;
		display: inline-block;
	}

	.ruleDialog > .dialog_content{
		padding: 0 30rpx;
		font-size: 26rpx;
		line-height: 30rpx;
		height:400rpx ;
		width: 580rpx;
		overflow: auto;
		color: #505050;
	}
	.dialog_content .ruleTxt{
		font-size: 26rpx;
		color: #505050;
		line-height: 50rpx;
		margin-bottom: 24rpx;
	}
	.ruleDialog .dialog_footer{
		height: 88rpx;
		line-height: 88rpx;
		font-size: 30rpx;
		font-weight: bolder;
		border-top: 1rpx solid #eee;
		color: #FF5000;
		text-align: center;
		margin-top: 60rpx;
	}
	.myCutPrice{
		position: fixed;
		width: 140rpx;
		right: 0;
		bottom: 120rpx;
		border-top-left-radius: 40rpx;
		border-bottom-left-radius: 40rpx;
	}
	.myCutPrice .img{
		width:140rpx;
		height: 98.3rpx;
	}
	.img{
		width: 100%;
	}
	.cutContent{
		padding: 0 20rpx;
		text-align: center;
	}
	.listContent{
		padding-bottom: 20rpx;
	}
	.cutPdtLists{
		display: flex;
		justify-content: center;
		height: 240rpx;
		border-radius: 16rpx;
		overflow: hidden;
		line-height: 240rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		box-shadow: 0rpx 0rpx 8rpx #F7D79A;
	}
	.cutPdtLists:last-child{
		margin-bottom: 0;
	}
	.pdtTxt .imgBox{
		display: inline-block;
	}
	.cutPdtLists .imgBox{
		height: 240rpx;
		width: 240rpx;
	}
	.imgBox .img{
		height: 240rpx;
		width: 240rpx;
	}
	.pdtTxt{
		text-align: left;
		height: 240rpx;
		width: 470rpx;
	}
	.pdtTitle{
		margin: 20rpx;
		margin-bottom: 36rpx;
		font-size: 26rpx;
		color: #333333;
		line-height: 32rpx;
		height: 64rpx;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	.startPrice{
		font-size:22rpx;
		line-height: 30rpx;
		color: #999;
		text-indent: 20rpx;
		margin-bottom: 10rpx;
	}

	.cuted{
		color: #FF5000 !important;
		text-decoration: none;
	}
	.lowPrice{
		padding: 0 20rpx;
		height: 60rpx;
		line-height: 60rpx;
	}
	.lowPrice .tip1,.lowPrice .tip2{
		font-size: 26rpx;
	}
	.orangeText{
		color: #FF5000;
		font-weight: bold;
	}
	.orangeText .bigTxt{
		font-size: 40rpx;
	}
	.cut_btn{
		display: block;
		background: -moz-linear-gradient(left, #FF8800, #FF5000);
		background: -webkit-linear-gradient(left, #FF8800, #FF5000);
		background: -o-linear-gradient(left, #FF8800, #FF5000);
		width: 148rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 30rpx;
		font-size: 28rpx;
		text-align: center;
		color: #fff;
		float: right;
	}
	.cut_btn::after{
		content: "";
		clear: both;
	}
	.soldOut{
		display: inline-block;
	}
	.soldOutImg{
		display: inline-block;
		margin-top: 152rpx;
		margin-bottom: 40rpx;
		width: 218rpx;
	}
	.soldOutImg .img{
		width: 218rpx;
		height: 218rpx;

	}
	.soldtip{
		color: #333333;
		width: 443rpx;
		height: 80rpx;
		margin-bottom: 284rpx;
		font-size: 26rpx;
		line-height: 40rpx;
	}
	.btn_disabled{
		background: #6d6d6d !important;
	}
</style>
