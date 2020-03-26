<template>
    <div class="cutShare" v-if="showLoading">
        <drawPost v-if="showPost" :cut_id="cut_id"  @closeShare="closeShare" :type="1"></drawPost>
        <img src="../images/kan_main_bg.jpg" mode="widthFix" class="bg" alt="">
        <!--<p class="openSwitcth" v-if="baseData.type==1||baseData.type==2">-->
            <!--<sapn >砍成提醒</sapn>-->
            <!--<img  v-if="!switchBtn" class="open" @click="openTip" src="../images/kan_switch_on@2x.png" alt="">-->
            <!--<img v-if="switchBtn" @click="openTip" class="open" src="../images/kan_switch_off@2x.png" alt="">-->
        <!--</p>-->
        <div class="cut-content" v-if="baseData">
            <div class="share-box">
                <div class="box-user">
                    <img :src="baseData.avatar" class="shareUser">
                    <p class="user-name">{{userName}}</p>
                    <p class="share-msg">呼朋唤友来砍价，好货一起搬回家！</p>
                </div>
                <div class="goodsMsgbox">
                    <img :src="baseData.sku.img_url" class="goods-img" alt="">
                    <div class="goods-msg">
                        <p class="goods-info">{{baseData.sku.name}}</p>
                        <p class="date-tip">
                            <span class="day" v-if="d!='00'">{{d}}天</span>
                            <span class="time">{{h}}</span>:
                            <span class="time">{{m}}</span>:
                            <span class="time">{{s}}</span>
                            <span class="time-tip">{{hasTime?'后砍价过期':'已过期'}}</span>
                        </p>
                        <p class="money"><moneySpan :money="baseData.sku.price" :iSize="30"></moneySpan><span>/件</span></p>
                    </div>
                </div>
                <p class="cut-tip">已砍 <span class="tip-money">{{baseData.sku.aleady_cut_price}}</span>元，还差<span class="tip-money">{{baseData.sku.different_price}}</span>元</p>
                <p class="tip-money-now" :style="{left:(baseData.sku.aleady_cut_price/(baseData.sku.price-baseData.sku.base_price))*600-50>480?'480rpx':((baseData.sku.aleady_cut_price/(baseData.sku.price-baseData.sku.base_price))*600+30>50?((baseData.sku.aleady_cut_price/(baseData.sku.price-baseData.sku.base_price))*600-50)+'rpx':'50rpx')}">当前价:￥{{baseData.sku.current_price}}</p>
                <span class="sanj" :style="{left:(baseData.sku.aleady_cut_price/(baseData.sku.price-baseData.sku.base_price))*600+20>600?'600rpx':(baseData.sku.aleady_cut_price/(baseData.sku.price-baseData.sku.base_price))*600+20+'rpx'}"></span>

                <slider disabled  :value="100*baseData.sku.aleady_cut_price/(baseData.sku.price-baseData.sku.base_price)" block-size="20" block-color="#FF5000" activeColor="#FF5000" backgroundColor="#FFF6D2"/>
                <p class="sharetip">分享到微信群砍价更快更给力！</p>
                <p class="lookMore" @click="subCut">{{textmsg.btn}}</p>
                <p class="zd_money" v-if="baseData.type==6" @click="gotoList">{{textmsg.tip}}</p>
                <p class="zd_money" v-else-if="baseData.type===1||baseData.type===2"  @click="gotoBuy">{{textmsg.tip}}
                    <img class="pic-right" v-if="baseData.activity_status>0" src="/static/images/public/order_arrow_redright.png" alt="">
                </p>
                <p class="zd_money" v-else >{{textmsg.tip}}</p>
            </div>
            <div class="cutMan-list">
                <div class="cut-title">乐砍帮</div>
                <div class="help-list" v-for="(item,index) in baseData.helper_list">
                    <img :src="item.avatar" class="help-user" alt="">
                    <div class="help-msg">
                        <p class="help-name">{{item.nickname}}</p>
                        <p class="help-tip">{{textArr[index%5]}}</p>
                    </div>
                    <div class="help-money">砍掉<span class="help-num">{{item.cut_price}}</span>元</div>
                </div>
            </div>
        </div>
        <div class="likeBox">
            <promoteTitle :title_aaa_bbb="'猜你喜欢'" > </promoteTitle>
            <div class="products_small_wrap" v-if="likeData">
                <likeGood :mainData="item" v-for="(item ,index) in likeData" :key="index"></likegood>
            </div>
        </div>

        <div class="dialog" v-if="baseData.type!=1&&baseData.type!=2&&showModel">
            <div class="dialog-box">
                <img class="dialog-bg" mode="widthFix" src="../images/kan_succeed_bg.png" alt="">
                <p class="dialog-title">感谢您帮助好友砍</p>
                <p class="dialog-money"><span class="dialog-y">￥</span>{{helpData.cut_price}}</p>
                <p class="help-text">感谢您的帮助，快去挑选商品</p>
                <p class="dialog-btn" @click="gotoList">去选择砍价商品</p>
                <img class="closeImg" @click="closetip" src="/static/images/kan_pop_close.png" alt="">
            </div>
        </div>
        <div class="dialog" v-if="showGx" catchtouchmove='true'>
            <div class="dialog-box">
                <img class="dialog-bg" mode="widthFix" src="../images/kan_succeed_bg.png" alt="">
                <p class="dialog-title">恭喜你！已砍</p>
                <p class="dialog-money"><span class="dialog-y">￥</span>{{options.cut_price}}</p>
                <p class="shareP">快分享好友砍到最低价</p>
                <p class="dialog-btn" @click="showDraw">分享好友</p>
                <img class="closeImg" @click="closetip" src="/static/images/kan_pop_close.png" alt="">

            </div>
        </div>
        <div class="dialog" v-if="showSure" atchtouchmove='true'>
            <div class="haskan">
                <p class="sure-title">确认要关闭砍成提醒吗?</p>
                <p class="sure-title">商品必须完成付款才会发货哦，先付先得~</p>
                <p class="sure-btn">
                    <span class="sure-qux" @click="closeSure">取消</span>
                    <span class="sure-que" @click="openSure">确认</span>
                </p>
            </div>
        </div>
        <img src="/static/images/public/public_link_mall.png" @click.stop='ongotoIndex' class="upImg" alt="">

    </div>
</template>

<script>
    import {
        getLikeInfo,
        cutDetail,
        cutDo,
        cutMsgtrigger,
        getQrcode,
        getUserinfo
    }
    from  '@/api'
    import likeGood from '@/components/public/likeGood';
    import promoteTitle from '@/components/product/promote/title';
    import moneySpan from '@/components/public/money.vue'
    import drawPost from '@/components/public/drawPost.vue'
    import shopSliding from "@/components/product/details/shopTopSliding"
    import {mapState, mapMutations} from "vuex"

    export default {
        name: "index",
        components:{
            moneySpan,
            likeGood,
            promoteTitle,
            drawPost,
            shopSliding
        },
        computed:
            mapState(['BASE_APP_INFO']),
        data(){
            return{
                helpData:"",
                switchBtn:false,
                showPost:false,
                showModel:false,
                showLoading:false,
                showGx:false,
                likeData:[],
                count:0,
                page_index:1,
                page_sizev:10,
                cut_id:'',
                goods_id:"",
                baseData:"",
                textmsg:{},
                userImg:'',
                showSure:false,
                textArr:[
                    '兄弟，帮你到这了',
                    '一不小心砍猛了',
                    '我回家再磨磨刀',
                    '来看我挥宝刀',
                    '手握小弯刀来帮砍'
                ],
                d: '00',
                h: '00',
                m: '00',
                s: '00',
                options:"",
                hasTime:true,
                downTimer:"",
                userName:"",
                postMsg:{
                    qrcode_url:"",

                }
            }
        },
        onLoad(options){
            console.log(options)
            this.options=options
            this.cut_id=options.cut_id
            if(options.userName)this.userName=options.userName
            else{
                this.userName=null
            }
            if(options.showGx)this.showGx=true
            this.getUser()
        },
        // 小程序分享

        onShow(){

            this.switchBtn=false;
            this.showPost=false;
            this.showModel=false;
            this.showLoading=false;
            this.d = "00";
            this.h = "00";
            this.m = "00";
            this.s = "00";
            wx.showLoading({
                title:'加载中'
            })
            this.baseData=""
            cutDetail({cut_id:this.cut_id}).then(res=>{
                if(res){
                    wx.hideLoading()
                    this.showLoading=true
                    if(wx.getStorageSync('time')-res.cut_end_time*1000>0){
                        this.hasTime=false
                    }else{
                        this.hasTime=true
                    }
                    this.baseData=res
                    this.switchBtn=this.baseData.trigger_close?false:true;
                    this.baseData.avatar = this.baseData.avatar ==''?'/static/goodsdetail/default_pic_user.png':this.baseData.avatar.indexOf('gif')>-1?'/static/goodsdetail/default_pic_user.png':res.avatar
                    this.baseData.helper_list.map(item=>{

                        item.avatar=item.avatar.indexOf('gif')>-1?'/static/goodsdetail/default_pic_user.png':item.avatar
                })
                    this.goods_id=this.baseData.goods_id
                    this.initTimeDown(this.baseData.cut_end_time)
                    this.getText(this.baseData.type)
                    console.log(this.baseData)
                }
            }).catch(err=>{
                    console.log(err)
            })
            this.getMore()
        },
        onReachBottom(){
            this.getMore()

        },

        onShareAppMessage(options) {
            var that =this
            that.showPost=false
            let activity_title = this.BASE_APP_INFO.share_active_prefix;
            let shareTitle = `${wx.getStorageSync('userinfo').nick_name}@你，快来帮我砍一刀，人多力量大`;
            if (activity_title && activity_title != '') {
                shareTitle = activity_title + shareTitle;
            }
            console.log(options)
            console.log('/pages/cutprice/cutShare/main?cut_id='+this.cut_id+'&goods_id='+this.goods_id+'&userName='+this.userName,)
            return{
                title:shareTitle,
                imageUrl: this.baseData.sku.img_url,
                path: '/pages/cutprice/cutShare/main?cut_id='+this.cut_id+'&goods_id='+this.goods_id+'&userName='+this.userName,
                success: function () {
                }
            }
        },

        methods:{
            showDraw(){
                this.showGx=false
                this.showPost=true
            },
            ongotoIndex(){
                wx.switchTab({url:'/pages/index/main'})
            },
            closetip(){
                this.showGx=false
                this.showModel=false
            },
            gotoList(){
                wx.navigateTo({
                    url:'/pages/cutprice/cutList/main'
                })
            },
            initTimeDown(endTime){//初始化砍价结束倒计时
                clearInterval(this.downTimer);
                if(this.baseData.activity_status===0||this.baseData.activity_status===-1){
                    this.d = "00";
                    this.h = "00";
                    this.m = "00";
                    this.s = "00";
                    return
                }
                let end = new Date(endTime*1000);
                let _now = new Date();
                if(end - _now <= 0){
                    this.isCutTimeEnd = true;
                }else{
                    this.isCutTimeEnd = false;
                    this.downTimer = setInterval(()=>{
                        let now = new Date();
                        let deltaTime = end - now; //到期时间和当前时间相差的毫秒数
                        if (deltaTime <= 0) {//结束停止
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
            closeSure(){
                this.showSure=false

            },
            openSure(){
                this.showSure=false
                cutMsgtrigger({}).then(res=>{
                    this.switchBtn=!this.switchBtn
                })
            },
            openTip(){
                if(!this.switchBtn){
                    this.showSure=true
                }else{
                    cutMsgtrigger({}).then(res=>{
                        this.switchBtn=!this.switchBtn
                    })
                }
            },
            getUser(){
                getUserinfo().then(res=>{
                    this.userName=this.userName?this.userName:res.nick_name
                    wx.setStorageSync('userinfo',res)
                }) //缓存用户信息}
            },
            getText(type){

if(this.baseData.activity_status===0||this.baseData.activity_status===-1){
                    console.log(3)
                    this.textmsg.btn="查看更多乐砍价";
                    this.textmsg.tip="当前砍价已过期";
                    return false
                };                if(type==1){
                    this.textmsg.btn="已砍至底价，立即购买";
                    this.textmsg.tip="哇，已经是最低价了，快来买买买！";
                }
                if(type==2){
                    this.textmsg.btn="喊好友帮砍一下"
                    this.textmsg.tip="以当前价格购买"
                }
                if(type==3){
                    this.textmsg.btn="查看更多乐砍价"
                    this.textmsg.tip="当前已经是最低价啦！"

                }
                if(type==4){
                    this.textmsg.btn="查看更多乐砍价"
                    this.textmsg.tip="您已经帮好友砍过价啦！"
                }
                if(type==5){
                    this.textmsg.btn="查看更多乐砍价"
                    this.textmsg.tip="当前已经是最低价啦！"
                }
                if(type==6){
                    this.textmsg.btn="帮好友砍一下"
                    this.textmsg.tip="查看更多乐砍价"
                }
                if(type==7){
                    this.textmsg.btn="查看更多乐砍价"
                    this.textmsg.tip="您已砍价成功"
                }
                if(!this.hasTime){
                    if(type===2){
                        this.textmsg.btn="查看更多乐砍价"
                        this.textmsg.tip="以当前价格购买"
                    }else if(type!=1){
                        this.textmsg.btn="查看更多乐砍价"
                        this.textmsg.tip="当前砍价已过期"
                    }
                }

            },
            closeShare(){
                this.showPost=false
            },
            gotoBuy(){
                if(this.baseData.activity_status===0||this.baseData.activity_status===-1){
                    return
                }
                var skus={
                    sku:this.baseData.sku.sku,
                    address_id:this.baseData.address_id,
                    cut_id:this.cut_id,
                    current_price:this.baseData.sku.current_price,
                    img_url:this.baseData.sku.img_url,
                    has_ship_money:this.baseData.is_free_shipping?false:true
                }
                wx.navigateTo({
                    url:'/pages/cutprice/cutOrder/main?skus='+JSON.stringify(skus)
                });
            },
            subCut(){
                if(!wx.getStorageSync('token')){
                    wx.navigateTo({
                        url:'/pages/userCenter/login/wxLogin/main'
                    });
                    return false;
                }
                if(this.baseData.activity_status===-1){
                    this.gotoList()

                    // wx.showToast({
                    //     title:'活动已下线',
                    //     icon:"none"
                    // })
                    return
                }
                if(this.baseData.activity_status===0){
                    this.gotoList()
                    // wx.showToast({
                    //     title:'活动已过期',
                    //     icon:"none"
                    // })
                    return
                }
                if(this.baseData.type==6&&this.hasTime){
                    cutDo({goods_id:this.goods_id,cut_id:this.cut_id}).then(res=>{
                        this.baseData=""
                        cutDetail({cut_id:this.cut_id}).then(data=>{
                            this.baseData=data
                            this.baseData.avatar = this.baseData.avatar ==''?'/static/goodsdetail/default_pic_user.png':this.baseData.avatar.indexOf('gif')>-1?'/static/goodsdetail/default_pic_user.png':res.avatar
                            this.goods_id=this.baseData.goods_id
                            this.initTimeDown(this.baseData.cut_end_time)
                            this.getText(this.baseData.type)
                            console.log(this.baseData)
                        })
                        this.helpData=res
                        this.showModel=true
                    })
                }
                else if(this.baseData.type==2&&this.hasTime){
                    this.showPost=true
                }else if(this.baseData.type==1){
                    this.gotoBuy()
                }else{
                    this.gotoList()
                }

            },
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
        }
    }
</script>

<style scoped>
    .pic-right{
        height: 22rpx;
        width: 12rpx;
        padding-left: 10rpx;
        vertical-align: middle;
        display: inline-block;
    }
    .sure-btn{
        height: 88rpx;
        width: 100%;
        position: absolute;
        bottom: 0;
        line-height: 88rpx;
        font-size: 30rpx;
    }
    .sure-qux{
        display: inline-block;
        width: 49%;
    }
    .sure-que{
        display: inline-block;
        width: 49%;
        color: #FF5000 ;
    }
    .haskan{
        position: relative;
        text-align: center;
        height: 230rpx;
        width: 590rpx;
        background: #fff;
        border-radius: 15rpx;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -295rpx;
        margin-top: -165rpx;
    }
    .haskan .sure-title{
        font-size: 28rpx;
        padding-top: 20rpx;
    }
    .shareP{
        font-size: 26rpx;
        text-align: center;
        padding: 20rpx;
    }
    .sharetip{
        font-size: 22rpx;
        text-align: center;
        color: #FF5000;
    }
    .date-tip{
        color: #633923;
        font-size: 26rpx;
        margin: 10rpx 0rpx 0;
    }
    .help-text{
        font-size: 26rpx;
        padding: 20rpx;
        text-align: center;
    }
    .sanj{
        margin-left: 10px;
        float: left;
        width: 0;
        height: 0;
        border-width: 10rpx;
        position: absolute;
        top:501rpx;
        border-style: solid;
        border-color:#FF5000 transparent transparent transparent;
    }
    .upImg{
        position: fixed;
        height: 80rpx;
        width: 80rpx;
        bottom: 260rpx;
        right: 0rpx;
        z-index: 9;
    }
    .closeImg{
        height: 60rpx;
        width: 60rpx;
        position: absolute;
        bottom: -100rpx;
        left: 210rpx;
    }
    .day{
        font-size: 28rpx;
        padding: 10rpx;
    }
    .open,.off{
        width: 60rpx;
        height: 35rpx;
        padding-left: 10rpx;
        vertical-align: middle;
    }
    .openSwitcth{
        height: 40rpx;
        line-height: 40rpx;
        position: absolute;
        z-index: 999;
        right: 50rpx;
        top: 35rpx;
        font-size: 24rpx;
        color: #633923;
        vertical-align: middle;
    }
    .dialog-title{
        font-size: 40rpx;
        color: #633923;
        text-align: center;
        padding: 20rpx 0 0;
        position:absolute ;
        top: 0;
        width: 100%;
    }
    .dialog-btn{
        background-image: linear-gradient(-90deg, #FF5000 0%, #FF8800 100%);
        border-radius: 36rpx;
        height: 72rpx;
        width: 340rpx;
        line-height: 72rpx;
        margin: auto;
        font-size: 30rpx;
        color: #fff;
        text-align: center;
        position: absolute;
        bottom: 20rpx;
        left: 80rpx;
    }
    .dialog-money{
        font-size: 80rpx;
        color: #FF5000 ;
        position: absolute;
        top: 70rpx;
        text-align: center;
        width: 100%;
        font-weight: bold;
    }
    .dialog-y{
        font-size: 40rpx!important;
        font-weight: bold;
    }
    .dialog-box{
        height: 450rpx;
        width: 500rpx;
        background: #fff;
        border-radius: 20rpx;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -225rpx;
        margin-left: -250rpx;
    }
    .dialog-bg{
        width: 100%;
        height: 90rpx;
    }
    .dialog{
        height: 100%;
        width: 100%;
        position: fixed;
        background: rgba(0,0,0,0.6);
        top: 0;
        z-index: 99;
    }
    .help-msg{
        padding:5rpx 20rpx;
    }
    .likeBox{
        background: #eee;
        padding-top: 20rpx;
        border-radius: 10rpx;
        margin-top: 30rpx;
    }
    .help-name{
        color: #333;
        font-weight: bold;
        font-size: 28rpx;
    }
    .help-tip{
        color: #666;
        font-size: 22rpx;
    }
    .help-list{
        display: flex;
        width: 630rpx;
        height: 80rpx;
        padding:10rpx 20rpx;
        position: relative;
    }
    .help-user{
        height: 80rpx;
        width: 80rpx;
        border-radius: 50%;
    }
    .help-num{
        color:#FF5000;
        font-weight: bold;
    }
    .help-money{
      position: absolute;
        right: 20rpx;
        font-size: 28rpx;
        color: #666;
        line-height: 80rpx;
    }
    .products_small_wrap {
        padding-top: 6px;
        display: flex;
        flex-wrap: wrap;
        background: #eee;
        justify-content: space-between;
    }
    .zd_money{
        font-size: 28rpx;
        color: #FF5000;
        letter-spacing: 0;
        text-align: center;
        line-height: 34px;
        display: flex;
        justify-content:center;
        align-items:center;
    }
    slider{
       margin-top: 80rpx;
    }
    .lookMore{
        width: 500rpx;
        height: 88rpx;
        margin: 20rpx auto 30rpx;
        border-radius: 44rpx;
        background: linear-gradient(-90deg, #FF5000 0%, #FF8800 100%);
        text-align: center;
        color: #fff;
        font-size: 34rpx;
        line-height: 88rpx;
    }
    .tip-money-now{
        font-size: 22rpx;
        color: #fff;
        display: inline-block;
        padding: 4rpx 10rpx;
        border-radius: 10rpx;
        position: absolute;
        background:  linear-gradient(-90deg, #FF5000 0%, #FF8800 100%);
        top: 466rpx;
        left: 30rpx;
    }
    .cut-tip{
        font-size: 28rpx;
        position: relative;
        color: #333;
        font-weight: bold;
        text-align: center;
    }
    .tip-money{
        color: #FF5000 ;
    }
    .money{
        padding: 10px 0 0;
        font-size: 24rpx;
        color: #FF5000;
        font-weight: bold;
    }
    .cutShare{
        position: relative;
        min-height: 100%;
        background: #fc4640;
    }
    .bg{
        width: 100%;
        z-index: 1;
        position: absolute;
        top: 0;

    }
    .cut-content{
        position: relative;
        z-index: 9;
        padding-top: 90rpx;
    }
    .share-box{
        height: 830rpx;
        width: 670rpx;
        margin: 0 auto;
        background: #fff;
        border-radius: 20rpx;
        position: relative;

    }
    .goodsMsgbox{
        width: 594rpx;
        height: 180rpx;
        padding:10rpx;
        margin: 20rpx auto;
        background: #f8f8f8;
        border-radius: 20rpx;
        display: flex;
    }
    .shareUser{
        width: 100rpx;
        height: 100rpx;
        margin-top: -50rpx;
        border-radius: 50%;
    }
    .cutMan-list{
        width: 670rpx;
        margin: 24rpx auto 0;
        background: #fff;
        border-radius: 20rpx;
        padding-bottom: 30rpx;
    }
    .box-user{
        text-align: center;
        position: relative;
        padding: 10rpx;
    }
    .share-msg{
        font-size: 28rpx;
        color: #333;
        padding: 10rpx;

    }
    .user-name{
        font-size: 25rpx;
        color: #999;
    }
    .cut-title{
        height: 100rpx;
        font-size: 34rpx;
        font-weight: bold;
        line-height: 100rpx;
        text-align: center;
    }
    .goods-img{
        width: 180rpx;
        height: 180rpx;
        border-radius: 8rpx;
        flex-shrink:0;
    }
    .goods-msg{
        padding: 10rpx 20rpx;
    }
    .goods-info{
        font-size: 24rpx;
        color: #333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .time{
        display: inline-block;
        height:40rpx;
        width: 40rpx;
        background: #F7D79A;
        font-size: 24rpx;
        color: #633923;
        line-height: 40rpx;
        text-align: center;
        font-weight: bold;
        border-radius: 4rpx;
        margin-right: 6rpx;
    }
    .time-tip{
        color: #9E8578;
        font-size: 20rpx;
    }
</style>
