<template>
  <div class="orderdelBox" v-if="is_show_data">
    <!-- 顶部 支付状态 -->
    <div class="detail_top_status">
      <img :src="order_status_icon" class="top_status_img" />
      <span class="top_status_title">{{orderData.status_desc}}</span>
      <span
        v-if="orderData.order_status == 3"
        class="top_status_subtitle"
      >{{orderData.start_time}}开始支付尾款</span>
      <span
        v-if="orderData.order_status == 5"
        class="top_status_subtitle"
      >预计{{orderData.start_time}}开始发货</span>
      <div
        v-if="orderData.order_status == 1 || orderData.order_status == 4"
        class="top_status_timer"
      >
        <counttime :skillNum="3" :endTime="orderData.close_time"></counttime>
        {{orderData.order_status == 3?'后自动关闭':'后结束'}}
      </div>
    </div>

    <!-- 预售轨迹 -->
    <div v-if="orderData.status_list" class="detail_serail_locus">
      <div class="serali_locus_all_bg">
        <div class="serail_locus_icon_bg" style="margin-left: 26rpx;">
          <img :src="order_serali_icon_list[0]" class="serail_locus_icon" />
          <span class="serail_locus_line"></span>
        </div>
        <div class="serial_locus_status">{{order_serali_locus[0].status_desc}}</div>
      </div>

      <div class="serali_locus_all_bg_center">
        <div class="serail_locus_icon_bg">
          <span class="serail_locus_line"></span>
          <img :src="order_serali_icon_list[1]" class="serail_locus_icon" />
          <span class="serail_locus_line"></span>
        </div>
        <div class="serial_locus_status">{{order_serali_locus[1].status_desc}}</div>
      </div>

      <div class="serali_locus_all_bg_right">
        <div class="serail_locus_icon_bg">
          <span class="serail_locus_line"></span>
          <img :src="order_serali_icon_list[2]" class="serail_locus_icon" />
        </div>
        <div
          class="serial_locus_status"
          style="text-align:right"
        >{{order_serali_locus[2].status_desc}}</div>
      </div>
    </div>

    <!-- 物流地址 -->
    <!--  -->
    <div class="deliverBox public" v-if="logisticsShow" @click="gotoGsLocation">
      <img class="headerimg" src="../../images/cart.png" />
      <div class="public deliverinfo">
        <span class="deliverinfoTxt">{{logisticsInfo.ope_remark || logisticsInfo.desc}}</span>
        <span class="deliverTime">{{logisticsInfo.ope_time || logisticsInfo.time}}</span>
      </div>
      <img class="deliverTriangle" src="/static/goodsdetail/lecard_arrow_right.png" alt />
    </div>

    <!-- 地址信息 -->
    <div class="addressBox public">
      <img class="headerimg addressimg" src="../../images/location.png" />
      <div>
        <div class="usreInfo">
          <span>{{orderData.consignee_name}}</span>
          <span style="padding-left:60rpx">{{orderData.consignee_mobile}}</span>
        </div>
        <div class="arrdessinfo">{{orderData.post_address}}</div>
      </div>
    </div>

    <div>
      <div class="public Globalgoods">
        <span class="globalTxt">乐商城</span>
        <div v-if="orderData.ext_type == 'H' || orderData.ext_type == 'G'">
          <img class="globalwarnImg" src="../../images/zhanshiyong.png" alt />
          <span class="globalwarn">不支持7天无理由退货</span>
        </div>
      </div>
      <div
        @click.stop="funcGotoDeatil(item)"
        v-for="(item,index) in orderData.order_products"
        :key=" index"
      >
        <div class="public Boughtgoods">
          <img class="goodsImg" :src="item.le_append_image" />
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

    <div class="orderNumber">
      <div class="public orderinfo">
        <div>
          <span class="NumberText">订单编号：</span>
          <span class="NumberTime">{{order_id}}</span>
        </div>
        <span class="copy" @click="copyBtn">复制</span>
      </div>
      <div>
        <span class="NumberText">下单时间：</span>
        <span class="NumberTime">{{orderData.order_create_time}}</span>
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
          <div
            class="location"
            v-if="orderData.order_status!=5 && orderData.order_status!=1"
            @click.stop="downinvoice"
          >
            <img class="locationImg" src="../../images/download.png" />
            <span class="locationTxt">查看发票</span>
          </div>
        </div>
      </template>
    </div>
    <!-- 发票信息 -->

    <!-- 金额信息 -->
    <div class="moneyInfo" v-if="is_online != 0">
      <div class="moneysum" v-for="(item,index) in total_price_array" :key="index">
        <div>
          <span class="NumberText">{{item.status_desc}}</span>
          <span class="money_subTitle" v-if="item.status_desc_ext">{{item.status_desc_ext}}</span>
        </div>

        <span class="NumberText">{{item.desc}}</span>
      </div>
    </div>
    <!-- 实付金额 -->
    <div class="wxmode payMoney">
      <span class="NumberMode">{{order_total_title}}</span>
      <span class="NumberMoney">{{order_total_fee}}</span>
    </div>
    <!-- 点击订单状态 -->
    <div class="button_bg">
      <!-- <div class="button_bg_left" @click.stop="funConactKefu">联系客服</div> -->
      <div></div>
      <div class="payAndcancel">
        <span
          :class="['pay',{'cancel':item.num=='0002' || item.num=='0006'},{'pre_gray':orderData.order_status == 3 && item.num == '0001'}]"
          v-for="(item,index) in orderarr"
          :key="index"
          @click.stop="orderstatusALL(item.num)"
        >{{item.name}}</span>
      </div>
    </div>
    <!-- <div class="share_red_bg"> -->
    <div class="share_red_bg" v-if="orderData.share_vo&& orderData.share_vo.enable">
      <button class="share_red_bg_button" open-type="share">
        <img src="../../images/public_float_share.png" style="width:132rpx;height:124rpx;" />
      </button>
    </div>
    <cover-view class="drawer_cover" v-if="ModalShow" @click="closeModal"></cover-view>
    <!-- <div class="drawer_screen" v-if="ModalShow" @click="closeModal"></div> -->
    <cover-view class="ModalShow" v-if="ModalShow">
      <cover-view class="modulecencancel" @click.stop="storeCancel">
        <cover-view class="dispalyFlex">
          <cover-image class="module_img" src="../../images/dianli.png"></cover-image>
          <cover-view class="font333">门店极速退货</cover-view>
        </cover-view>
        <cover-view class="font26">带着商品到原门店，现场办理退货</cover-view>
      </cover-view>
      <cover-view style="width:100%; height:2rpx; background:#f3f5f7"></cover-view>
      <cover-view class="modulecencancel module_sponsor_box">
        <cover-view class="goodsInfo">
          <cover-view class="dispalyFlex">
            <cover-image class="module_img" src="../../images/xianshang.png"></cover-image>
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
import { requestPayment } from "@/utils/pay/cil_minipay.sdk.js";
import { mapMutations } from "vuex";
import { creatBarcode } from "@/utils";
import counttime from "@/components/public/countdown";
import {
  // getMyorderdel,
  // getSuccessOrder,
  orderCancle,
  synAllShoppingCart,
  userGetPayInfomaiton,
  userGetXlzfInfomaiton,
  userGetXlzfFinishInfomaiton,
  orderAccept,
  downloadInvoice,
  getMyPreOrderDetail
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
      logisticsInfo: {}, //物流信息
      logisticsShow: false, //是否显示物流
      orderData: {},
      order_id: null, //订单编号
      order_total_fee: null, //实付金额
      order_total_title: "",
      order_serali_locus: [], //预售轨迹
      order_serali_icon_list:[],

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

      urlImage: null, //图片路径地址

      is_online: 1,
      leshansongname: "",
      leshansongdesc: "",
      leshansongShowArrivalTime: false
    };
  },
  computed: {
    total_price_array() {
      let price_array = [];
      if (this.orderData.manifest) {
        this.orderData.manifest.map((items, index) => {
          if (index != (this.orderData.manifest.length - 1)) {
            price_array.push(items);
          }
        });
      }
      return price_array;
    },

    order_status_icon() {
      let imgurl = "";
      if (this.orderData.order_status) {
        let status = this.orderData.order_status;
        if (status == 1) {
          // 未支付定金 等待支付
          imgurl = "../../images/headerplay.png";
        } else if (status == 2) {
          //  未支付定金 过期
          imgurl = "../../images/cancel.png";
        } else if (status == 3) {
          // 支付定金 尾款日期未开始
          imgurl = "../../images/headerplay.png";
        } else if (status == 4) {
          // 支付定金 尾款开始
          imgurl = "../../images/headerplay.png";
        } else if (status == 5) {
          // 支付定金和尾款 等待收货
          imgurl = "../../images/dengdaisong.png";
        } else if (status == 6) {
          // 支付定金 尾款未支付已过期
          imgurl = "../../images/cancel.png";
        } else if (status == 7) {
          // 订单完成
          imgurl = "../../images/finish.png";
        }
      }
      return imgurl;
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
    this.sa_page(this, false, "订单详情", "");
    let appInfo = wx.getStorageSync("appInfo");
    this.urlImage = appInfo.download_le_image;
    /** 1，未付款用流水 funorderdel
     *   2，已付款用订单
     */
    this.is_online = parseInt(options.is_online);
    this.is_show_data = true;
    wx.showLoading({ title: "加载中", mask: true });

    let params = {};
    if (parseInt(options.query_serial) == 0) {
      //支付完成
      params = { order_id: options.order_id };
      
    } else if (parseInt(options.query_serial) == 1) {
      //未支付,取消订单
      params = { serial_num:  options.serial_num};
    }
    // let params = { serial_num: "3115681954205679" };
    
    this.funorderdel(params);
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

    funorderdel(params) {
      //订单详情(流水号 为付款)
      let that = this;

      getMyPreOrderDetail(params).then(res => {
        wx.hideLoading();
        this.is_show_data = true;

        res.order_products.map(res => {
          res.le_append_image = that.urlImage + res.le_image;
        });
        let orderarrList = [];
        res.operations.map(r => {
          //比较要显示的状态类型
          let status_str = "000" + r.status;
          this.orderstatus.map(s => {
            if (status_str == s.num) {
              if (r.desc) {
                s.name = r.desc;
              }
              orderarrList.push(s);
            }
          });
        });
        this.orderarr = orderarrList;
        console.log(orderarrList);
        if (res.ship_infos && res.ship_infos.length) {
          //判断是否有物流信息
          this.logisticsInfo = res.ship_infos[0].expresstraces[0];
          this.logisticsShow = true;
        }

        if (res.status_list) {
          let serial_locus = [];
          res.status_list.map(locus_info => {
            let status = locus_info.status;
            let imgurl = "";
            if (status == 0) {
              imgurl = "/pages/confirm/images/presell_icon_circle01.png";
            } else if (status == 1) {
              imgurl = "/pages/confirm/images/presell_icon_circle02.png";
            } else if (status == 2) {
              imgurl = "/pages/confirm/images/presell_icon_circle03.png";
            } else {
              imgurl = "/pages/confirm/images/presell_icon_circle04.png";
            }
            let statusInfo = {
              imgsrc: imgurl,
              status_desc: locus_info.status_desc
            };
            serial_locus.push(statusInfo);
          });
          this.order_serali_locus = serial_locus;
        }
        let imgurl1,imgurl2,imgurl3;
        if (res.order_status == '1') {
          // 未支付定金
           imgurl1 = "/static/images/presell_icon_circle02.png";
           imgurl2 = "/static/images/presell_icon_circle01.png";
           imgurl3 = "/static/images/presell_icon_circle01.png";
        } else if (res.order_status == '2') {
          // 未支付定金 自动取消
           imgurl1 = "/static/images/presell_icon_circle04.png";
           imgurl2 = "/static/images/presell_icon_circle01.png";
           imgurl3 = "/static/images/presell_icon_circle01.png";
        } else if (res.order_status == '3') {
          // 已支付定金 尾款未开始
          imgurl1 = "/static/images/presell_icon_circle03.png";
          imgurl2 = "/static/images/presell_icon_circle01.png";
          imgurl3 = "/static/images/presell_icon_circle01.png";
        } else if (res.order_status == '4') {
          // 已支付定金 尾款未付 尾款有效期
          imgurl1 = "/static/images/presell_icon_circle03.png";
          imgurl2 = "/static/images/presell_icon_circle02.png";
          imgurl3 = "/static/images/presell_icon_circle01.png";
        } else if (res.order_status == '5') {
          // 已付定金 尾款，尾款有效期
          imgurl1 = "/static/images/presell_icon_circle03.png";
          imgurl2 = "/static/images/presell_icon_circle03.png";
          imgurl3 = "/static/images/presell_icon_circle01.png";
        } else if (res.order_status == '6') {
          // 已付定金 未付尾款 尾款已过期
          imgurl1 = "/static/images/presell_icon_circle03.png";
          imgurl2 = "/static/images/presell_icon_circle04.png";
          imgurl3 = "/static/images/presell_icon_circle01.png";
        } else if (res.order_status == '7') {
          // 已付定金 尾款  订单完成
          imgurl1 = "/static/images/presell_icon_circle03.png";
          imgurl2 = "/static/images/presell_icon_circle03.png";
          imgurl3 = "/static/images/presell_icon_circle03.png";
        } else {
          imgurl1 = "/static/images/presell_icon_circle03.png";
          imgurl2 = "/static/images/presell_icon_circle03.png";
          imgurl3 = "/static/images/presell_icon_circle03.png";
        }
        this.order_serali_icon_list = [imgurl1,imgurl2,imgurl3];
        console.log(imgurl1,imgurl2,imgurl3);
        if (res.manifest) {
          let tempObjc = res.manifest.slice(-1);

          this.order_total_title = tempObjc[0].status_desc; //标题
          this.order_total_fee = tempObjc[0].desc; //付款金额
        }
        this.order_id = res.order_products[0].order_id;
        this.orderData = res;
      });
    },

    orderstatusALL(num) {
      //所有的订单状态点击
      if (num == "0001") {
        //去支付
        if (this.orderData.order_status == 3) {
          let toast_title = this.orderData.start_time + "开始支付尾款";
          wx.showToast({
            title: toast_title,
            icon: "none"
          });
        } else {
          let res = {};
          if (this.orderData.order_status == 1) {
            // 支付定金
            res = {
              payable_amount: this.order_total_fee,
              serial_num: this.orderData.deposit_serial_num,
              order_id: this.order_id,
              pay_way: "0"
            };
          } else {
            res = {
              payable_amount: this.order_total_fee,
              serial_num: this.orderData.serial_num,
              order_id: this.order_id,
              pay_way: "0"
            };
          }
          this.funcWxpayInfomation(res);
        }
        
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
      let data = Object.assign({}, this.orderData);
      let arr = [];
      arr.push(item);
      data.order_products = arr;
      this.$store.commit("returnGoodsMutations", data);
      // wx.navigateTo({url:'/pages/userCenter/returnGoods/main?source='+this.order_id})
      wx.navigateTo({ url: "/pages/userCenter/returnGoods/main?source=sku" });
    },

    /************* 以下支付逻辑  **************************/
    // 获取微信支付的参数
    funcWxpayInfomation(res) {

      let url = '/pages/confirm/cash/main?type=100&serial_num=' + res.serial_num;

      wx.navigateTo({
        url: url,
      })
      return







      let openid = wx.getStorageSync("openid");
      let product_name = "乐友孕婴童";
      let pay_info = {
        serial_num: res.serial_num,
        pay_money: res.payable_amount,
        type: "xunlian_small"
      };
      this.funcGoPay(res, pay_info);
    },

    //去支付的逻辑
    funcGoPay(le_order_info, pay_order_info) {
      userGetXlzfInfomaiton(pay_order_info).then(res_pay_info => {
        let pay_info_suc = {
          channel_type: 3,
          pay_method: "xunlian_small",
          serial_number: res_pay_info.config.orderNum
        };
        // debugger
        let self = this;
        requestPayment(
          {
            chcd: res_pay_info.config.chcd,
            appId: res_pay_info.config.appId,
            // consumerId: res_pay_info.config.consumerId,
            orderNum: res_pay_info.config.orderNum,
            mchntid: res_pay_info.config.mchntid,
            inscd: res_pay_info.config.inscd,
            key: res_pay_info.config.key,
            backUrl: res_pay_info.config.backUrl,
            subject: res_pay_info.config.subject,
            goodsList: res_pay_info.config.goodsList
          },
          res_pay_info.txamt,
          {
            success: function(res_wx_info) {
              wx.hideLoading();

              self.funcGoFinshPage(le_order_info);
              userGetXlzfFinishInfomaiton(pay_info_suc);
            },
            fail: function(res_wx_info) {
              // if(res_wx_info.errMsg == '订单号重复'){
              //     this.funcGoPay(res, pay_info);
              // }
              wx.hideLoading();
              // 此处应该跳转订单列表
              self.funcScan();
            },
            complet: function() {}
          }
        );
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
    funConactKefu() {}
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
.detail_top_status {
  background: #ff5000;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-sizing: border-box;
  height: 100rpx;
}
.top_status_img {
  width: 48rpx;
  height: 48rpx;
}
.top_status_title {
  color: #fff;
  font-family: PingFangSC-Medium;
  font-size: 34rpx;
  margin-left: 32rpx;
}
.top_status_subtitle {
  font-size: 26px;
  color: #ffffff;
  margin-left: 20rpx;
}

.top_status_timer {
  margin-left: 20rpx;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 26rpx;
}

/* 预售轨迹 */
.detail_serail_locus {
  height: 156rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #eeeeee;
  font-size: 0;
}

.serali_locus_all_bg {
  width: 162rpx;
}

.serali_locus_all_bg_center {
  width: 236rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.serali_locus_all_bg_right {
  width: 140rpx;
  display: flex;
  justify-content: center;
  /* align-items: */
  flex-direction: column;

  /* flex-direction: row-reverse; */
}

.serail_locus_icon_bg {
  display: flex;
  align-items: center;
  height: 36rpx;
}
.serail_locus_icon {
  width: 36rpx;
  height: 36rpx;
}
.serail_locus_line {
  width: 100rpx;
  height: 2rpx;
  background: #bebebe;
}
.serial_locus_status {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #333;
}

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

.drawer_cover {
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
  background: #fff;
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

.pre_gray {
  background: #cacaca !important;
  color: #fff !important;
  border: none !important;
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
  height: 88rpx;
  font-family: PingFangSC-Medium;
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
  font-family: PingFangSC-Medium;
}

.money_subTitle {
  color: #ff5000;
  font-size: 26rpx;
  margin-left: 5rpx;
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
  font-size: 26px;
  color: #333333;
  background: #f3f5f7;
}

.share_red_bg {
  position: fixed;
  /* position: absolute;  */
  right: 20rpx !important;
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
