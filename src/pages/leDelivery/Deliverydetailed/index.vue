<template>
  <div class="goodsdetailed" v-if='commentBox'>
    <!-- 轮播图 -->
    <div class="roundheader">
      <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="1000" indicator-active-color='#ff5000'>
         <!-- <swiper-item v-if="goodsData.video_stream_url">
            <video style="width:100%;height:100%" object-fit='fill' :src="goodsData.video_stream_url" :poster='immm' controls></video>
          </swiper-item> -->
        <block v-for="(item, index) in abc" :key="index">
          <swiper-item @click.stop="previewImage(abc, index)">
            <image :src="item" class="slide-image" mode="aspectFill"></image>
          </swiper-item>
        </block>
      </swiper>

      <!-- <swiper class="swiper_sign" v-if="goodsData.good_review_list" circular vertical autoplay duration=2000 @click="LookMore" > //滚动评论
        <block  v-for="(items, ind) in goodsData.good_review_list" :key="ind">
          <swiper-item class="swiperItem">
              <img class="sign_limg" :src="item.header_imge_url || '/static/goodsdetail/default_pic_user.png'">
              <div class="sign_text ellipsis">{{items.review_desc}}</div>
              <img class="sign_rimg" src="/static/images/public/public_arrow_right_white.png">
          </swiper-item>
        </block>
      </swiper> -->

    </div>

    <!-- 1,新客户专享 2，全球购 3，定金开始 4定金结束 5，尾款  6,秒杀开始，7，秒杀结束-->
    <!-- 1，新客户专享 -->
    <div class="goodsmold" v-if="goodsDynamicData.recruit_sale">
      <!-- 新用户专享 -->
      <image class="goodsmold_img" src="/static/goodsdetail/product_price_bg03.png">
        <div class="goodsmold_img_box">
          <text class="sign">￥</text>
          <text class="goodsmold_price">{{recruit_saleNum[0]}}</text>
          <text class="goodsmold_float">{{recruit_saleNum[1]}}</text>
        </div>
        <div class="goodsmold_more" @click='gotoNewUser'>
          <text class="goodsUserVip_text">更多专享 ></text>
          <!-- <img class="goodsUserVip_img" src="/static/goodsdetail/lecard_arrow_right.png"> -->
        </div>
      </image>
    </div>
    <!-- 2,预告秒杀  与 开始 product_price_bg02 -->
    <div class="goodsmold" v-if="goodsData.product_skill">
      <image class="goodsmold_img" :src="goodsData.skill_status!=1?'/static/goodsdetail/product_price_bg01.png':'/static/goodsdetail/product_price_bg02.png'">
        <div class="goodsmold_img_box">
          <text class="sign">￥</text>
          <text class="goodsmold_price">{{priceskill[0]}}</text>
          <text class="goodsmold_float">{{priceskill[1]}}</text>
        </div>
        <!-- 秒杀未开始 -->
        <div class="goodsmold_over" v-if="goodsData.skill_status!=1">
          <!--  class="goodsmold_overtime" -->
          <timedown :endTime = 'goodsData.startime' :skillNum = '0' ></timedown>
          <div class="goodsmold_buy">{{goodsData.startdata}}</div>
        </div>
        <!-- 秒杀开始 -->
        <div class="goodsmold_over" v-else>
          <timedown :endTime = 'goodsData.endtime' :skillNum = '1' ></timedown>
          <div class="goodsmold_buy" style="color:#ff5000">已抢{{goodsData.selling_quantity}}件</div>
        </div>
      </image>
    </div>
    <!-- 3，定金开始，定金结束  4尾款 -->
    <div class="goodsmold goodsbargain" v-if="false">
      <div style="width:500rpx;display:flex;align-items:center">
        <text class="gsbargain_test">定金</text>
        <text class="gssign">¥</text>
        <text class="gsprice">100</text>
        <div class="gsbargainprice">可低¥150.00</div>
      </div>
      <div class='goodsmold_over goodsbargain_DAY'>
        <span>距预售开始:</span>
        <div>
          <span>19天</span> :
          <text>45</text> :
          <text>52</text> :
          <text>12.5</text>
        </div>
      </div>
    </div>

    <!-- 商品介绍 -->
    <div class="goodsinfo">
      <div class="price">
        <div  style="width:600rpx;display:flex;align-items:flex-end">
          <template v-if="goodsData.skill_status!=1">
            <div class="price_sell">
              <text :class="['textsign',{'textsignfont':goodsData.skill_status!=1}]">￥</text>
              <text :class="['textprice',{'textpricefont':goodsData.skill_status!=1}]">{{priceNum[0]}}</text>
              <text :class="['textsign',{'textsignfont':goodsData.skill_status!=1}]">{{priceNum[1]}}</text>
            </div>
            <div class="price_so" v-if="goodsData.marketPrice">
              <text>￥</text>
              <text>{{goodsData.list_price}}</text>
            </div>
          </template>
        </div>
        <div class="price_img">
          <img class='img1'  @click="goodsCollect" :src="goodsDynamicData.is_focus?'/static/goodsdetail/product_icon_attent_on.png':'/static/goodsdetail/product_icon_attent_off.png'">
        </div>
        <div class="price_img">
          <img class='img2' @click="sharePhoto" src="/static/goodsdetail/tabbar_icon_share.png">
        </div>
      </div>


    <!-- 全球购 -->
    <!-- <div class="globeBox" v-if="false">
        <div class="globebuy">
          <img class="globebuy_titimg" src="/static/goodsdetail/lecard_arrow_right.png">
          <span style="margin-right:12rpx;">英国直供</span>
          <span style="margin-right:24rpx;">税率 11.9%</span>
          <span>关税 ￥11.8</span>
        </div>
        <img class="globeIMG" src="/static/goodsdetail/product_overseas.png">
    </div> -->

    <div class="globeBox" v-if="goodsData.is_ht">
        <div class="globebuy">
          <!-- <img class="globebuy_titimg" src="/static/goodsdetail/lecard_arrow_right.png"> -->
          <span style="margin-right:12rpx;">{{goodsData.nation}}直供</span>
          <span style="margin-right:24rpx;">税率 {{goodsData.tax_rate}}%</span>
          <span>关税 ￥{{goodsData.tariff}}</span>
        </div>
        <img class="globeIMG" src="/static/goodsdetail/product_overseas.png">
    </div>

    <!-- 专属价格 -->
    <div class="vipprice" v-if="goodsData.vip_price">
        <span class="span vip_span">专享价:</span>
        <span class="span vip_span">¥{{goodsData.vip_price}}</span>
        <img class="vip_img" src="/static/goodsdetail/product_sign_vip.png">
    </div>

    <!-- 商品简介 -->
    <div style="display:flex;margin-top: 28rpx;margin-left: 20rpx;">
        <div class="content">
            <img class="leshansong" v-if="addressfreight.lightning_support==1"
                src="/static/images/search/search_sign_speed.png">
            <span class='leshansongText'>{{goodsData.marketing_title}}</span>
        </div>
    </div>

      <!-- 商品第二简介 -->
    <!-- <div class="introduce">{{goodsData.product_title}}</div> -->
      <div style="display: flex;justify-content: space-between;width:720rpx;margin:0 20rpx;">
        <div class="buyok">已有{{goodsData.selling_quantity}}人购买</div>
        <div class="test-container">
          <shareButton type=1 fore-color='#333'  :product="product" bind:error="on_error"/>
        </div>
      </div>

    <!-- 4, 预售价格 -->
    <div class="bookingsell" v-if="false">
        <div class="bs_box">
          <span class="bs_boxT1">预售价</span>
          <span class="bs_boxT2">￥</span>
          <span class="bs_boxT3">188.00</span>
          <span class="bs_boxT4">已有XX人购买</span>
        </div>
        <div class="bs_box" style="margin-top:20rpx;">
          <span class="bs_boxT1">尾款</span>
          <span class="bs_boxT2">￥</span>
          <span class="bs_boxT3">188.00</span>
          <span class="bs_boxT4">9月17日 15:00-9月18日 18:00</span>
        </div>
        <div class="bs_box" style="margin-top:20rpx;">
          <span class="bs_boxT1">流程</span>
          <span class="bs_boxT1">1. 付定金 - 2. 付尾款 - 3. 收货</span>
        </div>
      </div>
    </div>

    <!-- leyou_vip_info -->
     <!-- 是否开通VIP卡 -->
    <div class="alike card" style="margin-bottom:2rpx;" v-if="goodsDynamicData.leyou_vip_info">
      <img class='cardlab' style="width:125rpx;height:32rpx" src="/static/goodsdetail/lecard_label_super.png">
      <span class="cardawa" style="width:590rpx;">{{goodsDynamicData.leyou_vip_info}}</span>
      <img class='VIPIMG' src="/static/goodsdetail/lecard_arrow_right.png">
    </div>

    <!-- 是否开通乐享卡 -->
    <div class="alike card" style="margin-bottom:20rpx;" v-if="goodsDynamicData.le_vip_message">
      <img class='cardlab' style="width:125rpx;height:32rpx" src="/static/goodsdetail/lecard_label_super.png">
      <span class="cardawa">{{goodsDynamicData.le_vip_message}}</span>
      <img class='openCard' v-if='goodsDynamicData.is_open_le_vip==0' src="/static/goodsdetail/lecard_icon_buy.png" @click="gotoH5Vip">
    </div>


    <!-- 优惠卷 -->
    <div class="alike coupon" v-if="goodsDynamicData.can_receive_coupon_list">
        <span class="span">领劵</span>
        <div class="content" style="width:582rpx;" @click="ownCoupon">
              <!--<image class="coupon_conImg"   src='/static/goodsdetail/product_label_coupon.png'>-->
              <!--</image>-->
            <span class="coupon_span" v-for="(item,index) in goodsDynamicData.can_receive_coupon" :key="index">
                <img class="coupon_left" src='/static/goodsdetail/product_label_couponleft.png' alt="">
                <img class="coupon_right" src='/static/goodsdetail/product_label_couponright.png' alt="">
                <text >{{item.condition_tag}}</text>
            </span>
        </div>
        <img class="pointimg" @click="ownCoupon" style="margin-right:20rpx;" src="/static/goodsdetail/product_icon_more.png">
    </div>

    <!-- 促销 -->
    <div class="sales" @click="goodsSales" v-if="goodsDynamicData.promotion_list">
      <span class="span">促销</span>
      <div class="contentbox">
        <div class="content" v-for="(item,index) in goodsDynamicData.promotion_list" :key='index'>
          <div class="content_r">{{item.title}}</div>
          <span class="content_l" style="width:440rpx">{{item.content}}</span>
        </div>
      </div>
      <img class="pointimg salesImg" style="margin-top:10rpx;margin-right: 20rpx;" src="/static/goodsdetail/product_icon_more.png">
    </div>
    <!-- 库存 -->
    <div class="alike stock" v-if="havespec && false">
      <span class="span">库存</span>
      <div class="alike stockBox">
        <span class="span">{{stockgoodsObj.shop_name}}</span>
        <span style="color:#ff5000;font-size:26rpx;margin-left:12rpx;">{{stockgoodsObj.shop_stock_desc}}</span>
      </div>
      <span class="span" style="color:#333">查看更多门店</span>
      <img  style="width:12rpx;height:22rpx;margin-top:6rpx;margin-left:20rpx;" src="/static/goodsdetail/lecard_arrow_right.png">
    </div>

    <!-- 请选择颜色 -->
    <div class="sales"  v-if="havespec" style="margin-top:20rpx;border-bottom:1rpx solid #f3f5f7;" >
      <template v-if="!goodsspecData">
          <div class="content" @click="goodsSize()" style="color:#333;width:100%;">
            <span class="content_l span" style="color:#333;width:100%;">{{SelectText}}</span>
          </div>
      </template>
      <template v-else>
          <span class="span" style="width:70rpx;">已选</span>
          <div class="content span" style=" display: flex; flex-direction: column;width:100%; margin-right:4rpx;">
              <div  @click="goodsSize()"  style="display: flex; align-items: center; width:100%; justify-content: space-between;">
                  <div style="display: flex; align-items: center;">
                      <span class="content_l" style="color:#333">{{goodsspecData.goodsspecbuff}}/</span>
                      <span class="content_l" style="color:#333">{{goodsspecData.goodsspecsize}}</span>
                      <!-- <span class="content_l" style="color:#FF5500;margin-left:10rpx;">{{shoparrdess.express_stock_desc}}</span> -->
                  </div>
              </div>
          </div>
      </template>
    </div>

    <!-- 送货地址 -->
    <div class="address">
      <div class="alike place">
        <span class="span">送至</span>
        <div class="content">
          <!-- <template v-if="!tokenID">
            <div class="span color addressD"  @click="selectaddress">设置配送地址可查看商品闪送服务</div>
          </template>
          <template v-else>
            <div class="span color addressD" v-if="addressShow" @click="selectaddress">{{addressInfoData.address || addressInfoData.add_detail }}</div>
            <div class="span color addressD" v-else  @click="selectaddress">请选择地址</div>
          </template> -->
          <!-- @click="speedgive" -->
          <template  v-if="!tokenID">
                <div class="span color addressD">设置配送地址可查看商品闪送服务</div>
          </template>
          <template  v-else>
                <div class="span color addressD">{{addressInfoData.address || addressInfoData.add_detail }}</div>
          </template>
            <div class="alike addresseBOX"  @click="speedgive">
                <!-- <img class="addressexpressimg" src="/static/goodsdetail/product_icon_show01.png">
                <span class="span addressText" style="color:#ff5000">快递</span> -->
                <template v-if="addressfreight.lightning_support==1">
                    <img class="addressexpressimg" v-if="addressfreight.lightning_support==1"  src="/static/goodsdetail/product_icon_show01.png">
                    <span style="color:#ff5000" class="span addressText">乐闪送</span>
                    <span style="margin-left:0rpx;" class="span widthaddsong" v-if="addressfreight.lightning_desc">({{addressfreight.lightning_desc}})</span>
                </template>
                <!-- <template v-else>
                <img class="addressexpressimg" src="/static/goodsdetail/product_icon_show03.png">
                <span class="span addressText">乐闪送</span>
                </template> -->
                <!-- <template v-else> -->
                <img class="addressexpressimg" src="/static/goodsdetail/product_icon_show04.png">
                <span class="span addressText">乐闪送规则</span>
                <!-- </template> -->
          </div>


        </div>
        <!-- <img class="addresspointimg" src="/static/goodsdetail/product_icon_more.png" @click="selectaddress"> -->
      </div>
      <!-- 点击运费  @click="onfreight"-->
      <div class="alike addressmoney">
        <span class="span">运费</span>
        <span class="span color">{{addressfreight.freight_desc}}</span>
        <!-- <img class="pointimg" src="/static/goodsdetail/product_icon_more.png"> -->
      </div>
    </div>


    <!-- 商品评论 -->
    <div class="goodscomment">
      <div class="alike header">
        <span :class="['span',{'color000':goodsDynamicData.review_count=='0'}]" style="font-size: 30rpx;">商品评论{{goodsDynamicData.review_count?'('+goodsDynamicData.review_count+')':''}}</span>
        <img class="img" src="/static/goodsdetail/lecard_arrow_right.png" @click="LookMore">
      </div>
      <div class="content">
        <!-- 评论 -->
        <div class="goods_comment_lists" v-for="(item,index) in goodsDynamicData.review_list" :key='index'>
          <div class="alike userbox">
            <img class="img" :src="item.header_imge_url || '/static/goodsdetail/default_pic_user.png'">
            <div class="goodsuser">
              <span class="span" style="vertical-align: top;">{{item.member_name}}</span>
              <img src='/static/goodsdetail/product_comment_vip_v.png' class="vipimg" v-if="item.user_tags==1">
              <img src='/static/goodsdetail/product_comment_vip_le.png'  class="vipimg" v-if="item.user_tags==2">
              <div class="star">
                <block v-for="(item,ind) in 5-item.score" :key="ind">
                  <image class="starimg" src='/static/goodsdetail/fullstar.png'></image>
                </block>
                <block v-for="(item,ind) in item.score" :key="ind">
                  <image class="starimg" src='/static/goodsdetail/emptystar.png'></image>
                </block>
              </div>
            </div>
            <!-- <span class="span" style="vertical-align: top;">{{item.review_date_time}}</span> -->
          </div>
          <div class="span discuss">{{item.review_desc}}</div>
          <div class="span" v-if="item.color" style="margin-bottom:28rpx;">颜色:{{item.color}}/尺码:{{item.size}}</div>
          <div class="commentImg" v-if="item.imgs">
            <img class="cimg" :src="items" v-for="(items,indexs) in item.imgs" @click.stop="previewImage(item.imgs, indexs)"  :key='indexs'>
          </div>
        </div>
        <!-- End -->
      </div>
      <div class="span more" @click="LookMore">{{goodsDynamicData.review_count=='0'?'暂无评价':'查看全部评价'}}</div>
    </div>

    <!-- 提示 -->
    <!-- <div class="product_detail_top">继续拖动，查看图文详情</div> -->
    <!-- <product-content :content="content"></product-content> -->
    <div style="padding-bottom: 100rpx">
      <shop-sliding></shop-sliding>
    </div>

    <!-- 加入购物车成功，立即结算 -->
    <div class="addcartSuccess" v-if="addcartSuccess&&false">
        <span>成功加入购物车</span>
        <span class="addcart_text"  @click="cartCount">立即结算></span>
    </div>
    <!-- 普通商品购物车 -->

    <div :class="[ 'product_cart_fixed' ,{'phonestyleShow':phonestyleShow}]">
      <div class="productBox">
        <!-- <div class="product_cart_button">
          <span class="product_cart_icon" >
            <img src="/static/goodsdetail/tabbar_brand.png" class="product_cart_icon_img">
          </span>
          <span class="product_cart_txt">品牌馆</span>
        </div> -->
        <!-- <div class="product_cart_button">
          <span class="product_cart_icon">
            <img src="/static/goodsdetail/tabbar_service.png" class="product_cart_icon_img">
          </span>
          <span class="product_cart_txt">客服</span>
        </div> -->
        <div class="product_cart_service produce_positions">
          <span class="product_cart_icon"  @click="cartCount">
            <img src="/static/goodsdetail/tabbar_shop.png" class="product_cart_icon_img">
          </span>
          <span class="product_cart_txt">购物车</span>
          <div v-if="cartNum" class="product_cartNum">{{cartNum>99?'99+':cartNum}}</div>
        </div>
        <div class="product_cart_add" @click="ADDgoodsCart">加入购物车</div>
      </div>
    </div>


    <!-- Modal促销 模态框 -->
    <div class="drawer_screen" v-if="ModalShow" @click='closeModal'></div>
    <div class="goodsSalesMoadl" v-if="ModalShow">
      <goodsmodal :goodsModalData='goodsModalData' @Addcartshansong='Addcartshansong' :twogoodsSize='twogoodsSize' :onegoodsSizeImage='onegoodsSizeImage' @headCallBack="headCallresAdd" @closeModall='closeModal' @specCallBack="specCallBackselect"></goodsmodal>
    </div>
    <!-- MOdal-模态框 -->


    <!-- 购物车模态框 -->

    <div v-if="ModuleClass" :class="['cartModule',{'slideModule':ModuleClass}]">
        <cart-modaldata  :shop_id='cartShopId' @removerCartNum='funcCartNum'  :cart_id='shansongcart_id'  @closeModel='closeModalcart' catchtouchmove="ture"></cart-modaldata>
    </div>

  </div>
</template>
<script>
import shopSliding from "@/components/product/details/shopTopSliding"
import timedown from "@/components/public/countdown"
import productContent from "@/components/product/details"
import goodsmodal from "@/components/product/goodsmodal/goodsmodal"
import orderGoods from "@/components/product/ordergoods"
import cartModaldata from '@/components/cartModal/index'
import { compare,countDown, priceFormat,formatTime } from "@/utils/index"
import {mapState, mapMutations} from "vuex"
import {
  getDoodsData,
  getDoodsDataDynamic,
  getDoodsImgTxtData,
  getDoodsIdenticalData,
  gainAddressList,
  addCollectData,
  deteleCollectData,
  getrecomment,
  getshanaddCart,
  getshopcartNum,
  getMeetProductSize,
  mermtgeShoppingCart
} from "@/api";
var app =  getApp();

export default {
  data() {
    return {
      mp_sa_dict:{},
      commentBox:false,    //最外层合作
      shansongcart_id:'',
      phonestyleShow:false,  //处理iPhonex
      cartShopId:'',      //购物车店铺id
      ModuleClass: false, //显示购物车模态框
      recruit_saleNum:[], //新客专享
      options:{},       //传过来的值
      cartNum:0,     //购物车数量
      // addressShow:false, //是否显示地址
      stockgoodsObj:{},  //库存对象
      SelectText:'',    //选址的尺寸与颜色
      cart_id:'',
      tokenID:null,
      addcartSuccess:false, //加入购物车成功
      havespec:false,     //默认有无规格
      goodsspecData:null, //已选的商品规格
      priceskill:[],  //秒杀价格
      immm:'https://leyoutest1.oss-cn-beijing.aliyuncs.com/2018/08/30/1535621579443095.JPG',
      recgoodsList:[],//相关商品推荐
      recgoodsList1:[],
      recamongList:[],//排行商品推荐
      recamongList1:[],
      showRec:true,
      recIdx: 0, //初始默认的
      recommendlist: [],
      addressgive:{},  //地址
      addressING: 0, //默认选择地址的
      ModalShow: false, //模态框初始
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
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      content: {},
      couponList: [], //优惠卷
      address_list: [], //获取用户的送货地址
      priceNum: [], //金额大小含小数点
      abc: [],
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
        barndinfo:null       //品牌内容
      },
       shoparrdess:{},        //门店位置
      goodsDynamicData: {
        //动态商品列表
        promotion_list: [], //促销
        review_count: null, //评论人数
        le_vip_message: null, //最高返现
      },
        product:{
            item_code:'123',
            title:'',
            desc:'',
            category_list:'',
            image_list:'',
            src_mini_program_path:'',
        }
    };
  },
  components: {
    timedown,
    productContent,
    goodsmodal,
    orderGoods,
    shopSliding,
    cartModaldata
  },
  computed:mapState(['fromTag','fromSubTag']),
  onLoad(options) {
    // this.palyvide = false;
    this.mp_sa_dict = {};
    this.staff_id = '';
    this.funcGetFromModule();
    wx.showLoading({title: '正在加载中', mask: true});
    this.commentBox = false;
    this.cartShopId = wx.getStorageSync('shan_shop_id')
    this.goodsData = {};
    this.goodsDynamicData ={};
    this.abc=[];
    this.tokenID = wx.getStorageSync('token');
    // let locationInfo =  wx.getStorageSync("locationInfo");
    // let locationInfoGoods = wx.getStorageSync
    this.options = options;
    let phoneMobile = wx.getStorageSync('phoneMobile');
    if(phoneMobile.model.indexOf('X')>-1 || phoneMobile.model.indexOf('unknown<iPhone11,8>')>-1 ){
        this.phonestyleShow = true;
    }
    // let shop_id = wx.getStorageSync('shan_shop_id');
    //   "latitude" :  locationInfo.latitude,
    //   "longitude" : locationInfo.longitude,
    let dynamicParams = {  //动态数据
      "lightning_shop_id" : wx.getStorageSync('shan_shop_id'),
      "sku" : options.sku
    }
    this.Goodsinfo(dynamicParams);
    this.GoodsDynamicinfo(dynamicParams); //动态信息
    this.funcCartNum(); //购物车数量
    this.sa_page(this,false,'闪送商品详情页',this.staff_id);

  },

  onShow(){
    // console.log('22222222222222222')
    let token = wx.getStorageSync("token");
      if(token){ //用户登录合并购物车
        if(wx.getStorageSync('shansongcart_id')) { //合并购物车
          mermtgeShoppingCart({cart_id:wx.getStorageSync('shansongcart_id'),cart_type:2}).then(res=>{
            wx.removeStorageSync('shansongcart_id')
          })
        }
      }
  },

  methods: {

    funcGetFromModule() {
      let fromModule = '';
      let pages = getCurrentPages();
      let prePage = pages[pages.length - 2].route;
      if (prePage == 'pages/search/index/main') {
        if (this.fromSubTag == '') {
          fromModule = '搜索';
        } else {
          fromModule = '分类';
        }
      } else if (prePage == 'pages/transferH5/main') {
        fromModule = '活动页';
        this.$store.commit('fromTagMutations','活动页');
        this.$store.commit('fromSubTagMutations','');
      } else {
        this.$store.commit('fromTagMutations','');
        this.$store.commit('fromSubTagMutations','');
      }
      
      this.mp_sa_dict = {
        fromModule:fromModule,
        fromTag:this.fromTag,
        fromSubTag:this.fromSubTag
      };
      console.log(prePage,'页面栈内容', this.mp_sa_dict);
    },
    /**
     * 1,获取商品信息  Goodsinfo  (必传sku)
     * 2,获取商品扩展信息 GoodsDynamicinfo (必传sku)
     * 3,获取商品图文信息 getDoodsImgTxtData (必传sku)
     * 4,获取商品同类信息 getDoodsIdenticalData (必传sku)
     * 5,获取用户地址信息 gainAddressList   ()
     * 6,商品加入收藏     addCollectData
     * 7,相关推荐        getrecomment
     */
    Goodsinfo(params) {
      getDoodsData(params).then(msg => {
        let res = msg.body;
        if(res.vip_price){ //处理下vip价格
          res.vip_price = returnFloat(res.vip_price)
        }
        res.marketPrice = parseInt(res.list_price) > parseInt(res.sale_price) ? true : false; //是否显示原价
        this.priceNum = priceFormat(parseInt(res.sale_price)); //商品价格
        // if(res.image_colors[])
        if(res.image_colors[0].images){
            this.abc = res.image_colors[0].images; //获取轮播图
        }
        if(res.product_skill){ //处理秒杀预告
          this.priceskill = priceFormat(parseInt(res.product_skill.skill_price));
          if(res.product_skill.skill_status==1){//已经开始
            res.endtime = res.product_skill.end_time;//结束时间

          }else{
             res.startdata  = formatTime(res.product_skill.start_time)
             res.startime = res.product_skill.start_time;
          }
          res.skill_status = res.product_skill.skill_status;
        }
        // if(res.good_review_list){ //滚轮评论
        //     res.good_review_list.map(r=>{ //处理照片
        //     debugger
        //         r.header_imge_url = r.header_imge_url.indexOf('gif')>-1?false:'/static/goodsdetail/default_pic_user.png'
        //     })
        // }
        /**
         * 显示库存，或者 规格
         * 1,image_colors  数组大于2,显示 尺寸与颜色，数组等于1有sku_size_vos  显示 尺寸 ，没有sku_size_vos  显示库存
         */
        // console.log(res.image_colors[0].sku_size_vos,'我是有无规格');
        console.log(res,'ddd')
        // debugger
        if(!res.image_colors[0].sku_size_vos){ //无规格,直接显示库存
          this.havespec = false;
        }else if(res.image_colors.length>=2){
          this.havespec = true;
          this.SelectText = '请选择尺码、颜色'
          this.goodsspectList(res.sku,res.prod_id);
        }else if(res.image_colors[0].sku_size_vos.length>0){
           this.havespec = true;
           this.SelectText = '请选择尺码'
           this.goodsspectList(res.sku,res.prod_id);
        }
          this.product = {
              item_code:res.sku,
              title:res.mfct_name,  //名字
              desc:res.marketing_title,   //商品描述
              image_list: res.image_colors[0].images, //图片
              category_list:'', //类目列表
              src_mini_program_path:`/pages/leDelivery/Deliverydetailed/main?sku=${res.sku}`
          }
        //如果选择模态框的规格是开着的
        // if(this.goodsSize){
        //   let img = res.image_colors[0].main_image;
        //   let onegoodsSizeImage = {
        //     product_stock_Img:img
        //   }
        //   debugger
        //   this.onegoodsSizeImage=onegoodsSizeImage;
        // }
        this.commentBox = true;
        this.spill =  res.product_skill
        this.goodsData = res;

        let sa_dict = {
          pageType:'普通商品详情页',
          commodityID:res.sku,
          commodityName:res.marketing_title,
          commodityBrand:res.mfct_name,
          secondCommodityID:res.product_ctgy_info.category_prod_value_v2,
          secondCommodityName:res.product_ctgy_info.category_prod_name_v2,
          forthCommodityID:res.product_ctgy_info.category_prod_value_v4,
          forthCommodityName:res.product_ctgy_info.category_prod_name_v4,
          sixthCommodityID:res.product_ctgy_info.category_prod_value_v6,
          sixthCommodityName:res.product_ctgy_info.category_prod_name_v6,
          purchaseNum:res.selling_quantity,
          preferentialPrice:res.sale_price,
          originalPrice:res.list_price,
          commodityType:'乐商城'
        }
        // let temp_source = this.options.source;
        sa_dict.mp_source = this.options.source;
        sa_dict.staff_id = this.options.staff_id;
        let mp_group_id = wx.getStorageSync('mp_group_id');
        if (mp_group_id && mp_group_id != '') {
          sa_dict.mp_group_id = mp_group_id;
        }
        Object.assign(this.mp_sa_dict,sa_dict);
        app.sensors.track('mp_productDetailPage', this.mp_sa_dict);
        this.$store.commit('fromTagMutations','');
        this.$store.commit('fromSubTagMutations','');
        console.log(this.fromTag, this.fromSubTag,this.mp_sa_dict);
      });
    },
    goodsspectList(sku,productid){ //商品规格的数据
        let params = {
          sku: sku,
          product_id: productid,
          shop_id: wx.getStorageSync("shan_shop_id")
        };
         // 1.获取商品规格信息
         getMeetProductSize(params).then(res=>{
            console.log(res,'为什么没有走没有走');
            let sizeObj = res.meet_product; //规格数组
            // let sizeObj = res;  //规格数组
            let goodsSpec = this.goodsData.image_colors; //初始数据
            console.log(this.goodsData.image_colors);
            if(goodsSpec.length>0){
                goodsSpec.map(r=>{ //每一个商品颜色的规格
                    r.sku_size_vos.map(j=>{
                        for(let key in sizeObj){
                            if(j.sku== key ){
                                j.stock = sizeObj[key].stock;
                                j.sale_price = sizeObj[key].sale_price;
                            }
                        }
                    })
                })
                this.goodsSpecList = goodsSpec;
            }
        })
    },
    GoodsDynamicinfo(params) {
      getDoodsDataDynamic(params).then(res => {
        if(res.recruit_sale){
          this.recruit_saleNum = priceFormat(res.recruit_sale) //新客户专享
        }
        res.review_list.map(r => {
            // if(){
                // debugger
                r.header_imge_url = r.header_imge_url.indexOf('gif')>-1?false:'/static/goodsdetail/default_pic_user.png'
            // }
          //截取时间
          r.review_date_time = r.review_date_time.slice(0, 10);
          r.score = parseInt(r.score) == 1?0:2
        });
        if(res.can_receive_coupon_list){ //优惠卷处理
            res.can_receive_coupon = res.can_receive_coupon_list.slice(0,3);
        }
        this.goodsDynamicData = res;
        if(res.product_stock){
          this.stockgoodsObj = res.product_stock
        }
         //如果选择模态框的规格是开着的
        if(this.goodsSize && res.product_stock){
          let twogoodsSize = {
            // product_stock_name : res.product_stock.shop_name,
            product_stock_dest :res.product_stock.shop_stock_desc,
            express_stock_desc:res.product_stock.express_stock_desc
          }
          this.twogoodsSize = twogoodsSize;
        }
        //获取店铺地址
        this.shoparrdess = res.product_stock;
        //  获取地址（送至）(不能多个对象链式)
        this.addressInfoData = this.goodsDynamicData.support_distr_address;
        // this.addressShow = this.goodsDynamicData.support_distr_address.address?true:false;
        this.addressfreight = this.goodsDynamicData.support_distr_address.support_address;
        wx.hideLoading();
      });
    },
    UserAddressinfo() { //获取地址
      gainAddressList().then(res => {
        // console.log(res,'ddddddddd')
        this.address_list = res.address_list;
      });
    },
    goodsrecomment(params){ //获取排行榜
       this.recgoodsList = [];
       this.recgoodsList1 =[];
       this.recommendlist =[];
       getrecomment(params).then(res=>{
        if(res.recommends.length>0 && res.recommends[0].recommend_list.length>0){
              this.recIdx =0;
              this.showRec=true;
              this.recgoodsList = res.recommends[0].recommend_list.slice(0,6)
              this.recgoodsList1 = res.recommends[0].recommend_list.slice(6,12)
              this.recommendlist = res.recommends;
        }
       })
    },
    funDoodsImgTxt(params){
        getDoodsImgTxtData(params).then(res=>{
        //   console.log(res,'我是图文信息')
        })
    },
    previewImage(imgs=[], curIdx=0){ //图片预览
      wx.previewImage({current: imgs[curIdx], urls: imgs})
    },
    gotoH5Vip(){
      let url = wx.getStorageSync('appInfo').le_vip_info_url + '?token='+ wx.getStorageSync('token');
      wx.setStorageSync('urlH5', url);
      wx.navigateTo({url:'/pages/transferH5/main'})
    },
    gotobrand(){
      let url = this.goodsData.brand_info.brand_link+'?token='+ wx.getStorageSync('token');
      wx.setStorageSync('urlH5', url);
      wx.navigateTo({url:'/pages/transferH5/main'})
    },
    funcCartNum(){ //获取购物车的数量
      let token = wx.getStorageSync('token');
      let shansongCart_id =  wx.getStorageSync('shansongcart_id')
      let params ={};
      if(token){
         //获取购物车数量
         params = {
          shop_id: this.options.shopid,
          cart_type: 2,
          is_check: 2
        };
        getshopcartNum(params).then(res=>{
            // console.log(res,'购物车数量');
            this.cartNum = res.num;
        })
      }else if(shansongCart_id){
         params = {
            shop_id: this.options.shopid,
            cart_type: 2,
            is_check: 2,
            cart_id:wx.getStorageSync('shansongcart_id')?wx.getStorageSync('shansongcart_id'):undefined
        };
        getshopcartNum(params).then(res=>{
            // console.log(res,'购物车数量');
            this.cartNum = res.num;
        })
      }

    },

    /** 商品方法
     * 1,商品促销 goodsSales
     * 2,,闪送规则  speedgive
     * 3,选择商品规格 goodsSize
     * 4,选择地址 selectaddress
     * 5,选择优惠卷 ownCoupon
     */
    goodsSales() {
      //商品促销
      let goodsModalData = {
        salesList: this.goodsDynamicData.promotion_list,
        ifsales: true,
        promtionshansong:'shansong'
      };
      this.goodsModalData = goodsModalData;
      this.ModalShow = true;
    },
    speedgive() {
      //闪送规则
      let goodsModalData = {
        ifspeedsong: true,
        speedData: this.addressfreight.introduction
      };
      this.goodsModalData = goodsModalData;
      this.ModalShow = true;
    },
    goodsSize() {  //选择商品规格 商品价格，活动价，原价，图片，规格数据

        if(this.goodsSpecList==null){return}
        let goodsModalData = {
                buffind: 0,
                sizeind: -1,
                goodsSize: true,
                goodsSizeprice: this.priceNum, //价格
                goodsOriginal: parseInt(this.goodsData.list_price), //原价
                goodsphoto:this.goodsData.image_colors[0].main_image,
                goodsSizeSpec: this.goodsSpecList, //规格,
                shansong:'shansong'
        };
        this.goodsModalData = goodsModalData;
        this.ModalShow = true;
    },
    headCall(msg) {
    //   console.log(msg);
    },
    selectaddress() {  //选择地址
      if(this.tokenID){
        let goodsModalData = {
          addressING: this.addressING,
          ifselectaddress: true
        };
        gainAddressList().then(res => { //获取地址
          this.address_list = res.address_list;
          goodsModalData.address_list = res.address_list
          this.goodsModalData = goodsModalData;
          this.ModalShow = true;
        });
      }else{
        wx.navigateTo({url:'/pages/userCenter/login/wxLogin/main'})
      }

    },
    headCallresAdd(msg) {   //选择,地址后地址的值
    //   console.log(msg,'我是回调')
      this.addressING = msg.addressING;
      this.ModalShow = false;
      this.addressShow = true;
      this.addressInfoData = this.address_list[msg.addressING];
    //   console.log(this.addressInfoData);
    },
    specCallBackselect(msg){ //回调的规格
    //   console.log(msg,'为什么是没什么事说明书没事没事什么的')
      this.goodsspecData= msg;
      this.buffind = msg.buffind;
      this.sizeind = msg.sizeind;
      this.Goodsinfo({ sku: msg.goodssku});
      this.GoodsDynamicinfo({ sku:msg.goodssku});
    },
    ownCoupon() { //优惠卷
      let goodsModalData = {
        ifCoupon: true,
        couponList: this.goodsDynamicData.can_receive_coupon_list,
        integralList: this.goodsDynamicData.points_coupon_list,
        couponshansong:'shansong'
      };
      this.goodsModalData = goodsModalData;
      this.ModalShow = true;
    },
    onfreight(){ //点击地址查看运费情况
      let arr = this.goodsDynamicData.support_distr_address.support_address.freight_list;
      let obj = {};
        arr = arr.reduce(function(item, next) {
        obj[next.freight_name] ? '' : obj[next.freight_name] = true && item.push(next);
        return item;
      }, []);
    //   console.log(arr);
        let goodsModalData ={
          ifonfreight:true,
          addressfreightInfo: arr
        }
        this.goodsModalData = goodsModalData;
        this.ModalShow = true;
    },
    closeModal(msg) {
      let that = this;
      if(msg=='cart'){
        this.addcartSuccess = true;
        setTimeout(function(){
          that.addcartSuccess = false;
        },4000)
      }
      //关闭模态框
      this.ModalShow = false;
    },
    goodsCollect() {  //(完成)商品收藏与移除
      if(!this.tokenID){
        wx.navigateTo({url:'/pages/userCenter/login/wxLogin/main'})
        return false
      }
      let that = this;
      let params = {
        add_marks: [{
            prod_amount: this.goodsData.sale_price, //商品金额
            prod_id: this.goodsData.prod_id //商品id
          }
        ]
      };
      if(this.goodsDynamicData.is_focus){  //移除收藏
        deteleCollectData(params).then(res => {
          this.goodsDynamicData.is_focus = false;
          wx.showToast({ title: "已取消收藏", icon: "none", duration: 1000 });
        });
      }else{  //添加收藏
        addCollectData(params).then(res => {
          this.goodsDynamicData.is_focus = true;
          wx.showToast({ title: '收藏成功~~~请在"我的"-"收藏夹"查看', icon: "none", duration: 1000 });
        });
      }
    },
    ADDgoodsCart(){ //(完成)添加商品到购物车
      let that = this;
      /** 判断是否有规格，与无规格1,单规格，直接，加入，购物车，2，多规格跳转 */
      if(this.havespec){ //有规格
        this.goodsSize();
      }else{ //无规格

      //没有规格直接加入购物车
      let params = {};
      let that = this;
      this.shansongcart_id = wx.getStorageSync('shansongcart_id');
      let token = wx.getStorageSync('token')
      if(token){
        this.shansongcart_id = '';
        wx.removeStorageSync('shansongcart_id');
        params = {
          shop_id:wx.getStorageSync('shan_shop_id'), //门店Id
          quantity: 1, //数量
          cart_type: 2, //0普通商品 1海涛商品
          hander_type: 1, //默认添加
          sku: this.goodsData.sku //商品sku
        };
      }else{
        if(this.shansongcart_id){
           params ={
              shop_id:wx.getStorageSync('shan_shop_id'), //门店Id
              quantity: 1, //数量
              cart_type: 2, //0普通商品 1海涛商品
              hander_type: 1, //默认添加
              sku: this.goodsData.sku, //商品sku
              cart_id: this.shansongcart_id, //购物车id
            }
        }else {
          params={
              shop_id:wx.getStorageSync('shan_shop_id'), //门店Id
              quantity: 1, //数量
              cart_type: 2, //0普通商品 1海涛商品
              hander_type: 1, //默认添加
              sku: this.goodsData.sku //商品sku
          }
        }
      }
      getshanaddCart(params).then(res => {
          if(!token){ //没有登录
            if(!this.shansongcart_id){ //没有存过
              wx.setStorageSync('shansongcart_id', res.cart_id)
            }
          }
        //   console.log(res,'请问我执行了么')
          wx.showToast({title:'加入购物车成功',icon:'none'})
          this.ModalShow= false;
          this.funcCartNum();
          app.sensors.track('mp_addToShoppingcart',this.mp_sa_dict);
          wx.setStorageSync('mp_' + this.mp_sa_dict.commodityID, this.mp_sa_dict);
        });
      }
    },

    Addcartshansong(msg){ //闪送有规格加入购物车
      let params = {};
      let that = this;
      this.shansongcart_id = wx.getStorageSync('shansongcart_id');
      let token = wx.getStorageSync('token')
      if(token){
        this.shansongcart_id = '';
        wx.removeStorageSync('shansongcart_id');
        params = {
          shop_id:wx.getStorageSync('shan_shop_id'), //门店Id
          quantity: msg.quantity, //数量
          cart_type: 2, //0普通商品 1海涛商品
          hander_type: 1, //默认添加
          sku: msg.sku //商品sku
        };
      }else{
        if(this.shansongcart_id){
          params ={
            shop_id:wx.getStorageSync('shan_shop_id'), //门店Id
            quantity: msg.quantity, //数量
            cart_type: 2, //0普通商品 1海涛商品
            hander_type: 1, //默认添加
            sku: msg.sku, //商品sku
            cart_id: this.shansongcart_id, //购物车id
          }
        }else {
          params={
            shop_id:wx.getStorageSync('shan_shop_id'), //门店Id
            quantity: msg.quantity, //数量
            cart_type: 2, //0普通商品 1海涛商品
            hander_type: 1, //默认添加
            sku: msg.sku //商品sku
          }
        }
      }
      getshanaddCart(params).then(res => {
        if(!token){ //没有登录
          if(!this.shansongcart_id){ //没有存过
              wx.setStorageSync('shansongcart_id', res.cart_id)
            }
        }
        wx.showToast({title:'加入购物车成功',icon:'none'})
        this.ModalShow= false;
        this.funcCartNum();
      });
    },
    LookMore() { // 查看更多商品评论传递商品ID prod_id
      wx.navigateTo({
        url:
          "/pages/products/details/goodsComment/main?prod_id=" + this.goodsData.prod_id
      });
    },
    clickTab(i) {
      if(this.recIdx==i)return
      this.recIdx=i
      if(i==0){
        this.recgoodsList = this.recommendlist[i].recommend_list.slice(0,6)
        this.recgoodsList1 = this.recommendlist[i].recommend_list.slice(6,12)
        this.showRec=true
      }
      if(i==1){
        // console.log(this.recommendlist[i].recommend_list,'我是排行榜')
        this.recamongList = this.recommendlist[i].recommend_list.slice(0,6)
        this.recamongList1 = this.recommendlist[i].recommend_list.slice(6,12)
        this.showRec=false
      }
    },
    gotoReco(sku){ //推荐商品跳转
      let url = '/pages/goodsdetailed/main?sku='+sku;
      wx.navigateTo({url:url})
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
    cartCount(){ //成功后加入购物车
    // if(this.cartNum == 0){
    //   return
    // }
      this.shansongcart_id = wx.getStorageSync('shansongcart_id');
      this.ModuleClass = true;
    },
    closeModalcart(msg) {   //关闭购物车模态框
      //  that.ModuleShow = false;
      this.ModuleClass = false;
    },
  },
  onHide:function () {
    console.log("==onHide==");
    this.goodsspecData=null;
  },
  onUnload: function () {
    console.log("==onUnload==");

    this.goodsspecData=null;
    this.ModalShow = false;
  },
  // 小程序分享
  onShareAppMessage(options) {
   this.ModalShow = false;
   let _this = this;
    return{
        title: this.goodsData.marketing_title ,
        imageUrl: this.goodsData.image_colors[0].main_image,
        path: '/pages/goodsdetailed/main?sku='+this.goodsData.sku,
        success: function () {
          app.sensors.track('mp_shareProduct',_this.mp_sa_dict);
        }
    }
  }
};
</script>
<style scoped>

/* 优惠卷 */

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





/* 购物车模态框结算 */
/* 购物车模块 */
.cartModule {
  height: 100%;
  width: 100%;
  position: fixed;
  bottom: 0rpx;
  z-index: 10000;
  border-radius: 20rpx 20rpx 0rpx 0rpx;
  /* background-color:white; */
  /* transition: transform 0.3s ease 0.5s;
  -webkit-transform: translateY(100%);
  transform: translateY(100%); */
}
.slideModule {
  /* transform: translateY(0) !important; */
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

/* 相同的 */
.alike {
  display: flex;
  align-items: center;
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
}
.color {
  color: #333333 !important;
  width: 608rpx;
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
  height: 80rpx;
  width: 80rpx;
  margin-left: 20rpx;
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
  left: 0rpx;
  top: 0rpx;
  height: 50rpx;
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
  border: 2rpx solid #ff5000;
  border-radius: 50rpx;
  color: #ff5000;
  line-height: 60rpx;
  text-align: center;
  margin: 50px auto 0;
}
.goods_comment_lists {
  margin-top: 20px;
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
}
.place {
  align-items: baseline;
  height: 100rpx;
  position: relative;
  overflow: hidden;
  /* height: 72rpx; */
}
.addressD {
  height: 30rpx;
  line-height: 30px;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}
.addresspointimg {
  position: absolute;
  width: 44rpx;
  height: 44rpx;
  top: 15rpx;
  right: 6rpx;
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
  right: 2rpx;
}
.sales .contentbox {
  width: 580rpx;
  margin-left: 20rpx;
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
  width: 470rpx;
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
  /* height: 50rpx; */
  /* margin-top: 10rpx; */
  overflow: hidden;
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
  width: 98rpx;
  height: 30rpx;
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
  line-height: 28rpx;
  height: 56rpx;
  width: 340rpx;
  margin-left: 12rpx;
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
  width: 710rpx;
  margin: 0 auto;
  /* height: 30rpx; */
}
.price_sell {
  margin-top: 30rpx;
  color: #ff5000;
  vertical-align: bottom;
  font-weight: 600;
  font-family: PingFangSC-Regular;
  letter-spacing: 0;
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
  margin-top: 30rpx;
  margin-left: 20rpx;
}
.price_img .img1 {
  width: 68rpx;
  height: 68rpx;
}
.price_img .img2 {
  width: 68rpx;
  height: 68rpx;
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
  width: 76rpx;
  height: 30rpx;
  vertical-align: middle;
  /* margin-top:0rpx; */
  margin-right:5rpx;
}
.leshansongText{
    font-size:30rpx;
    vertical-align:middle;
}

.widthaddsong{
  width:350rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.goodsinfo .content {
  /* margin-top: 28rpx; */
  /* margin-left: 20rpx; */
  margin-left: 8rpx;
  font-weight: 600;
  font-family: PingFangSC-Medium;
  font-size: 30rpx;
  color: #333333;
  letter-spacing: 0;
  line-height: 40rpx;
  width: 650rpx;
}
.goodsinfo .introduce {
  margin-top: 20rpx;
  margin-left: 20rpx;
  font-family: PingFangSC-Regular;
  font-size: 26rpx;
  color: #666666;
  letter-spacing: 0;
  line-height: 32rpx;
  width: 710rpx;
}
.goodsinfo .buyok {
  margin-top: 20rpx;
  margin-left: 20rpx;
  font-family: PingFangSC-Regular;
  font-size: 26rpx;
  color: #999999;
  letter-spacing: 0;
  line-height: 26px;
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
.product_cart_fixed {
  width: 100%;
  background: #fff;
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  border-top: #eeeeee 1px solid;
}
.productBox{
  display: flex;
  height: 100rpx;
  width: 100%;
}
.phonestyleShow{
 height: 120rpx;
}

.product_cart_button,
.product_cart_service {
  width: 165px;
  padding-top: 13px;
}
.product_cart_button {
  border-right: #eeeeee 1px solid;
}
.product_cart_add {
  flex: 1;
  background: #ff5000;
  color: #fff;
  text-align: center;
  font-size: 30px;
  line-height: 98px;
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

