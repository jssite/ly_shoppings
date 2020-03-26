<template>
	<div class="content">
		<div class="top">
				<div class="address">
					<span class="cityText" @click="showSelect()">{{cityText}}
					<img class="arrow" v-if="!selcetBtn" src="/static/images/public/public_arrow_down.png" alt="">
									<img class="arrow" v-if="selcetBtn" src="/static/images/public/public_arrow_up.png" alt="">
					</span>
					<div   @click="showSelect()" class="dialog-select" v-if="selcetBtn">
						<div class="address-box" v-if="selcetBtn" >
							<div class="left" @click.stop>
								<p :class="actIndex==index?'city-text active-city':'city-text'" v-for="item in addData" :key="index" @click="selectCity(index)">{{item.city}}

								</p>
							</div>
							<div class="right" @click.stop>
								<span v-if="addData[actIndex]" class="area-text" @click="selectArea(index)" v-for="item in addData[actIndex].areas" :key="index">{{item.area}}</span>
							</div>
						</div>
					</div>
				</div>

			<div class="homeTopSelect">
				<input type="text" class="input" :input="addText()" v-model="searchText" placeholder="请输入门店或门店位置" >
				<img class="position selectImg" src="/static/images/navbar_search.png">
				<!-- <img class="position barCodeImg" src="/static/images/index/tiaoxing.png"> -->
			</div>

		</div>

		<p class="allhas">
			<img class="pre" @click="xuanHas()" v-if="!xuanBtn" src="/static/images/shop_store_check_not.png" alt="">
			<img  class="pre" @click="xuanHas()" v-if="xuanBtn" src="/static/images/shop_store_check_on.png" alt="">
			<!--<span class="xuanz" >-->
				<!--<img  class="pre" src="/static/images/twohr_orderpop_list_pre.png" alt="">-->
			<!--</span>-->
			全部有货
		</p>
		<div v-if="!item.show&&(xuanBtn?(!item.product_list.length?true:false):true)" :class="!item.stock_produt_list.length?'list has-no':'list'" v-for="item in shops" @click="goToCart(item)" :key="index">
			<p :class="!item.stock_produt_list.length?'list-title has-no':'list-title'" >{{item.shop_name}} <span class="tag-1" v-if="item.label">{{item.label}}</span><span class="tag-2" v-if="item.sku_stock_desc&&!options.detailedMore">{{item.sku_stock_desc}}</span></p>
			<p :class="!item.stock_produt_list.length?'list-addr has-no':'list-addr'" >{{item.shop_address}}</p>
			<p :class="!item.stock_produt_list.length?'list-time has-no':'list-time'" >可提货时间：{{item.work_time}}</p>
			<p class="quehuo" v-if="!item.stock_produt_list.length&&!options.detailedMore" @click="lookList(item)">缺货清单<img class="pic-right" src="/static/images/public_arrow_right.png" alt=""></p>
			<img v-if="!item.stock_produt_list.length" class="noGoodS" src="/static/images/public/public_goods_state01.png" alt="">
			<div class="logo-location">
				<img class="location-icon" src="/static/images/shop_store_location.png" alt="">
				<p>{{item.distance_str || item.distance}}</p>
			</div>
		</div>
		<div class="dialog" v-if="showBtn" >
			<div class="dialog-content">
            <img @click="closeDialog()" class="close-dialog" src="/static/images/public/public_pop_close.png" alt="" />

				<h2 class="title-h2">门店缺货清单</h2>
				<p class="list-p" v-for="(item ,index) in goodsList.product_list" :key='index'>
					<span class="list-name">{{item.marketing_title}}</span>
					<span class="tip-num">购{{item.qty}}件</span>
					<span class="tip-num">缺{{item.qty-item.stock}}件</span>
				</p>
			</div>
		</div>
		<div v-if="noGoodsBtn&&!shops.length">
			<div class="zanwei"  >
				<img class="zanwei-img" src="/static/images/public/public_empty_pic.png" alt="" />
				<p class="zanwei-tip">当前城市均无货 </p>
			</div>
		</div>
	</div>
</template>

<script>
    import BMapWX from '@/utils/bmap-wx.min.js';
    import { mapak } from '@/utils';
    import  { getCartAllData ,synAllShoppingCart,getShopStock,getAdvertisement,getLevelAddressTwo} from '@/api'
	 export default {
	 	data(){
	 		return{
	 			shops:[],
	 			goodsList:[],
	 			showBtn:false,
                xuanBtn:false,
				noGoodsBtn:false,
				actIndex:0,
				areaIndex:'',
                searchText:'',
				addData:'',
                cityText:'北京市',
                shop_area_id:'',
				selcetBtn:false,
				options:{}
	 		}
	 	},
	 	onLoad(options){
			this.sa_page(this,false,'门店自提','');
			console.log(options)
			this.searchText=''
            this.cityText='北京市'
			this.shops=[]
			this.xuanBtn=false
			this.goodsList=[]
			this.actIndex=0
			this.selcetBtn=false
			this.showBtn=false
			this.shop_area_id=''
			this.options={}
			this.noGoodsBtn=false
            this.options = options;

            this.funcSetLocaton(wx.getStorageSync('locationInfo').latitude,wx.getStorageSync('locationInfo').longitude)

            if(options.detailedMore=='detailedMore'){
				wx.setNavigationBarTitle({title:'选择门店'})
				console.log(options)
			}
            getLevelAddressTwo({}).then(res=>{
				this.addData=res
			})
			this.getData()

	 	},
		 methods:{

             funcSetLocaton(x, y) {

                 let _this = this;
                 var BMap = new BMapWX({
                     ak: mapak
                 });
                 BMap.regeocoding({
                     location: `${x},${y}`,
                     fail: err => {
                         console.log(err,'222222222222222')

                     },
                     success: res => {
                         _this.cityText=`${res.originalData.result.addressComponent.city}  ${res.originalData.result.addressComponent.district}`
                         // console.log(res,'222222222222222')
                         // _this.location.street_number = res.originalData.result.addressComponent.street + res.originalData.result.addressComponent.street_number;
                         // _this.location.city = res.originalData.result.addressComponent.city;
                     },
					 complete:data=>{
                         console.log(data,'222222222222222')

                     }
                 });
             },
             showSelect(){
                 this.selcetBtn=!this.selcetBtn
			 },
             selectArea(index){
				 this.areaIndex=index
                 this.shop_area_id=this.addData[this.actIndex].areas[this.areaIndex].areaid
                 this.cityText=this.addData[this.actIndex].city+' '+this.addData[this.actIndex].areas[this.areaIndex].area
                 this.getData()
                 this.selcetBtn=false
			 },
             selectCity(index){
                 this.actIndex=index
			 },
			 getData(){
                 console.log({
                     "shop_area_id":this.shop_area_id,
                     "source_y" : wx.getStorageSync('locationInfo').latitude,
                     "source_x" : wx.getStorageSync('locationInfo').longitude,
                 })
                 getShopStock({
					 "shop_area_id":this.shop_area_id,
					 "sku":this.options.sku,
                     "source_y" : wx.getStorageSync('locationInfo').latitude,
                     "source_x" : wx.getStorageSync('locationInfo').longitude,
                 }).then(res=>{

                     this.shop_stock_desc=res.shop_stock_desc
                     this.shops=res.shops
                     if(!this.shops.length){
                         this.noGoodsBtn=true
                     }else{
                         this.noGoodsBtn=false
                     }
                 })
			 },
             addText(){
                 this.shops.forEach(res=>{
                     if(res.shop_name.indexOf(this.searchText)!=-1||res.shop_address.indexOf(this.searchText)!=-1){
                         res.show=false
					 }else{
                         res.show=true
					 }
				 })
			 },
             xuanHas(){
                 console.log(111111111)
				 var btn = 0

                 this.xuanBtn=!this.xuanBtn
				 if(this.xuanBtn){
                     this.shops.forEach(res=>{
                         if(res.product_list.length){
                             btn++
						 }
					 })
					 if(btn==this.shops.length){
                         this.noGoodsBtn=true
					 }
				 }else{
                     this.noGoodsBtn=false
				 }


			 },
		 	closeDialog(){
		 		this.showBtn=false

		 	},
		 	lookList(item){
		 		this.showBtn=true
		 		this.goodsList=item
		 	},
             goToCart(data){
				 if(data.stock_produt_list.length){
                     if(this.options.kanjia){
                         wx.navigateBack({
                             delta: 1
                         })
                         wx.setStorageSync('kanAddress',{
                             shop_id:data.shop_id,
                             addressShopName:data.shop_name,
                         })
                         // wx.navigateTo({ url: '/pages/goodsdetailed/main?shop_id='+data.shop_id+'&addressShopName='+data.shop_name+'&sku='+this.options.sku})
                     }else if(this.options.detailedMore){
						if(this.options.stock){
							wx.navigateTo({ url: '/pages/goodsdetailed/main?shop_id='+data.shop_id+'&addressShopName='+data.shop_name+'&sku='+this.options.sku})
						}else{
							let params = `sku=${this.options.sku}&shop_id=${data.shop_id}&MoregoodsName=${this.options.MoregoodsName}&MoregoodsScpe=${this.options.MoregoodsScpe}&addressShopName=${data.shop_name}`
							wx.navigateTo({ url: '/pages/goodsdetailed/main?'+params})
						}
						// this.options.detailedMore = null;
					}else{
                        // wx.navigateBack({delta: 1})
						//
                        wx.reLaunch({
                         	url: `/pages/shop/shoppingCart/main?shops=`+JSON.stringify(data)+'&shop_stock_desc='+this.shop_stock_desc,
                     	})
					}
				 }
			 }
		 }
	 }
</script>

<style scoped>
	.arrow{
		width: 22rpx;
		height: 12rpx;
		vertical-align: middle;
	}
	.pic-right{
		height: 22rpx;
		width: 12rpx;
		padding-left: 20rpx;
		padding-bottom: 8rpx;
		vertical-align: middle;
		display: inline-block;
	}
	/* 搜索栏 */

	.cityText{
		display: inline-block;
		width: 100%;
		height: 100%;
		line-height: 70rpx;
		font-size: 26rpx;
	}
	.area-text{
		display: inline-block;
		width: 33%;
		height: 80rpx;
		line-height:80rpx;
		text-align: center;
		font-size: 24rpx;
	}
	.area-text:active{
		background: #999;
	}
	.top{
		position: fixed;
		top: 0;
		background: #fff;
		width: 100%;
		height: 70rpx;
		z-index:999;
	}
	.address-box{
		position: absolute;
		width: 750rpx;
		height: 700rpx;
		top: 0;
		background: #eee;
	}
	.address{
		position: absolute;
		width: 240rpx;
		height: 70rpx;
		top: 0;
		left: 0;
		z-index: 999;
		text-align: center;
		font-size: 26rpx;
		line-height: 70rpx;
	}
	.left,.right{
		height: 700rpx;
		float: left;
		overflow: auto;
	}
	.left{
		width: 200rpx;
		background: #fff;
	}
	.right{
		width: 550rpx;
		text-align: left;
	}
	.city-text{
		padding: 10rpx;
		font-size: 26rpx;
		border-bottom: 1rpx solid #eee;
	}
	.active-city{
		border-left: 4px solid #ff5000;
		background: #eee;
	}
	.homeTopSelect{
		height: 76rpx;
		width: 480rpx;
		position: relative;
		padding-left: 240rpx;
	}
	.homeTopSelect .input{
		height: 63rpx;
		width: 480rpx;
		margin-left: 20rpx;
		box-sizing: border-box;
		background: #F2F2F2;
		border-radius: 40px;
		padding-left: 71rpx;
		font-size: 26rpx;
	}
	.position{
		position: absolute;
	}
	.homeTopSelect .selectImg{
		width: 30rpx;
		height: 30rpx;
		left: 281rpx;
		top: 16rpx;
	}
	.homeTopSelect .sweepImg{
		width: 42rpx;
		height: 42rpx;
		right: 56rpx;
		top: 11rpx;
	}
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
		display:none;
	}
	.classify{
		position: fixed;
		width: 100%;
		height: 100%;
		background: #f3f5f7;
		/* box-sizing: border-box; */
	}
	.zanwei-tip{
		font-size: 30rpx;
		padding-bottom:40rpx;
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
	.xuanz{
		display: inline-block;
		height: 30rpx;
		width: 30rpx;
		border:1px solid #999;
		vertical-align: middle;
	}
	.pre{
		height: 36rpx;
		width: 36rpx;
		vertical-align: middle;
	}
	.allhas{
		text-align: right;
		padding: 20rpx;
		padding-top: 90rpx;
		font-size: 24rpx;
		background: #F3F5F7;
	}
	.close-dialog{
		height: 44rpx;
		width: 44rpx;
		position: absolute;
		right: 20rpx;
		top: 20rpx;;
	}
	.title-h2{
		font-size: 30rpx;
		text-align: center;
		height: 80rpx ;
		line-height: 80rpx;
	}
	.tip-num{
		font-size: 22rpx;
		color: #999;
		padding: 0 20rpx;
		vertical-align: middle;
	}
	.list-p{
		border-bottom: 1rpx solid #eee;
		padding: 10rpx;
	}
	.list-name{
		display: inline-block;
		vertical-align: middle;
		padding: 10rpx;
		font-size: 24rpx;
		width: 500rpx;
	}
	.dialog-content{
		min-height: 100rpx;
		padding-bottom: 20rpx;
		width: 100%;
		background: #fff;
		position: fixed;
		bottom: 0;
	}
	.dialog{
        position: fixed;
        height: 100%;
        width: 100%;
        background: rgba(0,0,0,0.3);
        z-index: 99;
        top: 0;
    }
	.dialog-select{
		position: fixed;
		height: 100%;
		width: 100%;
		background: rgba(0,0,0,0.3);
		z-index: 99;
		top: 70rpx;
	}
	.quehuo{
		text-align: right;
		vertical-align: middle;
		font-size: 24rpx;
		color: #333!important;
		padding:10rpx 20rpx ;
	}
	.has-no{
		color: #CACACA!important;
	}
	.logo-location{
		position: absolute;
		right: 20rpx;
		top: 60rpx;
		width: 100rpx;
		text-align: center;
		font-size: 26rpx;
		color: #666;
	}
	.noGoodS{
		height: 100rpx;
		width: 100rpx;
		position: absolute;
		right: 20rpx;
		top: 60rpx;
		z-index: 99;
	}
	.location-icon{
		height: 34rpx;
		width: 28rpx;
	}
	.list{
		position: relative;
		border-bottom: 1rpx solid #eee;
		margin: 0 20rpx;
	}
	.list-title{
		font-size: 30rpx;
		padding: 20rpx 0 ;

	}
	.list-addr,.list-time{
		font-size: 26rpx;
		color: #666;
		width: 560rpx;
		padding: 10rpx 0;
	}
	.tag-1{
		display: inline-block;
		padding:3rpx 20rpx;
		font-size: 22rpx;
		background: #FF5000;
		color: #fff;
		border-radius: 22rpx;
		margin-left: 20rpx;
	}
	.tag-2{
		margin-left: 20rpx;

		display: inline-block;
		padding:3rpx 20rpx;
		font-size: 22rpx;
		border:1rpx solid #FF5000;
		color: #FF5000 ;
		border-radius: 22rpx;
	}
	.content{
		height: 100%;

	}
</style>
