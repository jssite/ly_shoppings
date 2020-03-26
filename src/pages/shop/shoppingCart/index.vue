<template>
    <div class="main-cart">
        <div class="alike card" v-if="msgData.str&&token">
            <div v-if="baseData.is_open_vip" >
                <p class="cardlab-span"> <img class='cardlab' style="width:125rpx;height:32rpx"  src="/static/goodsdetail/lecard_label_super.png" alt=""></p>
                <span class="cardawa">{{msgDatavip.str }}<i class="num">{{msgDatavip.num}}</i></span>
            </div>
            <div  v-if="baseData.is_open_le_vip||!(baseData.is_open_vip||baseData.is_open_le_vip)" :class="(msgDatavip.str&&baseData.is_open_vip)?'':'alike-top'">
                <p class="cardlab-span"><img class='cardlab' style="width:125rpx;height:32rpx"  src="/static/goodsdetail/lecard_label_super.png" alt=""></p>
                <span class="cardawa">{{msgData.str}}<i class="num">{{msgData.num}}</i></span>
            </div>
            <img v-if="!(baseData.is_open_vip||baseData.is_open_le_vip)" class='openCard' src="/static/goodsdetail/lecard_icon_buy.png" alt="">
        </div>
		<p class="tologin" v-if="!token">登录后可享受专属价，并可同步购物车历史记录<span class="goTologin" @click="goLogin()">去登录</span></p>
        <div class="cart-box">
            <div class="img-nav">
            	<img   style="width: 710rpx;" v-if="bannerimg.url" @click="gototransfer(bannerimg.link)" class="img-nav-img" mode="widthFix" :src="bannerimg.url" :style="{width: bannerimg.width + 'rpx',height:bannerimg.height+'rpx'}" >
            </div>
            <!--"-->
            <!--<div class="switch" v-if="baseData.is_need_vip">-->
                <!--<span class="switch-msg">企业尊享价(本月内购余额{{baseData.company_sale_message}}元)</span>-->
                <!--<switch class="btn" color="#FF5000" v-model="is_use_vip" :checked="is_use_vip"  @change="funcVip"></switch>-->
            <!--</div>-->
           	<div class="zanwei"  v-if="!baseData.cart_product_type_list">
           		<img class="zanwei-img" src="/static/images/public/public_empty_pic.png" alt="" />
           		<p class="zanwei-tip">空空如也，快去装满它</p>
           		<p class="goLook_warp"><span class="goLook" @click="goLook()">去逛逛</span></p>
           	</div>
            <div class="good-list" v-if="baseData.cart_product_type_list" v-for="(item ,index) in baseData.cart_product_type_list" :key="index">
                    <div class="list-top">
                        <img class="circle"  v-if="!item.check" @click="select(item,1,item.cart_type)"  src="/static/images/public/publicCircle-checkOff.png" alt="">

                        <img class="circle" v-if="item.check" @click="select(item,1,item.cart_type)" src="/static/images/public/publicCircle-checkOn.png" alt="">
                        <span class="shopName">{{item.cart_type==0?'乐商城':(item.cart_type==1?'全球购':'乐海淘')}}</span>
                        <span class="skip">
                    </span>
                        <!--<span class="tip">还差12.1元免运费</span>-->
                    </div>
                <div class="list ">
                    <div class="list-goods-box" v-for="(items,indexC) in item.cart_info_product_list" :key="indexC">
                        <div class="list-tip" v-if="items.promotion_info_vo.promotion_id">

                            <span class="tip-btn">{{items.promotion_info_vo.promotion_type_title}}</span>
                            <span class="tip-msg">{{items.promotion_info_vo.promotion_content}}</span>
                            <span class="skip" @click="gotoPromotion(items.promotion_info_vo,true)">
                        {{items.promotion_info_vo.forward_title}}
                                <img class="pic-right" src="/static/images/public/order_arrow_redright.png" alt="">
                        </span>
                        </div>
                        <div   v-for="(itemf,indexF) in items.cart_product_list" :key="indexF">
                            <div   :class="(itemf.showDel==1&&itemf.product_type!=1&&itemf.product_type!=6)?'showDel list-goods':'list-goods'"  @touchstart="touchstart($event,indexF,indexC,index)" @touchend="touchend($event,indexF,indexC,index)"  v-if="itemf.product_type!=1&&itemf.product_type!=6" >
                                <img class="circle" @click="select(itemf,2,item.cart_type)" v-if="itemf.is_check" src="/static/images/public/publicCircle-checkOn.png" alt="">
                                <img class="circle" @click="select(itemf,2,item.cart_type)" v-if="!itemf.is_check" src="/static/images/public/publicCircle-checkOff.png" alt="">
                                <img @click="goMsg(itemf)" class="goods-img" :src="itemf.image" alt="">
                                <span class="only-p" v-if="itemf.product_status==0&&itemf.shop_quantity==0&&itemf.sale_quantity!=0">仅支持快递配送</span>
                                <span class="only-z" v-if="itemf.product_status==0&&itemf.sale_quantity==0&&itemf.shop_quantity!=0">仅支持门店自提</span>
                                <span v-if="itemf.product_status==1" class="only-g">缺货</span>
                                <span v-if="itemf.product_status==2" class="only-g">下架</span>
                                <span v-if="itemf.product_status==3" class="only-g">已抢光</span>
                                <div  :class="itemf.product_status==0?'goods-right':'goods-right has-no' ">
                                    <p class="goods-msg "><img  v-if="itemf.leyou_flash.support" class="lesha" src="/static/images/search/search_sign_speed.png" alt="">{{itemf.marketing_title}}</p>
                                    <p class="goods-attr ">{{itemf.product_color?'颜色：'+itemf.product_color:''}}  {{itemf.product_size?'尺码：'+itemf.product_size:'&nbsp;'}}</p>
                                    <p  class="new-btn-p">
                                        <span class="new-btn" v-for="(tag,indext) in itemf.list_product_tag" :key="indext">{{tag}}</span>
                                    </p>
                                    <p class="list-bottom">
                                        <span :class="itemf.product_status==0?'money':'money has-no' " ><moneySpan :money="itemf.vip_price?itemf.vip_price:itemf.sale_price" :iSize="30"></moneySpan></span>
                                        <img class="mark" v-if="itemf.vip_price" src="/static/goodsdetail/product_sign_le.png" alt="">
                                    <span class="xiang" v-if="itemf.quantity ==itemf.max_limit_sale">限购{{itemf.max_limit_sale}}件</span>

                                    <span class="add-reduce  " v-if="itemf.product_status==0">

                                            <img v-if="itemf.min_limit_sale?(itemf.quantity>itemf.min_limit_sale):(itemf.quantity>1)" class="add" src="/static/images/public/public_number_sub.png" alt=""  @click="doGoods(itemf,item.cart_type,-1)">
                                            <img v-if="itemf.min_limit_sale?(itemf.quantity<itemf.min_limit_sale):(itemf.quantity<2)" class="add" src="/static/images/public/public_number_subnot.png" alt="">
                                            <!--<span :class="itemf.quantity<2?'reduce gray':'reduce'" @click="doGoods(itemf,item.cart_type,-1)">-</span>-->
                                            <span class="goods-num" @click="showInput(itemf,item.cart_type,itemf.quantity)">{{itemf.quantity}}</span>
                                            <img v-if="itemf.max_limit_sale?(itemf.quantity<itemf.max_limit_sale):(itemf.quantity<99)" class="add" src="/static/images/public/public_number_add.png" alt="" @click="doGoods(itemf,item.cart_type,1)">
                                            <img v-if="itemf.max_limit_sale?(itemf.quantity>=itemf.max_limit_sale):(itemf.quantity>=99)" class="add" src="/static/images/public/public_number_addnot.png" alt="">
                                            <!--<span :class="itemf.max_limit_sale?(itemf.quantity>=itemf.max_limit_sale?'add gray':(itemf.quantity>=99?'add gray':'add')):(itemf.quantity>=99?'add gray':'add')" @click="doGoods(itemf,item.cart_type,1)">+</span>-->
                                        </span>
                                    </p>
                                </div>
                                <div class="del" @click="delGoode(itemf,item.cart_type)">
                                    删除
                                </div>
                            </div>
                            <div   class="list-goods"   v-if="itemf.product_type===6" >
                                <span class="circle" ></span>
                                <img @click="goMsg(itemf)" class="goods-img" :src="itemf.image" alt="">
                                <span class="only-p" v-if="itemf.product_status==0&&itemf.shop_quantity==0&&itemf.sale_quantity!=0">仅支持快递配送</span>
                                <span class="only-z" v-if="itemf.product_status==0&&itemf.sale_quantity==0&&itemf.shop_quantity!=0">仅支持门店自提</span>
                                <span v-if="itemf.product_status==1" class="only-g">缺货</span>
                                <span v-if="itemf.product_status==2" class="only-g">下架</span>
                                <span v-if="itemf.product_status==3" class="only-g">已抢光</span>
                                <div  :class="itemf.product_status==0?'goods-right':'goods-right has-no' ">
                                    <p class="goods-msg ">
                                        <!-- <img  v-if="itemf.leyou_flash.support" class="lesha" src="/static/images/search/search_sign_speed.png" alt=""> -->
                                        <span class="huangou">换购</span>
                                        {{itemf.marketing_title}}</p>
                                    <p class="goods-attr ">{{itemf.product_color?'颜色：'+itemf.product_color:''}}  {{itemf.product_size?'尺码：'+itemf.product_size:'&nbsp;'}}</p>
                                    <p  class="new-btn-p">
                                        <span class="new-btn" v-for="(tag,indext) in itemf.list_product_tag" :key="indext">{{tag}}</span>
                                    </p>
                                    <p class="list-bottom">
                                        <span :class="itemf.product_status==0?'money':'money has-no' " ><moneySpan :money="itemf.vip_price?itemf.vip_price:itemf.sale_price" :iSize="30"></moneySpan></span>
                                        <img class="mark" v-if="itemf.vip_price" src="/static/goodsdetail/product_sign_le.png" alt="">
                                        <span class="xiang" v-if="itemf.quantity == itemf.max_limit_sale">限购{{itemf.max_limit_sale}}件</span>

                                        <span class="add-reduce  " v-if="itemf.product_status==0">

                                            <!--<img v-if="itemf.min_limit_sale?(itemf.quantity>itemf.min_limit_sale):(itemf.quantity>1)" class="add" src="/static/images/public/public_number_sub.png" alt=""  @click="doGoods(itemf,item.cart_type,-1)">-->
                                            <!--<img v-if="itemf.min_limit_sale?(itemf.quantity<itemf.min_limit_sale):(itemf.quantity<2)" class="add" src="/static/images/public/public_number_subnot.png" alt="">-->
                                            <!--&lt;!&ndash;<span :class="itemf.quantity<2?'reduce gray':'reduce'" @click="doGoods(itemf,item.cart_type,-1)">-</span>&ndash;&gt;-->
                                                 <!--@click="showInput(itemf,item.cart_type,itemf.quantity)"-->
                                            <span class="goods-num">{{itemf.quantity}}</span>
                                            <!--<img v-if="itemf.max_limit_sale?(itemf.quantity<itemf.max_limit_sale):(itemf.quantity<99)" class="add" src="/static/images/public/public_number_add.png" alt="" @click="doGoods(itemf,item.cart_type,1)">-->
                                            <!--<img v-if="itemf.max_limit_sale?(itemf.quantity>=itemf.max_limit_sale):(itemf.quantity>=99)" class="add" src="/static/images/public/public_number_addnot.png" alt="">-->
                                            <!--&lt;!&ndash;<span :class="itemf.max_limit_sale?(itemf.quantity>=itemf.max_limit_sale?'add gray':(itemf.quantity>=99?'add gray':'add')):(itemf.quantity>=99?'add gray':'add')" @click="doGoods(itemf,item.cart_type,1)">+</span>&ndash;&gt;-->
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div class="promo-t" v-if="itemf.product_type==1">
                                <span class="chuxiao-s">赠品</span>
                                <span class="zenp-msg ">{{itemf.marketing_title}}</span>
                                <span class="zenp-num">x{{itemf.quantity}}</span>
                                <span class="skip" @click="selectZenp(items.promotion_info_vo,itemf.sku)" v-if="items.promotion_info_ext&&items.promotion_info_ext.product_list_enable===0">修改</span>
                                <img style="width:12rpx;height:20rpx;" src="/static/goodsdetail/lecard_arrow_right.png" alt="">
                            </div>
                            <div v-for="(itemcx ,indexcx) in itemf.product_promotion_list" :key="indexcx" class="promo-t" v-if="itemcx.is_check&&itemf.product_promotion_list&&itemf.product_promotion_list.length>1" @click="shipTochuxiao(itemf.product_promotion_list,itemf.sku)">
                                <span class="chuxiao-s">促销</span>
                                <span class="tip-msg" style="width:440rpx;">{{itemcx.content}}</span>
                                <span class="skip" style="margin-left:20rpx;">修改</span>
                                <img style="width:12rpx;height:20rpx;" src="/static/goodsdetail/lecard_arrow_right.png" alt="">
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
   		<div class="cart-bottom" v-if="baseData.cart_product_type_list">
            <img class="circle" @click="selectAll(0)" v-if="allSelect" src="/static/images/public/publicCircle-checkOn.png" alt="">
            <img class="circle" @click="selectAll(1)" v-if="!allSelect" src="/static/images/public/publicCircle-checkOff.png" alt="">
            <span class="all-select">全选</span>
            <span class="money-box" v-if="baseData.total_money">
                <span class="money-pay"><span class="all-moeny">合计:</span><moneySpan :money="baseData.total_money" :fontweight="500" :iSize="30" :fSize="24"></moneySpan></span>
                <span class="money-red">已优惠：¥{{baseData.coupon_money}}</span>
            </span>
            <span class="btn-group">
                <span class="btn-left" @click="subGo()">自提({{num>99?'99+':num}})</span>
                <span class="btn-right" @click="subBuy()">配送({{num>99?'99+':num}})</span>
            </span>
        </div>
		<div class="dialog" v-if="showBtn"  @click="closeDialog()" catchtouchmove='true'>
            <div  v-if="showBtn==1" @click.stop class="dialog-modal">
            <img @click="closeDialog()" class="close-dialog" src="/static/images/public/public_pop_close.png" alt="" />
                <div class="dialog-title">
                    门店自提(每日首单满99减5)
                </div>
                <div class="dalog-content">
                	<div class="zanwei"  v-if="!shopData.shops.length">
		           		<img class="zanwei-img" src="/static/images/public/public_empty_pic.png" alt="" />
		           		<p class="zanwei-tip">门店离您太远，建议您使用物流配送哦~</p>
		           	</div>
                    <scroll-view scroll-y style="height: 100%">
                        <div class="dialog-list" :key="indexs" v-for="(item,indexs) in shopData.shops" v-if="shopData.shops[0].quantity?(indexs<4):(indexs<3)" >
                            <div class="dialog-list-title" >
                                <img @click="showShop(indexs)" v-if="showIndex==indexs" class="circle" src="/static/images/public/publicCircle-checkOn.png" alt="">
                                <img @click="showShop(indexs)" v-if="showIndex!=indexs" class="circle" src="/static/images/public/publicCircle-checkOff.png" alt="">
                                <img  v-if="item.quantity" class="lesha" src="/static/images/search/search_sign_speed.png" alt="">
                                <span :class="!item.quantity?'dialog-shopName':'lesha-text'">{{item.quantity?'(下单运费随机减)':item.shop_name}}</span>
                                <span v-if="item.sku_stock_desc" class="dialog-tip">{{item.sku_stock_desc}}</span>
                                <span v-if="!item.quantity" class="dialog-num">{{item.phone}}</span>
                            </div>
                            <div v-if="item.quantity&&showIndex==indexs" class="dialog-goods-lesh">
                                <p class="address-lesh">可配送至：{{baseData.leyou_flash.address}}</p>
                                <p class="desc-lesh">{{baseData.leyou_flash.desc}}</p>
                            </div>
                            <div v-if="!item.quantity&&showIndex==indexs&&item.stock_produt_list.length" class="dialog-goods-list" v-for="items in item.stock_produt_list" :key="index">
                                <img class="dialog-goods-list-img" :src="items.img" alt="">
                                <div class="dialog-list-right">
                                    <p class="goods-msg">{{items.marketing_title}}</p>
                                    <p class="goods-attr">{{items.color?'颜色：'+items.color:''}}  {{items.specifications?'尺码：'+items.specifications:'&nbsp;'}}</p>
                                    <p class="list-bottom">
                                        <span class="money" ><moneySpan v-if="items.product_type!=1" :money="items.sale_price" :iSize="28" :fSize="20"></moneySpan>{{items.product_type==1?'赠品':''}}</span>
                                        <span class="add-reduce">
                                    x{{items.qty}}
                                    </span>
                                    </p>
                                </div>
                            </div>
                            <div v-if="!item.quantity&&showIndex==indexs&&item.product_list.length" class="dialog-goods-list" v-for="(itemp,indexp) in item.product_list" :key="indexp">
                                <img class="dialog-goods-list-img" :src="itemp.img" alt="">
                                <span  class="only-g">商品不足</span>
                                <div class="dialog-list-right">
                                    <p class="goods-msg">{{itemp.marketing_title}}</p>
                                    <p class="goods-attr">{{itemp.color?'颜色：'+itemp.color:''}}  {{itemp.specifications?'尺码：'+itemp.specifications:'&nbsp;'}}</p>
                                    <p class="list-bottom">
                                        <span class="money" ><moneySpan v-if="itemp.product_type!=1" :money="itemp.sale_price" :iSize="28" :fSize="20"></moneySpan>{{itemp.product_type!=1?'':'赠品'}}</span>
                                        <span class="add-reduce">
                                        <span class="noGoods">{{itemp.qty-itemp.stock}}件缺货</span>
                                    x{{itemp.qty}}
                                    </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </scroll-view>
                </div>
 				<div class="dalog-content-bottom">
 					<div class="shop-tip" v-if="shop_stock_desc">
 						<span class="shop-tip-text">{{shop_stock_desc}}</span>
 						<img class="shop-tip-img" src="/static/images/public/shopping_pop_store_arrow.png" alt="" />
 					</div>
 					<span class="choose-shop" @click="goTo()">选择其他自提门店</span>
 					<span v-if="shopData.shops[showIndex]" :class="shopData.shops[showIndex].quantity?'sub-order':shopData.shops[showIndex]&&!shopData.shops[showIndex].stock_produt_list.length?'sub-order sub-order-disable':'sub-order'" @click="zitSub(shopData.shops[showIndex].quantity)">提交订单</span>
 				</div>
            </div>
            <div v-if="showBtn==2" @click.stop class="dialog-modal-lack">
            <img @click="closeDialog()" class="close-dialog" src="/static/images/public/public_pop_close.png" alt="" />
                <p class="dialog-lack-title">您选择的以下商品库存不足</p>
                <div class="dialog-lack-content">
                    <scroll-view scroll-y style="max-height: 360rpx">
                        <div class="dialog-goods-list" v-for="item in noData" :key="index" >
                            <img class="dialog-goods-list-img" :src="item.image" alt="">
                            <span  class="only-g">商品不足</span>
                            <div class="dialog-list-right" >
                                <p class="goods-msg">{{item.marketing_title}}</p>
                                <p class="goods-attr">颜色：{{item.product_color}}  尺码：{{item.product_size}}</p>
                                <p class="list-bottom">
                                    <!--<span class="zenp">赠品</span>-->
                                    <span class="money"><moneySpan :money="item.sale_price" :iSize="26"></moneySpan></span>
                                    <span class="add-reduce">
                                        <span class="noGoods">剩余{{item.sale_quantity}}件</span>
                                    </span>
                                </p>
                            </div>
                        </div>
                    </scroll-view>
                </div>
                <div class="next-btn" @click="goSub()">继续下单</div>
                <p class="next-tip">我们将为您忽略以上商品继续下单</p>
            </div>
            <div v-if="showBtn==3" class="sure-dialog" @click.stop>
                <p class="sure-tip">海淘及供应商发货的商品在门店无货，继续选择自提，相关商品将不计入订单内，是否继续</p>
                <p class="sure-btn">
                    <span class="goOn" @click="sureGo()">继续自提</span>
                    <span class="select" @click="subBuy()">选择配送</span>
                </p>
            </div>
            <div v-if="showBtn==4" class="buy-dialog" @click.stop>
            <img @click="closeDialog()" class="close-dialog" src="/static/images/public/public_pop_close.png" alt="" />

                <div class="dialog-title">请分开结算以下商品</div>
                <div class="buy-list" v-for="item in baseData.cart_product_type_list"  :key="index">
                    <div>
                    <p class="buy-list-title">{{item.cart_type==0?'乐商城':(item.cart_type==1?'全球购':'乐海淘')}}</p>
                    <p class="buy-money">共{{item.num}}件，合计：<moneySpan :money="item.cart_type==0?baseData.self_total_money:item.money" :iSize="26"></moneySpan></p>
                    </div>
                    <span class="go-buy" @click="subList(item.cart_type)">去结算</span>
                </div>
            </div>
            <div v-if="showBtn===5" class="input-dialog" @click.stop>
                <p class="input-title">输入数量</p>
                <input class="num-input" type="text" v-model="goodsNum">
                <p class="btn-p">
                    <span class="quxbtn" @click="closeDialog()">取消</span>
                    <span class="quebtn" @click="sureInput()">确认</span>
                </p>
            </div>
            <div v-if="showBtn==6" class="chuxiao-dialog" @click.stop>
                <img @click="closeDialog()" class="close-dialog" src="/static/images/public/public_pop_close.png" alt="" />
                <p class="chu-title">促销修改</p>
                <div class="chu-list" v-for="item in chuList" @click="selectChu(item.promotion_id)">
                    <img v-if="item.is_check" style="flex-shrink: 0" @click="selectChu(item.promotion_id)"  class="circle" src="/static/images/public/publicCircle-checkOn.png" alt="">
                    <img v-if="!item.is_check" style="flex-shrink: 0" @click="selectChu(item.promotion_id)"  class="circle" src="/static/images/public/publicCircle-checkOff.png" alt="">
                    <p class="chu-list_content">{{item.content}}</p>
                </div>
            </div>
        </div>
    	<promote-title :title_aaa_bbb="'猜你喜欢'" > </promote-title>
        <div class="products_small_wrap" v-if="likeData">
			<likeGood :mainData="item" v-for="(item ,index) in likeData" :key="index"></likegood>
        </div>
    </div>
</template>

<script>
	import likeGood from '@/components/public/likeGood';
    import promoteTitle from '@/components/product/promote/title';
    import cartModal from '@/components/cartModal'
    import alikeCard from '@/components/public/alikeCard.vue'
    import moneySpan from '@/components/public/money.vue'
    import  {choosePromotion,mergeShoppingCart,getLikeInfo, getCartAllData ,synAllShoppingCart,getShopStock,getAdvertisement,calculatePromotion} from '@/api'
    var app =  getApp();
    export default {
        components:{
            alikeCard,
            moneySpan,
            likeGood,
        	promoteTitle,
            cartModal
        },
        filters:{
            priceFloat: function (value) {
                //if (!value) return ''
                console.log(value)
                value = value.toString();
                var result = parseFloat(value).toFixed(2);
                return result;
            }
        },
        onLoad(options){
            this.sa_page(this,false,'购物车','');
            console.log(options);
            this.options=options
            this.showBtn=0
            if(this.options){
                this.selectToBtn=true
            }
            calculatePromotion({promotion_id:12924,source:1})
            console.log(options)
        },
        onReachBottom(){
        	this.getMore()
        },
        onHide(){
            this.showBtn=0
        },
        onShow(){
        	this.token=wx.getStorageSync('token')
        	this.cart_id=wx.getStorageSync('cart_id')
            this.showIndex=0
            wx.showLoading({
                title:'数据加载中'
            })
            if(!wx.getStorageSync('token')&&wx.getStorageSync('cart_id')){
            		getCartAllData({cart_id:wx.getStorageSync('cart_id')}).then(data=>{
            		    wx.hideLoading()
            			this.baseData=data
		                var str= this.baseData.le_vip_message
                        var arr=this.delHtmlTag(str)
                        var str1=this.baseData.vip_message
                        var arr1=this.delHtmlTag(str1)
                        this.msgDatavip={
                            str:arr1[0],
                            num:arr1[1]
                        }
		                this.is_use_vip =this.baseData.is_need_vip?this.baseData.is_use_vip:false

		                this.msgData= {
		                    str:arr[0],
		                    num:arr[1]
		                },
		                this.showSelect()
            		})
                console.log(this.msgData)
            }else{
                if(wx.getStorageSync('token'))
                    if(wx.getStorageSync('cart_id')){
                        mergeShoppingCart({cart_id:wx.getStorageSync('cart_id'),cart_type:2}).then(res=>{
                            wx.removeStorageSync('cart_id')
                            getCartAllData({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined}).then(data=>{
                                this.baseData=data
                                wx.hideLoading()
                                var str= this.baseData.le_vip_message?this.baseData.le_vip_message:this.baseData.vip_message
                                var arr=this.delHtmlTag(str)
                                this.is_use_vip =this.baseData.is_need_vip?this.baseData.is_use_vip:false
                                this.msgData= {
                                    str:arr[0],
                                    num:arr[1]
                                }
                                var str1=this.baseData.vip_message
                                var arr1=this.delHtmlTag(str1)
                                this.msgDatavip={
                                    str:arr1[0],
                                    num:arr1[1]
                                }
                                this.showSelect()
                            })
                        })
                    }else{
                        getCartAllData({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined}).then(data=>{
                            console.log(111111)
                            wx.hideLoading()
                            this.baseData=data
                            var str= this.baseData.le_vip_message?this.baseData.le_vip_message:this.baseData.vip_message
                            var arr=this.delHtmlTag(str)
                            this.is_use_vip =this.baseData.is_need_vip?this.baseData.is_use_vip:false
                            this.msgData= {
                                str:arr[0],
                                num:arr[1]
                            }
                            var str1=this.baseData.vip_message
                            var arr1=this.delHtmlTag(str1)
                            this.msgDatavip={
                                str:arr1[0],
                                num:arr1[1]
                            }
                            this.showSelect()
                        })
                    }
                }
            this.getMore()
            getAdvertisement({}).then(res=>{
                wx.hideLoading()

            console.log(res)
                for(var i = 0;i<res.ad_list.length;i++){
                    if(res.ad_list[i].type==10011013){
                        this.bannerimg=res.ad_list[i]
                        console.log(this.bannerimg);
                        return
                    }

                }
            })
            console.log(2222)

            if(this.options.shops&&this.selectToBtn){
                this.showBtn=1
                this.shopData.shops=[]
                this.shopData.shops.push(JSON.parse(this.options.shops))
                this.shopData.shops[0].show=true
                this.shop_stock_desc=this.options.shop_stock_desc
                this.options=''
                console.log(111)
            }

        },
        data(){
            return{
                options:'',
                msgData:{},
                chuList:[],
                msgDatavip:{},
                page_index:0,
                page_size:10,
                goodsNum:0,
                goodsData:'',
                count:10,
                likeData:[],
                showBtn:0,
                baseData:'',
                token:'',
                shopData:{},
                showIndex:0,
                noData:[],
                is_use_vip:false,
                allSelect:true,
                num:0,
                shop_stock_desc:'',
                bannerimg:{},
                subData:[],
                options:'',
                goodsData:{
                    cart_id:'',
                    sku:'',
                    shop_id:'',
                    quantity:'',
                    hander_type:'',
                    is_check:'',
                    cart_type:'',
                    is_use_vip:''
                }
            }
        },
        methods:{
            selectChu(id){
                choosePromotion({
                    cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined,
                    sku:this.chuSkus,
                    promotion_id:id,
                    source:1
                }).then(res=>{
                    wx.showLoading({
                        title:'加载中'
                    })
                    this.showBtn=0
                    getCartAllData({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined}).then(res=>{
                        console.log({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined})
                        this.baseData=res
                        wx.hideLoading()
                        var str= this.baseData.le_vip_message?this.baseData.le_vip_message:this.baseData.vip_message
                        var arr=this.delHtmlTag(str)
                        this.msgData= {
                            str:arr[0],
                            num:arr[1]
                        }
                        var str1=this.baseData.vip_message
                        var arr1=this.delHtmlTag(str1)
                        this.msgDatavip={
                            str:arr1[0],
                            num:arr1[1]
                        }
                        this.showSelect()

                    })
                })
            },
            shipTochuxiao(data,skus){
                console.log(data)
                this.chuSkus=skus
                this.chuList=data
                this.showBtn=6
            },
            gotoPromotion(data){
                console.log(data);
                let params = '';
                if(data.promotion_type==8){
                    params = `gift=true&source=1&content=${data.promotion_content}&promotion_id=${data.promotion_id}&sort=1&title=${data.promotion_type_title}&shop_id=${this.shop_id}&cart_id=${this.cart_id}`
                }else {
                    params = `source=1&content=${data.promotion_content}&promotion_id=${data.promotion_id}&sort=1&title=${data.promotion_type_title}`
                }
                wx.navigateTo({ url: '/pages/search/salesPromotion/main?'+params})
            },
            selectZenp(data,seceltSku){
                let params = `seceltSku=${seceltSku}&gift=true&source=1&content=${data.promotion_content}&promotion_id=${data.promotion_id}&sort=1&title=${data.promotion_type_title}&shop_id=${this.shop_id}&cart_id=${this.cart_id}`
                wx.navigateTo({ url: '/pages/search/salesPromotion/main?'+params})
            },
            showInput(data,cart_type,num){
                this.showBtn=5
                this.goodsNum=num
                this.goodsData=data
                this.cart_type=cart_type
            },
            sureInput(){
                var reg=/^\+?[1-9][0-9]*$/
                if(!reg.test(this.goodsNum)){
                    wx.showToast({
                        title:'请输入有效数量',
                        icon:'none'
                    })
                    return
                }
                this.showBtn=0
                wx.showLoading({ title: '加载中……', mask: true })
                var goodsData={
                    cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):null,
                    sku:this.goodsData.sku,
                    shop_id:this.baseData.shop_id,
                    quantity:this.goodsNum>99?99-this.goodsData.quantity:this.goodsNum-this.goodsData.quantity,
                    hander_type:1,
                    is_check:this.goodsData.is_check,
                    cart_type:this.cart_type,
                    is_use_vip:this.baseData.is_use_vip
                }
                var subDaata={
                    cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined,
                    shop_id:this.baseData.shop_id,
                    is_use_vip:this.baseData.is_use_vip,
                    hander_cart:[goodsData]
                }
                console.log(subDaata)

                synAllShoppingCart(subDaata).then(res=>{
                    getCartAllData({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined}).then(res=>{
                        this.baseData=res
                        wx.hideLoading()
                        var str= this.baseData.le_vip_message?this.baseData.le_vip_message:this.baseData.vip_message
                        var arr=this.delHtmlTag(str)
                        this.msgData= {
                            str:arr[0],
                            num:arr[1]
                        }
                        var str1=this.baseData.vip_message
                        var arr1=this.delHtmlTag(str1)
                        this.msgDatavip={
                            str:arr1[0],
                            num:arr1[1]
                        }
                        this.showSelect()
                        console.log(res)
                    })
                })
            },
            touchstart (e,indexf,indexc,index) {
                this.showSelect()

                // console.log('看我的内容',e,i)
                // console.log(e,'距离距离');
                //开始触摸时 重置所有删除
                this.touchindexf=indexf
                this.touchindexc=indexc
                this.touchindex=index
                this.startX = e.clientX
                this.startY =e.clientY
            },
            touchend(e,indexf,indexc,index) {
                console.log(this.touchindex)
                //  console.log(e,'距离距离');
                var baseData= JSON.parse(JSON.stringify(this.baseData) ),
                    startX = this.startX,//开始X坐标
                    endX = e.mp.changedTouches[0].pageX;//滑动变化坐标
                console.log(indexf,indexc,index)

                if((startX-endX)>50&&this.touchindexf==indexf
                    &&this.touchindexc==indexc
                &&this.touchindex==index){
                    baseData.cart_product_type_list[index].cart_info_product_list[indexc].cart_product_list[indexf].showDel=1
                }
                this.baseData=baseData

                //获取滑动角度

            },
            /**
             * 计算滑动角度
             * start 起点坐标
             * end 终点坐标
             */
            gototransfer(link){
                wx.setStorageSync("urlH5",link)
                wx.navigateTo({
                    url:`/pages/transferH5/main`
                });
            },
            goLook(){
                wx.switchTab({
                    url:`/pages/index/main`
                })
            },
            //获取推荐商品
        	getMore(){
        		if(this.count<this.page_index+this.page_size){
        			return false
        		}
        		getLikeInfo({page_index:this.page_index,page_size:this.page_size,is_daguan_data:1}).then(res=>{
        			this.count=res.count
	        		this.likeData=this.likeData.concat(res.product_list)
	        		this.page_index+=this.page_size

        		})
        	},
            //vip开关
        	funcVip(e){

        		this.is_use_vip=e.target.value
                var that =this
                var arr=[]
                this.baseData.cart_product_type_list.forEach(data=>{
                    data.cart_info_product_list.forEach(item=>{
                        item.cart_product_list.forEach(res=>{
                            if(res.product_status==0){
                                var goodsData={
                                    cart_id:this.baseData.cart_id,
                                    sku:res.sku,
                                    shop_id:this.baseData.shop_id,
                                    quantity:0,
                                    hander_type:1,
                                    is_check:res.is_check,
                                    cart_type:data.cart_type,
                                    is_use_vip:this.is_use_vip
                                }
                                console.log(res.product_status)
                                arr.push(goodsData)

                            }

                        })
                    })
                })
                var subDaata={
                    cart_id:this.baseData.cart_id,
                    shop_id:this.baseData.shop_id,
                    is_use_vip:this.is_use_vip,
                    hander_cart:arr
                }
                console.log(subDaata)
                wx.showLoading({ title: '加载中……', mask: true })

                synAllShoppingCart(subDaata).then(res=>{
                    getCartAllData({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined}).then(res=>{
                        wx.hideLoading()

                        this.baseData=res

                        var str= this.baseData.le_vip_message?this.baseData.le_vip_message:this.baseData.vip_message
                        var arr=this.delHtmlTag(str)
                        this.msgData= {
                            str:arr[0],
                            num:arr[1]
                        }
                        var str1=this.baseData.vip_message
                        var arr1=this.delHtmlTag(str1)
                        this.msgDatavip={
                            str:arr1[0],
                            num:arr1[1]
                        }
                        this.showSelect()
                        console.log(res)
                    })
                })
        		console.log(this.is_use_vip)
        	},
            //登录
        	goLogin(){
        		wx.navigateTo({
                    url:`/pages/userCenter/login/wxLogin/main`
                });
        	},
            //商品详情
            goMsg(data){
                if(data.product_status!=0){
                    return
                }
                console.log(data.sku)
                wx.navigateTo({
                    url:`/pages/goodsdetailed/main?sku=`+data.sku
                });
            },
            //分开配送
            subList(index){
                console.log(index)
                var arr=[]
                this.showBtn=0
                wx.showLoading({ title: '加载中……', mask: true })

                this.baseData.cart_product_type_list.forEach(data=>{
                    data.cart_info_product_list.forEach((item,n)=>{
                        item.cart_product_list.forEach(res=>{
                            if(res.product_status==0&&res.is_check||data.product_type===1||data.product_type===6){
                                var goodsData={
                                    cart_id:this.baseData.cart_id,
                                    sku:res.sku,
                                    shop_id:this.baseData.shop_id,
                                    quantity:0,
                                    hander_type:1,
                                    is_check:data.cart_type!=index?0:res.is_check,
                                    cart_type:data.cart_type,
                                    is_use_vip:this.baseData.is_use_vip
                                }
                                arr.push(goodsData)
                            }


                        })
                    })
                })
                var subDaata={
                    cart_id:this.baseData.cart_id,
                    shop_id:this.baseData.shop_id,
                    is_use_vip:this.baseData.is_use_vip,
                    hander_cart:arr
                }
                console.log(subDaata)
                synAllShoppingCart(subDaata).then(res=>{
                    getCartAllData({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined}).then(res=>{
                        wx.hideLoading()
                        this.baseData=res
                        var str= this.baseData.le_vip_message?this.baseData.le_vip_message:this.baseData.vip_message
                        var arr=this.delHtmlTag(str)
                        this.msgData= {
                            str:arr[0],
                            num:arr[1]
                        }
                        var str1=this.baseData.vip_message
                        var arr1=this.delHtmlTag(str1)
                        this.msgDatavip={
                            str:arr1[0],
                            num:arr1[1]
                        }
                        this.showSelect()
                        this.subBuy(index)
                        console.log(res)
                    })
                })
            },
            //选择门店
        	goTo(){
        		wx.navigateTo({
                        url:`/pages/shop/shopSelect/main`
                    });
        	},
            //转码
	        delHtmlTag (str) {
                if(!str){
                    return false
                }
	        	var reg = /<[^<>]+>/g;
			  return str.replace(reg, '|').split('|')
			},
            //关闭弹窗
	        closeDialog(){
	        	this.showBtn=0
	        	this.showIndex=0
	        },
            //自提门店选择
        	showShop(index){
        		this.showIndex=index
        	},
            //自提确认
            zitSub(num){
                    if(num){
                        this.skulist=[]
                        this.order_type=3
                        var data={
                            staff_id: this.shopData.shops[this.showIndex].staff_id,
                            // marketing_title:this.shopData.shops[this.showIndex].marketing_title.toString(),
                            sku: this.shopData.shops[this.showIndex].sku,
                            img: this.shopData.shops[this.showIndex].image,
                            stock: this.shopData.shops[this.showIndex].stock,
                            qty: this.shopData.shops[this.showIndex].quantity,
                            sale_price: this.shopData.shops[this.showIndex].sale_price,
                            product_status:this.shopData.shops[this.showIndex].product_status,
                            product_type: this.shopData.shops[this.showIndex].product_type,
                            list_price: this.shopData.shops[this.showIndex].list_price,
                        }
                        this.skulist.push(data)
                        this.closeDialog()
                        wx.navigateTo({
                            url: '/pages/confirm/main?order_type=0&is_use_vip='+this.is_use_vip+'&skulist='+JSON.stringify(this.skulist),
                        })
                        // this.shopData.shops[this.showIndex].stock_produt_list.forEach(item=>{
                        //
                        // })
                    }
                    else {
                        if(!this.shopData.shops[this.showIndex].quantity&&this.shopData.shops[this.showIndex]&&!this.shopData.shops[this.showIndex].stock_produt_list.length){
                            return
                        }

                        if (this.shopData.shops[this.showIndex].stock_produt_list.length) {
                            this.skulist = []
                            this.order_type = 1
                            this.shops = this.shopData.shops[this.showIndex].shop_id
                            this.shopData.shops[this.showIndex].stock_produt_list.forEach(item => {
                                var data = {
                                    staff_id: item.staff_id,
                                    // marketing_title: item.marketing_title.toString(),
                                    sku: item.sku,
                                    img: item.img,
                                    stock: item.stock,
                                    qty: item.qty,
                                    sale_price: item.sale_price,
                                    product_status: item.product_status,
                                    product_type: item.product_type,
                                    list_price: item.list_price,
                                }
                                this.skulist.push(data)
                            })
                        }
                        this.closeDialog()

                        wx.navigateTo({
                            url: '/pages/confirm/main?order_type=1&is_use_vip='+this.is_use_vip+'&skulist='+JSON.stringify(this.skulist)+'&shops='+this.shops,
                        })
                    }

                    console.log('/pages/confirm/main?order_type=1&is_use_vip='+this.is_use_vip+'&skulist='+JSON.stringify(this.skulist)+'&shops='+this.shops)


                // this.shopData.shops[this.showIndex].product_list.forEach(item=>{
                //     // if(){}
                //     var data={
                //         staff_id: item.staff_id,
                //         marketing_title:item.marketing_title,
                //         sku: item.sku,
                //         img: item.img,
                //         stock: item.stock,
                //         qty: item.qty,
                //         sale_price: item.sale_price,
                //         product_status:item.product_status,
                //         product_type: item.product_type,
                //         list_price: item.list_price,
                //     }
                //     this.skulist.push(data)
                // })
                console.log(this.skulist)
            },
            //多选自提按钮
        	subGo(){
if(!wx.getStorageSync('token')){
                    wx.navigateTo({
                        url:`/pages/userCenter/login/wxLogin/main`
                    });
                    return
                }
                var btn =true
        		var that =this
                var arrziti=[]
        		this.baseData.cart_product_type_list.forEach(data=>{
        			data.cart_info_product_list.forEach(item=>{
	        				item.cart_product_list.forEach(res=>{
	        				    if(res.is_check||data.product_type===1||data.product_type===6){
                                    arrziti.push(res)
                                }
	        					if(res.is_check&&data.cart_type!=0){
	        						btn=false
	        					}
	        				})
	        			})
        		})
        		if(!btn){
        			this.showBtn=3
        			return false

	  			}
        		getShopStock({
                    "source_y" : wx.getStorageSync('locationInfo').latitude,
                    "source_x" : wx.getStorageSync('locationInfo').longitude,
                    size:3
                    }).then(res=>{
                        that.shopData=res
                        that.shop_stock_desc=res.shop_stock_desc
                        that.shopData.shops.forEach(res=>{
                            res.show=false
                        })

                        if(that.shopData.shops[0]){
                          that.shopData.shops[0].show=true
                        }
                            that.showBtn=1
                        if(arrziti.length==1&&arrziti[0].leyou_flash.support){
                            that.shopData.shops.unshift(arrziti[0])
                            that.shopData.shops[0].show=false
                            that.shopData.shops[1].show=true
                            that.showIndex=1
                        }
                    })

        	},
            //自提按钮
        	sureGo(){
        		console.log(11111111111)

        		var that =this
        		this.baseData.cart_product_type_list.forEach(data=>{
        				if(data.cart_type!=0){
        					that.selectAll(0,data.cart_type,true)

                        }
        			})

                // this.baseData.cart_product_type_list.forEach(data=>{
                //     data.cart_info_product_list.forEach(item=>{
                //         item.cart_product_list.forEach(res=>{
                //             if(res.is_check) {
                //                 this.arrziti.push(res)
                //             }
                //         })
                //     })
                // })


        	},
            //全选selectAll
        	selectAll(type,cartType,btn){
                    var that =this
        			var arr=[]
        			this.baseData.cart_product_type_list.forEach(data=>{
        				data.cart_info_product_list.forEach(item=>{
	        				item.cart_product_list.forEach(res=>{
	        				    if(res.product_status==0&&res.is_check!=type&&res.product_type!=1&&res.product_type!=6){
                                    var goodsData={
                                        cart_id:this.baseData.cart_id,
                                        sku:res.sku,
                                        shop_id:this.baseData.shop_id,
                                        quantity:0,
                                        hander_type:1,
                                        is_check:type,
                                        cart_type:cartType||data.cart_type,
                                        is_use_vip:this.baseData.is_use_vip
                                    }
                                    console.log(cartType==data.cart_type)
                                    console.log(data.cart_type)
                                    if(cartType){
                                        if(cartType==data.cart_type&&!res.product_status&&res.product_status==0){
                                            console.log(111111111111111)
                                            console.log(goodsData)
                                            arr.push(goodsData)
                                        }
                                    }else{
                                        arr.push(goodsData)
                                    }
                                }



	        				})
	        			})
        			})
        			var subDaata={
	                    cart_id:this.baseData.cart_id,
	                    shop_id:this.baseData.shop_id,
	                    is_use_vip:this.baseData.is_use_vip,
	                    hander_cart:arr
	                }
        			console.log(subDaata)
                wx.showLoading({ title: '加载中……', mask: true })

                synAllShoppingCart(subDaata).then(res=>{
						getCartAllData({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined}).then(res=>{
                            wx.hideLoading()

                            this.baseData=res
                            if(btn){
                                this.arrziti=[]
                                this.baseData.cart_product_type_list.forEach(data=>{
                                    data.cart_info_product_list.forEach(item=>{
                                        item.cart_product_list.forEach(res=>{
                                            if(res.is_check) {
                                                this.arrziti.push(res)
                                            }
                                        })
                                    })
                                })
                                getShopStock({
                                    "source_y" : "39.893118",
                                    "source_x" : "116.651401",
                                    size:3
                                }).then(res=>{
                                    that.shopData=res
                                    that.shopData.shops.forEach(res=>{
                                        res.show=false
                                    })
                                    if(that.shopData.shops[0]){
                                        that.shopData.shops[0].show=true
                                    }
                                    that.showBtn=1
                                    if(this.arrziti.length==1&&this.arrziti[0].leyou_flash.support){

                                        that.shopData.shops.unshift(this.arrziti[0])
                                        that.shopData.shops[0].show=false
                                        that.shopData.shops[1].show=true
                                        that.showIndex=1
                                        console.log(that.shopData.shops)

                                    }
                                })
                            }

			                var str= this.baseData.le_vip_message?this.baseData.le_vip_message:this.baseData.vip_message
							var arr=this.delHtmlTag(str)
							this.msgData= {
			                    str:arr[0],
			                    num:arr[1]
			                }
                            var str1=this.baseData.vip_message
                            var arr1=this.delHtmlTag(str1)
                            this.msgDatavip={
                                str:arr1[0],
                                num:arr1[1]
                            }
			                this.showSelect()
			                console.log(res)
			           })
	                })


        	},
            //单选
        	select(data,type,cart_type){
        			console.log(type)

        		if(type==2){
                    if(data.product_status&&data.product_status!=0){
                        return false
                    }
        			var goodsData={
	                    cart_id:this.baseData.cart_id,
	                    sku:data.sku,
	                    shop_id:this.baseData.shop_id,
	                    quantity:0,
	                    hander_type:1,
	                    is_check:data.is_check?0:1,
	                    cart_type:cart_type,
	                    is_use_vip:this.baseData.is_use_vip
	                }
	                var subDaata={
	                    cart_id:this.baseData.cart_id,
	                    shop_id:this.baseData.shop_id,
	                    is_use_vip:this.baseData.is_use_vip,
	                    hander_cart:[goodsData]
	                }
                    wx.showLoading({ title: '加载中……', mask: true })

                    synAllShoppingCart(subDaata).then(res=>{
						getCartAllData({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined}).then(res=>{
                            console.log({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined})

                            this.baseData=res
                            wx.hideLoading()
							var str= this.baseData.le_vip_message?this.baseData.le_vip_message:this.baseData.vip_message
			                var arr=this.delHtmlTag(str)
							this.msgData= {
			                    str:arr[0],
			                    num:arr[1]
			                }
                            var str1=this.baseData.vip_message
                            var arr1=this.delHtmlTag(str1)
                            this.msgDatavip={
                                str:arr1[0],
                                num:arr1[1]
                            }
			                this.showSelect()

			           })
	                })
        		}
        		if(type==1){

        			console.log(data)
        			var arr=[]

        			data.cart_info_product_list.forEach(item=>{
        				item.cart_product_list.forEach(res=>{
                        if(res.product_status==0&&res.product_type!=1&&res.product_type!=6){
                            var goodsData={
                                cart_id:this.baseData.cart_id,
                                sku:res.sku,
                                shop_id:this.baseData.shop_id,
                                quantity:0,
                                hander_type:1,
                                is_check:data.check?0:1,
                                cart_type:cart_type,
                                is_use_vip:this.baseData.is_use_vip
                            }
                            arr.push(goodsData)
                            }
        				})
        			})
        			var subDaata={
	                    cart_id:this.baseData.cart_id,
	                    shop_id:this.baseData.shop_id,
	                    is_use_vip:this.baseData.is_use_vip,
	                    hander_cart:arr
	                }
                    wx.showLoading({ title: '加载中……', mask: true })

                    synAllShoppingCart(subDaata).then(res=>{
						getCartAllData({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined}).then(res=>{
							var str= this.baseData.le_vip_message?this.baseData.le_vip_message:this.baseData.vip_message
							var arr=this.delHtmlTag(str)
							this.msgData= {
			                    str:arr[0],
			                    num:arr[1]
			                }
                            wx.hideLoading()

                            var str1=this.baseData.vip_message
                            var arr1=this.delHtmlTag(str1)
                            this.msgDatavip={
                                str:arr1[0],
                                num:arr1[1]
                            }
			                this.baseData=res
			                this.showSelect()
			                console.log(res)
			           })
	                })
        		}
        	},
            //选择数据初始化
        	showSelect(){
        			this.num=0
        		this.allSelect=true
				if(this.baseData.cart_product_type_list){
					this.baseData.cart_product_type_list.forEach((item,index)=>{
					item.check=true
					item.cart_info_product_list.forEach(res=>{
						res.cart_product_list.forEach(data=>{
                            data.showDel=0
							if(!data.is_check&&data.product_type==0&&data.product_status==0){
								item.check=false
								this.allSelect=false
							}else{
							    if(data.is_check&&data.product_type!=1)this.num+=data.quantity

							}
						})
					})

				})
                    console.log(11111111111111)


				}

        	},

            //配送下单
			subBuy(type){
                wx.showLoading({
                    title:'加载中'
                })
                if(!wx.getStorageSync('token')){
                    wx.hideLoading()
                    wx.navigateTo({
                        url:`/pages/userCenter/login/wxLogin/main`
                    });
                    return
                }
				var num=0
				this.noData=[]
                this.subData=[]
                var arr= JSON.parse(JSON.stringify(this.baseData.cart_product_type_list))
                arr.forEach((item,index)=>{
					this.subData[index]=[]
					var num=0
					var money=0
					item.cart_info_product_list.forEach(res=>{
						res.cart_product_list.forEach(data=>{
							if(data.is_check||data.product_type===1||data.product_type===6){
                                this.subData[index].push(data)
                                num+=data.quantity
								money+=data.sale_price*data.quantity
							}
							if(data.is_check&&data.sale_quantity<data.quantity){
                                data.cart_type=item.cart_type
								this.noData.push(data)
							}
						})
					})
                item.num = num
                item.money = money

				})
                this.$set(this.baseData,'cart_product_type_list',arr)
                // this.$set(this.baseData.cart_product_type_list[index],'money',money)
				console.log(this.subData)
                var subLenth=0
                this.subData.forEach(item=>{
                    if(item.length){
                        subLenth++
                    }
                })
				if(this.subData.length>1&&subLenth>1){
                    wx.hideLoading()
                    this.showBtn=4
                    console.log(this.showBtn)
                    return;
				}
				if(this.noData.length){//缺货逻辑
                    this.order_type=type?3:0
                    this.skulist=[]
                    for(var i =0;i<this.subData.length;i++){
                        if(this.subData[i].length){
                            this.subData[i].forEach(item=>{
                                if(item.sale_quantity){
                                    if(item.sale_quantity>item.quantity){
                                        var data={
                                            staff_id: item.staff_id,
                                            marketing_title:item.marketing_title,
                                            sku: item.sku,
                                            img: item.image,
                                            stock: item.stock,
                                            qty: item.quantity,
                                            sale_price: item.sale_price,
                                            product_status:item.product_status,
                                            product_type: item.product_type,
                                            list_price: item.list_price,
                                        }
                                    }else{
                                        var data={
                                            staff_id: item.staff_id,
                                            marketing_title:item.marketing_title,
                                            sku: item.sku,
                                            img: item.image,
                                            stock: item.stock,
                                            qty: item.sale_quantity,
                                            sale_price: item.sale_price,
                                            product_status:item.product_status,
                                            product_type: item.product_type,
                                            list_price: item.list_price,
                                        }
                                    }
                                }
                            })
                            break
                        }

                    }
                    wx.hideLoading()
					this.showBtn=2
					console.log(this.showBtn)
				}
				else{
                    this.skulist=[]
                    this.order_type=type?3:0
                    for(var i =0;i<this.subData.length;i++){
                        if(this.subData[i].length){
                            this.order_type=this.baseData.cart_product_type_list[i].cart_type?3:0
                            this.subData[i].forEach(item=>{
                                if(item.sale_quantity){
                                    if(item.sale_quantity>item.quantity){
                                        var data={
                                            staff_id: item.staff_id,
                                            marketing_title:item.marketing_title,
                                            sku: item.sku,
                                            img: item.image,
                                            stock: item.stock,
                                            qty: item.quantity,
                                            sale_price: item.sale_price,
                                            product_status:item.product_status,
                                            product_type: item.product_type,
                                              list_price: item.list_price,
                                        }
                                    }else{
                                        var data={
                                            staff_id: item.staff_id,
                                            marketing_title:item.marketing_title,
                                            sku: item.sku,
                                            img: item.image,
                                            stock: item.stock,
                                            qty: item.sale_quantity,
                                            sale_price: item.sale_price,
                                            product_status:item.product_status,
                                            product_type: item.product_type,
                                            list_price: item.list_price,
                                        }
                                    }
                                     if(item.choose_promotion_id && item.choose_promotion_id != '') {
                                        data.promotion_id = item.choose_promotion_id
                                    }
                                    this.skulist.push(data)
                                }
                            })
                            break
                        }

                    }
                    wx.hideLoading()
                    // skulist: [

                    // this.is_use_vip =this.baseData.is_need_vip?(this.baseData.is_use_vip?1:0):0
                    this.closeDialog()
                    let skuliststr = JSON.stringify(this.skulist);
                    console.log(encodeURIComponent(skuliststr));
                    console.log('/pages/confirm/main?order_type='+this.order_type+'&is_use_vip='+(this.is_use_vip?'1':'0')+'&skulist='+JSON.stringify(this.skulist))
                    wx.navigateTo({
                        url: '/pages/confirm/main?order_type='+this.order_type+'&is_use_vip='+(this.is_use_vip?'1':'0')+'&skulist='+encodeURIComponent(skuliststr),
                    })
                }

				console.log(this.noData)
			},
            //去自提下单
            goSub(){
                wx.showLoading({ title: '加载中……', mask: true })
                var noArr=[]
                this.noData.forEach(data=>{
                    if(data.sale_quantity==0){
                        var goodsData={
                            cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):null,
                            sku:data.sku,
                            shop_id:this.baseData.shop_id,
                            quantity:0,
                            hander_type:1,
                            is_check:0,
                            cart_type:data.cart_type,
                            is_use_vip:this.baseData.is_use_vip
                        }
                        noArr.push(goodsData)
                    }

                })
                var subDaata={
                    cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined,
                    shop_id:this.baseData.shop_id,
                    is_use_vip:this.baseData.is_use_vip,
                    hander_cart:noArr
                }
                synAllShoppingCart(subDaata).then(res=>{
                    getCartAllData({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined}).then(res=>{
                        this.baseData=res
                        wx.hideLoading()
                        var str= this.baseData.le_vip_message?this.baseData.le_vip_message:this.baseData.vip_message
                        var arr=this.delHtmlTag(str)
                        this.msgData= {
                            str:arr[0],
                            num:arr[1]
                        }
                        var str1=this.baseData.vip_message
                        var arr1=this.delHtmlTag(str1)
                        this.msgDatavip={
                            str:arr1[0],
                            num:arr1[1]
                        }
                        this.showSelect()
                        console.log(res)
                    })
                })
            	if(this.skulist.length){
                    this.closeDialog()
            		console.log('/pages/confirm/main?order_type=0&is_use_vip='+(this.is_use_vip?'1':'0')+'&skulist='+JSON.stringify(this.skulist))
	                wx.navigateTo({
	                    url: '/pages/confirm/main?order_type=0&is_use_vip='+(this.is_use_vip?'1':'0')+'&skulist='+JSON.stringify(this.skulist),
	                })
            	}else{
            		wx.showToast({
            			title:'当前没有可以购买的商品',
            			icon:'none'
            		})
            		this.showBtn=0
            	}

            },
            //g购物车加减
            delGoode(data,cart_type){
                var goodsData={
                    cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):null,
                    sku:data.sku,
                    shop_id:this.baseData.shop_id,
                    quantity:data.quantity,
                    hander_type:2,
                    is_check:data.is_check,
                    cart_type:cart_type,
                    is_use_vip:this.baseData.is_use_vip
                }
                var subDaata={
                    cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined,
                    shop_id:this.baseData.shop_id,
                    is_use_vip:this.baseData.is_use_vip,
                    hander_cart:[goodsData]
                }
                wx.showLoading({ title: '加载中……', mask: true })

                console.log(subDaata)

                synAllShoppingCart(subDaata).then(res=>{
                    getCartAllData({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined}).then(res=>{
                        this.baseData=res
                        wx.hideLoading()
                        var str= this.baseData.le_vip_message?this.baseData.le_vip_message:this.baseData.vip_message
                        var arr=this.delHtmlTag(str)
                        this.msgData= {
                            str:arr[0],
                            num:arr[1]
                        }
                        var str1=this.baseData.vip_message
                        var arr1=this.delHtmlTag(str1)
                        this.msgDatavip={
                            str:arr1[0],
                            num:arr1[1]
                        }
                            this.showSelect()
                        console.log(res)
                    })
                })
            },
            doGoods(data,cart_type,num){
                if((data.quantity==1&&num==-1)||(data.quantity==99&&num==1)){

                    return false
                }
                var goodsData={
                    cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):null,
                    sku:data.sku,
                    shop_id:this.baseData.shop_id,
                    quantity:num,
                    hander_type:1,
                    is_check:data.is_check,
                    cart_type:cart_type,
                    is_use_vip:this.baseData.is_use_vip
                }
                var subDaata={
                    cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined,
                    shop_id:this.baseData.shop_id,
                    is_use_vip:this.baseData.is_use_vip,
                    hander_cart:[goodsData]
                }
                console.log(subDaata)
                wx.showLoading({ title: '加载中……', mask: true })

                synAllShoppingCart(subDaata).then(res=>{
					getCartAllData({cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined}).then(res=>{
                        this.baseData=res
                        wx.hideLoading()

                        var str= this.baseData.le_vip_message?this.baseData.le_vip_message:this.baseData.vip_message
                        var arr=this.delHtmlTag(str)
                        this.msgData= {
                            str:arr[0],
                            num:arr[1]
                        }
                        var str1=this.baseData.vip_message
                        var arr1=this.delHtmlTag(str1)
                        this.msgDatavip={
                            str:arr1[0],
                            num:arr1[1]
                        }
                        this.showSelect()
                        console.log(res)
                    })
                })
            }
        }
    }
</script>

<style scoped>
    .huangou{
        font-size:20rpx;
        padding: 3rpx 4rpx;
        border: 1px solid #FF5500;
        color: #FF5500;
        border-radius: 8rpx;
    }
    .chu-list_content{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .chu-list{
        display: flex;
        padding: 20rpx 40rpx;
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        color: #333333;
        letter-spacing: 0;
        line-height: 32px;
    }
    .chu-list .circle{
        padding-right: 20rpx;
    }
    .chu-title{
        font-family: PingFangSC-Medium;
        font-size: 30rpx;
        color: #333333;
        text-align: center;
        height: 80rpx;
        line-height: 80rpx;
        font-weight: bold;
    }
    .chuxiao-dialog{
        min-height: 200rpx;
        background: #fff;
        width: 100%;
        position: absolute;
        bottom: 0;
        border-top-left-radius: 15rpx;
        border-top-right-radius:15rpx ;
        padding-bottom: 20rpx;
    }
    .promo-t{
        /* line-height: 50rpx; */
        height: 26rpx;
        display: flex;
        align-items: center;
        padding: 20rpx 0rpx;
    }
    .promo-t .skip{
        color: #333;
        width: 55rpx;
        /* margin-top: 7rpx; */
        /* font-weight: normal; */
    }
    .chuxiao-s{
        font-size: 22rpx;
        padding: 2rpx 10rpx;
        background: #eee;
        border-radius: 20rpx;
        margin-left: 80rpx;
    }
    .gray{
        color: #eee!important;
    }
    .dialog-goods-lesh{
        height: 140rpx;
        padding:10rpx 80rpx;
        font-size: 28rpx;
    }
    .lesha-text{
        color: #ff5000;
        font-size: 24rpx;
    }
    .desc-lesh{
        font-size: 24rpx;
        color: #999;
    }
    .input-title{
        font-size: 28rpx;
        line-height: 60rpx;
        padding-left: 40rpx;
        height: 60rpx;
    }
    .num-input{
        margin:0 20rpx;
        width: 560rpx;
        font-size:26rpx;
        border-bottom: 3px solid #429984;
        color:#429984;
    }
    .btn-p{
        padding-top: 40rpx;
        text-align: right;
        padding-right: 40rpx;
    }
    .quxbtn,.quebtn{
        padding: 20rpx;
        font-size: 28rpx;
    }
    .input-dialog{
        width:600rpx;
        height: 250rpx;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -300rpx;
        margin-top: -125rpx;
    }
    .pic-right{
        height: 22rpx;
        width: 12rpx;
        padding-left: 10rpx;
        padding-bottom: 5rpx;
        vertical-align: middle;
        display: inline-block;
    }
    .del{
        position: absolute;
        width: 100rpx;
        right: -100rpx;
        height: 200rpx;
        background: #ff5000;
        font-size: 26rpx;
        color: #fff;
        line-height: 200rpx;
        text-align: center;
        top: 0;
    }
    .showDel{
        transform: translateX(-100rpx);
        transition: ease-out 0.5s;
    }
    .lesha{
        vertical-align: middle;
        width: 76rpx;
        height: 30rpx;
        padding-bottom: 10rpx;
    }
	.products_small_wrap {
	    padding-top: 6px;
	    display: flex;
	    flex-wrap: wrap;
        background: #eee;
	    justify-content: space-between;
	}
	.goTologin{
		padding: 5rpx 20rpx;
		height: 30rpx;
		line-height: 30rpx;
		margin-top: 15rpx;
		background: #FF5000;
		font-size: 24rpx;
		border-radius: 24rpx;
		float: right;
		color: #fff;
	}
	.tologin{
		height: 60rpx;
		line-height: 60rpx;
		padding:0 10rpx ;
		font-size: 26rpx;
		background: #fff;
	}
    .sub-order-disable{
        background: #999!important;
    }
    .zenp-msg{
        font-size: 22rpx;
        width: 420rpx;
        color: #333;
        padding: 10rpx;
        display: inline-block;
        vertical-align: middle;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;

    }
    .zenp-num{
        vertical-align: middle;
        font-size: 22rpx;
        width: 40rpx;
    }
    .zenp-btn{
        color: #666!important;
        margin-left: 80rpx;
        border: 1rpx solid #666;
        padding: 5rpx 10rpx;
        vertical-align: middle;
        font-size: 20rpx;
        border-radius: 24rpx;
    }

	.goLook{
		font-size: 26rpx;
		padding:10rpx 40rpx;
		background: #FF5000;
		color: #fff;
		border-radius: 26rpx;
	}
    .goLook_warp {
        padding: 30px 0 80px;
    }
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
	.img-nav-img{
		width: 710rpx!important;
        border-radius: 16rpx;

    }
	.close-dialog{
		height: 44rpx;
		width: 44rpx;
		position: absolute;
		right: 20rpx;
		top: 20rpx;;
	}
	.shop-tip{
		position: absolute;
		bottom: 80rpx;;
		left: 20rpx;
	}
	.shop-tip-text{

		padding: 5rpx 20rpx;
		background: #FAC800;
		color: #886400;
		border-radius: 26rpx;
		font-size: 26rpx;
	}
	.shop-tip-img{
		position: absolute;
		bottom: -14rpx;
		left: 50%;
		margin-left: -14rpx;
		height: 14rpx;
		width: 28rpx;
	}
	.dalog-content-bottom{
		height: 96rpx;
		border-top: 1rpx solid #eee;
		font-size: 0;
		width: 100%;

	}
	.choose-shop{
		display: inline-block;
		width: 410rpx;
		padding-left: 20rpx;
		height: 100%;
		font-size: 26rpx;
		line-height: 96rpx;
		color: #999;
	}
	.sub-order{
		display: inline-block;
		width: 280rpx;
		height: 110rpx;
		line-height: 96rpx;
		text-align: center;
		color: #fff;
        float: right;
		font-size: 30rpx;
		background: #FF5000 ;
	}
	page{
		background: #eee;
	}
    .sure-dialog{
        width: 590rpx;
        height: 334rpx;
        position: absolute;
        margin-top: -167rpx;
        margin-left: -295rpx;
        top: 50%;
        left: 50%;
        background: #fff;
        border-radius: 16rpx;
    }
    .buy-dialog{
        min-height: 90rpx;
        width: 100%;
        position: fixed;
        bottom: 0;
        background: #fff;
    }
    .buy-list{
        height: 132rpx;
        margin: 0 20rpx;
        border-bottom: 1rpx solid #eee;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .go-buy{
        font-size: 26rpx;
        color: #fff;
        display: inline-block;
        height: 52rpx;
        width: 140rpx;
        background: #ff5000;
        line-height:52rpx;
        text-align: center;
        /* position: absolute; */
        /* right: 20rpx; */
        /* bottom: 28rpx; */
        border-radius: 26rpx;
    }
    .buy-list-title{
        font-size: 26rpx;
        color: #999;
        /* padding: 20rpx 0; */
        padding-bottom: 20rpx;
    }
    .buy-money{
        font-size: 26rpx;
        color: #333;
    }
    .goOn,.select{
        width: 49.5%;
        line-height: 88rpx;
        text-align: center;
        display: inline-block;
        float: left;
        font-size: 30rpx;
    }
    .select{
        border-left: 1rpx solid #eee;
        color: #FF5000;
    }
    .sure-btn{
        height: 87rpx;
        width: 100%;
        position: absolute;
        bottom: 0;
        border-top: 1rpx solid #eee;
    }
    .dialog-modal-lack{
        max-height: 707rpx;
        padding-bottom: 40rpx;
        width: 710rpx;
        background: #fff;
        border-radius: 16rpx;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -355rpx;
        margin-top: -353.5rpx;
    }
    .sure-tip{
        padding: 60rpx 40rpx;
        font-size: 30rpx;
        color: #333;
    }
    .dialog-lack-title{
        padding: 80rpx 0 40rpx 40rpx;
        font-size: 30rpx;

    }
    .dialog-lack-content{
        max-height: 360rpx;
        overflow: auto;
    }
    .next-tip{
        font-size: 26rpx;
        color: #999;
        text-align: center;
    }
    .next-btn{
        margin: 40rpx auto 20rpx;
        width: 280rpx;
        height: 72rpx;
        background: #FF5000;
        line-height: 72rpx;
        font-size: 30rpx;
        color: #fff;
        border-radius: 36rpx;
        text-align: center;
    }
    .dialog{
        position: fixed;
        height: 100%;
        width: 100%;
        background: rgba(0,0,0,0.3);
        z-index: 99;
        top: 0;
    }
    .dialog .circle{
        height: 36rpx;
        width: 36rpx;
        vertical-align: middle;
        padding-left: 0rpx;
        vertical-align: middle;
    }
    .noGoods{
        color: #FF5000 ;
    }
    .zenp{
        color: #FF5000 ;
        font-size: 26rpx;
        vertical-align: middle;
    }
    .dialog-title{
        height: 104rpx;
        border-bottom: 1rpx solid #eee;
        line-height: 104rpx;
        text-align: center;
        font-size: 34rpx;
        font-family: PingFangSC-Regular;
    }
    .dialog-num{
        font-size: 26rpx;
        float: right;
        padding: 10rpx 5rpx 0;
    }
    .dialog-tip{
        font-size: 22rpx;
        padding: 0 10rpx;
        border: 1rpx solid #FF5000;
        color: #FF5000;
        border-radius: 15rpx;

    }
    .dialog-list-title{
        padding: 20rpx;
    }
    .dialog-list .lesha{
        padding: 0 20rpx;
    }
    .dialog-goods-list{
        margin: 0 40rpx;
        background: #FAFAFA;
        width: 590rpx;
        padding: 20rpx;
        height: 120rpx;
        border-bottom: 1rpx solid #eee;
        position: relative;
    }
    .dialog-goods-list-img{
        vertical-align: middle;
        height: 120rpx;
        width: 120rpx;
    }
    .dialog-goods-list .only-g{
        width:120rpx;
        position:absolute;
        bottom:20rpx;
        font-size:20rpx;
        left:20rpx;
        border-bottom-right-radius:0!important;
        border-bottom-left-radius:0!important;
        text-align:center;
        height:32rpx;
        line-height:32rpx;
        color:#fff;
        background:#999;


    }
    .dialog-list-right{
        position: absolute;
        vertical-align: middle;
        height: 120rpx;
        width: 450rpx;
        right:20rpx;
        top: 20rpx;
    }
    .dialog-shopName{
        font-size: 30rpx;
        padding-left: 20rpx;
        max-width: 280rpx;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        display: inline-block;
        vertical-align: middle;

    }
    .dalog-content{
        height: 785rpx;
        overflow: auto;
    }

    .dialog-modal{
        height: 986rpx;
        width: 710rpx;
        background: #fff;
        border-radius: 16rpx;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top:-493rpx;
        margin-left: -355rpx;
        overflow: hidden;
    }
    .all-select{
        vertical-align: middle;
        font-size: 26rpx;
        padding-left: 25rpx;
    }
    .all-moeny{
        font-size: 26rpx;
        color: #333;
    }
    .btn-group{
        float: right;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 30rpx;
        width: 340rpx;
        border-radius: 40rpx;
        overflow: hidden;
        margin-top: 10rpx;
        margin-right: 10rpx;
    }
    .btn-left,.btn-right{
        display: inline-block;
        height: 100%;
        width: 170rpx;
        color: #fff;
        font-weight: bold;
        text-align: center;

    }
    .btn-left{
        background: #FAB400;
    }
    .btn-right{
        background: #FF5000 ;
        border-top-right-radius: 40rpx;
        border-bottom-right-radius: 40rpx;

    }
    .list-bottom{
        position: absolute;
        bottom: 0;
        height: 45rpx;
        line-height: 45rpx;
        width: 100%;
        vertical-align: middle;
    }
    .money{
        color: #FF5000!important;
        font-size: 30rpx;
        font-weight: 500;
    }
    .money-box{
        padding-left:10rpx;
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }
    .money-red{
        font-size: 20rpx;
        color: #666;

    }
    .money-pay,.money-red{
        display:block;

        width: 100%;
    }
    .money-pay{
    	color: #FF5000;
    }
    .main-cart{
        background: #f3f5f7;
        /* height: 100%; */
        min-height: 1500rpx;
        padding-bottom: 98rpx;
    }
    .img-nav{
        margin-bottom: 20rpx;

    }
    .circle{
        height: 36rpx;
        width: 36rpx;
        display: inline-block;
        vertical-align: middle;
        padding-left: 20rpx;
        vertical-align: middle;
    }
    .switch{
        height: 80rpx;
        line-height: 80rpx;
        background: #fff;
        font-size: 26rpx;
        margin-bottom: 3rpx;
        border-radius: 16rpx;
    }
    .cart-bottom{
        height: 98rpx;
        width: 100%;
        background: #fff;
        position: fixed;
        bottom: 0;
        border-top: 1rpx solid #dddddd;
    }
    .switch-msg{
        padding-left: 20rpx;
        color: #333;
    }

    .btn{
        float: right;
        line-height: 70rpx;
    }
    .good-list{
        border-radius: 16rpx;
        padding-bottom: 20rpx;
        position: relative;
    }
    .goods-img{
        height: 180rpx;
        width: 180rpx;
        vertical-align: middle;
        margin-left: 20rpx;
        border-radius: 16rpx;
    }
    .has-no{
        color: #CACACA!important;
    }
    .noMore{
        height: 80rpx;
        width: 80rpx;
        display: inline-block;
        border-radius: 50%;
        background: rgba(0,0,0,0.5);
        font-size: 24rpx;
        position: absolute;
        top: 70rpx;
        left: 130rpx;
        line-height: 80rpx;
        text-align: center;
        color: #fff;
    }
    .only-g{
        width: 180rpx;
        position: absolute;
        bottom:20rpx;
        font-size: 20rpx;
        left: 75rpx;
        border-bottom-right-radius:16rpx;
        border-bottom-left-radius:16rpx;
        text-align: center;
        height: 32rpx;
        line-height: 32rpx;
        color: #fff;
        background: #999;
    }
    .only-p,.only-z{
        width: 180rpx;
        position: absolute;
        bottom:20rpx;
        font-size: 20rpx;
        left: 75rpx;
        border-bottom-right-radius:16rpx;
        border-bottom-left-radius:16rpx;
        text-align: center;
        height: 32rpx;
        line-height: 32rpx;
        color: #fff;
        background: #FF7D41;

    }
    .only-z{
        background: #FAB400;
    }
    .goods-right{
        display: inline-block;
        width: 414rpx;
        height: 100%;
        padding-left: 20rpx;
        vertical-align: top;
        position: relative;
    }
    .xiang{
        font-size: 20rpx;
        color: #999;
        position: absolute;
        bottom: 50rpx;
        right: 40rpx;
    }
    .add-reduce{
        font-size: 24rpx;
        float: right;
        height: 45rpx;
        line-height: 45rpx;
        padding-right: 20rpx;
    }
   .goods-num{
        display: inline-block;
        height: 40rpx;
        vertical-align: middle;
        line-height:  40rpx;
        text-align: center;
    }
    .reduce,.add{
       height: 40rpx;
        width: 40rpx;
        vertical-align: middle;

    }
    .goods-num{
        width: 68rpx;
        height: 40rpx;
        background: #F6F6F6;
        text-align: center;
        font-size: 28rpx;

    }
    .goods-msg{
        /*display: inline-block;*/
        font-size: 26rpx;
        /*overflow:hidden;*/
        /*text-overflow:ellipsis;*/
        /*white-space:nowrap;*/
        width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .dialog .goods-msg{
        display: inline-block;
        font-size: 26rpx;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        width: 100%;

    }
    .goods-attr{
        font-size: 20rpx;
        color: #666;
    }
    .list-top{
        height: 80rpx;
        line-height: 80rpx;
        border-bottom: 1px solid #eee;
        background: #fff;
        border-top-left-radius: 16rpx;
        border-top-right-radius: 16rpx;
    }
    .shopName{
        font-size: 30rpx;
        font-weight: bold;
        padding-left: 20rpx;
    }
    .mark{
       width: 56rpx;
        height: 30rpx;
        vertical-align: middle;
        padding-left: 10rpx;
    }
    .cart-box{
        margin: 20px;
        border-radius: 16rpx;
    }
    .list-goods-box{
        padding: 10rpx 0;
        border-radius: 16rpx;
        margin: 0 0 5rpx;
        background: #fff;
        overflow: hidden;
    }
    .list-goods-box:nth-of-type(1){
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
    .list-goods{
        height: 180rpx;
        padding: 20rpx 0;
        position: relative;
    }

    .tip,.skip{
        /* float: right; */
        width: 60rpx;
        font-size: 22rpx;
        /* padding-right: 20rpx; */
    }
    .skip{
        color: #FF5000;
        font-weight: 700;
        vertical-align: middle;

    }

    .list-tip{
        height: 80rpx;
        line-height: 80rpx;
        background: #fff;
    }
    .new-btn{
        background: #FF5000;
        height: 24rpx;
        font-size: 20rpx;
        color: #fff;
        padding: 0 15rpx;
        border-radius: 14rpx;
        line-height: 24rpx;
    }
    .new-btn-p{
        font-size: 24rpx;
    }
    .tip-btn{
        background: #FF5000;
		padding: 0 10rpx;
        height: 32rpx;
        line-height: 32rpx;
        font-size: 20rpx;
        margin-left: 80rpx;
        color: #fff;
        display: inline-block;
        text-align: center;
        border-radius: 16rpx;
        vertical-align: middle;

    }
    .tip-msg{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        width:400rpx ;
        display: inline-block;
        font-size: 24rpx;
        margin-left: 20rpx;
        vertical-align: middle;
        color: #333;
    }
    /**/
    .alike {
        align-items: center;
        min-height: 68rpx;
        padding-top: 10rpx;
        padding-bottom: 10rpx;
        background: #ffffff;
        position: relative;
    }
    .card {
        background: #FFFAEB;
    }
    .cardlab-span{
        display: inline-block;
        margin-left: 20rpx;
        margin-right: 5rpx;
        /* width: 104rpx; */
        height: 32.65rpx;
        border-radius: 17rpx;
        text-align: center;
        background: #3A3A3A;
        vertical-align: middle;
        overflow: hidden;

    }
    .card .cardlab {

        width: 100rpx;
        height: 32.65rpx;
        vertical-align: top;
        overflow: auto;
    }
    .alike-top{
        padding-top:8rpx ;
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
        position: absolute;
        top: 0;
        right: 0;
        align-items: center;
        background: #ffeba2;
    }
</style>
