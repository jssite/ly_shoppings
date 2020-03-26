<template>
    <div class="goodsdetailed" v-show='commentBox'>
        <!-- 轮播图 -->
        <div class="roundheader">
            <swiper class="swiper" indicator-dots="true" :autoplay='autoplayset' @change='changeswiper'  interval="5000" duration="1000" indicator-active-color='#ff5000' circular>
                <swiper-item v-if="goodsData.video_cover_url">
                    <template v-if='!palyvide'>
                        <img class="videoPoster" :src="goodsData.video_cover_url">
                        <img class="videoPosterPaly" @click='palyVideo' src="/static/images/product_icon_video.png">
                    </template>
                </swiper-item>

                <block v-for="(item, index) in abc" :key="index">
                    <swiper-item @click.stop="previewImage(abc, index)">
                        <image :src="item" class="slide-image" mode="aspectFill"></image>
                    </swiper-item>
                </block>
            </swiper>

            <swiper class="swiper_sign" v-if="goodsData.good_review_list && !palyvide" circular vertical autoplay duration=2000 @click="LookMore" >
                <block  v-for="(items, ind) in goodsData.good_review_list" :key="ind">
                    <swiper-item class="swiperItem">
                        <img class="sign_limg" :src="items.header_imge_url || '/static/goodsdetail/default_pic_user.png'">
                        <div class="sign_text">{{items.review_desc}}</div>
                        <img class="sign_rimg" src="/static/images/public/public_arrow_right_white.png">
                    </swiper-item>
                </block>
            </swiper>
            <video v-if='palyvide' object-fit='fill' class='videoMP4'  @ended='bindende' @pause='pauser' id='video' autoplay :src="goodsData.video_stream_url"></video>
        </div>
        <!-- 商品介绍 -->
        <div class="goodsinfo">
            <div class="price">
                <div style="display:flex;align-items:flex-end">
                        <div class="price_sell">
                            <span class="money-bold"><moneySpan v-if="goodsData.sale_price" :money="goodsData.base_price" :iSize="64" :fSize="34"></moneySpan></span><span>/件</span>
                            <span class="base_price" >{{goodsData.sale_price}}</span>
                            <span class="lekan-tip">乐砍价</span>
                        </div>
                        <div class="end_time">
                            <p class="end_time_tip">距活动结束：</p>
                            <p class="end_time_day">
                                {{d}}天
                                <span class="day_num">{{h}}</span>:
                                <span class="day_num">{{m}}</span>:
                                <span class="day_num">{{s}}</span>
                            </p>
                        </div>
                </div>

            </div>
            <!-- 商品简介 -->
            <div style="display:flex;margin-top: 28rpx;" v-if="goodsData.skill_status!=1">
                <div class="content" style="margin-left: 20rpx;">
                    <div>
                        <img class="leshansong" v-if="addressfreight.lightning_support==1"
                             src="/static/images/search/search_sign_speed@2x.png">
                        <span class='leshansongText'>{{goodsData.marketing_title}}</span>
                    </div>
                    <div >
                        <div class="buyok">已有{{goodsData.selling_quantity}}人购买</div>
                    </div>
                </div>
                <!--<div class="price_img">-->
                    <!--<img class='img1' @click="goodsCollect"-->
                         <!--:src="goodsDynamicData.is_focus?'/static/goodsdetail/product_icon_attent_on.png':'/static/goodsdetail/product_icon_attent_off.png'">-->
                <!--</div>-->
                <div class="price_img">
                    <img class='img2' @click="sharePhoto" src="/static/goodsdetail/tabbar_icon_share.png">
                </div>
            </div>
            <!-- 商品第二简介 -->
            <!-- <div class="introduce">{{goodsData.product_title}}</div> -->



        </div>
        <!-- 库存 -->

        <!-- 请选择颜色 -->
        <div class="sales" v-if="!havespec" style="margin-top:20rpx;border-bottom:1rpx solid #f3f5f7;" >
            <template v-if="!goodsspecData">
                <div class="content" @click="goodsSize()" style="color:#333;width:100%;display: flex;align-items: center;justify-content: space-between;">
                    <span class="content_l span" style="color:#333;">{{SelectText}}</span>
                    <img class="pointimg"  src="/static/goodsdetail/product_icon_more.png">
                </div>
            </template>
            <template v-else>
                <span class="span" style="width:70rpx;">已选</span>
                <div class="content span" style=" display: flex; flex-direction: column;width:100%; margin-right:2rpx;">
                    <div  @click="goodsSize()"  style="display: flex; align-items: center; width:100%; justify-content: space-between;">
                        <div style="display: flex; align-items: center;">
                            <span class="content_l" style="color:#333">{{goodsspecData.goodsspecbuff}}/</span>
                            <span class="content_l" style="color:#333">{{goodsspecData.goodsspecsize}}</span>
                            <!--<span class="content_l" style="color:#FF5500;margin-left:10rpx;">{{shoparrdess.express_stock_desc}}</span>-->
                        </div>
                        <div style="display: flex; align-items: center;margin-right:16rpx;">
                            <img class="pointimg"  style="padding-left: 2rpx" src="/static/goodsdetail/product_icon_more.png">
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <!-- 送货地址 -->
        <div class="address">
            <div class="alike place" @click="showAddressModel">
                <span class="span">送至</span>
                <span class="selectChange-span">{{selectChanegedata.address || selectChanegedata.add_detail }}</span>
                <img class="addresspointimg" src="/static/goodsdetail/product_icon_more.png" >
            </div>
            <!-- 点击运费 -->
            <div class="alike addressmoney" @click="onfreight">
                <span class="span">运费</span>
                <span class="span color" style="width:594rpx">{{!goodsData.is_free_shipping?addressfreight.freight_desc:'包邮'}}</span>
                <img class="pointimg" src="/static/goodsdetail/product_icon_more.png">
            </div>
        </div>
        <!-- 品牌馆 -->
        <div class="alikep shopBrand" v-if='goodsData.brand_info && goodsData.brand_info.brand_desc'  @click="gotobrand">
            <img class='shopBrandImg' style="margin-top: 45rpx;" :src="goodsData.brand_info.brand_icon">
            <div class="shopBrandBOX">
                <div class="shopBrandNameBOX">
                    <text class="shopBrandName1">{{goodsData.brand_info.brand_name}}</text>
                    <text class="shopBrandName2">逛逛品牌馆</text>
                    <!-- <web-view class="shopBrandName2" :url='goodsData.brand_info.brand_link'>逛逛品牌馆</web-view> -->
                    <!-- <navigator class="shopBrandName2" >逛逛品牌馆</navigator> -->
                </div>
                <text class="shopBrandinfo ellipsis">{{goodsData.brand_info.brand_desc}}</text>
            </div>
        </div>


        <!-- 提示 -->
         <!--<div class="product_detail_top">继续拖动，查看图文详情</div>-->
        <!-- <product-content :content="content"></product-content> -->
        <div :class="['product_padd',{'product_paddX':phonestyleShow}]">
            <shop-sliding :type="1" :is_haitao='goodsData.is_ht'></shop-sliding>
        </div>


        <!-- 普通商品购物车 -->
        <div :class="[ 'product_cart_fixed' ,{'phonestyleShow':phonestyleShow}]">
            <div class="productBox">
                <div class="more-kan" @click="gotoList">
                    <img class="more-img" src="../images/tabbar_kan.png" alt="">
                    <p class="more-tip">更多砍价</p>
                </div>
                <div class="product_cart_add" @click="doCut">
                    <p>发起砍价</p>
                    <p class="product_cart_add_money">￥{{goodsData.base_price}}</p>
                </div>
            </div>
        </div>

        <!-- Modal促销 模态框 -->
        <div class="drawer_screen" v-if="ModalShow" @click='closeModal'  catchtouchmove="ture" ></div>
        <div class="goodsSalesMoadl" v-if="ModalShow">
            <goodsmodal :base_price="goodsData.base_price" :type="2" :goodsModalData='goodsModalData'  :twogoodsSize='twogoodsSize' :onegoodsSizeImage='onegoodsSizeImage' @headCallBack="headCallresAdd" @closeModall='closeModal' @closeM="closeM" @specCallBack="specCallBackselect"></goodsmodal>
        </div>
        <addressModel :address_id="address_id" @selectChanege="selectChanege" @closeDialog="closeDialog" v-if="showAddress"></addressModel>

        <div class="dialog" v-if="cutData.cut_id&&hasShare" catchtouchmove='true'>
            <div class="dialog-box">
                <img class="dialog-bg" mode="widthFix" src="../images/kan_succeed_bg.png" alt="">
                <p class="dialog-title">分享成功</p>
                <p class="shareP">分享给新用户砍价力度更大！</p>
                <p class="dialog-btn" @click="showDraw">分享好友</p>
            </div>
            <img class="closeImg" @click="closetip" src="/static/images/index_adv_close.png" alt="">
        </div>
        <!---->
        <div class="dialog"  v-if="sureAddress">
            <div class="sure-box">
                <p class="sure-title">请确认您的收货地址</p>

                <p class="sure-address">{{selectChanegedata.consignee}}，{{selectChanegedata.mobile}}，{{selectChanegedata.province}}{{selectChanegedata.city}}{{selectChanegedata.add_detail}}</p>
                <p class="sure-btn">
                    <span class="sure-qux" @click="closeSure">取消</span>
                    <span class="sure-que" @click="sureSub">确认</span>
                </p>
            </div>
        </div>
        <div class="dialog" v-if="hasKan">
            <div class="haskan">
                <p class="sure-title">您正在发起这个砍价活动哦~</p>
                <p class="sure-btn">
                    <span class="sure-qux" @click="closeSure">取消</span>
                    <span class="sure-que" @click="gotoShare">继续砍</span>
                </p>
            </div>
        </div>
        <drawPost v-if="showPost" :cut_id="cut_id" @closeShare="closeShare" :product="product"></drawPost>

    </div>
</template>
<script>
    import addressModel from "@/components/product/cutModel/address"
    import moneySpan from '@/components/public/money.vue'
    import shopSliding from "@/components/product/details/shopTopSliding"
    import timedown from "@/components/public/countdown"
    import productContent from "@/components/product/details"
    import goodsmodal from "@/components/product/goodsmodal/goodsmodal"
    import orderGoods from "@/components/product/ordergoods"
    import drawPost from '@/components/public/drawPost.vue'

    import { compare,countDown, priceFormat,formatTime,returnFloat } from "@/utils/index"
    import { getQueryString } from "@/utils"
    import {
        getDoodsData,
        getDoodsDataDynamic,
        getDoodsImgTxtData,
        getDoodsIdenticalData,
        gainAddressList,
        addCollectData,
        deteleCollectData,
        getrecomment,
        getMeetProductSize,
        getGoodsdetail,
        getCutPrdtLists,
        getPrdtStatus,
        getProductDynamicInfo,
        cutDo,

    } from "@/api";
    export default {
        data() {
            return {
                hasKan:false ,
                showGx:false,
                downTimer:null,
                sureAddress:false,
                hasShare:false,
                showPost:false,
                selectChanegedata:'',
                commentBox:false,
                goodsSpecList:null, //选择规格
                phonestyleShow:false,
                palyvide:false, //视频初始
                addressShow:false, //是否显示地址
                SelectText:'',    //选址的尺寸与颜色
                cart_id:'',
                tokenID:null,
                havespec:false,     //默认有无规格
                goodsspecData:null, //已选的商品规格
                immm:'https://leyoutest1.oss-cn-beijing.aliyuncs.com/2018/08/30/1535621579443095.JPG',
                showRec:true,
                recIdx: 0, //初始默认的
                recommendlist: [],
                addressgive:{},  //地址
                addressING: 0, //默认选择地址的
                ModalShow: false, //模态框初始
                cutData:{},
                imgUrls: [
                    "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640",
                    "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640",
                    "https://images.unsplash.com/photo-1551446591-142875a901a1?w=640"
                ],
                pattern: {
                    //设置金额的大小
                    tag: 30, //符号大小
                    Intnum: 45, //金额大小
                    floatnum: 30 //小数大小
                },
                showAddress:false,
                indicatorDots: false,
                autoplayset: true,  //自动切换
                interval: 5000,
                duration: 1000,
                content: {},
                address_list: [], //获取用户的送货地址
                priceNum: [], //金额大小含小数点
                abc: [],
                sku:"",
                goods_id:"",
                addressInfoData: {}, //配送地址
                addressfreight: {
                    //配送费用
                },
                goodsData: {
                    //商品数据
                    marketing_title: null, //商品名
                    product_title: null, //商品内容
                    image_colors: [], //商品图片
                    promotion_desc: null, //企业优惠
                    selling_quantity: null, //够买人数,
                    barndinfo:null,       //品牌内容,
                    base_price:null
                },
                shoparrdess:{},        //门店位置
                goodsDynamicData: {
                    //动态商品列表
                    promotion_list: [], //促销
                    review_count: null, //评论人数
                    le_vip_message: null, //最高返现
                },
                options:{},  //返回数据
                kanList:'',
                cut_id:"",
                d: '00',
                h: '00',
                m: '00',
                s: '00',
                address_id:"",
                buyBtn:false,
                buyaddress:false,
                product:{
                    item_code:'123',
                    title:'',
                    desc:'',
                    category_list:'',
                    image_list:'',
                    is_free_shipping:"",
                    src_mini_program_path:'',
                }   // 好物圈
            };
        },
        components: {
            timedown,
            productContent,
            goodsmodal,
            orderGoods,
            shopSliding,
            moneySpan,
            addressModel,
            drawPost

        },
        onShow(){
            wx.showLoading({title: '正在加载中', mask: true});
            this.tokenID = wx.getStorageSync('token');            //获取token
            this.showPost=false
            this.sureAddress=false
            this.buyaddress=false
            this.showAddress=false
            this.hasKan=false
            this.goodsspecData=null
            this.selectChanegedata={}
            this.buyBtn=false
            this.address_id=""
            this.d = "00";
            this.h = "00";
            this.m = "00";
            this.s = "00";
            let sku = wx.getStorageSync('sku') //获取缓存中的sku
            let params={};              //初始化参数
            if(!this.tokenID){ //未登录
                params = {
                    sku:  this.options.sku || sku,
                    longitude:this.locationInfo.longitude,
                    latitude:this.locationInfo.latitude,
                }
            }else{
                params = {             //只有sku参数的时候走这里
                    sku: this.options.sku || sku
                }
            }
            this.Goodsinfo(params);  //基本信息

        },
        onHide(){
            clearInterval(this.downTimer);
        },
        onLoad(options) {
            console.log(options);
            // 判断是否从二维码进入
            if(options.q){
                let params = decodeURIComponent(options.q);
                let sku = getQueryString('sku',params)
                let goods_id = getQueryString('goods_id',params)
            }else{
                let sku = options.sku
                this.sku = options.sku
                let goods_id= options.goods_id
                this.goods_id = options.goods_id
            }
            this.commentBox = false;
            this.goodsData = {};        //初始化基本数据
            this.goodsDynamicData ={};  //初始化动态数据
            this.palyvide = false;      //暂停播放
            this.abc=[];                //商品图片
            this.ModalShow = false;     //模态框关闭
            this.havespec = false;      //初始化选择规格

            // 获取手机型号
            let phoneMobile = wx.getStorageSync('phoneMobile'); //判断是否为IPhonex
            console.log(phoneMobile);
            if(phoneMobile.model.indexOf('X')>-1 || phoneMobile.model.indexOf('unknown<iPhone11,8>')>-1){
                this.phonestyleShow = true;
            }
            this.tokenID = wx.getStorageSync('token');            //获取token
            this.locationInfo = wx.getStorageSync('locationInfo') //获取经纬度
            let sku = wx.getStorageSync('sku') //获取缓存中的sku
            let params={};              //初始化参数

            if(!this.tokenID){ //未登录
                params = {
                    sku:  options.sku || sku,
                    longitude:this.locationInfo.longitude,
                    latitude:this.locationInfo.latitude,
                }
            }else{
                params = {             //只有sku参数的时候走这里
                    sku: options.sku || sku
                }
            }
            // 'W880001501' ||
            this.options = options;
        },
        methods: {
            GoodsDynamicinfo(params) {
                getProductDynamicInfo(params).then(res => {
                    this.goodsDynamicData = res;
                    this.addressfreight = this.goodsDynamicData.support_distr_address.support_address;
                }).catch(err=>{

                })
            },

            closeShare(){
                // this.Goodsinfo(params);  //基本信息
                this.showPost=false
            },
            selectChanege(data){
                let params = {
                    sku:wx.getStorageSync('sku'),
                    address_id:data.addressId,
                    free_freight:this.goodsData.is_free_shipping
                };
                this.address_id=data.address_id
                this.GoodsDynamicinfo(params);
                console.log(data)
                this.selectChanegedata=data
                if(this.buyaddress){
                    this.buyaddress=false
                    this.sureAddress=true
                }
            },
            gotoShare(){
                wx.navigateTo({
                    url:'/pages/cutprice/cutShare/main?cut_id='+this.kanList.current_cut_id
                })
            },
            gotoList(){
                wx.navigateTo({
                    url:'/pages/cutprice/cutList/main'
                })
            },
            /**
             * 1,获取商品信息  Goodsinfo  (必传sku)
             * 2,获取商品扩展信息 GoodsDynamicinfo (必传sku)
             * 3,获取商品图文信息 getDoodsImgTxtData (必传sku)
             * 4,获取商品规格信息 getDoodsIdenticalData (必传sku)
             * 5,获取用户地址信息 gainAddressList   ()
             * 6,商品加入收藏     addCollectData
             * 7,相关推荐        getrecomment
             */
            // https://webapi.leyou.com.cn/leyou-gateway-services/hotlist/daGuanHotlistRecommen
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
            closetip(){
                this.kanList.is_has_cutting=1
                this.showGx=false
            },
            showDraw(){
                this.showGx=false
                this.showPost=true
            },
            closeDraw(){
                this.showPost=false
            },
            closeDialog(){
                this.showAddress=false
            },
            showAddressModel(){
                if( !this.tokenID ){
                    wx.navigateTo({
                        url:'/pages/userCenter/login/wxLogin/main'
                    });
                    return false;
                }
                this.showAddress=true
            },
            sureSub(){
                this.sureAddress=false
                wx.showLoading({
                    title:'加载中'
                })
                cutDo({goods_id:this.goods_id,address_id:this.address_id}).then(res=>{
                    wx.hideLoading()
                this.cutData=res
                // this.showGx=true
                wx.navigateTo({
                    url:'/pages/cutprice/cutShare/main?cut_id='+this.cutData.cut_id+'&showGx=1&cut_price='+this.cutData.cut_price
                });
                // this.cut_id=this.cutData.cut_id
            })
                console.log({goods_id:this.goods_id,address_id:this.address_id})

            },

            closeSure(){
                this.sureAddress=false
                this.hasKan=false
            },
            doCut(){
                debugger
                if(!this.tokenID ){
                    wx.navigateTo({
                        url:'/pages/userCenter/login/wxLogin/main'
                    });
                    return false;
                }
                if(this.kanList.is_has_cutting){
                    this.hasKan=true
                    return
                }
                if(!this.havespec&&!this.goodsspecData){
                    this.buyBtn =true
                    this.goodsSize()
                    return
                }
                if(!this.address_id){
                    this.buyaddress=true
                    this.showAddress=true
                    return
                }
                wx.showLoading({
                    title:'加载中'
                })
                cutDo({goods_id:this.goods_id,address_id:this.address_id}).then(res=>{
                    wx.hideLoading()
                    this.cutData=res
                    // this.showGx=true
                    wx.navigateTo({
                        url:'/pages/cutprice/cutShare/main?cut_id='+this.cutData.cut_id+'&showGx=1&cut_price='+this.cutData.cut_price
                    });
                    // this.cut_id=this.cutData.cut_id
                })

            },
            Goodsinfo(params) {
                var _this =this
                getDoodsData(params).then(msg => {
                        console.log(msg,'我还是请求回来的数据');
                    let res = msg.body;
                    let headerinfo = msg.header;
                    deteleCollectData
                    if (headerinfo.res_code == 1002 || headerinfo.res_code == 1001) {
                        setTimeout(() => {
                            wx.navigateBack({
                            delta:1
                            });
                        }, 2000);
                        return;
                    }
                _this.commentBox = true;
                    wx.setStorageSync('sku',res.sku)
                    res.marketPrice = parseInt(res.list_price) > parseInt(res.sale_price) ? true : false; //是否显示原价
                    this.priceNum = priceFormat(res.sale_price); //商品价格
                    if(res.is_zero_can_sale){
                        res.is_zero_can_sale = res.is_zero_can_sale.indexOf('false')>-1?false:true
                    }
                    this.abc = res.image_colors[0].images; //获取轮播图
                    // 好物圈赋值
                    this.product = {
                        item_code:res.sku,
                        title:res.mfct_name,  //名字
                        desc:res.marketing_title,   //商品描述
                        image_list: res.image_colors[0].images, //图片
                        category_list:'', //类目列表
                        src_mini_program_path:`/pages/cutprice/detailed/main?sku=${res.sku}`
                    }
                    this.goodsData = res;

                /**
                 * 显示库存，或者 规格
                 * 1,image_colors  数组大于2,显示 尺寸与颜色，数组等于1有sku_size_vos  显示 尺寸 ，没有sku_size_vos  显示库存
                 */
                    this.goodsspectList();
                    if(this.options.MoregoodsName){
                        this.goodsspecData ={};
                        this.goodsspecData.goodsspecbuff = this.options.MoregoodsName;
                        this.goodsspecData.goodsspecsize = this.options.MoregoodsScpe;
                    }else{

                        if(res.image_colors.length>=2){
                            this.SelectText = '请选择尺码、颜色'
                        }else if(res.image_colors[0].sku_size_vos){
                            if(res.image_colors[0].sku_size_vos.length>1){
                                this.SelectText = '请选择尺码'
                            }else{
                                this.havespec = true;
                            }
                        }else{
                            this.havespec = true;
                        }

                    }
            }).catch(err=>{
                })
            },
            UserAddressinfo() { //获取地址
                gainAddressList().then(res => {
                    this.address_list = res.address_list;
            });
            },

            previewImage(imgs=[], curIdx=0){ //图片预览
                wx.previewImage({current: imgs[curIdx], urls: imgs})
            },
            gotoH5Vip(){
                let token = wx.getStorageSync('token');
                if( !token ){
                    wx.navigateTo({
                        url:'/pages/userCenter/login/wxLogin/main'
                    });
                    return false;
                }
                let url = wx.getStorageSync('appInfo').le_vip_info_url + '?token='+ token;
                wx.setStorageSync('urlH5', url);
                wx.navigateTo({url:'/pages/transferH5/main'})
            },
            gotobrand(){
                let url = this.goodsData.brand_info.brand_link+'&token='+ wx.getStorageSync('token');
                console.log(url)
                wx.setStorageSync('urlH5', url);
                wx.navigateTo({url:'/pages/transferH5/main'})
            },
            goodsspectList(){ //商品规格的数据
                getGoodsdetail({goods_id:this.goods_id}).then(res=>{
                    
                    this.kanList=res
                    this.goodsData.goods_id=this.kanList.goods_id
                    this.goodsData.distance_end_time=this.kanList.distance_end_time
                    this.goodsData.distance_end_time=this.kanList.distance_end_time
                    var  skulist=[]
                    let goodsSpec1 = this.goodsData.image_colors; //初始数据

                    this.kanList.anthor_sku.map(item=>{
                        if(this.goodsData.image_colors !== undefined){
                        if(goodsSpec1.length>0){
                            var result=[]
                            var result1=[]
                            goodsSpec1.map(r=>{ //每一个商品颜色的规格
                            let temp = {};
                            Object.assign(temp, r);
                            console.log(temp);
                                if(r.sku_size_vos){
                                r.sku_size_vos.map(j=>{
                                    if(j.sku=== item.sku ){
                                        result.push(j)
                                        result1.push(temp)
                                    }
                            })
                            temp.sku_size_vos=result
                        }
                    })
                    if (result1.length) {
                        this.goodsSpecList = result1;
                    }  
                    }
                }
                wx.hideLoading()
                if(this.goodsData.sku==item.sku){
                    this.$set(this.goodsData,'base_price',item.base_price)
                    this.$set(this.goodsData,'is_free_shipping',item.is_free_shipping)
                            // this.goods_id
                            // this.goodsData.base_price=item.base_price
                            // this.goodsData.is_free_shipping=item.is_free_shipping
                }
            skulist.push(item.sku)
            this.initTimeDown(this.kanList.distance_end_time)
        })
                    this.GoodsDynamicinfo({sku:this.goodsData.sku,free_freight:this.goodsData.is_free_shipping}); //动态信息
                    getPrdtStatus({skulist:skulist}).then(resStatue=>{
                        var statusList=resStatue
                        getCutPrdtLists({skus:skulist}).then(resPrd=>{
                            var  prdtLists =resPrd
                            //判断是否可售
                            statusList.map(item=>{
                                prdtLists.map((itemPrd,i)=>{
                                    if(itemPrd.sku==item.sku&&item.status!=1){
                                        prdtLists.splice(i,1)
                                    }
                                })
                            })
                            prdtLists.map((itemPrd,i)=>{
                                this.kanList.anthor_sku.map(item=>{
                                    if(item.sku==itemPrd.sku){
                                        itemPrd=Object.assign(itemPrd,item)
                                    }
                                })
                            })
                            getDoodsIdenticalData({sku:wx.getStorageSync('sku')}).then(res=>{
                                var skusArr=[]
                                console.log(res);
                                let sizeObj = res;  //规格数组
                                let goodsSpec = this.goodsData.image_colors; //初始数据
                                console.log(this.goodsData.image_colors);
                                prdtLists.map(sizeItem=>{
                                    for(let key in sizeObj){
                                        if(sizeItem.sku==key){
                                            sizeObj[key]=Object.assign(sizeObj[key],sizeItem)
                                            skusArr.push(sizeObj[key])
                                            console.log(skusArr)
                                        }
                                    }
                                })

                                if(this.goodsData.image_colors !== undefined){

                                    if(this.goodsSpecList.length>0){
                                        var result=[]
                                        var result1=[]
                                        debugger
                                        this.goodsSpecList.map((r,index)=>{ //每一个商品颜色的规格
                                            if(r.sku_size_vos){
                                                r.sku_size_vos.map(j=>{
                                                    skusArr.map(n=>{
                                                    if(j.sku=== n.sku ){
                                                        j=Object.assign(j,n)
                                                        j.stock=10
                                                        result.push(j)
                                                        }
                                                    })
                                                })
                                                this.$set(this.goodsSpecList[index],'sku_size_vos',result)
                                            }
                                        })
                                    }
                                }
                            })

                        })
                    })
                })
            },

            /** 商品方法
             * 1,商品促销 goodsSales
             * 2,,闪送规则  speedgive
             * 3,选择商品规格 goodsSize
             * 4,选择地址 selectaddress
             * 5,选择优惠卷 ownCoupon
             */

            goodsSize() {  //选择商品规格 商品价格，活动价，原价，图片，规格数据
                if(this.goodsSpecList==null){return}
                let goodsModalData = {
                    buffind: 0,
                    sizeind: -1,
                    goodsSize: true,
                    goodsSizeprice: this.priceNum, //价格
                    goodsOriginal: parseInt(this.goodsData.list_price), //原价
                    goodsphoto:this.goodsData.image_colors[0].main_image,
                    goodsSizeSpec: this.goodsSpecList, //规格,\
                    staff_id:this.options.staff_id || ''   //导购规则
                };
                this.goodsModalData = goodsModalData;
                this.ModalShow = true;
            },
            headCall(msg) {

                console.log(msg);
            },
            selectaddress() {  //选择地址
                if(this.tokenID){
                    // if(this.addressfreight.lightning_support ==1){
                    //     wx.navigateTo({url:'../search/quickGoods/main?detailedadd=detailedadd'})
                    // }else{
                    let goodsModalData = {
                        addressING: this.addressING,
                        ifselectaddress: true
                    };
                    gainAddressList().then(res => { //获取地址
                        if(JSON.stringify(res)=='{}'){
                        this.address_list = [];
                        goodsModalData.address_list = []
                    }else{
                        this.address_list = res.address_list;
                        goodsModalData.address_list = res.address_list
                    }
                    this.goodsModalData = goodsModalData;
                    this.ModalShow = true;
                });
                    // }
                }else{
                    wx.navigateTo({url:'../../pages/userCenter/login/wxLogin/main'})
                }

            },

            specCallBackselect(msg){ //回调的规格
                this.goodsspecData= msg;
                this.goodsData.base_price=this.kanList.base_price
                this.buffind = msg.buffind;
                this.sizeind = msg.sizeind;
                this.sku = msg.goodssku
                this.kanList.anthor_sku.map(item=>{
                    if(this.sku==item.sku){
                        this.goods_id=item.goods_id
                    }
                })
                // this.havespec=true
                if(!this.tokenID){
                    let params={
                        sku: msg.goodssku,
                        longitude:this.locationInfo.longitude,
                        latitude:this.locationInfo.latitude
                    }
                    this.Goodsinfo(params);
                    let paramsInfo={
                        sku: msg.goodssku,
                        longitude:this.locationInfo.longitude,
                        latitude:this.locationInfo.latitude,
                        free_freight:this.goodsData.is_free_shipping
                    }
                    this.GoodsDynamicinfo(paramsInfo);
                }else{

                    this.Goodsinfo({ sku: msg.goodssku});
                    this.GoodsDynamicinfo({ sku:msg.goodssku,free_freight:this.goodsData.is_free_shipping});
                }

                if(!this.address_id&&this.buyBtn){
                    this.showAddress=true
                    this.buyaddress=true
                    this.buyBtn=false
                    return
                }
            },
            onfreight(){ //点击地址查看运费情况
                if(this.goodsData.is_free_shipping)return
                let arr = this.goodsDynamicData.support_distr_address.support_address.freight_list;
                let obj = {};
                arr = arr.reduce(function(item, next) {
                    obj[next.freight_name] ? '' : obj[next.freight_name] = true && item.push(next);
                    return item;
                }, []);

                console.log(arr);
                let goodsModalData ={
                    ifonfreight:true,
                    addressfreightInfo: arr
                }
                this.goodsModalData = goodsModalData;
                this.ModalShow = true;
            },
            closeModal(msg) {
                let that = this;

                //关闭模态框
                this.ModalShow = false;
            },
            closeM(){
                this.showPost=false
                this.sureAddress=false
                this.buyaddress=false
                this.showAddress=false
                this.ModalShow = false;

            },
            sharePhoto(){ //分享和生成海报
                let goodsModalData = {
                    goodsName: this.goodsData.marketing_title,
                    sharepage: true,
                    goodsImg: this.goodsData.image_colors[0].main_image,
                    goodsprice:this.goodsData.list_price,
                    userName:'登录的用户名',
                    usertopimg:'用户头像',
                    goodssku:this.goodsData.sku,
                    sharesign:true
                };
                this.goodsModalData = goodsModalData;
                this.ModalShow = true;
            },

            palyVideo(){ //点击播放视频
                console.log(12334);
                this.autoplayset = false;
                let videoContext = wx.createVideoContext('video')
                this.palyvide = true;
                videoContext.play()
            },
            bindende(){
                console.log('视频播放处罚');
                this.palyvide = false;
                this.autoplayset = true;
            },
            pauser(){
                this.palyvide = false;
                this.autoplayset = true;
            },
            changeswiper(){
                // this.palyvide = false;
                // this.autoplayset = true;
                // let videoContext = wx.createVideoContext('video')
                // videoContext.stop();
                console.log(123)
            },
            lookMoreShop(i){
                // console.log(1234)
                if(i==1){  //库存的查看更多
                    wx.navigateTo({url: '/pages/shop/shopSelect/main?detailedMore=detailedMore'+'&sku='+this.goodsData.sku+'&stock=stock'})
                }else{ //有商品规格的查看更多
                    let params = `sku=${this.goodsData.sku}&detailedMore=detailedMore&MoregoodsName=${this.goodsspecData.goodsspecbuff}&MoregoodsScpe=${this.goodsspecData.goodsspecsize}`
                    console.log(params)
                    wx.navigateTo({url: '/pages/shop/shopSelect/main?'+params})
                }

            },

        },
        onHide:function () {
            console.log("==onHide==");
            let videoContext = wx.createVideoContext('video')
            videoContext.stop();
            // this.goodsspecData=null;
        },
        onUnload: function () {
            console.log("==onUnload==");
            let videoContext = wx.createVideoContext('video')
            videoContext.stop();
            this.goodsspecData=null;
            this.ModalShow = false;
        },
        // 小程序分享
        onShareAppMessage(options) {
            this.ModalShow = false;
            var that =this
            that.showPost=false
            console.log(options)
            console.log('/pages/cutprice/details/main?sku='+this.goodsData.sku,)
            console.log('/pages/cutprice/cutShare/main?cut_id='+this.cut_id+'&goods_id='+this.goods_id,)
            if(options.target.dataset.type==1){
                console.log(1)
                return{
                    title:`${wx.getStorageSync('userinfo').nick_name}@你，快来帮我砍一刀，人多力量大`,
                    imageUrl: this.goodsData.image_colors[0].main_image,
                    path: '/pages/cutprice/cutShare/main?cut_id='+this.cut_id+'&goods_id='+this.goods_id,
                    success: function () {
                        that.hasShare=true
                    }
                }
            }else{
                console.log(2)

                return{
                    title: this.goodsData.marketing_title ,
                    imageUrl: this.goodsData.image_colors[0].main_image,
                    path: '/pages/cutprice/details/main?sku='+this.goodsData.sku,
                    success: function () {
                        that.hasShare=true
                    }
                }
            }

        }
    };
</script>
<style scoped>
    .money-bold{
        font-weight: bold;
    }
    .closeImg{
        height: 60rpx;
        width: 60rpx;
        position: absolute;
        bottom: -100rpx;
        left: 210rpx;
    }
    .sure-title{
        font-size: 34rpx;
        padding: 20rpx;
    }
    .sure-address{
        font-size: 26rpx;
        padding: 20rpx;
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
        padding-top: 30rpx;
    }
    .sure-box{
        position: relative;
        text-align: center;
        height: 330rpx;
        width: 590rpx;
        background: #fff;
        border-radius: 15rpx;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -295rpx;
        margin-top: -165rpx;
    }
    .selectChange-span{
        font-size: 28rpx;
        padding-left: 20rpx;
        color: #666666;
        max-width: 600rpx;
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .more-kan{
        width: 200rpx;
        text-align: center;
        padding: 10rpx 0;
    }
    .more-img{
        height: 45rpx;
        width: 45rpx;
    }
    .more-tip{
        font-size: 25rpx;
    }
    .shareP{
        font-size: 26rpx;
        text-align: center;
        padding: 20rpx;
    }
    .dialog-title{
        font-size: 40rpx;
        color: #633923;
        text-align: center;
        padding: 37rpx 0 0;
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
        font-size: 40rpx;
        color: #FF5000 ;
        position: absolute;
        top: 100rpx;
        text-align: center;
        width: 100%;
    }
    .dialog-y{
        font-size: 28rpx!important;
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
    }
    .dialog{
        height: 100%;
        width: 100%;
        position: fixed;
        background: rgba(0,0,0,0.3);
        top: 0;
        z-index: 99;
    }
    .day_num{
        display: inline-block;
        height: 34rpx;
        width: 34rpx;
        text-align: center;
        line-height: 34rpx;
        margin: 2rpx;
        margin-right: 4rpx;
        background: #FF2828;
        color: #fff;
        border-radius: 4rpx;
    }
    .end_time_tip{
        padding: 10rpx 0 5rpx;
        text-align: center;
    }
    .end_time_day{
        text-align: center;
    }
    .end_time{
        width: 240rpx;
        height: 100%;
        font-size: 22rpx;
        color: #FF2828;
        background: #FFEAE9;
    }
    .coupon_left,.coupon_right{
        height: 32rpx;
        width: 12rpx;
        vertical-align: top;
    }
    .coupon_left{
        float: left;
    }
    .coupon_right{
        float: right;
    }
    .coupon_span{
        padding:  0 12rpx;
        height: 32rpx;
        text-align: center;
        line-height: 32rpx;
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 6rpx;
    }
    .coupon_span text{
        display: inline-block;
        vertical-align: top;
        background: #ff5000;
        color: #fff;
        font-size: 20rpx;
        height: 100%;
        padding: 0 4rpx;

    }
    /* 视频定位 */
    .videoPoster{
        position: absolute;
        top: 0rpx;
        left: 0rpx;
        width: 750rpx;
        height: 750rpx;
    }
    .videoPosterPaly{
        width: 120rpx !important;
        height: 120rpx !important;
        position: absolute;
        left: 315rpx;
        top: 315rpx;
    }



    .color000{
        color: #000 !important;
    }
    .drawer_screen {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        background: rgba(0, 0, 0, 0.6);
        overflow: hidden;
    }
    /* 促销模态框 */
    .goodsSalesMoadl {
        position: fixed;
        width: 100%;
        position: fixed;
        bottom: 0rpx;
        z-index: 10000;
        border-radius: 20rpx 20rpx 0rpx 0rpx;
        /* height:640rpx; */
        background-color: white;
    }
    /* 乐闪送 */


    /* 相同的 */
    .alike {
        display: flex;
        align-items: center;
        height: 88rpx;
        background: #ffffff;
    }
    .alikep {
        display: flex;
        /* align-items: center; */
        height: 88rpx;
        background: #ffffff;
    }
    .img {
        width: 26rpx;
        height: 6rpx;
        margin-right: 20rpx;
    }
    .pointimg {
        width: 44rpx;
        height: 44rpx;
        position: absolute;
        right: 20rpx;
        }
    .color {
        color: #333333 !important;
        width: 593rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .span {
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        color: #999999;
        letter-spacing: 0;
        margin-left: 20rpx;
    }
    /* 两行显示... */
    .ellipsis {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    /* 用户推荐 */
    .groom {
        height: 176rpx;
        margin-top: 20rpx;
        margin-left: 0rpx;
        font-family: PingFangSC-Regular;
        font-size: 22rpx;
        color: #333333;
        letter-spacing: 0;
        line-height: 24rpx;
        background: #f3f5f7;
    }
    .groom .groomName {
        background: #fff5c8;
        text-align: center;
        height: 176rpx;
        width: 104rpx;
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .groom .groomName image {
        width: 60rpx;
        height: 60rpx;
        margin-bottom: 20rpx;
        margin-top: 30rpx;
    }
    .groom .gromminfo {
        padding-left: 20rpx;
        height: 100%;
        background: #ffffff;
        width: 404rpx;
    }
    .groom .gromminfo .gormminfo_text {
        width: 380rpx;
        height: 64rpx;
        font-size: 26rpx;
        line-height: 32rpx;
        margin-bottom: 23rpx;
        margin-top: 28rpx;
    }
    .groom .gromminfo text {
        height: 36rpx;
        width: 110rpx;
        border: 1px solid #fac800;
        border-radius: 20px;
        line-height: 36rpx;
        margin-right: 12rpx;
        padding: 0 5rpx;
        color: #fac800;


    }
    .grommpeople {
        height: 130rpx;
        width: 180rpx;
        background: #ffffff;
        text-align: center;
        margin-left: 20rpx;
        padding-top: 46rpx;
    }
    .grommpeople .grommpeole_num {
        font-size: 48rpx;
        color: #ff5000;
    }
    .grommpeople .grommpeole_num2 {
        font-size: 26rpx;
        color: #ff5000;
    }
    .grommpeople .grommpeole_rec image {
        height: 24rpx;
        width: 24rpx;
        vertical-align: bottom;
        margin-left: 15rpx;
        margin-top: 34rpx;
    }

    /* 品牌馆 */
    .shopBrand {
        height: 190rpx;
        font-family: PingFangSC-Regular;
        font-size: 26px;
        color: #999999;
        margin-top: 20rpx;
    }
    .shopBrand .shopBrandImg {
        border-radius: 50%;

        height: 80rpx;
        width: 80rpx;
        margin-left: 20rpx;
        border: 1rpx solid #eeeeee;
    }
    .shopBrand .shopBrandBOX {
        width: 610rpx;
        margin-top: 31rpx;
        margin-left: 20rpx;
        margin-bottom: 20rpx;
    }
    .shopBrand .shopBrandBOX .shopBrandNameBOX {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16rpx;
    }
    .shopBrand .shopBrandNameBOX .shopBrandName1 {
        font-size: 30px;
        color: #333333;
    }
    .shopBrand .shopBrandNameBOX .shopBrandName2 {
        background: #ff5000;
        border-radius: 26px;
        height: 48rpx;
        width: 170rpx;
        color: #ffffff;
        line-height: 48rpx;
        text-align: center;
    }
    .shopBrandBOX .shopBrandinfo {
        color: #999999;
        height: 72rpx;
        width: 610rpx;
    }


    /* 商品推荐 */
    .Tabactive {
        color: #ff5000;
    }
    .recommend {
        margin-top: 20rpx;
        background: #ffffff;
        padding-bottom: 30rpx;
    }
    .ci_tab {
        height: 74rpx;
        display: flex;
        justify-content: center;
        font-size: 30px;
        color: #333333;
        text-align: center;
        background: #ffffff;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
    }
    .ci_tabline{
        height: 50rpx;
        width: 4rpx;
        background:#f3f5f7;
        position: absolute;
        left: 50% rpx;
        top: 13rpx;
    }
    .ci_tabtitle {
        width: 374rpx;
        height: 74rpx;
        line-height: 74rpx;
        box-sizing: border-box;
    }

    .recgoodsBox{
        display: flex;
        flex-wrap: wrap;
        font-size: 24px;
        color: #333333;
        margin-left: 20rpx;
        margin-top: 10rpx;
    }
    .recgoodscontent{
        display: flex;
        flex-direction: column;
        margin-right: 10rpx;
        margin-top: 10rpx;
        position: relative;
    }
    /* 排行棒图片标签 */
    .recCImg{
        position: absolute;
        right: 0rpx;
        top: 0rpx;
        height: 56rpx;
        width: 44rpx;
    }

    .recgoodscontent .recCtImg{
        height: 230rpx;
        width: 230rpx;
    }
    .recgoodscontent .recCtText{
        height: 65rpx;
        width: 230rpx;
        margin: 12rpx 0rpx;
    }
    .recgoodscontent .recCtprice{
        color: #FF5000;
    }
    /* 商品评论 */
    .goodscomment {
        padding-bottom: 28px;
        margin-top: 20rpx;
        background: #ffffff;
    }
    .goodscomment .header {
        justify-content: space-between;
    }
    .goodscomment .header .img {
        margin-right: 20rpx;
        height: 25rpx;
        width: 15rpx;


    }
    .goodscomment .content {
        margin-top: 20rpx;
    }
    .goodscomment .content .img {
        height: 80rpx;
        width: 80rpx;
        margin-right: 0rpx;
        margin-left: 20rpx;
        border-radius: 50%;
    }
    .goodscomment .content .goodsuser {
        vertical-align: top;
        width: 470rpx;
    }
    .goodscomment .content .goodsuser .vipimg {
        vertical-align: top;
        margin-left: 20rpx;
        width: 50rpx;
        height: 35rpx;
    }
    .goodscomment .content .userbox {
        align-items: flex-start;
    }
    .goodscomment .content .star {
        margin-left: 20rpx;
    }
    .goodscomment .content .star .starimg {
        width: 20rpx;
        height: 20rpx;
        margin-right: 4rpx;
        vertical-align: top;
    }
    .goodscomment .content .discuss {
        margin-top: 20rpx;
        margin-bottom: 20rpx;
        width: 710rpx;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .goodscomment .content .commentImg {
        margin-left: 20rpx;
    }
    .goodscomment .content .commentImg .cimg {
        width: 164rpx;
        height: 164rpx;
        margin-right: 10rpx;
        margin-bottom: 20rpx;
    }
    .goodscomment .more {
        width: 220rpx;
        height: 60rpx;
        background: #ffffff;
        border: 2px solid #ff5000;
        border-radius: 50rpx;
        color: #ff5000;
        line-height: 60rpx;
        text-align: center;
        margin: 50rpx auto 0;
    }
    .goods_comment_lists {
        margin-top: 20rpx;
        border-bottom: #eeeeee 1px solid;
    }
    .goods_comment_lists:last-child {
        border-bottom: none;
    }
    /* 中间广告 */
    .advertisement {
        background: #fafafa;
        box-shadow: 0 -1rpx 0 0 #eeeeee;
    }
    .advertisement .pointimg {
        margin: 0 20rpx;
        height: 26rpx;
        width: 26rpx;
    }
    .advertisement text {
        font-family: PingFangSC-Regular;
        font-size: 24px;
        color: #999999;
        letter-spacing: 0;
        margin-right: 40rpx;
    }

    /* 送货地址 */
    .address {
        height: 184rpx;
        align-items: baseline;
        background: #ffffff;
    }
    .addresseBOX {
        height: 30rpx;
        line-height: 30rpx;
        margin-top: 16rpx;
    }
    .addressText {
        margin-left: 8rpx;
        /* margin-right: 20rpx; */
    }
    .addressexpressimg {
        margin-left: 20rpx;
        width: 26rpx;
        height: 26rpx;
    }
    .addressmoney {
        height: 30rpx;
        line-height: 30rpx;
        margin-top: 28rpx;
        position: relative;
    }
    .place {
        align-items: baseline;
        height: 100rpx;
        position: relative;
        overflow: hidden;
        line-height: 100rpx;
        /* height: 72rpx; */
    }
    .addressD {
        height: 30rpx;
        margin-top: 20rpx;
        margin-bottom: 20rpx;
    }
    .addresspointimg {
        position: absolute;
        width: 44rpx;
        height: 44rpx;
        top: 30rpx;
        right: 20rpx;
    }
    .speedgive{
        height: 30rpx;
    }
    /* .speedgive{ */
    /* display: flex; */
    /* margin-left: 20rpx; */
    /* flex-direction: column; */
    /* } */
    /* .speedgive div{ */
    /* display: flex; */
    /* } */


    /* 库存 */
    .stock{
        margin-top:20rpx;
        border-bottom: 1rpx solid #f3f5f7;
        height: 88rpx;
    }
    .stockBox{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        width: 460rpx;
    }

    /* 选择规格 */
    .selectmore{
        color: #FF5000 !important;
        width: 70rpx !important;
        margin-left: 0rpx!important;
    }
    /* 促销 */
    .sales {
        min-height: 88rpx;
        position: relative;
        align-items: baseline;
        line-height: 88rpx;
        display: flex;
        background: #ffffff;
    }
    .sales .salesImg {
        position: absolute;
        width: 44rpx;
        height: 44rpx;
        top: 10rpx;
        right: 20rpx;
    }
    .sales .contentbox {
        width: 640rpx;
        margin-left: 20rpx;
        max-height: 170rpx;
        overflow: hidden;
    }
    .sales .contentbox .content {
        display: flex;
        align-items: center;
        margin-bottom: 28rpx;
    }
    .sales .contentbox .content .content_r {
        text-align: center;
        margin-left: 12rpx;
        background: #ffffff;
        border: 1rpx solid #ff5000;
        border-radius: 20rpx;
        height: 28rpx;
        min-width: 48rpx;
        padding: 0rpx 10rpx;
        font-family: PingFangSC-Regular;
        font-size: 21rpx;
        color: #ff5000;
        letter-spacing: 0;
        line-height: 28rpx;
    }
    .sales .contentbox .content .content_l {
        margin-left: 12rpx;
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        color: #333333;
        letter-spacing: 0;
        line-height: 28rpx;
        width: 490rpx;
        height: 28rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    /* 优惠卷 */
    .coupon {
        margin-top: 20rpx;
        border-bottom: 1rpx solid #f3f5f7;
    }
    .coupon .content {
        margin-left: 32rpx;
        width: 600rpx;
        overflow: hidden;
        /* height:50rpx; */
        /* position: relative; */
    }
    .coupon .coupon_conImg {
        position: relative;
        height: 32rpx;
        width: 180rpx;
        margin-left: 8rpx;
        /* background: #FF5000; */
        border-radius: 4px;
    }
    .coupon .coupon_txt {
        position: absolute;
        bottom: 0rpx;
        left: 17rpx;
        font-family: PingFangSC-Regular;
        font-size: 22rpx;
        color: #ffffff;
        letter-spacing: 0;
        line-height: 32rpx;
        height: 32rpx;
    }

    /* 是否开通乐享卡 */
    .card {
        background: #fffaeb;
    }
    .card .cardlab {
        margin-left: 20rpx;
        width: 105rpx;
        height: 35rpx;
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
    .card .openCard {
        height: 88rpx;
        width: 131rpx;
        display: flex;
        align-items: center;
        background: #ffeba2;
    }
    .VIPIMG{
        height: 25rpx;
        width: 15rpx;
    }
    /* 轮播图 */
    .roundheader{
        width: 750rpx;
        height: 750rpx;
        position: relative;
    }
    .videoMP4{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }

    .swiper {
        width: 750rpx;
        height: 750rpx;
        /* position: relative; */
    }
    .swiper image {
        width: 100%;
        height: 100%;
    }
    .swiper_sign {
        position: relative;
        bottom: 140rpx;
        left: 20rpx;
        display: flex;
        width: 500rpx;
        height: 88rpx;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50rpx;
        align-items: center;
    }

    .swiperItem{
        position: absolute;
        display: flex;
        width: 500rpx;
        height: 88rpx;
        align-items: center;
    }

    .swiper_sign .sign_limg {
        height: 80rpx;
        width: 80rpx;
        border-radius: 50%;
        margin-left: 6rpx;
    }
    .swiper_sign .sign_text {
        font-family: PingFangSC-Light;
        font-size: 22rpx;
        color: #ffffff;
        letter-spacing: 0;
        line-height: 56rpx;
        height: 56rpx;
        width: 340rpx;
        margin-left: 12rpx;
        overflow: hidden;/*超出部分隐藏*/
        white-space: nowrap;/*不换行*/
        text-overflow:ellipsis;/*超出部分文字以...显示*/
    }
    .swiper_sign .sign_rimg {
        height: 22.3rpx;
        width: 12.3rpx;
        margin-left: 28rpx;
    }
    /* 商品介绍 */
    .goodsinfo {
        /* height: 402rpx; */
        background: #ffffff;
        padding-bottom: 26rpx;
        /* width: 730rpx; */
    }

    .goodsinfo .price {
        display: flex;
        width: 750rpx;
        margin: 0 auto;
        height: 90rpx;
        /* height: 30rpx; */
    }
    .price_sell {
        width: 470rpx;
        padding-left: 40rpx;
        background:linear-gradient(-90deg, #FF5000 0%, #FF2828 74%, #FF2828 100%);
        height: 100%;
        line-height: 90rpx;
        color: #fff;
        vertical-align: middle;
        font-size: 34rpx;
    }
    .sale_price{
        font-size: 64rpx;
        vertical-align: middle;
    }
    .lekan-tip{
        font-size: 20rpx;
        padding: 2rpx 10rpx;
        border: 1rpx solid #fff;
        border-radius: 20rpx;
        vertical-align: middle;
        padding: 0 10rpx;
    }
    .base_price{
        font-size: 26rpx;
        padding: 0 10rpx;
        vertical-align: middle;
        text-decoration: line-through;
    }
    .price_sell .textsign {
        font-size: 40rpx;
    }
    .price_sell .textsignfont {
        font-size: 34rpx !important;
    }
    .price_sell .textprice {
        font-size: 64rpx;
    }
    .price_sell .textpricefont {
        font-size: 48rpx !important;
    }
    .price_so {
        color: #999999;
        text-decoration: line-through;
        margin-left: 12rpx;
        margin-bottom: 7rpx;
        vertical-align: middle;
        font-size: 26rpx;
    }
    .price_img {
        margin-left: 10rpx;
    }
    .price_img .img1 {
        width: 68rpx;
        height: 68rpx;
    }
    .price_img .img2 {
        width: 68rpx;
        height: 68rpx;
        padding-right: 14rpx;
        padding-top: 14rpx;
    }
    /* 商品会员专属价格 */
    .vipprice {
        height: 30rpx;
        display: flex;
        margin-top: 28rpx;
        margin-left: 20rpx;
    }
    .vipprice .vip_span {
        font-size: 30rpx;
        line-height: 30rpx;
        font-weight: 600;
        color: #333333;
        margin-left: 5rpx;
    }
    .vipprice .vip_img {
        width: 48rpx;
        height: 28rpx;
        margin-left: 7rpx;
    }
    /* 乐闪送 */
    .leshansong{
        width: 98rpx;
        height: 30rpx;
        vertical-align: middle;
        /* margin-top:0rpx; */
        margin-right:5rpx;
    }
    .leshansongText{
        font-size:30rpx;
        font-weight: bold;
        vertical-align:middle;
    }
    .widthaddsong{
        width:240rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .goodsinfo .content {
        /* margin-top: 28rpx; */
        /* margin-left: 20rpx;
        margin-left: 8rpx; */
        /* font-weight: 600; */
        font-family: PingFangSC-Medium;
        /* font-size: 30rpx; */
        color: #333333;
        /* letter-spacing: 0; */
        line-height: 40rpx;
        margin-right: 18rpx;
        width: 610rpx;
    }
    .goodsinfo .introduce {
        /* margin-top: 20rpx; */
        /* margin-left: 20rpx; */
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        color: #666666;
        letter-spacing: 0;
        line-height: 32rpx;
        width: 650rpx;
    }
    .goodsinfo .buyok {
        margin-top: 20rpx;
        /* margin-left: 20rpx; */
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        color: #999999;
        letter-spacing: 0;
        line-height: 26px;
    }
    /* 推荐好物 */
    .button--btn-navigator__hover{
        background-color:#fff;
    }
    .button--btn-type-0 {
        outline:1px solid #333 !important;
    }
    .goodsdetailed {
        background: #f3f5f7;
    }
    .product_detail_top {
        padding: 25px 0;
        text-align: center;
        font-size: 26px;
        color: #333333;
        background: #f3f5f7;
    }

    /* 图文信息 */
    .product_padd{
        padding-bottom:100rpx;
    }
    .product_paddX{
        padding-bottom:240rpx;
    }

    .product_cart_fixed {
        width: 100%;
        background: #fff;
        position: fixed;
        left: 0;
        bottom: 0;
        border-top: #eeeeee 1px solid;

    }

    .productBox{
        display: flex;
        height: 100rpx;
    }

    .phonestyleShow{
        height: 160rpx;
    }


    .product_cart_button,
    .product_cart_service {
        width: 165px;
        padding-top: 13px;
    }
    .product_cart_button {
        border-right: #eeeeee 1px solid;
    }
    .product_cart_add_money{
        font-size: 26rpx;
        color: #FFDCCC;
    }
    .product_cart_add {
        flex: 1;
        background: #ff5000;
        color: #fff;
        text-align: center;
        font-size: 30px;
        padding: 15rpx 0;
        font-weight: bold;
    }
    .product_cart_icon_img {
        width: 41px;
        height: 41px;
        display: block;
        margin: auto;
    }
    .product_cart_txt {
        display: block;
        padding-top: 8px;
        font-size: 24px;
        text-align: center;
        color: #333333;
        font-family: "PingFangSC-Regular";
    }

    /* 成功加入购物车 */
    .addcartSuccess{
        height: 88rpx;
        display: flex;
        font-size: 26rpx;
        position: fixed;
        bottom: 100rpx;
        line-height: 88rpx;
        padding:0 20rpx;
        width: 710rpx;
        color: #fff;
        justify-content:space-between;
        background: rgba(0, 0, 0, 0.7)
    }
    .addcartSuccess .addcart_text{
        color: chocolate;
    }
    .addSuccessX{
        bottom:160rpx !important;
    }
    /* 购物车数量 */
    .produce_positions{
        position: relative;
    }
    .product_cartNum{
        position: absolute;
        top: 1rpx;
        right: 45rpx;
        min-height: 25rpx;
        color: #ff5000;
        min-width: 25rpx;
        text-align: center;
        /* line-height: 22rpx; */
        border-radius: 50%;
        border: 1rpx solid #ff5000;
        background: #fff;
        font-size: 18rpx;
    }


    /**
    /* 商品类型显示 */
    .goodsmold {
        display: flex;
        font-family: PingFangSC-Medium;
        color: #ffffff;
        letter-spacing: 0;
        font-size: 30rpx;
        font-weight: 600;
        align-items: center;
        vertical-align: bottom;
    }
    .goodsmold .goodsmold_img {
        height: 98rpx;
        width: 750rpx;
        position: relative;
    }
    .goodsmold_img_box {
        position: absolute;
        left: 120rpx;
        bottom: 0rpx;
        color: #ffffff;
        font-size: 30rpx;
        font-weight: 600;
    }
    .goodsmold .sign {
        vertical-align: bottom;
    }
    .goodsmold .goodsmold_price {
        font-size: 64rpx;
        vertical-align: bottom;
    }
    .goodsmold .goodsmold_float {
        vertical-align: bottom;
    }
    .goodsmold_more {
        position: absolute;
        right: 20rpx;
        bottom: 35rpx;
    }
    /* 新用户专享 */
    .goodsUserVip_text {
        font-family: PingFangSC-Light;
        font-size: 26px;
        font-weight: 400;
        color: #ffffff;
        letter-spacing: 0;
        vertical-align: middle;
    }
    .goodsUserVip_img {
        height: 22.3rpx;
        width: 12.3rpx;
        margin-left: 20rpx;
        vertical-align: middle;
    }

    /* 秒杀开始与结束 */
    .goodsmold_over {
        position: absolute;
        right: 38rpx;
        bottom: 18rpx;
        text-align: center;
        display: flex;
        flex-direction: column;
        /* width: 300rpx; */
        /* text-align: end; */
    }
    .goodsmold_overtime {
        font-size: 26rpx;
        font-weight: 400;
        color: #ffffff;
    }
    .goodsmold_buy {
        background: rgba(255, 255, 255, 0.6);
        border-radius: 15rpx;
        text-align: center;
        font-size: 20rpx;
        color: #28b4fa;
        line-height: 22rpx;
        max-width: 200rpx;
        height: 22rpx;
        margin-top: 11rpx;
        margin-left: 28rpx;
    }

    /* 定金开始，定金结束，尾款 */
    .goodsbargain {
        background-image: linear-gradient(
                -269deg,
                #28b4fa 0%,
                #00a0f0 74%,
                #00a0f0 100%
        );
    }
    .gsbargain_test {
        font-size: 26rpx;
        margin-left: 20rpx;
        vertical-align: bottom;
        height: 10rpx;
    }
    .gssign {
        margin-left: 8rpx;
        vertical-align: bottom;
        font-size: 34rpx;
        height: 22rpx;
    }
    .gsprice {
        vertical-align: bottom;
        font-size: 64rpx;
        margin-left: 3rpx;
        /* height: 50rpx; */
    }
    .gsbargainprice {
        margin-top: 26rpx;
        margin-left: 20rpx;
        text-align: center;
        opacity: 0.8;
        background: #ffffff;
        border-radius: 20px;
        height: 30rpx;
        width: 158rpx;
        font-size: 22px;
        color: #00a0f0;
        line-height: 30px;
    }
    .goodsbargain_DAY {
        background: #e7f7ff;
        width: 250rpx;
        height: 98rpx;
        font-size: 22rpx;
        flex-direction: column;
        justify-content: center;
        color: #00a0f0;
        text-align: center;
    }
    .goodsbargain_DAY text {
        background: #00a0f0;
        border-radius: 4px;
        color: #ffffff;
        height: 45rpx;
        line-height: 45rpx;
        padding: 4rpx 4rpx;
    }
    .bookingsell {
        background: #f6f6f6;
        border-radius: 20rpx;
        height: 170rpx;
        width: 710rpx;
        margin: 0 auto;
        font-family: PingFangSC-Regular;
        font-size: 26px;
        color: #333333;
        letter-spacing: 0;
        margin-top: 20rpx;
        padding-top: 20rpx;
    }
    .bookingsell .bs_box {
        margin-left: 20rpx;
        vertical-align: bottom;
        height: 37rpx;
    }
    .bs_boxT1 {
        font-weight: 500;
        margin-right: 12rpx;
    }
    .bs_boxT2 {
        color: #ff5000;
    }
    .bs_boxT3 {
        font-size: 34px;
        color: #ff5000;
    }
    .bs_boxT4 {
        margin-left: 20rpx;
        color: #333333;
    }
    /* 全球购 */
    .globeBox {
    }
    .globebuy {
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 26px;
        color: #333333;
        letter-spacing: 0;
        line-height: 36px;
        margin-top: 32rpx;
        margin-left: 22rpx;
        margin: 32rpx 0rpx 20rpx 22rpx;
    }
    .globebuy_titimg {
        width: 36rpx;
        height: 36rpx;
        margin-right: 12rpx;
    }
    .globeIMG {
        height: 66rpx;
        width: 750rpx;
    }

    /* 轮播图滚动 */


</style>

