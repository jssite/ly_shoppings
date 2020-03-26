<template>
  <div class="goodsModalBOX">
    <!-- 优惠卷列表 -->
    <div class="goodsModal couponHeight" catchtouchmove="ture" v-if="goodsModalData.ifCoupon">
      <div class="goodsModal_title">
        优惠券
        <img
          v-if="type!=2"
          class="tpcontent_img"
          src="/static/images/public/public_pop_close.png"
          @click="closeModal"
        />
        <img
          v-if="type==2"
          class="tpcontent_img"
          src="/static/images/public/public_pop_close.png"
          @click="closeM"
        />
      </div>
      <div class="gmDiscount_title">
        <span :class="['gmDiscount_tab',{active:coupon}]" @click="TabDiscount">可领优惠券</span>
        <span :class="['gmDiscount_tab',{active:!coupon}]" @click="TabIntegral">可用优惠券</span>
      </div>
      <scroll-view scroll-y="true" style="height: 640rpx;background:#f3f5f7;">
        <div class="gmD_detailed" v-if="coupon">
          <span class="gmDDName">立即领券</span>
          <!-- 优惠卷 -->
          <div class="gmDD_content" v-for="(item,index) in goodsModalData.couponList" :key="index">
            <img class="gmDD_topImg" src="/static/goodsdetail/product_coupon_bg.png" alt />
            <div class="gmDD_content_r">
              <div class="gmDD_content_r_price">
                <span class="gmDD_content_r_price_sign">¥</span>
                <span class="gmDD_content_r_price_val">{{item.num_cost}}</span>
              </div>
              <span class="gmDD_content_r_price_rule">{{item.condition}}</span>
            </div>
            <span class="gmDD_content_z">{{item.info}}</span>
            <div class="gmDD_content_l">
              <span
                v-if="item.can_receive"
                class="gmDD_content_l_receive"
                @click="takecoupon(index)"
              >立即领取</span>
              <img v-else class="couponstate" src="/static/images/public/public_state02.png" alt />
            </div>
          </div>
          <!-- 积分兑换 -->
          <span
            class="gmDDName"
            v-if="goodsModalData.integralList&&goodsModalData.integralList.length"
          >积分兑换</span>
          <div class="gmDD_content" v-for="(item,ind) in goodsModalData.integralList" :key="ind">
            <img class="gmDD_topImg" src="/static/goodsdetail/product_coupon_bg.png" alt />
            <div class="gmDD_content_r">
              <div class="gmDD_content_r_price">
                <span class="gmDD_content_r_price_sign">¥</span>
                <span class="gmDD_content_r_price_val">{{item.value}}</span>
              </div>
              <span class="gmDD_content_r_price_rule">{{item.condition}}</span>
            </div>
            <span class="gmDD_content_z">{{item.info}}</span>
            <div class="gmDD_content_l">
              <span class="gmDD_content_l_integral">{{item.point}}积分</span>
              <span class="gmDD_content_l_receive" @click="takeintegral(ind)">立即兑换</span>
              <!-- <img v-else class="couponstate" src="/static/images/public/public_goods_state02.png" alt=""> -->
            </div>
          </div>
        </div>
        <div class="gmD_detailed" v-if="!coupon">
          <!-- 优惠卷 -->
          <div class="gmDD_content" v-for="(item,index) in needcouponList" :key="index">
            <img class="gmDD_topImg" src="/static/goodsdetail/product_coupon_bg.png" alt />
            <div class="gmDD_content_r">
              <div class="gmDD_content_r_price">
                <span class="gmDD_content_r_price_sign">¥</span>
                <span class="gmDD_content_r_price_val">{{item.num_cost}}</span>
              </div>
              <span class="gmDD_content_r_price_rule">{{item.condition}}</span>
            </div>
            <span class="gmDD_content_z">{{item.info}}</span>
            <div class="gmDD_content_l">
              <span class="gmDD_content_l_receive" @click="couponGotoPro(item)">立即使用</span>
              <!-- <img v-else class="couponstate" src="/static/images/public/public_state02.png" alt=""> -->
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <!-- 促销 -->
    <div class="goodsModal" catchtouchmove="ture" v-if="goodsModalData.ifsales">
      <div class="goodsModal_title">
        促销
        <img class="tpcontent_img" src="/static/images/public_pop_close.png" @click="closeModal" />
      </div>
      <scroll-view scroll-y="true" style="height: 512rpx;">
        <div
          class="goodsModal_conten"
          v-for="(item,index) in goodsModalData.salesList"
          :key="index"
        >
          <!--<div  class="content_r_box">-->
          <!--</div>-->
          <div
            style="display:flex; align-items: center;width:685rpx;"
            @click.stop="gotopromotion(item)"
          >
            <span class="content_r">{{item.title}}</span>
            <span class="content_l">{{item.content}}</span>
          </div>
          <img
            v-if="item.promotion_id"
            class="img"
            src="/static/goodsdetail/lecard_arrow_right.png"
          />
          <!-- <div style="display:flex; align-items: center;justify-content:space-between;width:580rpx;" @click.stop="gotopromotion(item)"> -->
          <!-- <span class="content_l">{{item.content}}</span>
                        <img class="img" src="/static/goodsdetail/lecard_arrow_right.png">
          -->
          <!-- </div> -->
        </div>
      </scroll-view>
    </div>

    <!-- 运费模态框 -->
    <div class="goodsModal" catchtouchmove="ture" v-if="goodsModalData.ifonfreight">
      <div class="goodsModal_title">
        运费
        <img class="tpcontent_img" src="/static/images/public_pop_close.png" @click="closeModal" />
      </div>
      <scroll-view scroll-y="true" style="height: 512rpx;">
        <div
          class="goodsfreight"
          v-for="(item,index) in goodsModalData.addressfreightInfo"
          :key="index"
        >
          <span class="gf_name">{{item.freight_name}}</span>
          <span class="gf_content">{{item.freight_value}}</span>
        </div>
        <!-- <div class="goodsfreight">
                    <span class="gf_name">普通快递</span>
                    <span class="gf_content">满99运费减免2.1~3.5之间任意金额，未满99运费减免2.1~2.9之间任意金额</span>
        </div>-->
      </scroll-view>
    </div>
    <!-- 闪送规则 -->
    <div class="goodsModal" catchtouchmove="ture" v-if="goodsModalData.ifspeedsong">
      <div class="goodsModal_title">
        闪送规则
        <img
          class="tpcontent_img"
          src="/static/images/public_pop_close.png"
          @click="closeModal"
        />
      </div>
      <!-- <scroll-view scroll-y="true"  style="height: 552rpx;"> -->
      <div class="goodsfast" v-for="(item,index) in goodsModalData.speedData" :key="index">
        <div class="goodsfast_index">{{index+1}}</div>
        <span class="goodsfast_content">{{item}}</span>
      </div>
      <!-- </scroll-view> -->
    </div>
    <!-- 闪送至 -->
    <div
      class="goodsModal couponHeight"
      catchtouchmove="ture"
      v-if="goodsModalData.ifselectaddress"
    >
      <div class="goodsModal_title">
        闪送至
        <img class="tpcontent_img" src="/static/images/public_pop_close.png" @click="closeModal" />
      </div>
      <template v-if="goodsModalData.address_list.length>0">
        <scroll-view scroll-y="true" style="height: 616rpx;">
          <div
            @click="pitchaddress(index,item.address_id)"
            :class="['goodsfastAddress',{activeAddress:goodsModalData.addressING==index}]"
            v-for="(item,index) in goodsModalData.address_list"
            :key="index"
          >
            <span class="goodsfastAddress_content">{{item.add_detail}}</span>
            <!-- <img v-if="goodsModalData.addressING==index" class="fastimg" src="/static/images/public/publicCircle-checkOn.png">
            <img v-else class="fastimg" src="/static/images/public/publicCircle-checkOff.png">-->
          </div>
        </scroll-view>
        <div class="addAddress" @click="setAddress">设置其他地址</div>
      </template>
      <template v-if="goodsModalData.address_list.length<=0">
        <div class="goodsfastAddressNull">
          <img class="goodsfastAddressNull_img" src="/static/images/public/public_empty_pic.png" />
          <span class="gfan_content">暂无地址信息</span>
          <navigator class="addAddress flexadd" @click="setAddress" hover-class="none">添加新地址</navigator>
        </div>
      </template>
      <!-- <div class="addAddress" @click="setAddress">设置其他地址</div> -->
    </div>

    <!-- 选择尺码 -->
    <div class="couponHeight" v-if="goodsModalData.goodsSize">
      <div class="goodsSize">
        <div class="goodsSizephoto">
          <div class="goodsSizephoto_imgBOX">
            <img class="goodsSizephoto_img" :src="goodsModalData.goodsphoto" />
          </div>
        </div>
        <div class="goodsSizeContent">
          <div>
            <text class="goodsSize1">¥</text>
            <text class="goodsSize2" v-if="type!=2">{{goodsModalData.goodsSizeprice[0]}}</text>
            <text class="goodsSize2" v-if="type===2">{{base_price}}</text>
            <text class="goodsSize3" v-if="type!=2">{{goodsModalData.goodsSizeprice[1]}}</text>

            <text class="goodsSize4" v-if="type!=2">￥{{goodsModalData.goodsOriginal}}</text>
            <text class="goodsSize5">已选：{{goodsspecbuff}} {{goodsspecsize}}</text>
            <img
              v-if="type!=2"
              class="tpcontent_img"
              src="/static/images/public/public_pop_close.png"
              @click="closeModal"
            />
            <img
              v-if="type==2"
              class="tpcontent_img"
              src="/static/images/public/public_pop_close.png"
              @click="closeM"
            />
          </div>
          <div style="margin-top:21rpx;" v-if="twogoodsSize">
            <!-- <text class="goodsSize6">¥13100.20</text> -->
            <!-- <img class="goodsSizeIMG_VIP" src="/static/goodsdetail/product_sign_vip.png"> -->
            <!-- <text v-if="type!=2" class="goodsSize7">常购门店{{twogoodsSize.product_stock_dest}}</text> -->
            <!-- <text v-if="type!=2" class="goodsSize7">dddd<rich-text :nodes="twogoodsSize.product_stock_dest"></rich-text></text> -->
            <!-- <text class="goodsSize7"><rich-text :nodes="twogoodsSize.express_stock_desc"></rich-text></text> -->
            <!-- <wxParse :content="twogoodsSize.express_stock_desc"/> -->
            <!-- <text class="goodsSize7">{{twogoodsSize.express_stock_desc}}</text> -->
          </div>
        </div>
      </div>
      <div class="goodsSizeType">
        <div class="goodsSizType_name">颜色</div>
        <div class="goodsSizeType_content">
          <template v-if="goodsModalData.goodsSizeSpec.length==1">
            <text
              class="gstcon_Txt goodsActive"
              v-for="(item,index) in goodsModalData.goodsSizeSpec"
              :index="index"
              :key="index"
            >{{item.color_name}}</text>
          </template>
          <template v-else>
            <span
              :class="['gstcon_Txt',{goodsActive:buffNum==index}]"
              @click.stop="gainBuff(index)"
              v-for="(item,index) in goodsModalData.goodsSizeSpec"
              :key="index"
            >{{item.color_name}}</span>
          </template>
        </div>
        <div class="goodsSizType_name">{{ageSize?'年龄':'尺寸'}}</div>
        <div class="goodsSizeType_content">
          <!--<template v-if="goodsModalData.goodsSizeSpec[0].sku_size_vos.length==1">-->
          <!--<text-->
          <!--class="gstcon_Txt goodsActive"-->
          <!--v-for="(item,index) in goodsModalData.goodsSizeSpec[0].sku_size_vos"-->
          <!--:index="index"-->
          <!--:key="index"-->
          <!--&gt;{{item.size}}</text>-->
          <!--</template>-->
          <!--<template>-->
          <text
            :class="['gstcon_Txt',{goodsActive: sizeNum == index},{'disabledccc':item.stock==0}]"
            @click.stop="gainSize(item,index)"
            v-for="(item,index) in goodsSizeSpecnew"
            :key="index"
          >{{item.size}}</text>
          <!--</template>-->

          <!-- <text class="gstcon_Txt goodsActive">粉色</text>
          <text class="gstcon_Txt goodsNo_Active">粉色</text>-->
        </div>
        <div class="fixed">
          <div class="goodsSizeNum" v-if="type!=2">
            <span class="gstitle">购买数量</span>

            <img
              class="reduce"
              @click="doDelGoods"
              :src="cartNum==1?'/static/images/public/public_number_subnot.png':'/static/images/public/public_number_sub.png'"
            />
            <!-- <span class="goods-num">{{cartNum}}</span> -->
            <input type="number" class="goods-num" @blur="blurInput" v-model="cartNum" />
            <img
              class="add"
              @click="doAddGoods"
              :src="cartNum>99?'/static/images/public/public_number_addnot.png':'/static/images/public/public_number_add.png'"
            />
          </div>
          <div :class="['goodsSizeconfirm', {iPhone:phonestyleShow}]">
            <div v-if="goodsModalData.is_presell"
              style="width:100%;height:97rpx;background: #FF5000;"
              :class="{'disabled':disabledBut}"
              @click="doaddCart">
              支付定金
            </div>
            <div
              v-else-if="type!=2"
              style="width:100%;height:97rpx;background: #FF5000;"
              :class="{'disabled':disabledBut}"
              @click="doaddCart"
            >加入购物车</div>
            <div
              v-else
              style="width:100%;height:97rpx;background: #FF5000;"
              :class="{'disabled':disabledBut}"
              @click="closeModal"
            >确定</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享给好友 -->
    <div
      class="goodsModal"
      style="height:378rpx;"
      catchtouchmove="ture"
      v-if="goodsModalData.sharepage"
    >
      <div class="goodsModal_title">
        <span v-if="show_staff_id != ''">{{'您的导购号：' + show_staff_id}}</span>
        <span v-else>分享给好友</span>
      </div>
      <div class="sharePER">
        <button class="sharePER_box btn" open-type="share">
          <img class="shareimg" src="/static/images/public/public_share_wechat.png" alt />
          <span class="sharetext">好友和微信群</span>
        </button>
        <!-- <div class="sharePER_box" @click.stop="createPoster">
                    <img class="shareimg" src="/static/images/public/public_share_pic.png" alt="">
                    <span class="sharetext">生成你的专属海报</span>
        </div>-->
      </div>
      <img class="shareClose" src="/static/images/public_pop_close.png" @click="closeModal" />
    </div>
    <!-- 画海报 -->
    <canvas canvas-id="shareCanvas" id="shareCanvas"></canvas>
    <canvas canvas-id="qrcode" id="qrcodeN"></canvas>
    <!-- 画二维码 -->

    <!-- 海报图片 -->
    <div class="posterPhoto" v-if="giveposter">
      <img :src=" canvasUrl " alt class="posterImg" @click="closePoster" />
      <div class="holdposter" @click="holdposter">保存海报</div>
    </div>
  </div>
</template>
<script>
import {
  getCoupon,
  getintegral,
  addshoppingcart,
  setdefaultaddress
} from "@/api";
import { creatQrcode } from "@/utils";
import wxParse from "mpvue-wxparse";
var app = getApp();

// import QR from '@/utils/qrcode.js'
export default {
  components: {
    wxParse
  },
  props: {
    type: "",
    staff_id: "",
    goodsModalData: {
      type: Object,
      default: {}
    },
    base_price: "",
    pattern: {
      type: Object,
      default: {}
    },
    twogoodsSize: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      QRcodeIMG: "", //二维码图片
      ageSize: false, //显示尺寸
      QRfinish: false, //完成二维码绘制
      userTopImg: null, //用户头像
      goodsImg: null, //绘制商品图片
      cart_id: "", //购物车id
      giveposter: false, //海报页面
      canvasUrl: null, //默认的海报地址
      disabledBut: true, //默认
      cartNum: 1,
      goodssku: null, //商品id
      buffNum: null,
      sizeNum: null,
      coupon: true, //初始，现在优惠卷
      // buffind:-1,  //颜色默认值
      // sizeind:-1,     //尺寸默认值
      goodsspecbuff: "", //默认已选颜色
      goodsspecsize: "", //默认大小
      imgUrls: [
        "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640",
        "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640",
        "https://images.unsplash.com/photo-1551446591-142875a901a1?w=640"
      ],
      needcouponList: [], //可以立即使用的优惠卷
      takecouponList: [], //可以在领取的领优惠卷
      phonestyleShow: false,
      goodsSizeSpecnew: null, //商品的规格尺寸
      show_staff_id: "" //要展示的导购id
    };
  },
  onLoad() {
    if (this.goodsModalData.couponList || this.goodsModalData.integralList) {
      //处理优惠劵
      this.goodsModalData.couponList.map(res => {
        //优惠卷处理
        if (!res.can_receive) {
          this.needcouponList.push(res);
        }
      });
    }
    let phoneMobile = wx.getStorageSync("phoneMobile"); //判断是否为IPhonex
    if (
      phoneMobile.model.indexOf("X") > -1 ||
      phoneMobile.model.indexOf("unknown<iPhone11,8>") > -1
    ) {
      this.phonestyleShow = true;
    }
    // 初始化一些数据
    this.cartNum = 1; //初始化

    let staff_id = wx.getStorageSync("staff_dgId");
    this.show_staff_id = staff_id;
    // 判断商品规格
    if (this.goodsModalData.goodsSizeSpec) {
      console.log(this.goodsModalData.goodsSizeSpec, "我是传递过来的数据");
      this.goodsSizeSpecnew = this.goodsModalData.goodsSizeSpec[0].sku_size_vos;
      this.buffNum = this.goodsModalData.buffind;
      this.sizeNum = this.goodsModalData.sizeind;
    }
    if (
      this.goodsModalData.goodsSizeSpec &&
      this.goodsModalData.goodsSizeSpec.length == 1
    ) {
      this.goodsspecbuff = this.goodsModalData.goodsSizeSpec[0].color_name;
    }
    if (
      this.goodsModalData.goodsSizeSpec &&
      this.goodsModalData.goodsSizeSpec[0].sku_size_vos
    ) {
      //判断是年龄，还是尺寸
      this.ageSize =
        this.goodsModalData.goodsSizeSpec[0].sku_size_vos[0].size.indexOf(
          "岁"
        ) > -1
          ? true
          : false;
    }
    if (
      this.goodsModalData.goodsSizeSpec &&
      this.goodsModalData.goodsSizeSpec[0].sku_size_vos.length == 1
    ) {
      this.goodsspecsize = this.goodsModalData.goodsSizeSpec[0].sku_size_vos[0].size;
    }
    if (
      this.goodsModalData.goodsSizeSpec &&
      this.goodsModalData.goodsSizeSpec[0].sku_size_vos.length == 1 &&
      this.goodsModalData.goodsSizeSpec.length == 1
    ) {
      this.disabledBut = false;
      this.goodssku = this.goodsModalData.goodsSizeSpec[0].sku_size_vos[0].sku;
    }

    // if(this.goodsModalData.sharesign){ //分享处理
    //     this.CacheUserImg();
    // }
    // if(this.goodsModalData.sharepage){ //判断是否为分享
    //     let scale = wx.getSystemInfoSync().windowWidth / 750;
    //     let url = 'https://app.leyou.com.cn?sku='+wx.getStorageSync('sku');
    //     creatQrcode('qrcode',url,280*scale,280*scale)
    //     this.CachgoodsImg();
    // }
  },
  computed() {},
  methods: {
    CacheUserImg() {
      //缓存用户头像
      let userheaderImg = wx.getStorageSync("userinfo").avatar || false;
      let that = this;
      if (userheaderImg) {
        if (userheaderImg.indexOf("gif") > -1) {
          that.userTopImg = "/static/goodsdetail/default_pic_user.png";
        } else {
          let that = this;
          wx.downloadFile({
            //缓存店铺头像，直接使用网络路径真机无法显示或绘制
            url: userheaderImg,
            success: function(res) {
              that.userTopImg = res.tempFilePath;
            }
          });
        }
      } else {
        that.userTopImg = "/static/goodsdetail/default_pic_user.png";
      }
      if (that.goodsModalData.goodsImg) {
        //商品图片
        that.goodsModalData.goodsImg =
          that.goodsModalData.goodsImg.split(":")[0] == "http"
            ? that.goodsModalData.goodsImg.replace("http", "https")
            : that.goodsModalData.goodsImg;
        wx.downloadFile({
          //缓存店铺头像，直接使用网络路径真机无法显示或绘制
          url: that.goodsModalData.goodsImg,
          success: function(res) {
            that.goodsImg = res.tempFilePath;
          }
        });
      }
    },
    CachgoodsImg() {
      //缓存商品图片
      let that = this;
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: "qrcode",
          success(res) {
            let tempFilePath = res.tempFilePath;

            that.QRcodeIMG = tempFilePath;
            // wx.setStorageSync('QRcodeIMG',tempFilePath)
            that.QRfinish = true;
          },
          fail: function(res) {}
        });
      }, 500);
    },
    // 设置地址,(跳转到地址搜索页)
    setAddress() {
      wx.navigateTo({
        url: "/pages/search/quickGoods/main?detailedadd=detailedadd"
      });
      this.$emit("closeModall");
      // this.
    },
    TabDiscount() {
      // 查看优惠卷
      this.coupon = true;
    },
    TabIntegral() {
      // 查看积分兑换
      this.coupon = false;
    },
    gotopromotion(data) {
      //促销 到 促销页面
      let that = this;
      if (data.promotion_id) {
        let params = Object.keys(data).map(res => {
          return `&${res}=${data[res]}`;
        });
        if (this.goodsModalData.promtionshansong == "shansong") {
          //判断是否有闪送 +'&shansong=shansong'
          wx.navigateTo({
            url: "/pages/search/salesDelivery/main?" + params.join("")
          });
        } else {
          wx.navigateTo({
            url: "/pages/search/salesPromotion/main?" + params.join("")
          });
        }
        setTimeout(function() {
          that.$emit("closeModall");
        }, 500);
      }
    },
    couponGotoPro(data) {
      //优惠卷到促销页面

      let url = "";
      if (this.goodsModalData.couponshansong == "shansong") {
        let params = `content=${data.info}&promotion_id=${
          data.promotion_id
        }&title=${data.condition_tag}`;
        url = "/pages/search/salesDelivery/main?" + params;
        //  url = '/pages/search/salesPromotion/main?content='+data.info+'&promotion_id='+data.promotion_id+'&title='+data.condition_tag+'&shansong=shansong'
      } else {
        url =
          "/pages/search/salesPromotion/main?content=" +
          data.info +
          "&promotion_id=" +
          data.promotion_id +
          "&title=" +
          data.condition_tag;
      }
      let that = this;
      wx.navigateTo({ url: url });
      setTimeout(function() {
        that.$emit("closeModall");
      }, 500);
    },
    takecoupon(i) {
      //立即领取优惠卷 type ID,面额
      let that = this;
      let params = {
        type: this.goodsModalData.couponList[i].type + "",
        num_cost: parseInt(this.goodsModalData.couponList[i].num_cost)
      };
      let data = this.goodsModalData.couponList[i];
      getCoupon(params).then(res => {
        let source = this.$store.state.mp_source;
        let group_id = this.$store.state.mp_group_id;
        let sa_coupon = {
          mp_source: source,
          mp_group_id: group_id,
          staff_id: this.staff_id,
          conponName: data.info,
          conponValue: data.num_cost,
          fromType: "商品详情页",
          promotionID: data.promotion_id,
          conponID: data.type
        };
        app.sensors.track("mp_getConpon", sa_coupon);
        wx.showToast({ title: "领取成功", icon: "none", duration: 1000 });
        setTimeout(function() {
          that.$emit("closeModall");
        }, 1000);
      });
    },
    takeintegral(i) {
      //积分兑换  优惠卷金额
      let that = this;
      let params = {
        coupons_amount: this.goodsModalData.integralList[i].value
      };
      getintegral(params).then(res => {
        wx.showToast({ title: "兑换成功", icon: "none", duration: 1000 });
        setTimeout(function() {
          that.$emit("closeModall");
        }, 1000);
      });
    },
    pitchaddress(i, addressId) {
      this.$emit("headCallBack", { addressING: i, addressId: addressId });
    },
    gainBuff(i) {
      this.goodsSizeSpecnew = this.goodsModalData.goodsSizeSpec[i].sku_size_vos; // 遍历颜色的   -- 商品的大小
      //获取商品颜色
      if (this.buffNum == i) {
        return;
      }
      this.buffNum = i;
      this.goodsspecbuff = this.goodsModalData.goodsSizeSpec[
        this.buffNum
      ].color_name;
      if (this.sizeNum == -1) {
        return;
      } else {
        this.sizeNum = 0;
      }
      this.goodssku = this.goodsModalData.goodsSizeSpec[
        this.buffNum
      ].sku_size_vos[0].sku;
      // color_name
      // this.$emit('specCallBack', {buffind:this.buffNum,sizeind:this.sizeNum,goodsspecbuff:this.goodsspecbuff,goodsspecsize:this.goodsspecsize,goodssku:this.goodssku});
    },
    gainSize(item, i) {
      //获取商品尺寸大小
      if (item.stock <= 0) {
        return;
      }
      if (this.sizeNum == i) {
        this.sizeNum = -1;
        this.disabledBut = true;
      } else {
        this.disabledBut = false;
        this.sizeNum = i;
        this.goodsspecsize = this.goodsModalData.goodsSizeSpec[
          this.buffNum
        ].sku_size_vos[this.sizeNum].size;
        this.goodssku = this.goodsModalData.goodsSizeSpec[
          this.buffNum
        ].sku_size_vos[this.sizeNum].sku;
        this.goodsModalData.goodsphoto =
          this.goodsModalData.goodsSizeSpec[0].images[this.sizeNum] ||
          this.goodsModalData.goodsSizeSpec[0].images[0];
      }
      this.$emit("specCallBack", {
        buffind: this.buffNum,
        sizeind: this.sizeNum,
        goodsspecbuff: this.goodsspecbuff,
        goodsspecsize: this.goodsspecsize,
        goodssku: this.goodssku
      });
    },
    doAddGoods() {
      //数量
      if (this.cartNum > 99) {
        return;
      }
      this.cartNum += 1;
    },
    blurInput(e) {
      this.cartNum = parseInt(e.mp.detail.value) > 99 ? 99 : e.mp.detail.value;
    },
    doDelGoods() {
      //减
      if (this.cartNum == 1) {
        return;
      }
      this.cartNum -= 1;
    },

    
    presellPay() {
      this.$emit("preSellClick",this.cartNum);
    },


    doaddCart() {
      //添加到购物车
      debugger
      if (this.goodsModalData.is_presell) {
        this.presellPay();
        return;
      }



      let that = this;
      if (this.goodsModalData.shansong == "shansong") {
        that.$emit("Addcartshansong", {
          sku: this.goodssku,
          quantity: this.cartNum
        });
        return;
      }
      let params = {};
      this.cart_id = wx.getStorageSync("cart_id");
      let token = wx.getStorageSync("token");
      if (this.goodsModalData.staff_id) {
        params.staff_id = parseInt(this.goodsModalData.staff_id);
      }

      if (token) {
        this.cart_id = "";
        wx.removeStorageSync("cart_id");
        params.cart_type = 0;
        params.hander_type = 1; //添加
        params.quantity = this.cartNum; //数量
        params.sku = this.goodssku;
        // params ={
        //     "cart_type": 0, //普通商品
        //     "hander_type": 1,//添加
        //     "quantity": this.cartNum, //数量
        //     "sku": this.goodssku
        // }
      } else {
        if (this.cart_id) {
          params.cart_type = 0;
          params.hander_type = 1; //添加
          params.quantity = this.cartNum; //数量
          params.sku = this.goodssku;
          params.cart_id = this.cart_id;
          // params ={
          //     "cart_id": this.cart_id, //购物车id
          //     "cart_type": 0, //普通商品
          //     "hander_type": 1,//添加
          //     "quantity": this.cartNum, //数量
          //     "sku": this.goodssku
          // }
        } else {
          params.cart_type = 0;
          params.hander_type = 1; //添加
          params.quantity = this.cartNum; //数量
          params.sku = this.goodssku;
          // params ={
          //     "cart_type": 0, //普通商品
          //     "hander_type": 1,//添加
          //     "quantity": this.cartNum, //数量
          //     "sku": this.goodssku,
          // }
        }
      }
      // console.log(params, "分销导购");
      addshoppingcart(params).then(res => {
        if (!this.tokenID) {
          //未登录,获取购物车ID
          if (!this.cart_id) {
            //没有 购物车ID
            wx.setStorageSync("cart_id", res.cart_id);
            this.cart_id = res.cart_id;
          }
        }
        // wx.showToast({ title: "添加购物车成功", icon: 'none' })
        that.$emit("funcCartNum");
        that.$emit("funcAppsens");
        setTimeout(function() {
          that.$emit("closeModall", "cart");
        }, 1000);
      });
    },
    closeModal() {
      this.$emit("closeModall");
    },
    closeM() {
      this.$emit("closeM");
    },
    createPoster() {
      //生成海报
      if (!this.QRfinish) {
        return;
      }
      // this.CachgoodsImg();
      //    this.userTopImg = this.userTopImg?this.userTopImg:'/static/goodsdetail/default_pic_user.png'
      //    let QRcodeIMG = wx.getStorageSync('QRcodeIMG')
      wx.showLoading({ title: "图片生成中..." });
      let scale = wx.getSystemInfoSync().windowWidth / 750;
      let username = wx.getStorageSync("userinfo").nick_name || "乐友用户";
      // let userImg = '/static/goodsdetail/product_guide_change.png'
      this.goodsModalData.sharepage = false;
      let that = this;
      let letyou = "/static/goodsdetail/leyou.png";
      let width = 750,
        height = 903,
        Toptitle = "发现好货";
      let goodsImg = this.goodsImg; //商品图片
      let goodsNameT = this.goodsModalData.goodsName;
      let context = wx.createCanvasContext("shareCanvas");
      context.setFillStyle("#FFFFFF");
      context.fillRect(0, 0, width * scale, height * scale);
      context.setFillStyle("#000000");
      context.setFontSize(30 * scale);
      context.fillText(Toptitle, 315 * scale, 54 * scale); //标题
      context.drawImage(
        letyou,
        300 * scale,
        84 * scale,
        150 * scale,
        44 * scale
      ); //绘制logo
      context.drawImage(
        goodsImg,
        125 * scale,
        134 * scale,
        500 * scale,
        500 * scale
      ); //绘制商品图片
      context.setFillStyle("#333333");
      context.setFontSize(26 * scale);
      if (goodsNameT.length > 12) {
        //绘制商品详情(2行)
        context.fillText(goodsNameT.substring(0, 12), 125 * scale, 684 * scale);
        context.fillText(
          goodsNameT.substring(13, 26) + "...",
          125 * scale,
          717 * scale
        );
      } else {
        //(1行)
        context.fillText(goodsNameT, 125 * scale, 684 * scale);
      }
      context.drawImage(
        this.userTopImg,
        125 * scale,
        764 * scale,
        60 * scale,
        60 * scale
      ); //绘制头像
      context.setFillStyle("#333333");
      context.setFontSize(26 * scale);
      context.fillText(username, 205 * scale, 804 * scale); //名字
      if (that.QRcodeIMG) {
        context.drawImage(
          that.QRcodeIMG,
          485 * scale,
          654 * scale,
          280 * scale,
          280 * scale
        );
      }
      context.setFillStyle("#999999");
      context.setFontSize(20 * scale);
      context.fillText("长按识别二维码", 489 * scale, 835 * scale); //标题

      context.draw(false, function() {
        setTimeout(function() {
          //延时缓存避免部分安卓手机canvas绘图串色
          that.tempPoster(
            that,
            "shareCanvas",
            width * scale,
            height * scale,
            750,
            903
          );
        }, 1000);
      });
    },
    holdposter() {
      //保存图片
      let that = this;
      wx.getSetting({
        success(res) {
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            wx.authorize({
              scope: "scope.writePhotosAlbum",
              success() {
                //这里是用户同意授权后的回调
                wx.showToast({
                  title: "保存中...",
                  icon: "none"
                });
                that.save(that);
              },
              fail() {
                //这里是用户拒绝授权后的回调
                wx.showToast({
                  title: "授权后才能保存至手机相册",
                  icon: "none"
                });
                that.setData({
                  btnShow: "authorize"
                });
                return;
              }
            });
          } else {
            //用户已经授权
            wx.showToast({
              title: "保存中...",
              icon: "none"
            });
            that.save(that);
          }
        }
      });
    },
    save(obj) {
      //保存图片到相册
      let that = obj;
      if (!that.canvasUrl) {
        return;
      }
      wx.saveImageToPhotosAlbum({
        filePath: that.canvasUrl,
        success(res) {
          wx.showToast({
            title: "保存成功",
            icon: "none"
          });
          that.giveposter = false;
          that.$emit("closeModall");
        }
      });
    },
    closePoster() {
      this.giveposter = false;
      this.$emit("closeModall");
    },
    //缓存成图片
    tempPoster(obj, id, width, height, destWidth, destHeight) {
      let that = obj;
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: width,
        height: height,
        destWidth: destWidth,
        destHeight: destHeight,
        fileType: "jpg",
        canvasId: id,
        success: function(res) {
          that.canvasUrl = res.tempFilePath;
          that.giveposter = true; //海报页面
          wx.hideLoading();
        }
      });
    }
  }
};
</script>
<style scoped>
.disabledccc {
  color: #cccccc !important;
  border: 1rpx solid #ccc !important;
}

.btn {
  border: none !important;
  color: #333333;
  border-radius: 0;
  background: #fff;
}
button::after {
  border: none;
}
.sharetext {
  font-size: 28rpx;
  color: #333;
  height: 34rpx;
  line-height: 34rpx;
}
#shareCanvas {
  width: 750rpx;
  height: 903rpx;
  position: fixed;
  top: 5000rpx;
}
#qrcodeN {
  position: fixed;
  top: 5000rpx;
  width: 280rpx;
  height: 280rpx;
}
/* 绘制海报 */
.posterPhoto {
  width: 750rpx;
  height: 1000rpx;
}
.posterPhoto .posterImg {
  height: 903rpx;
  width: 750rpx;
}
.posterPhoto .holdposter {
  height: 97rpx;
  width: 100%;
  background: #ff5000;
  color: #ffffff;
  font-size: 30rpx;
  text-align: center;
  line-height: 97rpx;
}
/* 分享给好友 */
.sharePER {
  display: flex;
  font-size: 26px;
  color: #333333;
}
.sharePER .sharePER_box {
  display: flex;
  flex-direction: column;
  width: 375rpx;
  height: 100%;
  text-align: center;
  align-items: center;
  margin-top: 20rpx;
}
.sharePER .sharePER_box .shareimg {
  height: 88rpx;
  width: 88rpx;
  margin-bottom: 15rpx;
}
.shareClose {
  height: 40rpx;
  width: 40rpx;
  position: absolute;
  bottom: 40rpx;
  left: 355rpx;
}
/* 商品选择尺码类型 */
.goodsSizeType {
  font-family: PingFangSC-Regular;
  font-size: 26px;
  color: #999999;
  letter-spacing: 0;
  line-height: 28px;
  margin-top: 20rpx;
}
.goodsSizeType .goodsSizType_name {
  margin-top: 40rpx;
  margin-left: 20rpx;
  margin-bottom: 20rpx;
}
.goodsSizeType_content {
  display: flex;
  flex-wrap: wrap;
}
.gstcon_Txt {
  background: #ffffff;
  border: 1px solid #999999;
  border-radius: 30px;
  margin-left: 20rpx;
  margin-bottom: 20rpx;
  text-align: center;
  width: 160rpx;
  height: 48rpx;
  line-height: 48rpx;
  color: #333333;
}
.goodsActive {
  background: #ff5000;
  border: 1px solid #ff5000;
  color: #ffffff;
}
.goodsNo_Active {
  border: 1px solid #dddddd;
  color: #cccccc;
}
/* 商品选择尺码 */
.goodsSize {
  /* height: 800rpx;
        width: 750rpx; */
  background: #ffffff;
  display: flex;
  height: 110rpx;
}
.goodsSize .goodsSizephoto {
  position: relative;
  height: 112rpx;
  width: 210rpx;
}
.goodsSizephoto_imgBOX {
  overflow: hidden;
  position: absolute;
  bottom: -4rpx;
  left: 18rpx;
  border-radius: 20rpx;
  height: 175rpx;
  width: 175rpx;
  background: #ffffff;
}
.goodsSizephoto_img {
  overflow: hidden;
  border-radius: 20rpx;
  position: absolute;
  bottom: 7.5rpx;
  left: 9rpx;
  height: 160rpx;
  width: 160rpx;
}
.goodsSizeContent {
  position: relative;
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #ff5000;
  letter-spacing: 0;
  line-height: 28px;
  margin-top: 20rpx;
  height: 80rpx;
  width: 510rpx;
}
.goodsSizeContent .goodsSize2 {
  font-size: 34rpx;
}
.goodsSizeContent .goodsSize4 {
  font-size: 34rpx;
  font-size: 22rpx;
  color: #cacaca;
  text-decoration: line-through;
}
.goodsSizeContent .goodsSize5 {
  font-family: PingFangSC-Regular;
  margin-left: 20rpx;
  font-size: 22rpx;
  color: #666666;
}
.goodsSizeContent .goodsSize6 {
  font-family: PingFangSC-Regular;
  font-size: 26px;
  color: #151515;
}
.goodsSizeContent .goodsSize7 {
  /* margin-left: 55rpx; */
  font-family: PingFangSC-Regular;
  font-size: 26px;
  color: #ff5000;
}
.goodsSizeIMG_close {
  width: 44rpx;
  height: 44rpx;
  position: absolute;
  top: -5rpx;
  right: -10rpx;
}
.goodsSizeIMG_VIP {
  width: 40rpx;
  height: 22rpx;
  position: absolute;
  bottom: 2rpx;
  left: 135rpx;
}
.goodsSizeNum {
  display: flex;
  align-items: center;
  font-size: 26px;
  color: #999999;
  width: 710rpx;
  margin-left: 20rpx;
}
.goodsSizeNum .gstitle {
  width: 530rpx;
}
.goodsSizeNum .reduce {
  /* background: #EEEEEE; */
  border-radius: 2px;
  height: 46rpx;
  width: 46rpx;
  line-height: 46rpx;
  text-align: center;
  color: #333;
}
.goodsSizeNum .goods-num {
  background: #f6f6f6;
  border-radius: 4px;
  height: 46rpx;
  width: 80rpx;
  text-align: center;
  line-height: 46rpx;
  color: #333;
}
.goodsSizeNum .add {
  color: #333;
  height: 46rpx;
  width: 46rpx;
  line-height: 46rpx;
  text-align: center;
  /* background: #EEEEEE; */
}
.disabled {
  pointer-events: none;
  background: #cacaca !important;
}
.goodsSizeconfirm {
  height: 97rpx;
  width: 100%;
  background: #fff;
  font-size: 30px;
  color: #ffffff;
  text-align: center;
  line-height: 97rpx;
  margin-top: 30rpx;
}
.fixed {
  position: absolute;
  bottom: 0rpx;
  width: 100%;
}
/* 优惠卷列表 */
.couponHeight {
  height: 800rpx !important;
}
.gmDD_content {
  display: flex;
  width: 708rpx;
  height: 175rpx;
  position: relative;
  background: #ffffff;
  border-radius: 8px 8px 0 0;
  border: 2rpx solid RGBA(255, 201, 181, 0.4);
  margin-top: 24rpx;
  /* overflow: hidden; */
}
.gmDD_topImg {
  width: 710rpx;
  height: 175rpx;
  position: absolute;
  top: 0;
  bottom: 0;
}
.gmDD_content .gmDD_content_r {
  width: 180rpx;
  text-align: center;
  line-height: 56rpx;
  margin-top: 38rpx;
  z-index: 10;
}
.gmDD_content .gmDD_content_z {
  margin-top: 25rpx;
  width: 360rpx;
  font-size: 24rpx;
  color: #333333;
  font-size: 24rpx;
  line-height: 36rpx;
  margin-left: 18rpx;
  padding-bottom: 20rpx;
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
  /* display: -webkit-box; */
  /* -webkit-line-clamp: 4; */
  /* -webkit-box-orient: vertical; */
  z-index: 99;
}
.gmDD_content .gmDD_content_l {
  width: 120rpx;
  display: flex;
  flex-direction: column;
  font-size: 20rpx;
  color: #ff5000;
  text-align: center;
  background: #ffffff;
  margin-left: 20rpx;
  margin-top: 37rpx;
  z-index: 99;
  height: 130rpx;
  /* overflow: hidden; */
}
.gmDD_content .couponstate {
  width: 100rpx;
  height: 100rpx;
}

.gmDD_content_l_receive {
  border: 1px solid #ff5000;
  border-radius: 40rpx;
  height: 44rpx;
  line-height: 44rpx;
  width: 112rpx;
  margin-top: 15rpx;
}
.gmDD_content_r_price {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  justify-content: center;
}
.gmDD_content_r_price_sign {
  font-size: 32rpx;
  color: #ff5000;
  vertical-align: middle;
}
.gmDD_content_r_price_val {
  font-size: 66rpx;
  color: #ff5000;
  vertical-align: middle;
}
.gmDD_content_r_price_rule {
  font-size: 24px;
  color: #ff5000;
  line-height: 24px;
}
.gmD_detailed {
  margin-left: 20rpx;
}
.gmDDName {
  display: block;
  margin-top: 40rpx;
  font-size: 26px;
  line-height: 28rpx;
}
.gmDiscount_title {
  display: flex;
  padding: 0 45px;
  justify-content: space-around;
  height: 64rpx;
}
.gmDiscount_tab {
  padding: 11px 0;
  width: 160px;
  line-height: 42px;
  text-align: center;
}
.gmDiscount_title .active {
  color: #ff5000;
  border-bottom: 2px #ff5000 solid;
}
/* 闪送到位置 */
.activeAddress {
  /* color: #FF5000; */
}
.goodsfastAddress {
  display: flex;
  align-items: center;
  margin-left: 20rpx;
  margin-top: 33rpx;
  border-bottom: 1rpx solid #eeeeee;
  padding-bottom: 25rpx;
}
.goodsfastAddress .goodsfastAddress_content {
  width: 620rpx;
  /* font-family: PingFangSC-Medium; */
  font-size: 26px;
}
.goodsfastAddress .fastimg {
  width: 36rpx;
  height: 36rpx;
  margin-left: 40rpx;
}
.goodsfastAddress .goodsfastAddress_img {
  height: 36rpx;
  width: 36rpx;
  margin-left: 54rpx;
}
.goodsfastAddressNull {
  margin-top: 148rpx;
  height: 616rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.goodsfastAddressNull .goodsfastAddressNull_img {
  width: 242rpx;
  height: 200rpx;
}
.gfan_content {
  margin-top: 40rpx;
  color: #999999;
  text-align: center;
  line-height: 40px;
}
/* 闪送 */
.goodsfast {
  display: flex;
  font-size: 26px;
  color: #333333;
  margin: 28rpx 0;
}
.goodsfast .goodsfast_index {
  text-align: center;
  width: 32rpx;
  height: 32rpx;
  border: 1px solid #ff5000;
  border-radius: 50%;
  margin: 5rpx 25rpx;
  line-height: 32rpx;
  color: #ff5000;
}
.goodsfast .goodsfast_content {
  width: 630rpx;
}
.addAddress {
  height: 97rpx;
  width: 750rpx;
  background: #ff5000;
  font-size: 30px;
  color: #ffffff;
  text-align: center;
  line-height: 97rpx;
}
.flexadd {
  position: fixed;
  bottom: 0rpx;
}
/*  运费模态框  */
.goodsfreight {
  margin-left: 20rpx;
  min-height: 118rpx;
  display: flex;
  flex-direction: column;
  font-size: 26px;
  border-bottom: solid 1rpx #eeeeee;
}
.goodsfreight .gf_name {
  color: #ff5000;
  margin-top: 28rpx;
}
.goodsfreight .gf_content {
  margin-top: 12rpx;
  padding-bottom: 28rpx;
  line-height: 36rpx;
}
/* 促销模态框 */
.img {
  width: 16rpx;
  height: 26rpx;
  margin-top: 3rpx;
  /* margin-left: 40rpx; */
}
.goodsModal {
  height: 600rpx;
  width: 750rpx;
  background: #ffffff;
  position: relative;
  z-index: 9999;
}
.goodsModal_title {
  position: relative;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 30rpx;
  text-align: center;
}
.tpcontent_img {
  position: absolute;
  width: 39rpx;
  height: 39rpx;
  bottom: 28rpx;
  right: 25rpx;
}
.goodsModal_conten {
  /* min-height: 70rpx; */
  display: flex;
  align-items: center;
  margin-left: 12rpx;
  padding-bottom: 28rpx;
  padding-top: 20rpx;
  border-bottom: 1rpx solid #f3f5f7;
  width: 726rpx;
}
.content_r_box {
  display: flex;
  justify-content: center;
  width: 120rpx;
}

.goodsModal_conten .content_r {
  text-align: center;
  background: #ffffff;
  border: 1rpx solid #ff5000;
  border-radius: 20rpx;
  height: 28rpx;
  padding: 2rpx 15rpx;
  font-size: 21rpx;
  color: #ff5000;
}
.goodsModal_conten .content_l {
  margin-left: 15rpx;
  font-size: 26rpx;
  line-height: 36rpx;
  width: 520rpx;
}
/* 最外层的盒子 */
.goodsModalBOX {
  font-family: PingFangSC-Regular;
  font-size: 30px;
  color: #333333;
  letter-spacing: 0;
}

.iPhone {
  height: 166rpx;
}
</style>
