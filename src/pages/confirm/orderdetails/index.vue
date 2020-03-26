<template>
  <div class="orderdelBox" v-if="is_show_data">
    <!-- <movable-area style="height: 2000rpx ;width: 750rpx;"> -->
      <!-- order_status 订单状态码 5为已经取消  -->
      <!-- 顶部 1，待支付 -->
      <div v-if="orderData.order_type == 5 && orderData.order_status != 1">
        <!-- 闪送订单1 -->
        <div
          :class="['orderHeader','shansongbox',{'leshansongorder':leshansongShowArrivalTime}]"
          v-if="orderData.order_status==2 || orderData.order_status==5"
        >
          <img class="headerimg" style="margin-top:34rpx;" src="../images/userorder_icon_twohr.png">
          <div class="shansong" style="margin-top:34rpx;width: 100%;">
            <div
              v-if="leshansongShowArrivalTime"
              style="display:flex;justify-content: space-between;align-items: center;"
            >
              <span class="headertext">{{leshansongname}}</span>
              <span style="color:#fff;font-size:26rpx; margin-right: 20rpx">{{leshansongdesc}}</span>
            </div>
            <div v-else style="display:flex;flex-direction:column">
              <span class="headertext">{{leshansongname}}</span>
              <span
                v-if="leshansongdesc && leshansongdesc != ''"
                class="headertext"
                style="font-size:30rpx; margin-top:13rpx;"
              >{{leshansongdesc}}</span>
            </div>
          </div>
          <!-- <span
            v-if="orderData.leyou_flash && orderData.leyou_flash.desc"
            class="headertext"
            style="font-size:30rpx; margin-top:13rpx;"
          >{{orderData.leyou_flash.desc}}</span>
          </div>-->
        </div>
        <!-- style="margin-top:34rpx;  style="margin-top:34rpx;-->
        <div
          v-else
          class="orderHeader shansongbox"
          style="height:100rpx !important; display:flex;align-items:center"
        >
          <img class="headerimg" src="../images/userorder_icon_twohr.png">
          <div class="shansong">
            <span
              class="headertext"
              style="font-family: PingFangSC-Medium;font-size: 34rpx;color: #FFFFFF;"
            >{{leshansongname}}</span>
          </div>
        </div>

        <div class="deliverBox public" v-if="logisticsShow" @click="gotoGsLocation">
          <img class="headerimg" src="../images/cart.png">
          <div class="public deliverinfo">
            <span class="deliverinfoTxt">{{logisticsInfo.ope_remark || logisticsInfo.desc}}</span>
            <span class="deliverTime">{{logisticsInfo.ope_time || logisticsInfo.time}}</span>
          </div>
          <img class="deliverTriangle" src="/static/goodsdetail/lecard_arrow_right.png" alt>
        </div>
        <!-- </div> -->

        <!-- <div class="orderHeader shansongbox" v-if="orderData.freight_type=='ms'">
        <img class="headerimg" style="margin-top:34rpx;" src="../images/userorder_icon_twohr.png">
        <div class="shansong" style="margin-top:34rpx;">
          <span class="headertext">{{orderData.status_desc}}</span>
          <span
            class="headertext"
            style="font-size:30rpx; margin-top:13rpx;"
          >{{orderData.order_submit_time}}</span>
        </div>
        </div>-->
      </div>
      <div v-else>
        <div class="orderHeader public" v-if="orderData.order_status==1">
          <img class="headerimg" src="../images/headerplay.png" alt>
          <span class="headertext">{{orderData.status_desc}}</span>
          <span v-if="orderData.left_pay_time == '0' " class="headerClose">订单超时未支付,已为您取消</span>
          <!-- <template v-if="orderData.left_pay_time!='0'"> -->
          <div class="headerTime" style="display:flex;align-items:center" v-if="orderData.left_pay_time!='0'">
            <span style="font-size: 26rpx;color: #ffffff;margin-left:20rpx;margin-right:10rpx">剩</span>
            <counttime :skillNum="3" :endTime="orderData.left_pay_time"></counttime>
          </div>
          <span class="headerClose" v-if="orderData.left_pay_time!='0'">后自动关闭</span>
          <!-- <template> -->
        </div>
        <!-- 顶部2，待收货 order_status==2  -->
        <div class="orderHeader public" v-if="orderData.order_status==2&&!orderData.is_oto">
          <img class="headerimg" src="../images/dengdaisong.png" alt>
          <span class="headertext">{{orderData.status_desc}}</span>
        </div>

        <!-- 顶部 3，交易完成 -->
        <div class="orderHeader public" v-if=" !orderData.is_oto && orderData.order_status==3">
          <img class="headerimg" src="../images/finish.png" alt>
          <span class="headertext">{{orderData.status_desc}}</span>
        </div>

        <!-- 顶部 3，邮寄交易完成 -->
        <div class="orderHeader public" v-if="!orderData.is_oto && orderData.order_status==4">
          <img class="headerimg" src="../images/finish.png" alt>
          <span class="headertext">{{orderData.status_desc}}</span>
        </div>

        <!-- 顶部 3，交易取消 -->
        <div class="orderHeader public" v-if="orderData.order_status==5&&!orderData.is_oto">
          <img class="headerimg" src="../images/cancel.png" alt>
          <span class="headertext">{{orderData.status_desc}}</span>
        </div>

        <!-- 待收货自提 -->
        <template v-if="orderData.is_oto&&orderData.oto_detail && orderData.oto_detail.detail_sn">
          <div class="orderHeader public justifyCon">
            <div class="public">
              <img class="headerimg" src="../images/store.png" alt>
              <span class="headertext">{{orderData.status_desc}}</span>
            </div>
            <div class="public" style="margin-right:20rpx;">
              <span class="font30">提货码:</span>
              <span
                class="upgoods"
                v-for="(item,index) in orderData.oto_detail.detail"
                :key="index"
              >{{item}}</span>
            </div>
          </div>
          <div class="pickup">
            <canvas class="canvas" canvas-id="goodsCode"></canvas>
            <span class="pickupText">可以展示给导购~验证条形码~不再排队！</span>
          </div>
        </template>
        <!-- 自提已经取消 -->
        <template v-if="orderData.is_oto&&orderData.order_status==5">
          <div class="orderHeader public">
            <img class="headerimg" src="../images/store.png" alt>
            <span class="headertext">门店自提</span>
          </div>
        </template>
        <!-- 待取货交易完成 -->
        <template v-if="orderData.is_oto&&orderData.order_status==3">
          <div class="orderHeader public">
            <img class="headerimg" src="../images/store.png" alt>
            <span class="headertext">门店自提</span>
          </div>
        </template>

        <!-- 物流地址 -->
        <div class="deliverBox public" v-if="logisticsShow" @click="gotoGsLocation">
          <img class="headerimg" src="../images/cart.png">
          <div class="public deliverinfo">
            <span class="deliverinfoTxt">{{logisticsInfo.ope_remark || logisticsInfo.desc}}</span>
            <span class="deliverTime">{{logisticsInfo.ope_time || logisticsInfo.time}}</span>
          </div>
          <img class="deliverTriangle" src="/static/goodsdetail/lecard_arrow_right.png" alt>
        </div>
      </div>

      <!-- 地址信息 -->
      <div class="addressBox public">
        <img class="headerimg addressimg" src="../images/location.png">
        <div>
          <div class="usreInfo">
            <span>{{orderData.order_receiver_name}}</span>
            <span style="padding-left:60rpx">{{orderData.mobile}}</span>
          </div>
          <div class="arrdessinfo">{{orderData.order_receiver_address}}</div>
        </div>
      </div>

      <!-- 全球购，乐商城 -->
      <div v-if="is_online == 0">
        <div class="public Globalgoods">
          <span class="globalTxt">门店订单</span>
          <div v-if="orderData.ext_type == 'H' || orderData.ext_type == 'G'">
            <img class="globalwarnImg" src="../images/zhanshiyong.png" alt>
            <span class="globalwarn">不支持7天无理由退货</span>
          </div>
        </div>
        <div
          @click.stop="funcGotoDeatil(item)"
          class="public Boughtgoods"
          v-for="(item,index) in orderData.order_products"
          :key=" index"
        >
          <img class="goodsImg" :src="item.le_append_image">
          <div class="goodsInfo">
            <span class="goodsName">{{item.marketing_title}}</span>
            <div v-if="item.stylecode" style="color:#333333;font-size:22rpx;margin-top:4rpx;">
              <span v-if="item.color">颜色：{{item.color + ' '}}</span>
              <span v-if="item.specifications">尺码：{{item.specifications}}</span>
            </div>
            <div class="priceNum">
              <span class="goodsPrice">¥{{item.sale_price}}</span>
              <span class="goodsnum">x{{item.quantity}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="public Globalgoods">
          <span class="globalTxt">{{orderData.ext_desc}}</span>
          <div v-if="orderData.ext_type == 'H' || orderData.ext_type == 'G'">
            <img class="globalwarnImg" src="../images/zhanshiyong.png" alt>
            <span class="globalwarn">不支持7天无理由退货</span>
          </div>
        </div>
        <!-- 全球购的上商品 -->
        <div
          @click.stop="funcGotoDeatil(item)"
          v-for="(item,index) in orderData.order_products"
          :key=" index"
        >
          <div class="public Boughtgoods">
            <img class="goodsImg" :src="item.le_append_image">
            <div class="goodsInfo">
              <span v-if="item.product_title" class="goodsName">{{item.product_title}}</span>
              <span v-else class="goodsName">{{item.marketing_title}}</span>
              <div v-if="item.stylecode" style="color:#333333;font-size:22rpx;margin-top:4rpx;">
                <span v-if="item.color">颜色：{{item.color + ' '}}</span>
                <span v-if="item.specifications">尺码：{{item.specifications}}</span>
              </div>
              <div class="priceNum">
                <span class="goodsPrice">¥{{item.sale_price}}</span>
                <span class="goodsnum">x{{item.quantity}}</span>
              </div>
            </div>
          </div>
          <div v-if="item.aftermarket" class="after_bg">
            <div class="after_button" @click.stop="afterClick(item)">申请售后</div>
          </div>
        </div>
      </div>

      <!-- 订单编号 -->
      <div v-if="is_online == 0" style="padding:0 20rpx">
        <div class="public orderinfo">
          <div>
            <span class="NumberText">订单编号：</span>
            <span class="NumberTime">{{order_id}}</span>
          </div>
          <span class="copy" @click="copyBtn">复制</span>
        </div>
      </div>
      <div v-else class="orderNumber">
        <div class="public orderinfo">
          <div>
            <span class="NumberText">订单编号：</span>
            <span class="NumberTime">{{order_id}}</span>
          </div>
          <span class="copy" @click="copyBtn">复制</span>
        </div>
        <div v-if="is_online != 0">
          <span class="NumberText">下单时间：</span>
          <span class="NumberTime">{{format_time}}</span>
        </div>
      </div>
      <!-- 微信支付 -->
      <div class="wxmode" v-if="is_online != 0">
        <span class="NumberText">支付方式：</span>
        <span class="NumberTime">{{orderData.order_paid_way||'网上支付'}}</span>
      </div>

      <!-- 不开发票 -->
      <div v-if="is_online != 0">
        <template v-if="orderData.invoice_type==0">
          <div class="wxmode" v-if="orderData.ext_type == 'H' || orderData.ext_type == 'G'">
            <span class="NumberText">海淘商品不支持开具发票</span>
            <!-- <span class="NumberTime">不开发票</span> -->
          </div>
          <div class="wxmode" v-else>
            <span class="NumberText">发票类型：</span>
            <span class="NumberTime">不开发票</span>
          </div>
        </template>
        <template v-else-if="orderData.invoice_type==1">
          <div class="wxmode">
            <span class="NumberText">发票：</span>
            <span class="NumberTime">如需纸质发票,请联系门店工作人员</span>
          </div>
        </template>
        <template v-else>
          <div class="receiptInfo">
            <div class="div">
              <span class="NumberText">发票类型：</span>
              <span class="NumberTime">电子发票</span>
            </div>
            <div class="div" v-if="orderData.invoice_title">
              <span class="NumberText">发票抬头：</span>
              <span class="NumberTime">{{orderData.invoice_title}}</span>
            </div>
            <div class="div" v-if="orderData.invoice_content">
              <span class="NumberText">发票内容：</span>
              <span class="NumberTime">{{orderData.invoice_content}}</span>
            </div>
            <div class="div" v-if="orderData.invoice_num">
              <span class="NumberText">纳税人识别号：</span>
              <span class="NumberTime">{{orderData.invoice_num}}</span>
            </div>
            <!-- <div class="div" v-if="orderData.invoice_telephone">
                    <span class="NumberText">电话：</span>
                    <span class="NumberTime">{{orderData.invoice_telephone}}</span>
                </div>
                <div class="div" v-if="orderData.invoice_address">
                    <span class="NumberText">地址：</span>
                    <span class="NumberTime">{{orderData.invoice_address}}</span>
                </div>
                <div class="div" v-if="orderData.invoice_bank">
                    <span class="NumberText">开户银行：</span>
                    <span class="NumberTime">{{orderData.invoice_bank}}</span>
                </div>
                <div class="div" v-if="orderData.invoice_bank_account">
                    <span class="NumberText">银行账号：</span>
                    <span class="NumberTime">{{orderData.invoice_bank_account}}</span>
            </div>-->
            <div
              class="location"
              v-if="orderData.order_status!=5 && orderData.order_status!=1"
              @click.stop="downinvoice"
            >
              <img class="locationImg" src="../images/download.png">
              <span class="locationTxt">查看发票</span>
            </div>
          </div>
        </template>
      </div>
      <!-- 发票信息 -->

      <!-- 金额信息 -->
      <div class="moneyInfo" v-if="is_online != 0">
        <div class="moneysum" v-for="(item,index) in total_price_array" :key="index">
          <span class="NumberText">{{item.name}}</span>
          <span class="NumberText">¥{{item.value}}</span>
        </div>
      </div>
      <!-- 实付金额 -->
      <div class="wxmode payMoney">
        <span class="NumberMode">{{order_total_title}}</span>
        <span class="NumberMoney">¥{{order_total_fee}}</span>
      </div>
      <!-- 点击订单状态 -->
      <div class="button_bg">
        <!-- <div class="button_bg_left" @click.stop="funConactKefu">联系客服</div> -->
        <div></div>
        <div class="payAndcancel">
          <span
            :class="['pay',{'cancel':item.num=='0002' || item.num=='0006'}]"
            v-for="(item,index) in orderarr"
            :key="index"
            @click.stop="orderstatusALL(item.num)"
          >{{item.name}}</span>
        </div>
      </div>
      <!-- <div class="share_red_bg"> -->
      <div class="share_red_bg" v-if="orderData.share_vo&& orderData.share_vo.enable">

      <!-- <movable-view direction="all" class="share_red_bg" style="width:132rpx;height:124rpx;"> -->
        <!-- <div class="share_red_bg"> -->
        <button class="share_red_bg_button" open-type="share">
          <img src="../images/public_float_share.png" style="width:132rpx;height:124rpx;">
        </button>
        </div>
      <!-- </movable-view> -->

      <!-- </div> -->
      <!-- </div> -->
      <cover-view class="drawer_cover" v-if='ModalShow'  @click="closeModal"></cover-view>
      <!-- <div class="drawer_screen" v-if="ModalShow" @click="closeModal"></div> -->
        <cover-view class="ModalShow" v-if="ModalShow">
            <cover-view class="modulecencancel" @click.stop="storeCancel">
              <cover-view class="dispalyFlex">
                <cover-image class="module_img" src="../images/dianli.png"></cover-image>
                <cover-view class="font333">门店极速退货</cover-view>
              </cover-view>
              <cover-view class="font26">带着商品到原门店，现场办理退货</cover-view>
            </cover-view>
            <cover-view style="width:100%; height:2rpx; background:#f3f5f7"></cover-view>
            <cover-view class="modulecencancel module_sponsor_box">
              <cover-view class="goodsInfo">
                <cover-view class="dispalyFlex">
                  <cover-image class="module_img" src="../images/xianshang.png"></cover-image>
                  <cover-view class="font333">线上自助退货</cover-view>
                </cover-view>
                <cover-view class="font26">线上申请，进度实时查询，预计2-7天完成</cover-view>
              </cover-view>
              <cover-view class="module_sponsor" @click.stop="gotoPutInFor">发起申请</cover-view>
            </cover-view>
        </cover-view>

    <!-- </movable-area> -->
  </div>
</template>
<script>
import { requestPayment } from '@/utils/pay/cil_minipay.sdk.js';
import { mapMutations } from "vuex";
import { creatBarcode } from "@/utils";
import counttime from "@/components/public/countdown";
import {
  getMyorderdel,
  getSuccessOrder,
  orderCancle,
  synAllShoppingCart,
  userGetPayInfomaiton,
  userGetXlzfInfomaiton,
  userGetXlzfFinishInfomaiton,
  orderAccept,
  downloadInvoice
} from "@/api";
import { compare } from "@/utils/index";
import { EventBus } from "@/bus/event-bus.js";
export default {
  components: {
    counttime
  },
  data() {
    return {
      orderarr: [], //存储订单状态
      is_show_data: false,
      orderstatus: [
        //订单可执行状态
        { num: "0001", name: "去支付" },
        { num: "0002", name: "取消订单" },
        // {num:'0003',name:'查看物流'},
        { num: "0004", name: "再次购买" },
        { num: "0005", name: "去评价" },
        { num: "0006", name: "申请售后" },
        { num: "0007", name: "确认收货" }
      ],
      ModalShow: false, //模态框
      options: null, //传递过来的值
      orderData: {},
      order_id: null, //订单编号
      order_total_fee: null, //实付金额
      order_total_title: "",
      urlImage: null, //图片路径地址
      logisticsInfo: {}, //物流信息
      logisticsShow: false, //是否显示物流
      is_online: 1,
      leshansongname: "",
      leshansongdesc: "",
      leshansongShowArrivalTime: false
    };
  },
  computed: {
    total_price_array() {
      let price_array = [];
      if (this.orderData.payment_details) {
        this.orderData.payment_details.map((items, index) => {
          if (index != 0) {
            price_array.push(items);
          }
        });
      }
      return price_array;
    },

    format_time() {
      let time = "";
      if (this.orderData.order_submit_time) {
        //   let date = new Date(this.orderData.order_submit_time);
        //   let Y = date.getFullYear() + "-";
        //   let M =
        //     (date.getMonth() + 1 < 10
        //       ? "0" + (date.getMonth() + 1)
        //       : date.getMonth() + 1) + "-";
        //   let D = date.getDate() + " ";
        //   let h = date.getHours() + ':';
        //   let m = date.getMinutes();
        //   if (m < 10) {
        //     m = '0' + m + ':';
        //   } else {
        //     m = m + ':';
        //   }
        //   let s = date.getSeconds();
        //   if (s < 10) {
        //     s = '0' + s;
        //   } else {
        //     s = s;
        //   }
        //   time = Y + M + D + h + m + s; //呀麻碟
        time = this.orderData.order_submit_time;
      }
      return time;
    }
  },
  onLoad(options) {
    this.funcClearData();
    this.options = options;
    this.sa_page(this,false,'订单详情','');
    let appInfo = wx.getStorageSync("appInfo");
    this.urlImage = appInfo.download_le_image;
    /** 1，未付款用流水 funorderdel
     *   2，已付款用订单
     */
    this.is_online = parseInt(options.is_online);
    wx.showLoading({ title: "加载中", mask: true });
    if (this.is_online == 0) {
      // 门店订单 按订单查询 传入流水
      let params = { serial_num: options.serial_num };
      this.funSuccessOrder(params);
    } else {
      if (parseInt(options.query_serial) == 0) {
        //支付完成
        let params = { order_id: options.order_id };
        this.funSuccessOrder(params);
      } else if (parseInt(options.query_serial) == 1) {
        //未支付,取消订单
        this.funorderdel(options.serial_num);
      }
    }
  },

  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      let link = encodeURIComponent(this.orderData.share_vo.share_link);
      let share_info = {
        title: this.orderData.share_vo.share_title,
        imageUrl: this.orderData.share_vo.share_image_url,
        path: "/pages/transferH5/main?url=" + link
      };
      return share_info;
    }
  },

  methods: {
    funcClearData() {
      this.is_show_data = false;
      this.orderData = {};
      this.order_total_title = "";
      this.order_total_fee = null; //实付金额
      this.urlImage = null; //图片路径地址
      this.logisticsInfo = {}; //物流信息
      this.logisticsShow = false; //是否显示物流
      this.leshansongname = "";
      this.leshansongdesc = "";
      this.leshansongShowArrivalTime = false;
      this.ModalShow = false;
    },

    funorderdel(serialNum) {
      //订单详情(流水号 为付款)
      let that = this;
      let orderarrList = [];
      let params = { serial_num: serialNum };
      getMyorderdel(params).then(res => {
        wx.hideLoading();
        this.is_show_data = true;

        if (this.is_online == 0) {
          //  门店订单
          this.order_id = res.serial_num;
          this.order_total_title = "应付款"; //标题
          this.order_total_fee = res.order_total_fee; //付款金额
        } else {
          this.order_id = res.order_products[0].order_id; //订单号
          this.order_total_title = res.payment_details[0].name; //标题
          this.order_total_fee = res.payment_details[0].value; //付款金额
        }

        res.order_products.map(res => {
          //处理照片
          res.le_append_image = that.urlImage + res.le_image;
        });
        res.operations.map(r => {
          //比较要显示的状态类型
          that.orderstatus.map(s => {
            if (r == s.num) {
              orderarrList.push(s);
            }
          });
        });
        // 判断已经取消自提状态
        if (res.is_oto) {
          res.order_receiver_name = res.oto_detail.shop_name;
          res.mobile = res.oto_detail.phone;
          res.order_receiver_address = res.oto_detail.address;
        }

        // 处理乐闪送订单  1,未接单状态
        // if (res.leyou_flash) {
        //   if (res.order_status == 5) {
        //     if (parseInt(res.leyou_flash.status) == 0) {
        //       if (parseInt(res.leyou_flash.status_type) == 1) {
        //         this.leshansongname = "骑手未接单,已转发快递";
        //       } else if (parseInt(res.leyou_flash.status_type) == 2) {
        //         this.leshansongname = "骑手未接单,已取消";
        //       } else if (parseInt(res.leyou_flash.status_type) == 3) {
        //         this.leshansongname = "骑手未接单，快递转发失败";
        //       } else {
        //         this.leshansongname = res.status_desc;
        //       }
        //     } else {
        //       this.leshansongname = res.status_desc;
        //     }
        //   } else if (res.order_status == 2) {
        //     if (parseInt(res.leyou_flash.status) == 0) {
        //       if (parseInt(res.leyou_flash.status_type) == 1) {
        //         this.leshansongname = "等待骑手接单";
        //       } else if (parseInt(res.leyou_flash.status_type) == 2) {
        //         this.leshansongname = "骑手未接单,已取消";
        //       } else if (parseInt(res.leyou_flash.status_type) == 3) {
        //         this.leshansongname = "骑手未接单，快递转发失败";
        //       } else {
        //         this.leshansongname = res.status_desc;
        //       }
        //     } else {
        //       this.leshansongname = res.status_desc;
        //     }
        //   } else {
        //     this.leshansongname = res.status_desc;
        //   }
        // } else {
        //   this.leshansongname = res.status_desc;
        // }
        this.operationLeyouFlashData(res);

        this.orderarr = orderarrList;
        this.orderData = res;
      });
    },
    funSuccessOrder(orderId) {
      //订单详情（订单号 已经付款）
      let that = this;
      let orderarrList = [];

      getSuccessOrder(orderId).then(res => {
        this.is_show_data = true;
        wx.hideLoading();
        this.orderarr = orderarrList;
        // this.order_id = res.order_products[0].order_id; //订单号

        if (this.is_online == 0) {
          //  门店订单
          this.order_id = res.serial_num;
          this.order_total_title = "实付款"; //标题
          this.order_total_fee = res.order_total_fee; //付款金额
        } else {
          this.order_id = res.order_products[0].order_id; //订单号
          this.order_total_title = res.payment_details[0].name; //标题
          this.order_total_fee = res.payment_details[0].value; //付款金额
        }

        this.orderData = res;
        res.order_status = parseInt(res.order_status);
        res.order_products.map(res => {
          //处理照片
          res.le_append_image = that.urlImage + res.le_image;
        });

        // 判断订单是否取消
        if (this.is_online != 0) {
          if (res.leyou_flash) {
            if (res.leyou_flash_express && res.leyou_flash_express.length) {
              //有他说明订单已经取消
              this.logisticsShow = true;
              this.logisticsInfo = res.leyou_flash_express;
            }
          } else {
            if (res.ship_infos.length > 0 && !res.is_oto) {
              //判断是否有物流信息
              // let lengthNum = res.ship_infos[0].expresstraces.length - 1;
              this.logisticsInfo = res.ship_infos[0].expresstraces[0];
              this.logisticsShow = true;
            }
          }
          // if (res.leyou_flash_express && res.leyou_flash_express.length) {
          //   //有他说明订单已经取消
          //   this.logisticsShow = true;
          //   this.logisticsInfo = res.leyou_flash_express;
          // } else if (res.ship_infos.length > 0 && !res.is_oto) {
          //   //判断是否有物流信息
          //   // let lengthNum = res.ship_infos[0].expresstraces.length - 1;
          //   this.logisticsInfo = res.ship_infos[0].expresstraces[0];
          //   this.logisticsShow = true;
          // }
        }

        if (this.is_online == 0) {
          res.order_receiver_name = res.shop_name;
          res.mobile = res.shop_phone;
          res.order_receiver_address = res.shop_address;
        }
        this.operationLeyouFlashData(res);

        if (res.is_oto) {
          //如果是自提
          res.oto_detail.detail = res.oto_detail.detail_sn.split("");
          res.order_receiver_name = res.oto_detail.shop_name;
          res.mobile = res.oto_detail.phone;
          res.order_receiver_address = res.oto_detail.address;

          // let rpx = 1;
          // wx.getSystemInfo({
          //   success: function(res) {
          //     rpx = res.pixelRatio;
          //   }
          // });


          creatBarcode("goodsCode", this.order_id, 590, 170);
          // creatBarcode("goodsCode", res.oto_detail.detail_sn, 590, 170);
        }
        res.operations.map(r => {
          that.orderstatus.map(s => {
            if (r == s.num) {
              orderarrList.push(s);
            }
          });
        });
      });
    },

    operationLeyouFlashData(res) {
      // 处理乐闪送订单  1,未接单状态
      this.leshansongShowArrivalTime = false;
      if (res.leyou_flash) {
        if (res.order_status == 5) {
          if (parseInt(res.leyou_flash.status) == 0) {
            if (parseInt(res.leyou_flash.status_type) == 1) {
              this.leshansongname = "骑手未接单,已转发快递";
            } else if (parseInt(res.leyou_flash.status_type) == 2) {
              this.leshansongname = "骑手未接单,已取消";
              if (res.leyou_flash.changed_flag) {
                this.leshansongdesc = res.leyou_flash.desc;
              }
            } else if (parseInt(res.leyou_flash.status_type) == 3) {
              this.leshansongname = "骑手未接单，快递转发失败";
              this.leshansongdesc = res.leyou_flash.desc;
            } else {
              this.leshansongname = res.status_desc;
            }
          } else {
            this.leshansongname = res.status_desc;
          }
        } else if (res.order_status == 2) {
          if (parseInt(res.leyou_flash.status) == 0) {
            if (parseInt(res.leyou_flash.status_type) == 2) {
              if (res.leyou_flash.changed_flag) {
                this.leshansongdesc = "骑手未接单,已取消";
              } else {
                if (res.leyou_flash.send_mt_flg == 0) {
                  this.leshansongdesc = res.leyou_flash.desc;
                } else if (res.leyou_flash.send_mt_flg == 1) {
                  this.leshansongdesc = "30分钟后如无骑手接单将为您转发快递";
                } else {
                  this.leshansongdesc = "";
                }
              }
            } else if (parseInt(res.leyou_flash.status_type) == 3) {
              this.leshansongdesc = "骑手未接单，快递转发失败";
            } else if (parseInt(res.leyou_flash.status_type) == 1) {
              if (res.leyou_flash.send_mt_flg == 0) {
                this.leshansongdesc = res.leyou_flash.desc;
              } else if (res.leyou_flash.send_mt_flg == 1) {
                this.leshansongdesc = "30分钟后如无骑手接单将为您转发快递";
              } else {
                this.leshansongdesc = "";
              }
            } else {
              this.leshansongdesc = "";
            }
            //  if (parseInt(res.leyou_flash.status_type) == 1) {
            //   this.leshansongname = "等待骑手接单";
            // } else if (parseInt(res.leyou_flash.status_type) == 2) {
            //   this.leshansongname = "骑手未接单,已取消";
            // } else if (parseInt(res.leyou_flash.status_type) == 3) {
            //   this.leshansongname = "骑手未接单，快递转发失败";
            // } else {
            //   this.leshansongname = res.status_desc;
            // }
            this.leshansongname = "等待骑手接单";
          } else {
            this.leshansongShowArrivalTime = true;
            this.leshansongname = res.status_desc;
            this.leshansongdesc = res.leyou_flash.desc;
          }
        } else {
          this.leshansongname = res.status_desc;
        }
      } else {
        this.leshansongname = res.status_desc;
      }
    },

    orderstatusALL(num) {
      //所有的订单状态点击
      if (num == "0001") {
        //去支付
        let res = {
          payable_amount: this.order_total_fee,
          serial_num: this.orderData.serial_num,
          order_id: this.order_id
        };
        this.funcWxpayInfomation(res);
      } else if (num == "0002") {
        //取消订单
        this.cancelOrder();
      } else if (num == "0003") {
        //查看物流
        this.gotoGsLocation();
      } else if (num == "0004") {
        //再来一单
        // this.ModalShow = true;
        this.Comingorder();
      } else if (num == "0005") {
        //去评价
        this.goToComment();
      } else if (num == "0006") {
        //0006:申请退货
        this.ModalShow = true;
      } else if (num == "0007") {
        //0007:确认收货
        this.takeDelivery();
      }
    },

    goToComment() {
      // let order_id = this.order_id;
      // let serial_num = this.orderData.serial_num;
      // let url =
      //   "/pages/userCenter/comment/main?order_id=" +
      //   order_id +
      //   "&serial_num=" +
      //   serial_num;
      // wx.navigateTo({
      //   url: url
      // });
      let order_id = this.order_id;
      let pro_list_str = JSON.stringify(this.orderData.order_products);
      let url =
        "/pages/confirm/lotComment/main?order_id=" +
        order_id +
        "&product_info=" +
        pro_list_str;
      wx.navigateTo({
        url: url
      });
    },
    cancelOrder() {
      //取消订单
      let that = this;
      let params = { serial_num: that.options.serial_num };
      wx.showModal({
        title: "提示",
        content: "确认取消此订单？",
        success(res) {
          if (res.confirm) {
            orderCancle(params).then(res => {
              EventBus.$emit("listRefersh");
              wx.navigateBack({
                delta: 1
              });
              // wx.navigateTo({ url: "/pages/confirm/list/main" });
            });
          }
        }
      });
    },
    Comingorder() {
      //再来一单
      let pro_info_list = [];
      this.orderData.order_products.map(items => {
        let pro = {};
        pro.sku = items.sku;
        pro.quantity = items.quantity;
        pro.hander_type = 1;
        pro.is_check = 1;
        if (items.is_haitao == "false") {
          pro.cart_type = 0;
        } else {
          pro.cart_type = 1;
        }
        pro_info_list.push(pro);
      });

      let params = {
        hander_cart: pro_info_list,
        is_uncheck: 1,
        cart_id: "0"
      };
      let order_type = "0";
      if (this.orderData.ext_type == "H" || this.orderData.ext_type == "G") {
        order_type = "3";
      }
      synAllShoppingCart(params).then(res => {
        wx.navigateTo({
          url: "/pages/confirm/main?order_type=" + order_type
        });
      });
    },

    downinvoice() {
      downloadInvoice({ order_id: this.order_id }).then(res => {
        let link = res.pdf_url;
        wx.setStorageSync("urlH5", link);
        wx.navigateTo({ url: "/pages/transferH5/main" });
        // wx.navigateTo({
        //   url: "/pages/transferH5/main?url=" + link
        // });
      });
    },

    afterClick(item) {
      let data = Object.assign({},this.orderData);
      let arr = [];
      arr.push(item)
      data.order_products = arr;
      this.$store.commit("returnGoodsMutations", data);
      // wx.navigateTo({url:'/pages/userCenter/returnGoods/main?source='+this.order_id})
      wx.navigateTo({ url: "/pages/userCenter/returnGoods/main?source=sku" });
    },

    /************* 以下支付逻辑  **************************/
    // 获取微信支付的参数
    funcWxpayInfomation(res) {
      let openid = wx.getStorageSync("openid");
      let product_name = "乐友孕婴童";
      let pay_info = {
        serial_num: res.serial_num,
        //detail: res.serial_num,
       // title: product_name,
        // type: "weixin",
        pay_money: res.payable_amount,
       // ipAddress: "0.0.0.0",
        type: "xunlian_small",
       // wx_type: 2,
       // open_id: openid
      };

      // funcGlobalWxpayInfomation(res, pay_info);
      this.funcGoPay(res, pay_info);
    },

    //去支付的逻辑
    funcGoPay(le_order_info, pay_order_info) {
      userGetXlzfInfomaiton(pay_order_info).then(res_pay_info => {
        let pay_info_suc = {
          channel_type: 3,
          pay_method: "xunlian_small",
          serial_number: res_pay_info.config.orderNum,
        };
        // debugger
        let self = this;
        requestPayment({
          chcd: res_pay_info.config.chcd,
          appId: res_pay_info.config.appId,
          // consumerId: res_pay_info.config.consumerId,
          orderNum: res_pay_info.config.orderNum,
          mchntid: res_pay_info.config.mchntid,
          inscd: res_pay_info.config.inscd,
          key: res_pay_info.config.key,
          backUrl: res_pay_info.config.backUrl,
          subject: res_pay_info.config.subject,
          goodsList: res_pay_info.config.goodsList,
          },res_pay_info.txamt,{
             success:function(res_wx_info){
                wx.hideLoading();
                
                self.funcGoFinshPage(le_order_info);
                userGetXlzfFinishInfomaiton(pay_info_suc);
             },
             fail:function(res_wx_info){
                // if(res_wx_info.errMsg == '订单号重复'){
                //     this.funcGoPay(res, pay_info);
                // }
                 wx.hideLoading();
            // 此处应该跳转订单列表
             self.funcScan();

             },
             complet:function(){}
          });
      });
    },

    // 支付成功跳转支付成功页面
    funcGoFinshPage(options) {
      let url =
        "/pages/confirm/finish/main?pay_info=" +
        JSON.stringify(options) +
        "&is_le_vip=0";
      wx.redirectTo({
        url: url
      });
    },

    /************* 以上支付逻辑  **************************/

    // funcGoPay(le_order_info, pay_order_info) {
    //   userGetPayInfomaiton(pay_order_info).then(res_pay_info => {
    //     let self = this;
    //     wx.requestPayment({
    //       timeStamp: res_pay_info.timestamp,
    //       nonceStr: res_pay_info.noncestr,
    //       package: res_pay_info.package,
    //       signType: "MD5",
    //       paySign: res_pay_info.sign,
    //       success(res_wx_info) {
    //         wx.hideLoading();
    //         self.funcGoFinshPage(le_order_info);
    //       },
    //       fail(res_wx_info) {
    //         wx.hideLoading();
    //         // 此处应该跳转订单列表
    //         // self.funcScan();
    //       }
    //     });
    //   });
    // },

    // gotoPay() {
    //   //去支付
    //   let res = {
    //     payable_amount: this.order_total_fee,
    //     serial_num: this.orderData.serial_num,
    //     order_id: this.order_id
    //   };
    //   let pay_info = {
    //     serial_num: this.orderData.serial_num,
    //     title: "乐友孕婴童",
    //     type: "weixin",
    //     pay_money: this.order_total_fee,
    //     ipAddress: "0.0.0.0",
    //     pay_type: "weixin_pay"
    //   };
    //   this.funcGoPay(res, pay_info);
    // },
    takeDelivery() {
      //确认收货
      let self = this;
      wx.showModal({
        title: "提示",
        content: "请确认是否已收到货？",
        success(res) {
          if (res.confirm) {
            orderAccept({ order_id: self.order_id }).then(res => {
              EventBus.$emit("listRefersh");
              wx.showToast({
                title: "确认收货成功！",
                icon: "none",
                duration: 2000
              });
            });
          }
        }
      });
    },
    gotoGsLocation() {
      //去物流信息

      if (this.orderData.leyou_flash_express) {
        wx.setStorageSync("goodsLocation", this.orderData.leyou_flash_express);
      } else {
        wx.setStorageSync("goodsLocation", this.orderData.ship_infos[0]); //有物流信息
      }

      wx.navigateTo({ url: "/pages/userCenter/logisticMsg/main" });
    },
    closeModal(msg) {
      //关闭模态框
      this.ModalShow = false;
    },
    storeCancel() {
      wx.showToast({ title: "请到原购买门店退货", icon: "none" });
    },
    gotoPutInFor() {
      this.$store.commit("returnGoodsMutations", this.orderData);
      // wx.navigateTo({url:'/pages/userCenter/returnGoods/main?source='+this.order_id})
      this.closeModal();
      wx.navigateTo({ url: "/pages/userCenter/returnGoods/main?source=order" });
    },
    // funcGoPay(le_order_info, pay_order_info) {
    //   userGetPayInfomaiton(pay_order_info).then(res_pay_info => {
    //     let self = this;
    //     wx.requestPayment({
    //       timeStamp: res_pay_info.timestamp,
    //       nonceStr: res_pay_info.noncestr,
    //       package: res_pay_info.package,
    //       signType: "MD5",
    //       paySign: res_pay_info.sign,
    //       success(res_wx_info) {
    //         wx.hideLoading();
    //         self.funcGoFinshPage(le_order_info);
    //       },
    //       fail(res_wx_info) {
    //         wx.hideLoading();
    //         // 此处应该跳转订单列表
    //         // self.funcScan();
    //       }
    //     });
    //   });
    // },
    // funcGoFinshPage(options) {
    //   let url =
    //     "/pages/confirm/finish/main?pay_info=" +
    //     JSON.stringify(options) +
    //     "&is_le_vip=0";
    //   wx.redirectTo({
    //     url: url
    //   });
    // },
    appraise() {
      //评价晒单
      wx.navigateTo({
        url: "../../../pages/userCenter/comment/main?orderId" + this.order_id
      });
    },
    copyBtn: function(e) {
      //准备复制的数据
      var that = this;
      wx.setClipboardData({
        data: that.order_id + "",
        success: function(res) {
          wx.showToast({ title: "复制成功", icon: "none" });
        }
      });
    },
    funcGotoDeatil(item) {
      let url = "/pages/goodsdetailed/main?sku=" + item.sku;
      wx.navigateTo({
        url: url
      });
    },
    funConactKefu() {
    }
  },
  onHide() {
    // this.logisticsShow=false;
  }, // 生命周期函数--监听页面隐藏
  onUnload() {
    this.logisticsShow = false;
  } //生命周期函数--监听页面卸载
};
</script>
<style scoped>
/* 公共的 */
.public {
  display: flex;
  align-items: center;
}
.justifyCon {
  justify-content: space-between;
}

.shansongbox {
  display: flex;
  align-items: flex-start;
  height: 140rpx !important;
}

.shansong {
  display: flex;
  flex-direction: column;
}

.font30 {
  font-size: 30px;
  color: #ffffff;
  margin-right: 16rpx;
}
.upgoods {
  background: #ffffff;
  border-radius: 4px;
  width: 26rpx;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  margin-left: 4rpx;
}
/* 自助退货 */
.modulecencancel {
  height: 152rpx;
  width: 710rpx;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 20rpx;
  /* border-bottom: 2rpx solid #eeeeee; */
}
.module_sponsor_box {
  flex-direction: inherit;
  align-items: center;
  justify-content: space-between;
}
.dispalyFlex {
  display: flex;
  margin: 18rpx 0 30rpx 0rpx;
}
.module_img {
  width: 36rpx;
  height: 42rpx;
  margin-right: 20rpx;
}
.font333 {
  font-size: 30px;
  color: #333333;
}
.font26 {
  font-size: 26px;
  color: #999999;
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

.drawer_cover{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
  overflow: hidden;
}



.ModalShow {
  position: fixed;
  bottom: 0rpx;
  z-index: 103;
}
.module_sponsor {
  background: #ff5000;
  border: 1px solid #ff5000;
  border-radius: 40px;
  height: 52rpx;
  width: 140rpx;
  font-size: 26px;
  color: #ffffff;
  text-align: center;
  line-height: 52rpx;
}

.leshansongorder {
  height: 100rpx !important;
}

/* 全球购，已经买的商品 */
.Boughtgoods {
  /* margin-top: 20rpx; */
  height: 160rpx;
  width: 750rpx;
  /* padding: 0 20rpx; */
  background: #fafafa;
}
.Boughtgoods .goodsImg {
  width: 120rpx;
  height: 120rpx;
  margin: 20rpx;
}
.goodsInfo {
  flex-direction: column;
  display: flex;
}
.Boughtgoods .goodsName {
  width: 570rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 34rpx;
  color: #333;
  font-size: 26rpx;
}
.goodsSize {
  font-size: 22px;
  color: #999999;
  margin-top: 8rpx;
}
.priceNum {
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 570rpx;
  margin-top: 24rpx;
}

.button_bg {
  border-top: 1rpx solid #dddddd;
  height: 98rpx;
  padding: 0 20rpx;
  display: flex;
  background: #ffffff;
  justify-content: space-between;
  position: fixed;
  bottom: 0rpx;
  width: 750rpx;
  align-items: center;
  box-sizing: border-box;
}

.button_bg_left {
  opacity: 0.66;
  border: 1px solid #666666;
  color: #333333;
  font-size: 26px;
  width: 160rpx;
  height: 62rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 30rpx;
}

/* 支付与取消 */
.payAndcancel {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* margin-right: 20rpx; */
}
.payAndcancel .cancel {
  /* opacity: 0.66;
  border: 1px solid #666666 !important;
  color: #333333 !important; */
}
.payAndcancel .pay {
  border: 1px solid #ff5000;
  border-radius: 30rpx;
  text-align: center;
  color: #ff5000;
  font-size: 26px;
  width: 160rpx;
  height: 60rpx;
  line-height: 60rpx;
  margin-left: 20rpx;
}
/* 金额信息 */
.moneyInfo {
  background: #ffffff;
  margin-top: 20rpx;
  width: 710rpx;
  padding: 28rpx 20rpx;
  border-bottom: 1rpx solid #f3f5f7;
}
.moneysum {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 28rpx;
}
.moneysum:first-child {
  margin-top: 0rpx;
}
/* 实付金额 */
.payMoney {
  display: flex;
  align-content: center;
  justify-content: space-between;
  padding-bottom: 120rpx !important;
}
.NumberMode {
  font-size: 30px;
  color: #333333;
}
.NumberMoney {
  font-size: 30px;
  color: #ff5000;
}

/* 发票信息 */
.receiptInfo {
  background: #ffffff;
  width: 710rpx;
  padding: 28rpx 20rpx;
  border-bottom: 1rpx solid #f3f5f7;
}
.div {
  margin-top: 28rpx;
}
.div:first-child {
  margin-top: 0rpx;
}
.location {
  width: 710rpx;
  text-align: right;
}
.locationImg {
  width: 30rpx;
  height: 30rpx;
  vertical-align: middle;
  margin-right: 12rpx;
}
.locationTxt {
  font-size: 26px;
  color: #ff5000;
  text-align: right;
  vertical-align: middle;
}

/* 微信支付 */
.wxmode {
  height: 88rpx;
  line-height: 88rpx;
  width: 710rpx;
  padding: 0rpx 20rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #f3f5f7;
}
/* 订单编号 */
.orderNumber {
  height: 170rpx;
  background: #ffffff;
  margin-top: 20rpx;
  width: 710;
  padding: 0rpx 20rpx;
  border-bottom: 1rpx solid #f3f5f7;
}
.orderinfo {
  justify-content: space-between;
  padding: 28rpx 0rpx;
  box-sizing: border-box;
}
.NumberText {
  color: #333333;
  line-height: 28px;
}
.orderNumber .copy {
  border: 1px solid #999999;
  border-radius: 20px;
  width: 84rpx;
  height: 38rpx;
  font-size: 22px;
  color: #333;
  line-height: 36rpx;
  text-align: center;
}
.NumberTime {
  color: #333333;
  line-height: 28px;
}
/* 全球购 */
.Globalgoods {
  height: 80rpx;
  background: #ffffff;
  justify-content: space-between;
  width: 710rpx;
  padding: 0 20rpx;
  margin-top: 20rpx;
}
.Globalgoods .globalTxt {
  font-size: 30px;
  color: #333333;
}
.globalwarnImg {
  height: 20rpx;
  width: 20rpx;
  vertical-align: middle;
  margin-right: 13rpx;
}
.globalwarn {
  font-size: 22px;
  color: #ff5000;
  vertical-align: middle;
}
/* 地址信息 */
.addressBox {
  height: 176rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #f3f5f7;
}
.addressimg {
  width: 36rpx;
  height: 44rpx;
}
.addressBox .usreInfo {
  margin-top: 10rpx;
  margin-bottom: 20rpx;
}
.addressBox .arrdessinfo {
  width: 630rpx;
  color: #333333;
  line-height: 36px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* 送货信息 */
.deliverBox {
  background: #ffffff;
  height: 172rpx;
  border-bottom: 1rpx solid #f3f5f7;
}
.deliverBox .deliverinfo {
  flex-direction: column;
  align-items: flex-start;
  width: 560rpx;
}
.deliverBox .deliverinfo .deliverinfoTxt {
  color: #333333;
  line-height: 36px;
  /* height: 36rpx; */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.deliverBox .deliverinfo .deliverTime {
  color: #333333;
  margin-top: 20rpx;
}
.deliverTriangle {
  margin-left: 58rpx;
  height: 22rpx;
  width: 12rpx;
}

/* 顶部信息 */
.orderHeader {
  background: #ff5000;
  height: 100rpx;
}
/* 自提货 */
.pickup {
  width: 750rpx;
  background: #fafafa;
  text-align: center;
  padding: 60rpx 0rpx;
}
.canvas {
  width: 590rpx;
  height: 170rpx;
  margin-top: 60rpx;
  margin: 0rpx 80rpx 28rpx 80rpx;
}
.pickupText {
  font-size: 30rpx;
  color: #333333;
}

.headerimg {
  height: 48rpx;
  width: 48rpx;
  margin-right: 36rpx;
  margin-left: 20rpx;
  vertical-align: middle;
}
.orderHeader .headertext {
  font-size: 34px;
  color: #ffffff;
  vertical-align: middle;
}
.orderHeader .headerClose {
  font-size: 26px;
  color: #ffffff;
  margin-left: 10rpx;
}

.orderdelBox {
  font-family: PingFangSC-Medium;
  font-size: 26px;
  color: #333333;
  background: #f3f5f7;
}

.share_red_bg {
  position: fixed;
  /* position: absolute;  */
  right: 20rpx  !important;
  bottom: 200rpx !important;
  /* width: 132rpx; */
  /* height: 124rpx; */
  /* padding: 0; */
}

.share_red_bg_button {
  padding: 0;
  background-color: transparent;
}

.share_red_bg_button::after {
  border: 0;
}

.after_bg {
  padding: 0 20rpx;
  display: flex;
  /* align-items: center; */
  flex-direction: row-reverse;
  height: 55rpx;
  background: #fafafa;
  /* width: 100%; */
}

.after_button {
  color: #333;
  font-size: 26rpx;
  width: 140rpx;
  height: 52rpx;
  opacity: 0.66;
  border: 1px solid #666666;
  border-radius: 30px;
  text-align: center;
  line-height: 52rpx;
  margin-top: -15rpx;
}

.list_button_color {
  border: 1rpx solid #333 !important;
  color: #333 !important;
}
</style>
