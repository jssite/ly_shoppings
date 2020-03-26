<template>
    <div class="ordercode">
        <div class="orderinfo">
            <div class="orderSuccess">
                <img class="orderInfoImg" src="../../images/zhanshiyong.png" alt="">
                <span class="ordersuccess_text">支付成功</span>
            </div>
            <div class="ordermoney">
                <span class="ordermoney_text">支付金额 : </span>
                <span class="ordermoney_text" style="margin-left:10rpx;">¥{{options.order_fee}}</span>
            </div>
            <div class="orderTime">支付时间 : {{options.order_time}}</div>
            <div class="orderBack">
                <div class="orderBakc_1" @click.stop="viewOrder">查看订单</div>
                <div class="orderBakc_1 orderBack_2" @click.stop="backHome">返回首页</div>
            </div>
        </div>
        <div class="pickup">
            <span class="pickupText">请向工作人员出示此码，检验后即可离店！</span>
            <canvas class="canvas" canvas-id="goodsCode"></canvas>
            <span class="pickupText" style="margin-top:0rpx;">{{options.order_code}}</span>
        </div>
    </div>
</template>
<script>
import { creatBarcode } from "@/utils";
export default {
    data(){
        return {
            options:{},
        }
    },
    onLoad(options){
        console.log(options,'我是传递过来的')
        this.options = options
        creatBarcode("goodsCode", options.order_code, 590, 170);
    },
    methods:{
        viewOrder(){ //查看订单
            wx.navigateBack({
                delta: 1 // 回退前 delta(默认为1) 页面
            })
        },
        backHome(){ //返回首页
            wx.switchTab({
                url: '/pages/index/main'
            })
        }
    }
}
</script>
<style>
.ordercode{
    height: 100vh;
    background: #f3f3f3;
    font-family: PingFangSC-Medium;
    letter-spacing: 0;
}
.orderinfo{
    height: 340rpx;
    display: flex;
    flex-direction:column;
    align-items: center;
    background: #FF5000;
}
.orderSuccess{
    display: flex;
    align-items: center;
}
.orderInfoImg{
    width: 50rpx;
    height: 50rpx;
}
.ordersuccess_text{
    font-size: 40rpx;
    color: #FFFFFF;
    line-height: 50rpx;
    margin-left: 16rpx;
}
.ordermoney{
    display: flex;
    align-items: center;
    margin-top: 20rpx;
}
.ordermoney_text{
    font-size: 26rpx;
    color: #FFFFFF;
    line-height: 28rpx;
}
.orderTime{
    font-size: 22rpx;
    color: rgba(255,255,255,0.60);
    line-height: 26rpx;
    margin-top: 12rpx;
}

.orderBack{
    display: flex;
    align-items: center;
}
.orderBakc_1{
    margin-top: 40rpx;
    font-size: 26rpx;
    color: #FFFFFF;
    line-height: 60rpx;
    height: 60rpx;
    width: 200rpx;
    border: 1rpx solid #ffffff;
    border-radius: 30rpx;
    text-align: center;
}
.orderBack_2{
    margin-left: 80rpx;
}

.pickup {
    position: fixed;
    left: 20rpx;
  width: 710rpx;
  height: 375rpx;
  text-align: center;
  background: #FFFFFF;
  border-radius: 12rpx;
  top: 300rpx;
  display: flex;
  flex-direction: column;
}
.canvas {
  width: 590rpx;
  height: 170rpx;
  margin-top: 60rpx;
  margin: 40rpx 60rpx 20rpx 60rpx;
}
.pickupText {
    /* width: 100%; */
  font-size: 30rpx;
  color: #333333;
  margin-top: 30rpx;
}
</style>
