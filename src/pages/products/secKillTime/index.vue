<template>
  <div class="seckillBOX">
     <div class="seckillTab">
        <div :class="['sectabTitle',{'fontopt':curIdx==idx}]"  @click.stop="clickTab(idx)" v-for="(item,idx) in arrskillList" :key="idx"  >
            <span class="font34">{{item.seckill_timearr[0]}}</span>
            <span class="font22">{{item.seckill_timearr[1]}}</span>
        </div>
    </div>
     <div class="Timedown">
        <span class="font22" style="color:#333;">限时限量  好货低价</span>
        <div class="display">
            <span class="finishText">{{distanceName}}</span>
            <template v-if='timeData'>
                 <timedown :skillNum = 2 :endTime='timeData' :currTime="now_time"></timedown>
            </template>

        </div>
    </div>
    <div class="padding_bottom" :style="{'height': windowHeight+'px'}">
        <swiper :current="curIdx" class="swiperTBox" duration="300" @change="bindchange">
            <swiper-item item-id='t1'>
                <scroll-view scroll-y  style="height:100%;">
                    <div class="Boughtgoods" @click="gotoGoodsDel(item.sku)" v-for="(item,index) in skillListItem0" :key="index">
                        <img class="goodsImg" :src="item.image" >
                        <div class="goodsInfo">
                            <span class="font26 goodsName">{{item.prod_title}}</span>
                            <div class="priceInfo">
                                <div class="public">
                                    <div>
                                        <span class="font24">¥</span>
                                        <span class="font34" style="color: #FF5000;padding-left:5rpx;">{{item.sale_price}}</span>
                                    </div>
                                    <div style="margin-top:12rpx;">
                                        <span class="underline">¥{{item.list_price}}</span>
                                    </div>
                                </div>
                                <div class="public" style="align-items:center">
                                    <span @click.stop="remindMyandBuy(index,item)" :class="['gradIt',{'Remindme':item.sub_status==2}]">{{item.sub_status==0?'马上抢':item.sub_status==1?'提醒我':'取消提醒'}}</span>
                                    <span class="Purchased">{{item.seckill_member+'人已经抢购'}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="padding_bottom"></div>
                </scroll-view>
            </swiper-item>
            <swiper-item item-id='t2'>
                <scroll-view scroll-y  style="height:100%;">
                    <div class="Boughtgoods" @click="gotoGoodsDel(item.sku)" v-for="(item,index) in skillListItem1" :key="index">
                        <img class="goodsImg" :src="item.image" >
                        <div class="goodsInfo">
                            <span class="font26 goodsName">{{item.prod_title}}</span>
                            <div class="priceInfo">
                                <div class="public">
                                    <div>
                                        <span class="font24">¥</span>
                                        <span class="font34" style="color: #FF5000;padding-left:5rpx;">{{item.sale_price}}</span>
                                    </div>
                                    <div style="margin-top:12rpx;">
                                        <span class="underline">¥{{item.list_price}}</span>
                                    </div>
                                </div>
                                <div class="public" style="align-items:center">
                                    <span @click.stop="remindMyandBuy(index,item)" :class="['gradIt',{'Remindme':item.sub_status==2}]">{{item.sub_status==0?'马上抢':item.sub_status==1?'提醒我':'取消提醒'}}</span>
                                    <span class="Purchased">{{item.seckill_member+'人已经关注'}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="padding_bottom"></div>
                </scroll-view>
            </swiper-item>
            <swiper-item item-id='t3'>
                 <scroll-view scroll-y  style="height:100%;">
                    <div class="Boughtgoods" @click="gotoGoodsDel(item.sku)" v-for="(item,index) in skillListItem2" :key="index">
                        <img class="goodsImg" :src="item.image" >
                        <div class="goodsInfo">
                            <span class="font26 goodsName">{{item.prod_title}}</span>
                            <div class="priceInfo">
                                <div class="public">
                                    <div>
                                        <span class="font24">¥</span>
                                        <span class="font34" style="color: #FF5000;padding-left:5rpx;">{{item.sale_price}}</span>
                                    </div>
                                    <div style="margin-top:12rpx;">
                                        <span class="underline">¥{{item.list_price}}</span>
                                    </div>
                                </div>
                                <div class="public" style="align-items:center">
                                    <span @click.stop="remindMyandBuy(index,item)" :class="['gradIt',{'Remindme':item.sub_status==2}]">{{item.sub_status==0?'马上抢':item.sub_status==1?'提醒我':'取消提醒'}}</span>
                                    <span class="Purchased">{{item.seckill_member+'人已经关注'}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="padding_bottom"></div>
                </scroll-view>
            </swiper-item>
            <swiper-item item-id='t3'>
                 <scroll-view scroll-y  style="height:100%;">
                    <div class="Boughtgoods" @click="gotoGoodsDel(item.sku)" v-for="(item,index) in skillListItem3" :key="index">
                        <img class="goodsImg" :src="item.image" >
                        <div class="goodsInfo">
                            <span class="font26 goodsName">{{item.prod_title}}</span>
                            <div class="priceInfo">
                                <div class="public">
                                    <div>
                                        <span class="font24">¥</span>
                                        <span class="font34" style="color: #FF5000;padding-left:5rpx;">{{item.sale_price}}</span>
                                    </div>
                                    <div style="margin-top:12rpx;">
                                        <span class="underline">¥{{item.list_price}}</span>
                                    </div>
                                </div>
                                <div class="public" style="align-items:center">
                                    <span @click.stop="remindMyandBuy(index,item)" :class="['gradIt',{'Remindme':item.sub_status==2}]">{{item.sub_status==0?'马上抢':item.sub_status==1?'提醒我':'取消提醒'}}</span>
                                    <span class="Purchased">{{item.seckill_member+'人已经关注'}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="padding_bottom"></div>
                </scroll-view>
            </swiper-item>
        </swiper>
    </div>


  </div>
</template>
<script>
import timedown from '@/components/public/countdown'
import { getskillinfo ,getskillRemind} from '@/api'
export default {
    components:{
        timedown
    },
    data(){
        return{
            //
            distanceName:'距本场结束', //距离的名字
            timeData:'',  //初始第一个时间
            now_time: '',
            curIdx: 0, //初始第一个为0
            windowHeight:555,  //初始的值
            arrskillList:[],    //数据值
            skillListItem0:[], //第一部分的内容数据
            skillListItem1:[], //第一部分的内容数据
            skillListItem2:[], //第一部分的内容数据
            skillListItem3:[], //第一部分的内容数据
        }
    },
    onLoad(){
        this.sa_page(this,false,'限时秒杀','');
        let phoneMobile = wx.getStorageSync('phoneMobile');
        if(phoneMobile.model.indexOf('X')>-1){
            this.windowHeight = wx.getStorageSync('windowHeight');
        }else{
            this.windowHeight = wx.getStorageSync('windowHeight')-30;
            console.log(this.windowHeight)
        }
        this.fungetskillList();
    },
    methods:{
        bindchange(e) {
            this.curIdx = e.target.current;
            this.distanceName = this.arrskillList[this.curIdx].seckill_status
            if(e.target.current==0){
                 this.timeData= this.arrskillList[e.target.current].product_list[0].end_time
            }else{
                this.timeData= this.arrskillList[e.target.current].product_list[0].seckill_time
            }
        },
        clickTab(i) {
            this.distanceName = this.arrskillList[this.curIdx].seckill_status
            if (this.curIdx === i) {
                this.timeData= this.arrskillList[i].product_list[0].end_time
            }else{
                this.timeData= this.arrskillList[i].product_list[0].seckill_time
            }
            this.curIdx = i
        },
        fungetskillList(){
            // wx.showLoading({title: '正在加载中',mask: true});
            getskillinfo({"test_ab":"leyou"}).then(res=>{
                let { body, header } = res;
                if(header.res_code == 0 ){
                    body.seckill_list.map(res=>{
                        res.seckill_timearr = res.seckill_time.split(';')
                    })
                    this.timeData = body.seckill_list[0].product_list[0].end_time; //初始的时间
                    // console.log(this.timeData,'时间')
                    this.distanceName = body.seckill_list[0].seckill_status;
                    this.skillListItem0 = body.seckill_list[0].product_list;
                    this.skillListItem1 = body.seckill_list[1].product_list;
                    this.skillListItem2 = body.seckill_list[2].product_list;
                    this.skillListItem3 = body.seckill_list[3].product_list;
                    this.arrskillList = body.seckill_list;
                    this.now_time = header.time_stamp;
                } else {
                    wx.showToast({
                        title: header.message,
                        icon: 'none',
                        duration: 2000
                    });
                }


                // wx.hideLoading();
            })
        },
        remindMyandBuy(i,item){
            if(item.sub_status==0){
                wx.navigateTo({url: '/pages/goodsdetailed/main?sku='+item.sku})
                return
            }
            // 订阅状态,0：马上抢，1：提醒我，2：取消提醒
            let params ={
                sku:item.sku,
                sub_status:item.sub_status,
                seckill_time:item.seckill_time,
                end_time:item.end_time,
                prod_title:item.prod_title
            }
            getskillRemind(params).then(res=>{
                 let { body, header } = res;
                if(header.res_code == 0 ){
                    if(body.sub_status==1){
                        wx.showToast({title: '已取消提醒，您可能会错过呦',icon: 'none'})
                    }else{
                        wx.showToast({title: '已设置提醒，将会在开始前3分钟提醒您',icon: 'none'})
                    }

                    if(body.sub_status==1){
                        this.arrskillList[this.curIdx].product_list[i].sub_status = 1
                    }else{
                        this.arrskillList[this.curIdx].product_list[i].sub_status = 2
                    }
                } else {
                    wx.showToast({
                        title: header.message,
                        icon: 'none',
                        duration: 2000
                    });
                }

                // this.fungetskillList();
            })
        },
        gotoGoodsDel(sku){
            wx.navigateTo({url: '/pages/goodsdetailed/main?sku='+sku})
        }

    },
    onPullDownRefresh(){
        console.log(1234)
    }
};
</script>
<style scoped>
.seckillBOX {
  font-family: PingFangSC-Regular;
  font-size: 26rpx;
  position: fixed;
}
.font22{
    font-size: 22px;
    color: #ffffff;
}
.font24{
    font-size: 24px;
    color: #FF5000;
}
.font26{
    font-size: 26px;
    color: #333333;
}
.fontopt{
    font-size: 34rpx;
    color: #ffffff;
    opacity: 1 !important;
}
.font34{
    font-size: 34rpx;
    color: #FFFFFF;
}
.swiperTBox{
    padding-bottom: 50rpx;
    height: 100%;
}
/* tab */
  .seckillTab{
        height: 90rpx;
      font-weight: bold;
        background: #FF5000;
        width: 750rpx;
        display: flex;
        align-items: center;
        text-align: center;
        border-bottom: 1rpx solid #f3f5f7;
    }
    .sectabTitle{
        display: flex;
        width: 187.5rpx;
        flex-direction: column;
        opacity: 0.7;
    }
    /* 倒计时 */
    .Timedown{
        background: #F3F5F7;
        width: 710rpx;
        height: 70rpx;
        padding: 0 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    /* 内容 */
    .Boughtgoods{
        align-items: flex-start;
        display: flex;
    }

    .Boughtgoods .goodsImg{
        width: 200rpx;
        height: 200rpx;
        margin: 20rpx;
    }
    .goodsInfo{
        flex-direction: column;
        display: flex;
        width: 490rpx;
        height: 240rpx;
        border-bottom: 1rpx solid #f3f5f7;
    }

    .Boughtgoods .goodsName{
        width: 490rpx;
        margin-top: 26rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    /* 价格信息 */
    .priceInfo{
        display: flex;
        justify-content:space-between;
        align-content: center;
        margin-top: 36rpx;
    }
    .public{
        display: flex;
        flex-direction: column;
        /* align-items: center; */
    }
    /* 马上抢 */
    .gradIt{
        background: #FF5000;
        border-radius: 24px;
        height: 48rpx;
        line-height: 48rpx;
        width: 152rpx;
        text-align: center;
        font-size: 26rpx;
        color: #ffffff;
    }
    .padding_bottom {
        padding-bottom: 40px;
    }
    .Purchased{
        font-size: 22px;
        color: #999999;
        margin-top: 18rpx;
        text-align: center;
    }
    /* 提醒我 */
    .Remindme{
        background: #FAC800;
        border-radius: 24px;
    }
    /* 价格文字 */
    .underline{
        text-decoration: line-through;
        font-size: 22rpx;
        color: #999;
    }
    .finishText{
        font-size: 22px;
        color: #333333;
        margin-right: 10rpx;
    }
    .display{
        display: flex;
        align-items: center;
    }

</style>

