<template>
  <div class="goodsdetailed" v-if='commentBox'>
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
    <div class="goodsmold" v-if="goodsData.product_skill && !is_presell_pro">
      <image class="goodsmold_img" :src="goodsData.skill_status!=1?'/static/goodsdetail/product_price_bg01.png':'/static/goodsdetail/product_price_bg02.png'">
        <div class="goodsmold_img_box">
          <text class="sign">￥</text>
          <text class="goodsmold_price">{{priceskill[0]}}</text>
          <text class="goodsmold_float">{{priceskill[1]}}</text>
        </div>
        <!-- 秒杀未开始 -->
        <div class="goodsmold_over" v-if="goodsData.skill_status!=1" style='width:255rpx;'>
          <!--  class="goodsmold_overtime" -->
          <timedown :endTime = 'goodsData.startime' :currTime="now_time" :skillNum = '0' ></timedown>
          <div class="goodsmold_buy">{{goodsData.startdata}}开抢</div>
        </div>
        <!-- 秒杀开始 -->
        <div class="goodsmold_over" v-else style='width:255rpx;'>
          <timedown :endTime = 'goodsData.endtime' :currTime="now_time" :skillNum = '1' ></timedown>
          <div class="goodsmold_buy" style="color:#ff5000">已抢{{goodsData.selling_quantity}}件</div>
        </div>
      </image>
    </div>
    <!-- 3，定金开始，定金结束  4尾款  v-if="false" -->
    <div class="preselll_status_bg" v-if="is_presell_pro">
      <div class="presell_status_left_bg " :class="{presell_status_left_red_bg:presell_time_start}">
        <text class="gsbargain_test">{{goodsData.presell.status == '0' || goodsData.presell.status == '1'?'定金':'尾款'}}</text>
        <text class="gssign">¥</text>
        <text class="gsprice">{{goodsData.presell.downpayment}}</text>
        <div class="gsbargainprice" style="font-family:PingFangSC-Regular;" :class="{'gsbargainprice_red':presell_time_start}">{{goodsData.presell.deduction}}</div>
      </div>
      <div class='presell_status_right_bg' :class="{presell_status_right_red_bg:presell_time_start}">
        
          <span v-if="goodsData.presell.status == '0'">距预售开始:</span>
          <span v-else-if="goodsData.presell.status == '1'">距预售结束:</span>
          <span v-else-if="goodsData.presell.status == '2'">距支付尾款开始:</span>
          <span v-else-if="goodsData.presell.status == '3'">距支付尾款结束:</span>
          <span v-else>支付尾款结束:</span>
        <div class="presell_count_time">
          <span v-if="d>0">{{d}}天</span>
          <span class="time_style" :class="{time_style_red:presell_time_start}">{{h}}</span>
          <span class="time_style_margin">:</span>
          <span class="time_style" :class="{time_style_red:presell_time_start}">{{m}}</span>
          <span class="time_style_margin">:</span>
          <!-- <span class="time_style" style="width:48rpx" :class="{time_style_red:presell_time_start}">{{s}}</span> -->
          <span class="time_style" style="width:48rpx" :class="{time_style_red:presell_time_start}">{{s + '.' + ss}}</span>
        </div>
        
      </div>
    </div>

    <!-- 商品介绍 -->
    <div class="goodsinfo">
        <div class="price" v-if="!is_presell_pro">
            <div :class="goodsDynamicData.share_flag?'hasshare_flag':'nohasshare_flag'" style="display:flex;align-items:flex-end">
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

                <template v-else>
                    <div class="price_sell" style="display:flex;margin-top: 28rpx;">
                        <div class="content" style="width:520rpx;margin-right:0rpx;">
                            <img class="leshansong" v-if="addressfreight.lightning_support==1"
                                src="/static/images/search/search_sign_speed.png">
                            <text class='leshansongText'>{{goodsData.marketing_title}}</text>
                        </div>
                    </div>
                </template>
            </div>
            <div class="price_img">
                <img class='img1' @click.stop="goodsCollect"
                    :src="goodsDynamicData.is_focus?'/static/goodsdetail/product_icon_attent_on.png':'/static/goodsdetail/product_icon_attent_off.png'">
            </div>
            <div class="price_img" >
                <img class='img2' v-if="!goodsDynamicData.share_flag" @click="sharePhoto" src="/static/goodsdetail/tabbar_icon_share.png">
                <img v-if="goodsDynamicData.share_flag" class='img3' @click="showShare" src="/static/images/share_product_share@3x.gif" alt="">
                <div v-if="goodsDynamicData.share_flag" class="yongj" @click="showShare">佣金{{goodsDynamicData.product_share_vo.commission_rate}}%</div>
            </div>
        </div>


    <!-- 全球购 -->
    <div class="globeBox" v-if="goodsData.is_ht">
        <div class="globebuy">
            <!-- <img class="globebuy_titimg" src="/static/goodsdetail/lecard_arrow_right.png"> -->
            <span style="margin-right:12rpx;">{{goodsData.nation}}品牌</span>
            <div v-if="goodsData.tax_rate == '0.00'">
              <span>[包税]售价已含税费</span>
            </div>
            <div v-else>
              <span style="margin-right:24rpx;">税率 {{goodsData.tax_rate}}%</span>
            <span>关税 ￥{{goodsData.tariff}}</span>
            </div>
            
        </div>
        <img class="globeIMG" src="/static/goodsdetail/product_overseas.png">
    </div>

    <!-- 专属价格  -->
    <div class="vipprice" v-if="goodsData.vip_price">
        <span class="span vip_span">专享价:</span>
        <span class="span vip_span">¥{{goodsData.vip_price}}</span>
        <img class="vip_img" src="/static/goodsdetail/product_sign_vip.png">
    </div>
    <!-- 商品简介 -->
    <div style="display:flex;padding-top: 28rpx;margin-left: 20rpx;margin-right: 20rpx;justify-content: space-between;align-items:center" v-if="goodsData.skill_status!=1">
        <div class="content pre_sell_title" style='width:500rpx'>
            <img class="leshansong" v-if="addressfreight.lightning_support==1"
                src="/static/images/search/search_sign_speed.png">
            <span class='leshansongText'>{{goodsData.marketing_title}}</span>
        </div>
        <div style="display: flex;" v-if="is_presell_pro">
          <div class="price_img" style="margin-top:10rpx">
                <img class='img1' @click.stop="goodsCollect"
                    :src="goodsDynamicData.is_focus?'/static/goodsdetail/product_icon_attent_on.png':'/static/goodsdetail/product_icon_attent_off.png'">
            </div>
            <div class="price_img"  style="margin-top:10rpx">
                <img class='img2' v-if="!goodsDynamicData.share_flag" @click="sharePhoto" src="/static/goodsdetail/tabbar_icon_share.png">
                <img v-if="goodsDynamicData.share_flag" class='img3' @click="showShare" src="/static/images/share_product_share@3x.gif" alt="">
                <div v-if="goodsDynamicData.share_flag" class="yongj" @click="showShare">佣金{{goodsDynamicData.product_share_vo.commission_rate}}%</div>
            </div>
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

    <!-- 4, 预售价格 v-if="false" -->
    <div class="bookingsell"  v-if="is_presell_pro">
        <div class="bs_box">
            <span class="bs_boxT1">预售价</span>
            <span class="bs_boxT2" style="font-family: PingFangSC-Medium;">￥</span>
            <span class="bs_boxT3" style="font-family: PingFangSC-Medium;">{{goodsData.presell.presell_price}}</span>
            <span class="bs_boxT4" style="color:#999">(已有{{goodsData.selling_quantity}}人购买)</span>
        </div>
        <div class="bs_box" style="margin-top:20rpx;">
            <span class="bs_boxT1">尾&nbsp;&nbsp;款&nbsp;</span>
            <span class="bs_boxT2" style="font-family: PingFangSC-Medium;">￥</span>
            <span class="bs_boxT3" style="font-family: PingFangSC-Medium;">{{goodsData.presell.balance}}</span>
            <span class="bs_boxT4">({{goodsData.presell.balance_time}})</span>
        </div>
        <div class="bs_box" style="margin-top:24rpx;">
            <span class="bs_boxT1">流&nbsp;&nbsp;程&nbsp; </span>
            <span class="bs_boxT1">1. 付定金 - 2. 付尾款 - 3. 发货</span>
        </div>
    </div>
    </div>




    <!-- leyou_vip_info -->
     <!-- 是否开通VIP卡 -->
    <div class="alike card" style="margin-bottom:2rpx;" v-if="goodsDynamicData.leyou_vip_info" @click="gotoVIP">
      <img class='cardlab' style="width:125rpx;height:32rpx" src="/static/goodsdetail/lecard_label_super.png">
      <span class="cardawa" style="width:590rpx;">{{goodsDynamicData.leyou_vip_info}}</span>
      <img class='VIPIMG'  src="/static/goodsdetail/lecard_arrow_right.png">
    </div>

    <!-- 是否开通乐享卡 -->
    <div class="alike card" style="margin-bottom:20rpx;" v-if="goodsDynamicData.le_vip_message">
      <img class='cardlab' style="width:125rpx;height:32rpx"  src="/static/goodsdetail/lecard_label_super.png">
      <span class="cardawa">{{goodsDynamicData.le_vip_message}}</span>
      <img class='openCard' v-if='goodsDynamicData.is_open_le_vip==0' src="/static/goodsdetail/lecard_icon_buy.png" @click="gotoH5Vip">
    </div>

    <!-- 优惠卷 -->
    <div class="alike coupon" v-if="goodsDynamicData.can_receive_coupon">
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
          <span class="content_l">{{item.content}}</span>
        </div>
      </div>
      <img class="pointimg salesImg" style="margin-top:12rpx;" src="/static/goodsdetail/product_icon_more.png">
    </div>
    <!-- 库存 -->
    <div class="alike stock" v-if="havespec">
      <span class="span">库存</span>
      <div class="alike stockBox">
        <!--<span class="span wxSpan" style="display: flex"><rich-text :nodes="stockgoodsObj.shop_name"></rich-text></span>-->
        <span  style="color:#ff5000;font-size:26rpx;margin-left:12rpx;display: flex"><rich-text :nodes="stockgoodsObj.shop_stock_desc"></rich-text></span>

      </div>
      <span class="span" style="color:#333" @click="lookMoreShop(1)">查看更多门店</span>
      <img  style="width:12rpx;height:22rpx;margin-top:6rpx;margin-left:20rpx;" src="/static/goodsdetail/lecard_arrow_right.png">
    </div>

    <!-- 请选择颜色 -->
    <div class="sales" v-else style="margin-top:20rpx;border-bottom:1rpx solid #f3f5f7;" >
      <template v-if="!goodsspecData">
          <div class="content" @click="goodsSize()" style="color:#333;width:100%;display: flex;align-items: center;justify-content: space-between;">
            <span class="content_l span" style="color:#333;">{{SelectText}}</span>
            <img class="pointimg" style="margin-right:20rpx;" src="/static/goodsdetail/product_icon_more.png">
          </div>
      </template>
      <template v-else>
          <span class="span" style="width:70rpx;">已选</span>
          <div class="content span" style=" display: flex; flex-direction: column;width:100%; margin-right:4rpx;">
              <div  @click="goodsSize()"  style="display: flex; align-items: center; width:100%; justify-content: space-between;">
                  <div style="display: flex; align-items: center;">
                      <span class="content_l" style="color:#333">{{goodsspecData.goodsspecbuff}}/</span>
                      <span class="content_l" style="color:#333">{{goodsspecData.goodsspecsize}}</span>
                      <span class="content_l" style="color:#FF5500;margin-left:10rpx;"><rich-text :nodes="shoparrdess.express_stock_desc"></rich-text></span>
                      <!-- <span class="content_l" style="color:#FF5500;margin-left:10rpx;">{{shoparrdess.express_stock_desc}}</span> -->
                  </div>
                  <div style="display: flex; align-items: center;margin-right:14rpx;">
                    <img class="pointimg" src="/static/goodsdetail/product_icon_more.png">
                  </div>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-right:20rpx" >
                  <div style="display: flex; align-items: center;">
                    <!--<span class="content_l" style="color:#333">{{shoparrdess.shop_name}}</span>-->
                    <!-- shop_stock_desc -->
                      <span class="content_l" style="color:#FF5500;margin-left:10rpx;display: flex"><rich-text :nodes="shoparrdess.shop_name"></rich-text></span>
                  </div>
                  <div>
                    <span class="span" style="color:#333" @click="lookMoreShop(2)" >查看更多门店 ></span>
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
          <template v-if="!tokenID">
            <div class="span color addressD"  @click="selectaddress">设置配送地址可查看商品闪送服务</div>
          </template>

          <template v-else>
            <div class="span color addressD" v-if="addressShow" @click="selectaddress">{{addressInfoData.address || addressInfoData.add_detail }}</div>
            <div class="span color addressD" v-else  @click="selectaddress">请选择地址</div>
          </template>

          <div class="alike addresseBOX"  @click="speedgive">
            <img class="addressexpressimg" src="/static/goodsdetail/product_icon_show01.png">
            <span class="span addressText" style="color:#ff5000">快递</span>
            <template v-if="addressfreight.lightning_support==1">
              <img class="addressexpressimg" v-if="addressfreight.lightning_support==1"  src="/static/goodsdetail/product_icon_show01.png">
              <span style="color:#ff5000" class="span addressText">乐闪送</span>
              <span style="margin-left:0rpx;" class="span widthaddsong" v-if="addressfreight.lightning_desc">({{addressfreight.lightning_desc}})</span>
            </template>
            <template v-else>
              <img class="addressexpressimg" src="/static/goodsdetail/product_icon_show03.png">
              <span class="span addressText">乐闪送</span>
            </template>
            <!-- <template v-else> -->
              <img class="addressexpressimg" src="/static/goodsdetail/product_icon_show04.png">
              <span class="span addressText">乐闪送规则</span>
            <!-- </template> -->
          </div>

        </div>
        <img class="addresspointimg" src="/static/goodsdetail/product_icon_more.png" @click="selectaddress">
      </div>
      <!-- 点击运费 -->
      <div class="alike addressmoney" @click="onfreight">
            <span class="span">运费</span>
            <span class="span color" style="width:594rpx">{{addressfreight.freight_desc}}</span>
            <img class="pointimg" src="/static/goodsdetail/product_icon_more.png">
      </div>
    </div>

    <!-- 中间广告 -->
    <div class="alike advertisement" v-if="goodsData.product_labels">
      <img class="pointimg" src="/static/goodsdetail/product_icon_show01.png">
      <text>供应商发货</text>
      <img class="pointimg" src="/static/goodsdetail/product_icon_show01.png">
      <text>正品保证</text>
      <!-- <img class="pointimg" src="/static/goodsdetail/product_icon_show02.png">
      <text style="margin-right:0rpx;">特价商品不支持退换货</text> -->
    </div>
    <!-- 店长推荐 -->
    <div class="alike groom" v-if="false">
      <div class="groomName">
        <img src="../../../static/images/navbar_search.png">
        <text>张小四</text>
      </div>
      <div class="gromminfo">
        <div class="gormminfo_text ellipsis">100%纯棉材质，超过两行显示...，做工精细呵护宝宝…</div>
        <!-- <div class="gormminf0_tit"> -->
        <text>张小四四</text><text>张小四四</text><text>张四小四</text>
        <!-- </div> -->
      </div>
      <div class="grommpeople">
        <text class="grommpeole_num">50</text>
        <text class="grommpeole_num2">位</text>
        <div class="grommpeole_rec">
          <text>顾问推荐</text>
          <img
            src="/static/images/order_manage_edit_dis.png"
            alt=""
          >
        </div>
      </div>
    </div>
    <!-- 商品评论 -->
    <div class="goodscomment">
      <div class="alike header">
        <span :class="['span',{'color000':goodsDynamicData.review_count=='0'}]" style="font-size: 30rpx;">商品评论{{goodsDynamicData.review_count?'('+goodsDynamicData.review_count+')':''}}</span>
        <div class="alike" @click="LookMore">
          <img class="img" src="/static/goodsdetail/lecard_arrow_right.png" >
        </div>
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

    <!-- 商品推荐 -->
    <div class="recommend" v-if="recommendlist.length>0">
      <dl class="ci_tab">
        <dd class="ci_tabtitle" v-if="item.recommend_list.length>0"   @click.stop="clickTab(item.recommend_type)" v-for="(item,idx) in recommendlist" :class="{'Tabactive': recIdx==idx}" :key="idx">{{item.recommend_title}}</dd>
        <span class="ci_tabline"></span>
      </dl>
        <swiper v-if="showRec" style="height:780rpx;" class="recSwiper" indicator-dots indicator-active-color='#ff5500'>
          <swiper-item>
            <div class="recgoodsBox">
              <div class="recgoodscontent" @click="gotoReco(item.sku)" v-for="(item,idx) in recgoodsList" :key="idx">
                  <img class="recCtImg" :src="item.image" alt="">
                  <span class="recCtText ellipsis">{{item.prod_title}}</span>
                  <text class="recCtprice">¥{{item.sale_price}}</text>
              </div>
            </div>
          </swiper-item>
          <swiper-item v-if="recgoodsList1.length>0">
              <div class="recgoodsBox">
                <div class="recgoodscontent" @click="gotoReco(item.sku)" v-for="(item,idx) in recgoodsList1" :key="idx">
                    <img class="recCtImg" :src="item.image" alt="">
                    <span class="recCtText ellipsis">{{item.prod_title}}</span>
                    <text class="recCtprice">¥{{item.sale_price}}</text>
                </div>
              </div>
          </swiper-item>
        </swiper>

      <swiper v-else style="height:780rpx;" class="recSwiper" indicator-dots indicator-active-color='#ff5500' >
        <swiper-item>
            <div class="recgoodsBox">
              <div class="recgoodscontent" @click="gotoReco(item.sku)" v-for="(item,idx) in recamongList" :key="idx">
                  <img class="recCtImg" :src="item.image" alt="">
                  <span class="recCtText ellipsis">{{item.prod_title}}</span>
                  <text class="recCtprice">¥{{item.sale_price}}</text>
                  <img class="recCImg" v-if="item.sort==1"  src="/static/images/public/public_label_top_1.png" alt="">
                  <img class="recCImg" v-if="item.sort==2"  src="/static/images/public/public_label_top_2.png" alt="">
                  <img class="recCImg" v-if="item.sort==3"  src="/static/images/public/public_label_top_3.png" alt="">
              </div>
            </div>
        </swiper-item>
        <swiper-item v-if="recamongList1.length>0">
          <div class="recgoodsBox">
              <div class="recgoodscontent" @click="gotoReco(item.sku)" v-for="(item,idx) in recamongList1" :key="idx">
                  <img class="recCtImg" :src="item.image" alt="">
                  <span class="recCtText ellipsis">{{item.prod_title}}</span>
                  <text class="recCtprice">¥{{item.sale_price}}</text>
              </div>
            </div>
        </swiper-item>
      </swiper>


    </div>
    <!-- 提示 -->
    <!--<div class="product_detail_top">继续拖动，查看图文详情</div>-->
    <!-- <product-content :content="content"></product-content> -->
    <div :class="['product_padd',{'product_paddX':phonestyleShow}]">
      <shop-sliding :is_haitao='goodsData.is_ht'></shop-sliding>
    </div>

    <!-- 加入购物车成功，立即结算 -->
        <div :class="['addcartSuccess',{'addSuccessX':phonestyleShow}]" v-if="addcartSuccess">
        <span>成功加入购物车</span>
        <span class="addcart_text"  @click="cartCount">立即结算></span>
    </div>
    <!-- 普通商品购物车 -->
    <div :class="[ 'product_cart_fixed' ,{'phonestyleShow':phonestyleShow}]">
      <div class="productBox">
        <div class="product_cart_button" @click="gotobrand">
          <span class="product_cart_icon" >
            <img src="/static/goodsdetail/tabbar_brand.png" class="product_cart_icon_img">
          </span>
          <span class="product_cart_txt">品牌馆</span>
        </div>
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
          <div v-if="cartNum" class="product_cartNum">{{cartNum}}</div>
        </div>
        <div class="product_cart_add" >
          <div class="pre_add_bg" v-if="is_presell_pro"> 
            <div class="pre_add"  @click.stop="ADDgoodsCart">
              <span style="line-height:36rpx; font-size:30rpx;">加入购物车</span>
              <span style="line-height:26rpx; font-size: 26rpx;opacity: 0.8;height:28rpx;font-family: PingFangSC-Regular;">¥{{goodsData.sale_price}}</span>
            </div>
            <div class="pre_pay" @click.stop="presellPay" :class="{pre_pay_red:goodsData.presell.status == '1' || goodsData.presell.status == '3'}">
              <span style="line-height:36rpx; font-size:30rpx;">{{goodsData.presell.status == '0' || goodsData.presell.status == '1'?'支付定金':'支付尾款'}}</span>
              <span v-if="goodsData.presell.status == '3'" style="line-height:26rpx; font-size: 26rpx;opacity: 0.8;height:28rpx;font-family: PingFangSC-Regular;">{{time_str}}</span>
              <span v-if="goodsData.presell.pay_hint" style="line-height:26rpx; font-size: 26rpx;opacity: 0.8;height:28rpx;font-family: PingFangSC-Regular;">{{goodsData.presell.pay_hint}}</span>
            </div>
          </div>
           <div class="normal_add" v-else @click.stop="ADDgoodsCart">
            加入购物车
          </div>
        </div>
      </div>
    </div>

    <!-- Modal促销 模态框 -->
    <div class="drawer_screen" v-if="ModalShow" @click='closeModal'  catchtouchmove="ture" ></div>
    <div class="goodsSalesMoadl" v-if="ModalShow">
      <goodsmodal :staff_id='staff_id' :goodsModalData='goodsModalData' @funcAppsens='funcAppsens' @funcCartNum='funcCartNum' :twogoodsSize='twogoodsSize' :onegoodsSizeImage='onegoodsSizeImage' @headCallBack="headCallresAdd" @closeModall='closeModal' @specCallBack="specCallBackselect" @preSellClick="presellMutiPay"></goodsmodal>
    </div>
    <shareModal @closeShare="closeShare" :goodsData="goodsData" v-if="goodsDynamicData.share_flag&&shareBtn" :shareData="goodsDynamicData.product_share_vo"></shareModal>
    <div class="share_staffId_toast" @click="funcStaffClose" v-if="show_staff_toast" catchtouchmove="ture">
      <div class="toast_content">
        <span style="font-family: PingFangSC-Medium;font-size:34rpx;color:#333;margin-top:28rpx;">温馨提示</span>
        <div class="toast_content_title">
          <span>该账号已经绑定导购编号：</span>
          <span style="color:#ff5000">{{show_staff_id}}</span>
          <span>，快去分享赚取提成吧</span>
        </div>
        <div class="toast_content_button">
          <div class="toast_content_cancle" @click.stop="funcStaffCancle">不再提示</div>
          <div class="toast_content_sure" @click.stop="funcStaffSure">确定</div>
        </div>
      </div>
    </div>
    <!-- MOdal-模态框 -->
  </div>
</template>
<script>
import shopSliding from "@/components/product/details/shopTopSliding"
import timedown from "@/components/public/countdown"
import productContent from "@/components/product/details"
import goodsmodal from "@/components/product/goodsmodal/goodsmodal"
import orderGoods from "@/components/product/ordergoods"
import shareModal from "@/components/product/shareModal"
import { compare,countDown, priceFormat,formatTime,returnFloat } from "@/utils/index"
import { getQueryString } from "@/utils"
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
  addshoppingcart,
  getCartNum,
  getMeetProductSize
} from "@/api";
import wxParse from "mpvue-wxparse";
import { sa } from '../../utils/sensorsdata'

const app = getApp();

export default {
  data() {
    return {
      mp_sa_dict:{},
        shareBtn:false,
        commentBox:false,
      goodsSpecList:null, //选择规格
      now_time:'',  //秒杀倒计时
      phonestyleShow:false,
      show_staff_toast:false,
      show_staff_id:'',
      share_is_normal:true,
      palyvide:false, //视频初始
      cartNum:null,     //购物车数量
      addressShow:false, //是否显示地址
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
      autoplayset: true,  //自动切换
      interval: 5000,
      duration: 1000,
      content: {},
      couponList: [], //优惠卷
      address_list: [], //获取用户的送货地址
      priceNum: [], //金额大小含小数点
      recruit_saleNum:[], //新客专享
      abc: [],
      addressInfoData: {}, //配送地址
      addressfreight: {
        //配送费用
      },
      staff_id:'',
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
      options:{},  //返回数据
      product:{
        item_code:'123',
        title:'',
        desc:'',
        category_list:'',
        image_list:'',
        src_mini_program_path:'',
      },   // 好物圈

      goods_params:{},

      // 预售详情

      // 预售商品 
      is_presell_pro:false,
      // 预售时间开始
      presell_time_start:true,
      
      // 预售时间结束

      // 预售倒计时
      timeInterval:null,
      time_flag:false,
      time_str:'',
      presell_time :0,
      d:0,
      h:0,
      m:0,
      s:0,
      ss:0,





    };
  },
  components: {
    timedown,
    productContent,
    goodsmodal,
    orderGoods,
    shopSliding,
      shareModal,
      wxParse
  },
  computed:mapState(['fromTag','fromSubTag','mp_group_id','staff_id','BASE_APP_INFO']),
  watch:{
    mp_group_id (n, o) {
      let mp_group_id = n;
      if (mp_group_id && mp_group_id != '') {
        this.mp_sa_dict.mp_group_id = mp_group_id;
      }
      app.sensors.track('mp_productDetailPage', this.mp_sa_dict);
      
    },
  },
  onLoad(options) {
    
    this.mp_sa_dict = {};
    this.staff_id = '';
    this.funcGetFromModule();
    wx.showLoading({title: '正在加载中', mask: true});
    // 判断是否从二维码进入
    if(options.q){
      let params = decodeURIComponent(options.q);
      let staff_id = getQueryString('staff_id',params)
      let sku = getQueryString('sku',params)
      let source = getQueryString('utm_source',params);
      let su = getQueryString('su',params);
      let shareFromModule= getQueryString('shareFromModule',params);
      options.shareFromModule = shareFromModule;
      if(sku){
        options.sku = sku;
      }
      if(staff_id){
        options.staff_id = staff_id;
        this.staff_id = staff_id;
      }
      if (source) {
        options.source = source;
      }
      if (su) {
          options.su = su;
      }
    } else {
      if (options.staff_id && options.staff_id != '') {
        this.staff_id = options.staff_id;
      } else {
        let staff_id = this.$store.state.staff_id;
        options.staff_id = staff_id;
        this.staff_id = staff_id;
      }
      if (options.utm_source && options.utm_source != '') {
        options.source = options.utm_source;
      } else {
        options.source = this.$store.state.mp_source;
      }
    }
    if (options.source && options.source != '') {
      this.$store.commit('mpSourceMutations',options.source)
    }
    let shareFromModule = options.shareFromModule;
    if (shareFromModule && shareFromModule != '') {
        this.$store.commit("mpShareFromModuel",shareFromModule);
    } else {
      let sharemodule = this.$store.state.mp_shareFromModule;
      options.shareFromModule = sharemodule;
    }
    

    this.commentBox = false;
    this.goodsData = {};        //初始化基本数据
    this.goodsDynamicData ={};  //初始化动态数据
    this.palyvide = false;      //暂停播放
    this.abc=[];                //商品图片
    this.ModalShow = false;     //模态框关闭
    this.havespec = false;      //初始化选择规格
    let params={};              //初始化参数

    // 获取手机型号
    let phoneMobile = wx.getStorageSync('phoneMobile'); //判断是否为IPhonex
    if(phoneMobile.model.indexOf('iPhone X')>-1 || phoneMobile.model.indexOf('unknown<iPhone11,8>')>-1){
        this.phonestyleShow = true;
    }
    this.tokenID = wx.getStorageSync('token');            //获取token
    this.locationInfo = wx.getStorageSync('locationInfo') //获取经纬度
    let sku = wx.getStorageSync('sku') //获取缓存中的sku
    // sku = "W920000101";
    // sku = 'S860000801';
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
    //从地址搜索页过来
    if(options.poi_name){
      params.poi_address = options.poi_address;
      params.poi_name = options.poi_name;
      params.latitude = options.latitude ||  this.locationInfo.latitude;
      params.longitude = options.longitude || this.locationInfo.longitude;
    }
    //从更多门店进入
    if(options.shop_id){
      params.shop_id = options.shop_id;
      params.shop_name = options.addressShopName;
    }
    // 'W880001501' ||
    this.options = options;
    
    this.goods_params = params;
    this.Goodsinfo(this.goods_params);  //基本信息
    this.GoodsDynamicinfo(this.goods_params); //动态信息
    // this.UserAddressinfo();
    // this.funDoodsImgTxt({sku:'P24000214X'})
    this.goodsrecomment({sku: options.sku || sku })  //排行榜
    this.funcCartNum(); //购物车数量
    this.sa_page(this,false,'普通商品详情',this.staff_id);

    wx.showShareMenu({
      withShareTicket: true,
      success: (result)=>{

      },
      fail: ()=>{},
      complete: ()=>{}
    });

  },
  methods: {
      showShare(){
        this.share_is_normal = false;
        
        this.funcStaffShow();
      },
      closeShare(){
          this.shareBtn=false
      },
    funcGetFromModule() {
      let fromModule = '';
      let pages = getCurrentPages();
      if (pages.length <= 1) {
        fromModule = '活动页';
        let link = wx.getStorageSync("urlH5")
        this.$store.commit('fromTagMutations',link);
        this.$store.commit('fromSubTagMutations','');
        if (this.$store.state.mp_shareFromModule == '') {
          this.$store.commit("mpShareFromModuel", '活动页');
        }
      } else {
      let prePage = pages[pages.length - 2].route;
      if (prePage == 'pages/search/index/main') {
        if (this.fromSubTag == '') {
          fromModule = '搜索';
        } else {
          fromModule = '分类';
        }
      } else if (prePage == 'pages/transferH5/main') {
        fromModule = '活动页';
        let link = wx.getStorageSync("urlH5")
        this.$store.commit('fromTagMutations',link);
        this.$store.commit('fromSubTagMutations','');
        if (this.$store.state.mp_shareFromModule == '') {
          this.$store.commit("mpShareFromModuel", '活动页');
        }
      } else if (prePage == 'pages/products/secKillTime/main') {
        fromModule = '秒杀';
        this.$store.commit('fromTagMutations','');
        this.$store.commit('fromSubTagMutations','');
      }
      else {
        this.$store.commit('fromTagMutations','');
        this.$store.commit('fromSubTagMutations','');
      }
      }

      this.mp_sa_dict = {
        fromModule:fromModule,
        fromTag:this.fromTag,
        fromSubTag:this.fromSubTag
      };
      
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
    // https://webapi.leyou.com.cn/leyou-gateway-services/hotlist/daGuanHotlistRecomment
    Goodsinfo(params) {
      getDoodsData(params).then(msg => {
      
       let res = msg.body;
       let headerinfo = msg.header;
       if (headerinfo.res_code == 1002 || headerinfo.res_code == 1001) {
         setTimeout(() => {
           wx.navigateBack({
           delta:1
         });
         }, 2000);
         return;
       }
       this.commentBox = true;
       wx.setStorageSync('sku',res.sku)
        res.marketPrice = parseInt(res.list_price) > parseInt(res.sale_price) ? true : false; //是否显示原价
        this.priceNum = priceFormat(res.sale_price); //商品价格
        if(res.is_zero_can_sale){
          res.is_zero_can_sale = res.is_zero_can_sale.indexOf('false')>-1?false:true
        }
        if(res.vip_price){ //处理下vip价格
          res.vip_price = returnFloat(res.vip_price)
        }
        if(res.tax_rate){ //全球购
           res.tax_rate = returnFloat(res.tax_rate)
        }
        this.abc = res.image_colors[0].images; //获取轮播图
        if(res.product_skill){ //处理秒杀预告
          this.priceskill = priceFormat(res.product_skill.skill_price);
          if(res.product_skill.skill_status==1){//已经开始
            res.endtime = res.product_skill.end_time;//结束时间
            this.now_time = headerinfo.time_stamp;
          }else{
             res.startdata  = formatTime(res.product_skill.start_time)
             res.startime = res.product_skill.start_time;
             this.now_time = headerinfo.time_stamp;
          }
          res.skill_status = res.product_skill.skill_status;
        }
        if(res.good_review_list){ //滚轮评论
          res.good_review_list.map(r=>{ //处理照片
              r.header_imge_url = r.header_imge_url.indexOf('gif')>-1?false: r.header_imge_url!=''? r.header_imge_url : '/static/goodsdetail/default_pic_user.png'
          })
        }

        // 好物圈赋值
        this.product = {
          item_code:res.sku,
          title:res.mfct_name,  //名字
          desc:res.marketing_title,   //商品描述
          image_list: res.image_colors[0].images, //图片
          category_list:'', //类目列表
          src_mini_program_path:`/pages/goodsdetailed/main?sku=${res.sku}`
        }

        this.goodsData = res;

        if (res.presell && res.presell.presell_id) {
           this.is_presell_pro = true;
           if (res.presell.status == 0) {
             this.presell_time_start = false;
           } else {
             this.presell_time_start = true;
           }
           this.presell_time = res.presell.count_down_time;
           this.time_flag = false;
           this.time_start();
        } else {
          this.is_presell_pro = false;
        }

        /**
         * 显示库存，或者 规格
         * 1,image_colors  数组大于2,显示 尺寸与颜色，数组等于1有sku_size_vos  显示 尺寸 ，没有sku_size_vos  显示库存
         */
        if(this.options.MoregoodsName){
          this.goodsspecData ={};
          this.goodsspecData.goodsspecbuff = this.options.MoregoodsName;
          this.goodsspecData.goodsspecsize = this.options.MoregoodsScpe;
          // this.havespec = true;
        }else{
          if(res.image_colors.length>=2){
            this.SelectText = '请选择尺码、颜色'
            this.goodsspectList();
          }else if(res.image_colors[0].sku_size_vos){
            if(res.image_colors[0].sku_size_vos.length>1){
              this.SelectText = '请选择尺码'
              this.goodsspectList();
            }else{
              this.goodsspecData = {};
              this.goodsspecData.goodsspecbuff = res.image_colors[0].color_name;
              this.goodsspecData.goodsspecsize = res.image_colors[0].sku_size_vos[0].size;
              this.havespec = true;
            }
          }else{
            this.havespec = true;
          }
        }

        let pre_temp = false;
        if(this.is_presell_pro) {
          if (this.goodsData.presell.status == '1') {
            pre_temp = true;
          }
        }

        if (this.ModalShow && this.goodsModalData) {
          let a = {};
          Object.assign(a, this.goodsModalData);
          a.is_presell = pre_temp;
          this.goodsModalData = a;
          this.ModalShow = true;
        }
        


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

        if (this.is_presell_pro) {
          sa_dict.pageType = '预售商品详情页';
          sa_dict.commodityType = '预售商品';
        }
        // let temp_source = this.options.source;
        if(this.options.source && this.options.source != '') {
          sa_dict.mp_source = this.options.source;
        }
        if (this.options.staff_id && this.options.staff_id != '') {
          sa_dict.staff_id = this.options.staff_id;
        }
        if (this.options.shareFromModule) {
          sa_dict.shareFromModule = this.options.shareFromModule;
        }
        if (this.is_presell_pro) {
          sa_dict.shareFromModule = '预售';
        }
        let mp_group_id = this.$store.state.mp_group_id;
        if (mp_group_id && mp_group_id != '') {
          sa_dict.mp_group_id = mp_group_id;
        }
        Object.assign(this.mp_sa_dict,sa_dict);
        app.sensors.track('mp_productDetailPage', this.mp_sa_dict);
        this.$store.commit('fromTagMutations','');
        this.$store.commit('fromSubTagMutations','');
        

      }).catch(err=>{
      })
    },
    GoodsDynamicinfo(params) {
      getDoodsDataDynamic(params).then(res => {

        if(res.recruit_sale){
          this.recruit_saleNum = priceFormat(res.recruit_sale) //新客户专享
        }
        res.review_list.map(r => {
          r.header_imge_url = r.header_imge_url.indexOf('gif')>-1?false: r.header_imge_url!=''? r.header_imge_url : '/static/goodsdetail/default_pic_user.png'
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
            express_stock_desc:res.product_stock.express_stock_desc || ''
          }
          this.twogoodsSize = twogoodsSize;
        }
        //获取店铺地址
        this.shoparrdess = res.product_stock;
        //  获取地址（送至）(不能多个对象链式)
        this.addressInfoData = this.goodsDynamicData.support_distr_address;
        this.addressShow = this.goodsDynamicData.support_distr_address.address?true:false;
        this.addressfreight = this.goodsDynamicData.support_distr_address.support_address;
        wx.hideLoading();
      }).catch(err=>{

      })
    },
    UserAddressinfo() { //获取地址
      gainAddressList().then(res => {
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
          // console.log(res,'我是图文信息')
        })
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
      wx.setStorageSync('urlH5', url);
      wx.navigateTo({url:'/pages/transferH5/main'})
    },
    funcCartNum(){ //获取购物车的数量
      let params = {};
      let cartId = wx.getStorageSync('cart_id')
      if(this.tokenID){ //判断是否登录
        params={
          cart_type:2,
          is_check:2
        }
      }else if(cartId){
         params={
          cart_type:2,
          is_check:2,
          cart_id:cartId
        }
      }else{
        return;
      }
      //判断是否有购物车ID
      getCartNum(params).then(res=>{
        this.cartNum = res.num>99?'99+':res.num;
      })
    },
    goodsspectList(){ //商品规格的数据
         // 1.获取商品规格信息
         getDoodsIdenticalData({sku:wx.getStorageSync('sku')}).then(res=>{
            // console.log(res);
            let sizeObj = res;  //规格数组
            let goodsSpec = this.goodsData.image_colors; //初始数据
            // console.log(this.goodsData.image_colors);
            if(this.goodsData.image_colors !== undefined){
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
            }
        })
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
        ifsales: true
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

        let pre_temp = false;
        if(this.is_presell_pro) {
          if (this.goodsData.presell.status == '1') {
            pre_temp = true;
          }
        }
        let goodsModalData = {
                buffind: 0,
                sizeind: -1,
                goodsSize: true,
                goodsSizeprice: this.priceNum, //价格
                goodsOriginal: parseInt(this.goodsData.list_price), //原价
                goodsphoto:this.goodsData.image_colors[0].main_image,
                goodsSizeSpec: this.goodsSpecList, //规格,\
                staff_id:this.options.staff_id || '',   //导购规则
                is_presell:pre_temp
        };
        this.goodsModalData = goodsModalData;
        this.ModalShow = true;
    },
    headCall(msg) {
      // console.log(msg);
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
    headCallresAdd(msg) {   //选择,地址后地址的值
        //刷新页面
        let params = {
            sku:wx.getStorageSync('sku'),
            address_id:msg.addressId
        };
        this.GoodsDynamicinfo(params);
        this.ModalShow = false;
        this.addressShow = true;
        //   console.log(msg,'我是回调')
        // this.addressING = msg.addressING;
        // this.addressInfoData = this.address_list[msg.addressING];
        // console.log(this.addressInfoData);
    },
    specCallBackselect(msg){ //回调的规格
      this.goodsspecData= msg;
      this.buffind = msg.buffind;
      this.sizeind = msg.sizeind;
      if(!this.tokenID){
        let params={
          sku: msg.goodssku,
          longitude:this.locationInfo.longitude,
          latitude:this.locationInfo.latitude
        }
        this.Goodsinfo(params);
        this.GoodsDynamicinfo(params);
      }else{
        this.Goodsinfo({ sku: msg.goodssku});
        this.GoodsDynamicinfo({ sku:msg.goodssku});
      }
    },
    ownCoupon() { //优惠卷
      let goodsModalData = {
        ifCoupon: true,
        // couponList: this.goodsDynamicData.possess_coupon_list || this.goodsDynamicData.can_receive_coupon_list ,
        couponList: this.goodsDynamicData.can_receive_coupon_list ,
        integralList: this.goodsDynamicData.points_coupon_list
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
      // console.log(arr);
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
        wx.navigateTo({url:'/pages/userCenter/login/wxLogin/main?goodsDetailed=goodsDetailed'})
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

    time_start() {
      let timeInterval = setInterval(() => {
      if (this.time_flag == true) {
        clearInterval(timeInterval);
      }
      this.timeDown();
    }, 100);
      this.timeInterval = timeInterval;
    },

    timeDown() {
      let endTime = this.presell_time;
      let leftTime = 0;
      
      if (endTime >= 0) {
        endTime -= 100;
        this.presell_time = endTime
        leftTime = endTime / 1000;
      } else {
        this.time_flag = true;
        return;
      }
      let d = parseInt(leftTime / (24 * 60 * 60));
      let h = this.formate(parseInt((leftTime / (60 * 60)) % 24));
      let m = this.formate(parseInt((leftTime / 60) % 60));
      let s = this.formate(parseInt(leftTime % 60));
      let ss = parseInt(leftTime * 10 % 10);
      if (leftTime <= 0) {
        this.time_flag = true;
        this.Goodsinfo(this.goods_params);
      }
      this.d = d;
      this.h = h;
      this.m = m;
      this.s = s;
      this.ss = ss;
      this.time_str = d == 0 ? `${h}:${m}:${s}` : `${d}:${h}:${m}:${s}`; // 需要修改时间样式的话 ，比如需要什么30分钟倒计时，就只保留分和秒
    },
    formate(time) {
      if (time >= 10) {
        return time;
      } else {
        return `0${time}`;
      }
    },

    presellMutiPay(quantity_params) {
      if (this.goodsData.presell.status == '1') {        
        let token = wx.getStorageSync('token');
        if (!token || token == '') {
          let url = '/pages/userCenter/login/wxLogin/main';
          wx.navigateTo({
            url: url
          });
          return;
        }
        let temp_staff_id = '';
        if (this.staff_id && temp_staff_id != '') {
          temp_staff_id = this.staff_id;
        } else {
          temp_staff_id = wx.getStorageSync('staff_dgId');
        }
        
        let pre_id = this.goodsData.presell.presell_id;
        let quantity = 1;
        if (quantity_params) {
          quantity = quantity_params;
        }
        let sku = this.goodsData.sku;
        let path = "/pages/confirm/presell/confirm/main?sku=" + sku + '&presell_id=' + pre_id + '&quantity=' + quantity + '&staff_id=' + temp_staff_id;
        wx.setStorageSync('mp_' + this.mp_sa_dict.commodityID, this.mp_sa_dict);
        wx.redirectTo({
          url: path
        });
        return;
      }

    },



    presellPay() {
      // debugger
      if (this.goodsData.presell.status == '0' || this.goodsData.presell.status == '2') {
        wx.showToast({
          title: this.goodsData.presell.pre_start_time,
          icon: 'none'
        });
        return;
      }
  
      if (this.goodsData.presell.status == '1') {        
        if (!this.havespec) {
          this.goodsSize();
          return;
        }


        let token = wx.getStorageSync('token');
        if (!token || token == '') {
          let url = '/pages/userCenter/login/wxLogin/main';
          wx.navigateTo({
            url: url
          });
          return;
        }
        let temp_staff_id = '';
        if (this.staff_id && temp_staff_id != '') {
          temp_staff_id = this.staff_id;
        } else {
          temp_staff_id = wx.getStorageSync('staff_dgId');
        }
        

        let pre_id = this.goodsData.presell.presell_id;
        let quantity = 1;
        let sku = this.goodsData.sku;
        let path = "/pages/confirm/presell/confirm/main?sku=" + sku + '&presell_id=' + pre_id + '&quantity=' + quantity + '&staff_id=' + temp_staff_id;
        wx.setStorageSync('mp_' + this.mp_sa_dict.commodityID, this.mp_sa_dict);
        wx.redirectTo({
          url: path
        });
        return;
      }

      if (this.goodsData.presell.status == '3') {
        let url = "/pages/confirm/list/main?order_status=1";
        wx.redirectTo({
          url: url
        });
        return;
      }
    },
    ADDgoodsCart(){ //(完成)添加商品到购物车
      this.cart_id = wx.getStorageSync('cart_id');
      if(this.tokenID){
         wx.removeStorageSync('cart_id')
         this.cart_id=''
      }
      let that = this;
      /** 判断是否有规格，与无规格1,单规格，直接，加入，购物车，2，多规格跳转 */
      if(this.havespec){//加入购物车
        let sku = this.goodsData.sku;
        let params ={}
          let that =this;
          this.cart_id = wx.getStorageSync('cart_id');
          let token = wx.getStorageSync('token');
          if(this.options.staff_id){
            params.staff_id = parseInt(this.options.staff_id);
          } else {
              let staff_id = wx.getStorageSync('staff_dgId');
              if (staff_id && staff_id != '') {
                params.staff_id = parseInt(staff_id);
              }
          }
          if(token){
            this.cart_id = '';
            wx.removeStorageSync('cart_id')
            params.cart_type=0; //普通商品
            params.hander_type=1; //添加
            params.quantity=1; //数量
            params.sku=sku;
            // params ={
            //   "cart_type": 0,
            //   "hander_type": 1,//添加
            //   "quantity": 1, //数量
            //   "sku": sku
            // }
          }else{
            if(this.cart_id){
              params.cart_type=0; //普通商品
              params.hander_type=1; //添加
              params.quantity=1; //数量
              params.sku=sku;
              params.cart_id = this.cart_id;//购物车id
              // params ={
              //   "cart_id": this.cart_id,
              //   "cart_type": 0, //普通商品
              //   "hander_type": 1,//添加
              //   "quantity": 1, //数量
              //   "sku": sku
              // }
            }else{
              params.cart_type=0; //普通商品
              params.hander_type=1; //添加
              params.quantity=1; //数量
              params.sku=sku;
              // params ={
              //   "cart_type": 0, //普通商品
              //   "hander_type": 1,//添加
              //   "quantity": 1, //数量
              //   "sku": sku
              // }
            }
          }
        if(this.options.su)params.share_user=this.options.su;
        addshoppingcart(params).then(res=>{
          if(!this.tokenID){ //未登录,获取购物车ID
              if(!this.cart_id){
                  wx.setStorageSync('cart_id', res.cart_id)
                  this.cart_id= res.cart_id
              }
          }
          this.addcartSuccess = true;
          // wx.showToast({ title: "添加购物车成功", icon: 'none' })
          //刷新购车数量
          that.funcCartNum();
          app.sensors.track('mp_addToShoppingcart',this.mp_sa_dict);
          wx.setStorageSync('mp_' + this.mp_sa_dict.commodityID, this.mp_sa_dict);
          setTimeout(function(){
            that.addcartSuccess = false;
          },3000)
        })
      }else{ //选择规格
        this.goodsSize();
      }
    },

    funcAppsens(){
      app.sensors.track('mp_addToShoppingcart',this.mp_sa_dict);
      wx.setStorageSync('mp_' + this.mp_sa_dict.commodityID, this.mp_sa_dict);
      console.log('这个是服放类的埋点',this.mp_sa_dict);
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
        console.log('分享这个是普通商品详情的分享');
      this.share_is_normal = true;
      this.funcStaffShow();
    },

    shareInfomations() {
      if (this.share_is_normal) {
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
      } else {
        this.shareBtn=true;
      }
    },




    cartCount(){ //成功后加入购物车
      wx.switchTab({
        url: '/pages/shop/shoppingCart/main'
      })
    },
    palyVideo(){ //点击播放视频
      
      this.autoplayset = false;
      let videoContext = wx.createVideoContext('video')
      this.palyvide = true;
      videoContext.play()
    },
    bindende(){
      
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
    },
    lookMoreShop(i){
      if(i==1){  //库存的查看更多
         wx.navigateTo({url: '/pages/shop/shopSelect/main?detailedMore=detailedMore'+'&sku='+this.goodsData.sku+'&stock=stock'})
      }else{ //有商品规格的查看更多
        let params = `sku=${this.goodsData.sku}&detailedMore=detailedMore&MoregoodsName=${this.goodsspecData.goodsspecbuff}&MoregoodsScpe=${this.goodsspecData.goodsspecsize}`
        wx.navigateTo({url: '/pages/shop/shopSelect/main?'+params})
      }

    },
    gotoVIP(){ //去VIP页面 H5
      let url = wx.getStorageSync('appInfo').vip_info_url + '?token='+ wx.getStorageSync('token');
      wx.setStorageSync('urlH5', url);
      wx.navigateTo({url:'/pages/transferH5/main'})
    },
    gotoNewUser(){ //新客户专享页面
      let url =  this.goodsData.recruit_link + '&token='+ wx.getStorageSync('token');
      wx.setStorageSync('urlH5', url);
       wx.navigateTo({url:'/pages/transferH5/main'})
    },

    funcStaffShow() {
      this.shareInfomations();
      // let status = wx.getStorageSync('show_staff_status');
      // let staff_id = wx.getStorageSync('staff_dgId');
      // this.show_staff_id = staff_id; 
      // if (!status || status == '') {
      //   if (staff_id && staff_id != '') {
      //     this.show_staff_toast = true;
      //   } else {
      //     this.shareInfomations();
      //   }
      // } else {
      //   this.shareInfomations();
      // }
    },
    funcStaffClose() {
      this.show_staff_toast = false;
    },
    funcStaffSure() {
      this.show_staff_toast = false;
      this.shareInfomations();
    },
    funcStaffCancle() {
      this.show_staff_toast = false;
      wx.setStorageSync('show_staff_status', '1');
      this.shareInfomations();
    },
  },
  onHide:function () {
    let videoContext = wx.createVideoContext('video')
    videoContext.stop();
    // this.goodsspecData=null;
  },
  onUnload: function () {
    let videoContext = wx.createVideoContext('video')
    videoContext.stop();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
    this.goodsspecData=null;
    this.ModalShow = false;
  },
  // 小程序分享
  onShareAppMessage(options) {
      
      this.ModalShow = false;
      this.shareBtn = false;
      let _this = this;

      let shareTitle = this.goodsData.marketing_title

      let activity_title = _this.BASE_APP_INFO.share_active_prefix;
      if (activity_title && activity_title != '') {
        shareTitle = activity_title + shareTitle;
      }

      
      _this.mp_sa_dict.utm_source = 'leyou_xcx';
      if(options.target && options.target.dataset){

      if (this.goodsDynamicData.product_share_vo && this.goodsDynamicData.product_share_vo.share_url) {
        _this.mp_sa_dict.shareFromModule = '分享赚';
        let path = this.goodsDynamicData.product_share_vo.share_url + '&utm_source=leyou_xcx&shareFromModule=分享赚' ;
        let staff_id = wx.getStorageSync('staff_dgId');
          if (staff_id && staff_id != '') {
            path = path + '&staff_id=' + staff_id;
        }
        app.sensors.track('mp_shareProduct',_this.mp_sa_dict);
        return{
              title: shareTitle,
              imageUrl: this.goodsData.image_colors[0].main_image,
              path: path,
          }
      } else {
        _this.mp_sa_dict.shareFromModule = _this.mp_sa_dict.fromModule;
        if(_this.is_presell_pro) {
          _this.mp_sa_dict.shareFromModule = '预售';
        }
          let path = '/pages/goodsdetailed/main?sku='+this.goodsData.sku + '&utm_source=leyou_xcx';
          if (_this.mp_sa_dict.shareFromModule && _this.mp_sa_dict.shareFromModule != '') {
            path = path + '&shareFromModule=' + _this.mp_sa_dict.shareFromModule;
          }
          let staff_id = wx.getStorageSync('staff_dgId');
          if (staff_id && staff_id != '') {
            path = path + '&staff_id=' + staff_id;
          }
          console.log('分享的路径',path,_this.mp_sa_dict);
          app.sensors.track('mp_shareProduct',_this.mp_sa_dict);
          return{
              title: shareTitle,
              imageUrl: this.goodsData.image_colors[0].main_image,
              path: path,
          }
      }
          
      }else{
        _this.mp_sa_dict.shareFromModule = _this.mp_sa_dict.fromModule;
        if(_this.is_presell_pro) {
          _this.mp_sa_dict.shareFromModule = '预售';
        }
          let path = '/pages/goodsdetailed/main?sku='+this.goodsData.sku + '&utm_source=leyou_xcx';
          if (_this.mp_sa_dict.shareFromModule && _this.mp_sa_dict.shareFromModule != '') {
            path = path + '&shareFromModule=' + _this.mp_sa_dict.shareFromModule;
          }
          let staff_id = wx.getStorageSync('staff_dgId');
          if (staff_id && staff_id != '') {
            path = path + '&staff_id=' + staff_id;
          }
          console.log('分享的路径',path,_this.mp_sa_dict);
          app.sensors.track('mp_shareProduct',_this.mp_sa_dict);
          return{
              title: shareTitle,
              imageUrl: this.goodsData.image_colors[0].main_image,
              path: path,
          }
      }

  }
};
</script>
<style scoped>
    .hasshare_flag{
        width: 500rpx;
    }
    .nohasshare_flag{
        width: 600rpx;
    }
    .wxSpan>view{
        display: flex!important;
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
  margin-top: 14rpx;
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
  height: 32rpx;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}
.addresspointimg {
  position: absolute;
  width: 44rpx;
  height: 44rpx;
  top: 15rpx;
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
  margin-left: 10rpx;
    font-size: 0;
    text-align: center;
}
.price_img .img1 {
  width: 68rpx;
  height: 68rpx;
}
.price_img .img2 {
  width: 68rpx;
  height: 68rpx;
}
.price_img .img3 {
    width: 44rpx;
    height: 44rpx;
}
.yongj{
    font-family: PingFangSC-Regular;
    font-size: 20rpx;
    color: #FF5000;
    /* padding-top: 1rpx; */
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
  width: 710rpx;
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
.product_cart_add {
  flex: 1;
  color: #fff;
  text-align: center;
  font-size: 30px;
  line-height: 98px;
  height: 98rpx;
}

.normal_add {
  background: #ff5000;
  flex: 1;
  
}

.pre_add_bg {
  display: flex;
  font-family: PingFangSC-Medium;
  height: 98rpx;
}

.pre_add {
  background: #FAB400;
  flex: 0.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pre_pay {
  flex: 0.5;
  background: #cacaca;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pre_pay_red {
  background: #FF5000;
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

.presell_status_right_bg {
  background: #e7f7ff;
  flex: 1;
  font-size: 22rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #00a0f0;
  text-align: center;
  font-family: PingFangSC-Regular;
}

.presell_status_right_red_bg {
  background: #FFEAE9;
  color: #ff2828;
}

.presell_status_left_bg {
  width:542rpx;
  display:flex;
  align-items:center;
  background-image: linear-gradient(
    -269deg,
    #28b4fa 0%,
    #00a0f0 74%,
    #00a0f0 100%
  );
}

.presell_status_left_red_bg {
  background-image: linear-gradient(-269deg, #FF5000 0%, #FF2828 74%, #FF2828 100%);
}

.preselll_status_bg {
  display: flex; 
  color: #ffffff;
  letter-spacing: 0;
  font-size: 30rpx;
  font-weight: 600;
  width: 100%;
  height: 98rpx;  
}

.time_style {
  color: #fff;
  padding: 2rpx 4rpx;
  background: #00A0F0;
  font-size: 22rpx;
  text-align: center;
  border-radius: 4rpx;
  width: 34rpx;
  height: 34rpx;
  box-sizing: border-box;
}

.time_style_margin {
  font-size: 22rpx;
  text-align: center;
  width: 8rpx;
  padding: 0 4rpx;
  height: 34rpx;
}

.presell_count_time {
  width: 124rpx;
  height: 34rpx;
}

.time_style_red {
  background: #ff2828
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
.gsbargainprice_red {
  color: #FF2828;
}

.goodsbargain_DAY {
  background: #e7f7ff;
  /* width: 250rpx; */
  height: 98rpx;
  flex: 1;
  font-size: 22rpx;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #00a0f0;
  text-align: center;
  font-family: PingFangSC-Regular;
}
.goodsbargain_DAY text {
  background: #00a0f0;
  border-radius: 4px;
  color: #ffffff;
  height: 34rpx;
  line-height: 34rpx;
  padding: 2rpx 4rpx;
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

/* 模态框背景 */

.share_staffId_toast {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.toast_content {
  width: 590rpx;
  height: 330rpx;
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding: 20rpx 28rpx; */
}

.toast_content_input {
  width: 590rpx;
  height: 356rpx;
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 取消订单模态框 */

.toast_content_title {
  margin-top: 36rpx;
  text-align: center;
  font-size: 30rpx;
  color: #333;
  height: 84rpx;
  width: 510rpx;
}

.toast_content_button {
  margin-top: 54rpx;
  width: 100%;
  height: 88rpx;
  display: flex;
  font-size: 30rpx;
  align-items: center;
  border-top: #eeeeee 1px solid;
}
.toast_content_sure {
  font-family: PingFangSC-Medium;
  text-align: center;
  flex: 1;
  height: 42rpx;
  color: #ff5000;
  font-size: 30rpx;
}

.toast_content_cancle {
  font-family: PingFangSC-Medium;
  text-align: center;
  height: 42rpx;
  font-size: 30rpx;
  flex: 1;
  color: #333;
  border-right: #eeeeee 1px solid;
}

/* 轮播图滚动 */


</style>

