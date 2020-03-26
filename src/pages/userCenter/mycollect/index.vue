<template>
  <div>
        <template v-if="showcollec">
            <div class="container">
            <div :class="['touch-item',{'touch-move-active':item.isTouchMove}]" @touchstart="touchstart($event,index)" @touchmove="touchmove($event,index)" v-for="(item,index) in items" :key='index'>
                <div class="content" >
                    <!-- publicCircle-checkOff publicCircle-checkOn-->
                    <!-- <img class="pitchonImg" @click.stop='onCheck(item.prod_id,index)' :src="item.pitchon ? '/static/images/public/publicCircle-checkOn.png':'/static/images/public/publicCircle-checkOff.png'" alt=""> -->
                    <img class="goodsImg" :src="item.img_url" alt="" @click.stop="gotogoodsDel(item.sku)">

                    <!-- <img v-if="item.status==1" src="/static/images/public/public_goods_state02.png"  class="undercarriage"> -->
                    <img v-if ='item.status==1' src="/static/images/public/public_goods_state01.png"  class="undercarriage">
                    <div class="goodsinfo" @click.stop="gotogoodsDel(item.sku)">
                        <span :class="['goodsTitle',{'color999':item.status==1}]">{{item.prod_name}}</span>
                        <div :class="['goodsmoney' ,'colorFF00',{'color999':item.status==1}]">
                            <span class="font24">¥</span>
                            <span class="font34">{{item.priceNum[0]}}</span>
                            <span class="font24">{{item.priceNum[1]}}</span>
                            <!-- <span v-if="false" class="goodsactivity">满300减100</span> -->
                        </div>
                        <div class="collectPer">
                            <span  class="personNum"></span>
                            <img class="cartImg" @click.stop="Addcart(index)" src="/static/images/user_collect_shop.png">
                        </div>
                    </div>
                </div>
                <div class="del" @click.stop="delCollect(item.prod_id,0,index)">
                    <div class="delcoll">
                        取消收藏
                    </div>
                </div>
            </div>
            </div>
            <!-- 猜你喜欢 -->
            <!-- <div style="margin-top:20rpx;">
                <promote-title :title_aaa_bbb="'为你推荐'"></promote-title>
            </div>
            <div class= 'resemble' >
                <likeGood :mainData="item" v-for="(item,index) in likeData" :key="index"></likegood>
            </div> -->
            <div>
                <div class="weui-loadmore">
                    <div v-if="!bottom" class="weui-loading"></div>
                    <div class="weui-loadmore__tips">{{bottom?"已经全部加载完毕":"正在加载..."}}</div>
                </div>
            </div>
           
            <!-- <div class="collectBottom">
                <div style="display:flex;width:510rpx;align-items: center;" @click="checkAll">
                    <img class="BottmImg " :src="checkAllImg?'/static/images/public/publicCircle-checkOn.png':'/static/images/public/publicCircle-checkOff.png'" alt="">
                    <span class="allText">全选</span>
                </div>
                <span class="cancelCollect" @click="delCollect(1,1)">取消收藏</span>
            </div> -->
        </template>
        <template v-if="Nocollect">
            <div>
                <div class="placeholder">
                    <img src="/static/images/public/public_empty_pic.png" alt="">
                    <text>亲,收藏夹为空哦,快去浏览商品吧</text>
                    <navigator  url="/pages/index/main" class="user_invoice_add" open-type='switchTab' hover-class="none">
                        去逛逛
                    </navigator>
                </div>
            </div>
        </template>
  </div>
</template>
<script>
import likeGood from '@/components/public/likeGood';
import promoteTitle from '@/components/product/promote/title';
import money from '@/components/public/money'
import { myMarkCollect,getLikeInfo,removeMarkCollect ,addshoppingcart,deteleCollectData} from '@/api';
import { priceFormat } from '@/utils/index'
export default {
  components:{
    money,
    likeGood,
    promoteTitle
  },
  data() {
    return {
        onCheckshow:false,
        checkAllImg:false,
        showcollec:false,//判断是否有数据
        Nocollect:false,
        items: [],  // 收藏数据
        startX: 0, //开始坐标
        startY: 0,
        bottom:false,  //是否到底
        page_index:0,  //页数
        page_size:10,  //个数
        likeData:[],   //获取数据
        count:10,    //总页数
        collectPage:1,
        is_end:false, //是否到最后一页
        // priceNum:[]   //存储价格
    };
  },
  onLoad() {
     this.sa_page(this,false,'收藏夹','');
    //   this.getMore();
  },
  onShow(){
      this.collectPage = 0;
      this.items = [];
    //   this.likeData =[];
      this.onCheckshow = false;
      wx.showLoading({ title: '正在加载中',mask:true})
      this.funmyCollect();
  },
  methods: {
    getMore(){ //获取更多相似商品
            if(this.count<this.page_index+this.page_size){
                this.bottom = true;
        		return false
        	}
        	getLikeInfo({page_index:this.page_index,page_size:this.page_size,is_daguan_data:1}).then(res=>{
        		this.count=res.count
	        	this.likeData=this.likeData.concat(res.product_list)
	        	this.page_index+=this.page_size
        	})
    },
    funmyCollect(){
        let that = this;
          let params ={
              "page_index":this.collectPage,
              "page_size" : "10"
          }
          myMarkCollect(params).then(res=>{
              console.log(res,'我的收藏数据');
             this.bottom = res.is_end>10?false:true;
             this.is_end = res.is_end;
            //  priceFormat
              if(res.pro_list){
                res.pro_list.map(r=>{
                    r.pitchon = false;
                    r.isTouchMove = false;
                    r.priceNum = priceFormat(r.mark_amount)
                })
                that.items = that.items.concat(res.pro_list);
                this.collectPage+=1;
                that.showcollec = true;
                that.Nocollect =false;
              }else{
                 that.showcollec = false;
                 that.Nocollect =true;
              }
              wx.hideLoading();
          })
    },
    //手指触摸动作开始 记录起点X坐标
    touchstart: function (e,i) {
        // console.log('看我的内容',e,i)
        // console.log(e,'距离距离');
        // this.items[i].pitchon = !this.items[i].pitchon
        //开始触摸时 重置所有删除
        this.items.forEach(function (v, i) {
        if (v.isTouchMove)//只操作为true的
            v.isTouchMove = true;
        })
        this.startX = e.clientX
        this.startY =e.clientY
        this.items=this.items
    },
    //滑动事件处理
    touchmove: function (e,i) {
        console.log(213)
        //  console.log(e,'距离距离');
        var that = this,
        index = i,//当前索引
        startX = that.startX,//开始X坐标
        startY = that.startY,//开始Y坐标
        touchMoveX = e.clientX,//滑动变化坐标
        touchMoveY = e.clientY,//滑动变化坐标
        //获取滑动角度
        angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
        that.items.forEach(function (v, i) {
            v.isTouchMove = false
            //滑动超过30度角 return
            if (Math.abs(angle) > 30) return;
            if (i == index) {
            if (touchMoveX > startX) //右滑
            v.isTouchMove = false
            else //左滑
            v.isTouchMove = true
            }
        })
        //更新数据
        this.items=that.items
    },
    onCheck(prod_id,i){ //点击单个收藏
        this.onCheckshow = true;
        this.items[i].pitchon = !this.items[i].pitchon;
    },
    /**
    * 计算滑动角度
    * start 起点坐标
    * end 终点坐标
    */
    angle: function (start, end) {
    var _X = end.X - start.X,
        _Y = end.Y - start.Y
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    delCollect: function (prodId,all,index) { //取消收藏列表
        let that = this;
        if(all==0){ //单个删除
            let  params = {
                prod_id:prodId
            }
            removeMarkCollect(params).then(res=>{
                if(res.header.res_code==0){
                    wx.showToast({title:'取消收藏成功',icon:'none'})
                    that.collectPage =1;
                    that.items=[];
                    that.funmyCollect();
                }else{
                    wx.showToast({title:'取消收藏失败,请稍后再试',icon:'none'})
                }
              
                // that.items.splice(index, 1)
                // wx.switchTab({url:"/pages/index/main"})
            })
        }else{  //全部删除
            //删除一个
            if(this.onCheckshow){ //用户点过选择
                let paramsCheck = { add_marks:[] }
                this.items.map(res=>{
                    console.log(res);
                    if(res.pitchon==true){
                        paramsCheck.add_marks.push({prod_id:res.prod_id})
                    }
                })
                deteleCollectData(paramsCheck).then(res=>{
                    if(res.header.res_code==0){
                        wx.showToast({title:'取消收藏成功',icon:'none'})
                        that.collectPage =1;
                        that.items=[];
                        that.funmyCollect();
                    }else{
                        wx.showToast({title:'取消收藏失败,请稍后再试',icon:'none'})
                    }
                })
                console.log(paramsCheck,'dddddd');
            }

            if(this.checkAllImg){  //删除全部
                let params = { add_marks:[] }
                this.items.map(res=>{
                    params.add_marks.push({prod_id:res.prod_id})
                })
                console.log(params);
                deteleCollectData(params).then(res=>{
                    if(res.header.res_code==0){
                        wx.showToast({title:'全部取消收藏成功',icon:'none'})
                        that.collectPage =1;
                        that.items=[];
                        that.funmyCollect();
                    }else{
                        wx.showToast({title:'取消收藏失败,请稍后再试',icon:'none'})
                    }
                })
                console.log('dddddd');
            }
        }
    },
    Addcart(index){ //添加到购物车
        let  params ={
                "cart_type": 0, //普通商品
                "hander_type": 1,//添加
                "quantity": 1, //数量
                "sku": this.items[index].sku
        }
        console.log(params,'我是添加到购车')
        addshoppingcart(params).then(res=>{
            wx.showToast({title:'添加购物车成功',icon:'none'})
        })

    },
    checkAll(){
        this.checkAllImg = !this.checkAllImg;
        if(this.checkAllImg){
            this.items.map(res=>{
                res.pitchon=true
            })
        }else{
            this.items.map(res=>{
                res.pitchon=false
            })
        }
    },
    gotogoodsDel(sku){
       wx.navigateTo({url:'/pages/goodsdetailed/main?sku='+sku})  
    }
  },
  onReachBottom(){ //加载更多数据
    if(this.is_end){
        this.bottom=true;
    }else{
        this.bottom = false;
        this.funmyCollect()
    }
    
  },
   onHide(){
        // this.likeData=[];
    }, // 生命周期函数--监听页面隐藏
    onUnload(){
    } //生命周期函数--监听页面卸载
};
</script>
<style scoped>
.container {
  min-height: 100%;
  font-family: PingFangSC-Regular;
  background: #fff;
  padding: 20rpx 0rpx;
}
.touch-item:first-child{
    margin-top:0rpx;
}
.touch-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
  height: 200rpx;
  margin-top: 20rpx;
}
.content {
    width: 100%;
    padding: 10px;
    line-height: 22px;
    margin-right: 0;
    -webkit-transition: all 0.4s;
    transition: all 0.4s;
    -webkit-transform: translateX(90px);
    transform: translateX(90px);
    margin-left: -90px;
    display: flex;
    align-items: center;
    position: relative;
}

.content .pitchonImg{
    height: 36rpx;
    width: 36rpx;   
    margin-left: 10rpx;
}
.content .goodsImg{
    height: 200rpx;
    width: 200rpx;
    border-radius: 16rpx;
    margin: 0rpx 20rpx;
}
.content .goodsinfo{
    display: flex;
    flex-direction: column;
    height: 196rpx;
    border-bottom: 2rpx solid #f3f5f7;
    /* color: #999999; */
}
.content .goodsinfo .goodsTitle{
    height: 75rpx;
    font-size: 26px;
    width: 430rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 36rpx;
    margin-top: 8rpx;
    margin-bottom: 20rpx;
    color: #333;
}
.content .goodsinfo .goodsactivity{
    background: #FF5000;
    border-radius: 15px;
    height: 28rpx;
    font-size: 20px;
    color: #FFFFFF;
    padding: 0rpx 10rpx;
    line-height: 28rpx;
    margin-left: 12rpx;
}
.collectPer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0rpx;
}
.collectPer .personNum{
    font-size: 22px;
    color: #999999;
}
.collectPer .cartImg{
    height: 56rpx;
    width: 56rpx;
}


.font24{
    font-size: 24rpx;
}
.font34{
    font-size: 34rpx;
}
.color333{
    color: #333;
}
.colorFF00{
   color: #FF5000;
}
.color999{
    color:#999999 !important;
}

.del {
  background-color: orangered;
  width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  -webkit-transform: translateX(90px);
  transform: translateX(90px);
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
  font-size: 24px;
  color: #FFFFFF;
}
.delcoll{
    height: 55rpx;
    margin: 0 auto;
    width: 48rpx;
}
.touch-move-active .content,
.touch-move-active .del {
  -webkit-transform: translateX(0);
  transform: translateX(0);
}

/* 相似 */
.resemble{
    padding-top: 6rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.collectBottom{
    position: fixed;
    bottom: 0rpx;
    display: flex;
    align-items: center;
    height: 98rpx;
    background: #fff;
    width: 750rpx;
}
.BottmImg{
    height: 36rpx;
    width: 36rpx;
    margin-left: 20rpx;
    margin-right: 24rpx;
}
.allText{
    font-size: 26rpx;
    color: #333333;
    line-height: 98rpx;
    width: 200rpx;
}
.cancelCollect{
    width: 240rpx;
    height: 98rpx;
    line-height: 98rpx;
    font-size: 30rpx;
    color: #FFFFFF;
    text-align: center;
    font-weight: 500;
    background: #FF5000;
}

    .placeholder{
    display: flex;
    align-items: center;
    flex-direction: column;
}
.placeholder image{
    width: 250rpx;
    height: 210rpx;
    margin-top:100rpx;

}
.placeholder text{
    font-family: PingFangSC-Regular;
    font-size: 26px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    margin:40rpx 0rpx 60rpx 0rpx;
}
.user_invoice_add {
    width: 170px;
    height: 60px;
    background: #FF5000;
    color: #ffffff;
    font-size: 28px;
    text-align: center;
    border-radius: 40px;
    line-height: 60rpx;
}

.undercarriage{
    position: absolute;
    height: 80rpx;
    width: 80rpx;
    top: 60rpx;
    left: 90rpx;
}

</style>
