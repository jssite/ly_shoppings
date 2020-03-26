<template>
  <div class="scanorder" v-if="is_show_data">
    <!-- 1待支付  2以支付  3交易完成 5以取消 -->
    <!-- 订单状态码， 3交易完成 5以取消 -->

    <!-- 2,待收货 -->
    <div class="waitReceived" v-if="orderData.order_status==2 && orderData.status_desc=='待收货'">
      <div class="orderHeader">
        <img src="../../images/dengdaisong.png" alt />
        <div class="orderHeader_text">{{orderData.status_desc}}</div>
      </div>
      <div class="Received_address" @click="gotoGsLocation">
        <img class="received_cart" src="../../images/cart.png" />
        <div class="Received_add_content">
          <span class="text1">{{logisticsInfo.ope_remark || logisticsInfo.desc}}</span>
          <span class="text2">{{logisticsInfo.ope_time || logisticsInfo.time}}</span>
        </div>
        <img class="received_jiantou" src="/static/goodsdetail/lecard_arrow_right.png" alt />
      </div>
      <div class="userAddress">
        <img src="../../images/location.png" />
        <div>
          <div class="usreInfo">
            <span class="usreInfo_text">{{orderData.order_receiver_name}}</span>
            <span class="usreInfo_text" style="padding-left:60rpx">{{orderData.mobile}}</span>
          </div>
          <div class="arrdessinfo">{{orderData.order_receiver_address}}</div>
        </div>
      </div>
      <div class="userAddress" style="height:88rpx;">
          <img src="../../images/userorder_icon_scan.png" />
          <div>
            <div class="usreInfo">
              <span class="usreInfo_text">{{orderData.shop_name}}</span>
            </div>
          </div>
      </div>
    </div>

    <!-- 1 待支付 -->
    <div v-if="orderData.order_status==1">
      <div class="orderHeader" >
        <img src="../../images/headerplay.png" />
        <div class="orderHeader_text" style="margin-right:10rpx;">{{orderData.status_desc}}</div>
        <span v-if="orderData.left_pay_time == '0' " class="headerClose">订单超时未支付,已为您取消</span>
        <div class="headerTime" style="display:flex" v-if="orderData.left_pay_time!='0'">
          <!-- <span style="font-size: 26rpx;color: #ffffff;margin-left:20rpx;margin-right:10rpx">剩</span> -->
          <counttime :skillNum="3" :endTime="orderData.left_pay_time"></counttime>
        </div>
        <span class="headerClose" v-if="orderData.left_pay_time!='0'">后自动关闭</span>
      </div>
      <template v-if="!orderData.is_oto">
        <div class="userAddress">
          <img src="../../images/location.png" />
          <div>
            <div class="usreInfo">
              <span class="usreInfo_text">{{orderData.order_receiver_name}}</span>
              <span class="usreInfo_text" style="padding-left:60rpx">{{orderData.mobile}}</span>
            </div>
            <div class="arrdessinfo">{{orderData.order_receiver_address}}</div>
          </div>
        </div>
        <div class="userAddress" style="height:88rpx;">
          <img src="../../images/userorder_icon_scan.png" />
          <div>
            <div class="usreInfo">
              <span class="usreInfo_text">{{orderData.shop_name}}</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 以支付 -->
    <div v-if="orderData.order_status==2 && orderData.status_desc=='已支付'"  >
      <div class="orderHeader">
        <img src="../../images/headerplay.png" alt />
        <div class="orderHeader_text">{{orderData.status_desc}}</div>
      </div>
      <div class="pickup">
        <canvas class="canvas" canvas-id="goodsCode"></canvas>
        <span class="pickupText">请向工作人员出示此码，检验后即可离店！</span>
      </div>
    </div>

    <!-- 交易完成 -->
    <div v-if="orderData.order_status==3">
      <div class="orderHeader" >
        <img src="../../images/finish.png" alt />
        <div class="orderHeader_text">交易完成</div>
      </div>
      <template v-if="!orderData.is_oto">
        <div class="userAddress">
          <img src="../../images/location.png" />
          <div>
            <div class="usreInfo">
              <span class="usreInfo_text">{{orderData.order_receiver_name}}</span>
              <span class="usreInfo_text" style="padding-left:60rpx">{{orderData.mobile}}</span>
            </div>
            <div class="arrdessinfo">{{orderData.order_receiver_address}}</div>
          </div>
        </div>
        <div class="userAddress" style="height:88rpx;">
          <img src="../../images/userorder_icon_scan.png" />
          <div>
            <div class="usreInfo">
              <span class="usreInfo_text">{{orderData.shop_name}}</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 已取消 -->
    <div v-if="orderData.order_status==5">
      <div class="orderHeader" >
        <img src="../../images/cancel.png" alt />
        <div class="orderHeader_text">{{orderData.status_desc}}</div>
      </div>
      <template v-if="!orderData.is_oto">
        <div class="userAddress">
          <img src="../../images/location.png" />
          <div>
            <div class="usreInfo">
              <span class="usreInfo_text">{{orderData.order_receiver_name}}</span>
              <span class="usreInfo_text" style="padding-left:60rpx">{{orderData.mobile}}</span>
            </div>
            <div class="arrdessinfo">{{orderData.order_receiver_address}}</div>
          </div>
        </div>
        <div class="userAddress" style="height:88rpx;">
          <img src="../../images/userorder_icon_scan.png" />
          <div>
            <div class="usreInfo">
              <span class="usreInfo_text">{{orderData.shop_name}}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    
    <!-- 店铺信息位置 -->
    <div class="userAddress" v-if="orderData.is_oto">
      <img src="../../images/userorder_icon_scan.png" />
      <div>
        <div class="usreInfo">
          <span class="usreInfo_text">{{orderData.oto_detail.shop_name}}</span>
          <span class="usreInfo_text" style="padding-left:60rpx">{{orderData.oto_detail.phone}}</span>
        </div>
        <div class="arrdessinfo">{{orderData.oto_detail.address}}</div>
      </div>
    </div>

    <!-- 服务门店 -->
    <div class="Globalgoods">
      <span class="globalTxt" style="color:#999;margin-right:20rpx;">{{orderData.ext_desc}}</span>
      <!-- <span class="globalTxt">天猫智慧门店</span> -->
    </div>
    <!-- 商品内容 -->
    <div
      class="Boughtgoods"
      @click.stop="funcGotoDeatil(item)"
      v-for="(item,index) in orderData.order_products"
      :key="index"
    >
      <img class="goodsImg" :src="item.le_append_image" />
      <div class="goodsInfo">
        <span class="goodsName">{{item.marketing_title}}</span>
        <div v-if="item.stylecode" class="goodscolor">
          <span v-if="item.color" class="goodscolr_siez">颜色：{{item.color + ' '}}</span>
          <span v-if="item.specifications" class="goodscolr_siez">尺码：{{item.specifications}}</span>
        </div>
        <div class="priceNum">
          <span class="goodsPrice">¥{{item.sale_price}}</span>
          <span class="goodsnum goodsPrice">x{{item.quantity}}</span>
        </div>
      </div>
    </div>
    <!-- 订单内容 -->
    <div>
      <div class="orderNumber">
        <div class="orderinfo">
          <div>
            <span class="NumberText">订单编号：</span>
            <span class="NumberTime">{{order_id}}</span>
          </div>
          <span class="copy" @click="copyBtn">复制</span>
        </div>
        <div>
          <span class="NumberText">下单时间：</span>
          <span class="NumberTime">{{orderData.order_submit_time}}</span>
        </div>
      </div>
      <!-- 支付方式 -->
      <div class="wxmode" v-if="orderData.order_paid_way">
        <span class="NumberText">支付方式：</span>
        <span class="NumberTime">{{orderData.order_paid_way||'网上支付'}}</span>
      </div>
      <!-- 发票方式 -->
      <div class="wxmode">
        <span class="NumberText">发票：</span>
        <span class="NumberTime">如需纸质发票,请联系门店工作人员</span>
      </div>
      <!-- <div v-if="is_online != 0">
          <template v-if="orderData.invoice_type==0">
            <div class="wxmode" v-if="orderData.ext_type == 'H' || orderData.ext_type == 'G'">
              <span class="NumberText">海淘商品不支持开具发票</span>
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
      </div>-->
    </div>

    <!-- 金额信息 -->
    <div class="moneyInfo">
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
      <div></div>
      <div class="payAndcancel">
        <span
          :class="['pay',{'cancel':item.num=='0002'}]"
          v-for="(item,index) in orderarr"
          :key="index"
          @click.stop="orderstatusALL(item.num)"
        >{{item.name}}</span>
      </div>
    </div>

    <!-- 申请退货 -->
    <cover-view class="drawer_cover" v-if="ModalShow" @click="closeModal"></cover-view>
    <cover-view class="ModalShow" v-if="ModalShow">
      <cover-view class="modulecencancel" @click.stop="storeCancel">
        <cover-view class="dispalyFlex">
          <cover-image class="module_img" src="../../images/cart.png"></cover-image>
          <cover-view class="font333">门店极速退货</cover-view>
        </cover-view>
        <cover-view class="font26">带着商品到原门店，现场办理退货</cover-view>
      </cover-view>
      <cover-view style="width:100%; height:2rpx; background:#f3f5f7"></cover-view>
      <cover-view class="modulecencancel module_sponsor_box">
        <cover-view class="goodsInfo">
          <cover-view class="dispalyFlex">
            <cover-image class="module_img" src="../../images/return.png"></cover-image>
            <cover-view class="font333">线上自助退货</cover-view>
          </cover-view>
          <cover-view class="font26">线上申请，进度实时查询，预计2-7天完成</cover-view>
        </cover-view>
        <cover-view class="module_sponsor" @click.stop="gotoPutInFor">发起申请</cover-view>
      </cover-view>
    </cover-view>

  </div>
</template>
<script>
import { mapMutations } from "vuex";
import { creatBarcode } from "@/utils";
import counttime from "@/components/public/countdown";
import {
  getMyorderdel,
  getSuccessOrder,
  orderCancle,
  synAllShoppingCart,
  userGetPayInfomaiton,
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
      urlImage: null, //图片路径地址
      orderData: {
        oto_detail: {}, //店铺地址
        order_products: [] //商品信息
      },
      orderarr: [], //存储订单状态
      options: null, //传递过来的值
      order_id: null, //订单编号
      order_total_fee: null, //实付金额
      order_total_title: "",
      orderstatus: [
        //订单可执行状态
        { num: "0001", name: "去支付" },
        { num: "0002", name: "取消订单" },
        // {num:'0003',name:'查看物流'},
        { num: "0004", name: "再次购买" },
        { num: "0005", name: "去评价" },
        { num: "0006", name: "申请售后" },
        { num: "0007", name: "确认收货" },
        { num: "0008", name: "查看检验码" }
      ],
      is_show_data: false, //整个页面隐藏

      ModalShow: false, //模态框
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
    }
  },
  onLoad(options) {
    /**
     * 1,未付款用流水号
     * 2,已经付款用订单号
     */
    this.is_show_data = false;
    wx.showLoading({ title: "加载中", mask: true });
    console.log(options, "我是传入过来的");
    this.options = options;
    let appInfo = wx.getStorageSync("appInfo"); //获取图片路径
    this.urlImage = appInfo.download_le_image;
    this.is_online = parseInt(options.is_online); //
    if (this.is_online == 0) {
      let params = { serial_num: options.serial_num };
      this.funSuccessOrder(params);
    } else {
      if (parseInt(options.query_serial) == 0) {
        //支付完成
        let params = { order_id: options.order_id };
        this.funSuccessOrder(params);
      } else if (parseInt(options.query_serial) == 1) {
        //未支付,取消订单
        console.log("我是未支付");
        this.funorderdel(options.serial_num);
      }
    }
  },
  methods: {
    funorderdel(serialNum) {
      //流水号查询，未付款
      let that = this;
      let orderarrList = [];
      let params = { serial_num: serialNum };
      getMyorderdel(params).then(res => {
        this.is_show_data = true;
        console.log(res);
        wx.hideLoading();
        res.operations.map(r => {
          //比较要显示的状态类型
          that.orderstatus.map(s => {
            if (r == s.num) {
              orderarrList.push(s);
            }
          });
        });
        res.order_products.map(res => {
          //处理照片
          res.le_append_image = that.urlImage + res.le_image;
        });
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
        console.log(res);
        wx.hideLoading();
        res.operations.map(r => {
          //订单号状态
          console.log(r);
          that.orderstatus.map(s => {
            if (r == s.num) {
              orderarrList.push(s);
            }
          });
        });
        res.order_products.map(res => {
          //处理照片
          res.le_append_image = that.urlImage + res.le_image;
        });
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
        }

        if (this.is_online == 0) {
          res.order_receiver_name = res.shop_name;
          res.mobile = res.shop_phone;
          res.order_receiver_address = res.shop_address;
        }
        this.operationLeyouFlashData(res);
        if (res.is_oto && res.oto_detail.detail_sn) {
          //如果是自提
          res.oto_detail.detail = res.oto_detail.detail_sn.split("");
          res.order_receiver_name = res.oto_detail.shop_name;
          res.mobile = res.oto_detail.phone;
          res.order_receiver_address = res.oto_detail.address;
          creatBarcode("goodsCode", res.oto_detail.detail_sn, 590, 170);
        }
        res.order_status = parseInt(res.order_status);
        this.orderarr = orderarrList;
        this.orderData = res;
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

    copyBtn() {
      //复制订单号
      let that = this;
      wx.setClipboardData({
        data: that.order_id + "",
        success: function(res) {
          wx.showToast({ title: "复制成功", icon: "none" });
        }
      });
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
      } else if (num == '0008'){
        console.log('我是查看晓燕毛')
        // 传入参数 订单号 价格 
        console.log(this.orderData.oto_detail.detail_sn,'123456') //订单编号
        console.log('实付金额' + this.orderData.order_total_fee)
        console.log('实付金额' + this.orderData.order_submit_time)
        let url = '../ordercode/main?order_time='+this.orderData.order_submit_time+'&order_fee='+this.orderData.order_total_fee+'&order_code='+this.orderData.oto_detail.detail_sn
        wx.navigateTo({
          url: url
        })
      }
    },
    Comingorder() {
      //再来一单
      console.log(this.orderData, "我是获取的数据");
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
      console.log(params);
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
    gotoGsLocation() {
      //查看物流
      if (this.orderData.leyou_flash_express) {
        wx.setStorageSync("goodsLocation", this.orderData.leyou_flash_express);
      } else {
        wx.setStorageSync("goodsLocation", this.orderData.ship_infos[0]); //有物流信息
      }
      wx.navigateTo({ url: "/pages/userCenter/logisticMsg/main" });
    },
    takeDelivery() { //确认收货
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
              // console.log("收货成功");
            });
          }
        }
      });
    },
    goToComment() { //去评价
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
    funcGotoDeatil(item) {
      let url = "/pages/goodsdetailed/main?sku=" + item.sku;
      wx.navigateTo({
        url: url
      });
    },
    closeModal(msg) { //关闭模态框
      this.ModalShow = false;
    },
    storeCancel() { //请到原购买门店退货
      wx.showToast({ title: "请到原购买门店退货", icon: "none" });
    },
    gotoPutInFor() {
      // console.log(this.order_id)
      this.$store.commit("returnGoodsMutations", this.orderData);
      // wx.navigateTo({url:'/pages/userCenter/returnGoods/main?source='+this.order_id})
      this.closeModal();
      wx.navigateTo({ url: "/pages/userCenter/returnGoods/main?source=order" });
    },

    /************* 以下支付逻辑  **************************/
    // 获取微信支付的参数
    funcWxpayInfomation(res) {
      let openid = wx.getStorageSync("openid");
      let product_name = "乐友孕婴童";
      let pay_info = {
        serial_num: res.serial_num,
        detail: res.serial_num,
        title: product_name,
        // type: "weixin",
        pay_money: res.payable_amount,
        ipAddress: "0.0.0.0",
        type: "smallpay",
        wx_type: 2,
        open_id: openid
      };

      // funcGlobalWxpayInfomation(res, pay_info);
      this.funcGoPay(res, pay_info);
    },
    //去支付的逻辑
    funcGoPay(le_order_info, pay_order_info) {
      userGetPayInfomaiton(pay_order_info).then(res_pay_info => {
        let self = this;
        wx.requestPayment({
          timeStamp: res_pay_info.timeStamp,
          nonceStr: res_pay_info.nonceStr,
          package: res_pay_info.package,
          signType: res_pay_info.signType,
          paySign: res_pay_info.sign,
          success(res_wx_info) {
            wx.hideLoading();
            console.log(res_wx_info);
            self.funcGoFinshPage(le_order_info);
          },
          fail(res_wx_info) {
            wx.hideLoading();
            // 此处应该跳转订单列表
            // self.funcScan();
          }
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
    }
  }
};
</script>
<style>
.scanorder {
  font-family: PingFangSC-Regular;
  letter-spacing: 0;
  height: 100vh;
  background: #f3f3f3;
}
/* 顶部信息 */
.orderHeader {
  background: #ff5000;
  height: 100rpx;
  display: flex;
  align-items: center;
}
.orderHeader image {
  height: 44rpx;
  width: 44rpx;
  margin-right: 36rpx;
  margin-left: 24rpx;
  vertical-align: middle;
}
.orderHeader_text {
  font-size: 34rpx;
  color: #ffffff;
}
.orderHeader .headerClose {
  font-size: 26px;
  color: #ffffff;
  margin-left: 10rpx;
}
/* 待收货 */
.Received_address {
  height: 172rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #f3f5f7;
  display: flex;
  align-items: center;
}
.received_cart {
  height: 48rpx;
  width: 48rpx;
  margin-left: 20rpx;
  margin-right: 33rpx;
}
.Received_add_content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 560rpx;
}
.Received_add_content .text1 {
  font-size: 26rpx;
  color: #333333;
  line-height: 36rpx;
}
.Received_add_content .text2 {
  font-size: 22rpx;
  color: #999999;
  line-height: 24rpx;
  margin-top: 20rpx;
}
.received_jiantou {
  margin-left: 58rpx;
  height: 22rpx;
  width: 12rpx;
}
/* 用户地址信息 */
.userAddress {
  height: 176rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #f3f5f7;
  display: flex;
  align-items: center;
}
.userAddress image {
  width: 40rpx;
  height: 44rpx;
  margin-left: 25rpx;
  margin-right: 30rpx;
}
.usreInfo {
  margin-top: 10rpx;
  margin-bottom: 20rpx;
}
.usreInfo_text {
  font-size: 30rpx;
  color: #333333;
  line-height: 28rpx;
}
.arrdessinfo {
  width: 630rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 26rpx;
  color: #666666;
  line-height: 36px;
}

/* 服务门店 */
.Globalgoods {
  height: 80rpx;
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 0 20rpx;
  margin-top: 20rpx;
}
.Globalgoods .globalTxt {
  font-size: 30rpx;
  color: #333333;
  line-height: 28px;
}
/* 商品信息内容 */
.Boughtgoods {
  height: 160rpx;
  width: 750rpx;
  background: #fafafa;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #eeeeee;
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
.goodscolor {
  color: #333333;
  font-size: 22rpx;
  margin-top: 4rpx;
}
.goodscolr_siez {
  font-size: 22rpx;
  color: #999999;
  line-height: 24rpx;
}
.priceNum {
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 570rpx;
  margin-top: 24rpx;
}
.goodsPrice {
  font-size: 26rpx;
  color: #333333;
  line-height: 25rpx;
}
/* 订单编号 */
.orderNumber {
  height: 100rpx;
  background: #ffffff;
  margin-top: 20rpx;
  width: 710;
  padding: 12rpx 20rpx;
  border-bottom: 1rpx solid #f3f5f7;
}
.orderinfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* padding: 28rpx 0rpx; */
  box-sizing: border-box;
}
.NumberText {
  font-size: 26rpx;
  color: #333333;
  line-height: 28rpx;
}
.orderNumber .copy {
  border: 1px solid #999999;
  border-radius: 20rpx;
  width: 84rpx;
  height: 38rpx;
  font-size: 22rpx;
  color: #999;
  line-height: 36rpx;
  text-align: center;
}
.NumberTime {
  font-size: 26rpx;
  color: #2a2a2a;
  line-height: 28rpx;
}
.wxmode {
  display: flex;
  align-items: center;
  height: 88rpx;
  /* line-height: 88rpx; */
  /* width: 710rpx; */
  padding: 0rpx 20rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #f3f5f7;
}

/* 金额信息 */
.moneyInfo {
  background: #ffffff;
  margin-top: 20rpx;
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
  /* padding-bottom: 120rpx !important; */
  margin-bottom: 120rpx !important;
}
.NumberMode {
  font-size: 30px;
  color: #333333;
}
.NumberMoney {
  font-size: 30px;
  color: #ff5000;
}
/* 订单状态 */
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
/* 支付与取消 */
.payAndcancel {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* margin-right: 20rpx; */
}
.payAndcancel .cancel {
  /* opacity: 0.66; */
  border: 1px solid #666666 !important;
  color: #666666 !important;
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

/* 完成后自提码 */
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

/* 申请退货 */
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
</style>
