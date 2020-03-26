<template>
    <div class="giftlist">
        <div class="shopcart_pro" @click.stop="funcSelectClick(index)" v-for="(item, index) in shop_product_list" :key="index">
            <img v-if="item.select" src="/static/images/public/publicCircle-checkOn.png"  style="width:36rpx;height:36rpx;">
            <img v-else src="/static/images/public/publicCircle-checkOff.png"  style="width:36rpx;height:36rpx;">
            <div class="shopcart_pro_content">
                <img :src="item.image || '/static/images/twohr_seat_pic70x70.png'" style="width:120rpx;height:120rpx;">
                <div class="shopcart_pro_desc">
                    <div class="ellipsis" style="color:#333;font-size:24rpx;font-family:PingFangSC-Medium;">{{item.marketing_title}}</div>
                    <div class="shopcart_pro_desc_price">
                        <span v-if="huangougift" style="font-size:24rpx;font-family: PingFangSC-Medium;color:#ff5000">赠品</span>
                        <span v-else style="font-size:24rpx;font-family:PingFangSC-Medium;color:#ff5000">{{item.sale_price}}</span>
                        <span style="font-size:24rpx;color:#333">×{{item.quantity}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="sales_shopcart_submit_box">
            <div class="sales_shopcart_submit" @click.stop="funcSubmit()">确定</div>
        </div>

       <!-- 换购弹层 -->
        <!-- <div class="sales_shopcart" @click="funcClose" v-if="show_toast" catchtouchmove="ture">
            <div class="sales_shopcart_box">
                <div class="sales_shopcart_top"> 选择赠品
                    <img @click="funcClose" src="/static/images/public/public_pop_close.png" style="width:44rpx;height:44rpx;" class="toast_time_close"/>
                </div>
                <scroll-view scroll-y="true" class="sale_shopcart_content">
                    <div class="shopcart_pro" @click.stop="funcSelectClick(index)" v-for="(item, index) in shop_product_list" :key="index">
                        <img v-if="item.select" src="/static/images/public/publicCircle-checkOn.png"  style="width:36rpx;height:36rpx;">
                        <img v-else src="/static/images/public/publicCircle-checkOff.png"  style="width:36rpx;height:36rpx;">
                        <div class="shopcart_pro_content">
                            <img :src="item.image || '/static/images/twohr_seat_pic70x70.png'" style="width:120rpx;height:120rpx;">
                            <div class="shopcart_pro_desc">
                                <div class="ellipsis" style="color:#333;font-size:24rpx;">{{item.marketing_title}}</div>
                                <div class="shopcart_pro_desc_price">
                                    <div style="color:#ff5000">
                                        <span style="font-size:24rpx;font-family: PingFangSC-Medium;">赠品</span>
                                    </div>
                                    <span style="font-size:24rpx;color:#333">×{{item.quantity}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </scroll-view>
                <div class="sales_shopcart_submit_box">
                    <div class="sales_shopcart_submit" @click.stop="funcSubmit()">确定</div>
                </div>
                
            </div>
        </div> -->
    </div>



</template>
<script>
import {  calculatePromotion,choosePromotion,chooseSku} from '@/api';
import {priceFormat} from '@/utils'
export default {
    data(){
        return{
            shop_product_list:[],   //获取赠品数据
            selectIndex:0,  //默认选择的第一个赠品
            promotion_id:'',  //促销id
            huangougift:'',    //如果是换购 undefined 是换购，不是是赠品
        }
    },
    onLoad(option){
        console.log(option,'ddddd')
        this.promotion_id  = option.promotion_id;
        this.huangougift = option.seceltSku;
        if(option.seceltSku){
            wx.setNavigationBarTitle({title: '选择赠品'})
        }else{
            wx.setNavigationBarTitle({title: '选择换购商品'})
        }
        this.funcShopCartPromition(option);
        this.shop_product_list = [];
    },
    methods:{
        funcShopCartPromition(option) {
            wx.showLoading({'title':'加载中...'})
            let cart_id = wx.getStorageSync('cart_id');
            let params = {
                cart_id:cart_id,
                source:3,
                promotion_id: option.promotion_id,
                shop_id:wx.getStorageSync('shop_id')
            };
            console.log(params,'我是购物车接口')
            calculatePromotion(params).then(
                res => {
                    wx.hideLoading();
                    console.log(res,'我是返回来的结果')
                    res.product_list.map((pro_item,index) => {
                        // console.log()
                        // pro_item.price_f = priceFormat(pro_item.sale_price)
                        if(option.seceltSku==pro_item.sku){
                            pro_item.select = true;
                        }else if(option.seceltSku==undefined){
                             pro_item.select = true;
                        }else{
                            pro_item.select = false;
                        }                      
                    });
                    this.shop_product_list = res.product_list;
                    this.giftData=res;
                }
            );
        },
        funcSelectClick(indexx) {
            this.selectIndex = indexx;
            let that = this;
            let pro = this.shop_product_list[indexx];
            this.shop_product_list.map((res,index)=>{
                if(indexx==index){
                    res.select = true;
                }else{
                    res.select = false;
                }
            })
            this.shop_product_list = this.shop_product_list;
            // let that = this;
            // this.giftNum=0;
            // let pro = this.shop_product_list[index];
            // pro.select = !pro.select;
            // this.shop_product_list.map(res=>{
            //     if(res.select==true){
            //        this.giftNum = this.giftNum+1
            //     }
            // })
            // this.shop_product_list = this.shop_product_list;
        },
        funcSubmit() { //确定
            let pro = this.shop_product_list[this.selectIndex];
            let cart_id = wx.getStorageSync('cart_id');
            let skus = [{
                sku:pro.sku,
                amount:pro.quantity
            }]
            let params = {
                cart_id:cart_id,
                source:3,    //1 ,购物车  3，扫码购
                skus:skus,
                promotion_id:this.promotion_id,
                shop_id:wx.getStorageSync('shop_id')
            };
            console.log(params,'我是传入的参数')
            chooseSku(params).then(res=>{
                wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                })
            })
        },
    }
}
</script>
<style>
.gift{
    height: 100vh;
    /* background: #f3f3f3; */
}
.shopcart_pro {
    padding: 0 20px 0 20px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    margin-top: 20rpx;
}
.giftlist:last-child{
    margin-bottom: 100rpx;
}
.shopcart_pro_content {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
   
}
.shopcart_pro_desc{
    display: flex;
    flex-direction: column;
    width: 500rpx;
    padding-bottom: 10rpx;
    margin-left: 20rpx;
    border-bottom: 2rpx solid #f3f3f3;
}
.shopcart_pro_desc_price {
    margin-top: 50rpx;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}
.ellipsis{
    display: inline-block;
  white-space: nowrap; 
  width: 100%; 
  overflow: hidden;
  text-overflow:ellipsis;
}
.sales_shopcart_submit_box{
    display: flex;
    align-items: center;
    line-height: 98rpx;
    height: 98rpx;
    font-family: PingFangSC-Medium;
    position: fixed;
    bottom: 0rpx;
    width: 100%;
}
.sales_shopcart_submit {
    width: 240rpx;
    background: #ff5000;
    font-size: 30rpx;
    text-align: center;
    color: #fff;
    width: 100%;
}

</style>
