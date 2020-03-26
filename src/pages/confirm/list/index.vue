<template>
  <div class="backgroundView" v-if="is_show_data">
    <!--  :style="{'height':screenHeight+'px'}" -->
    <div class="list_top">
      <div class="list_top_button">
        <div
          class="list_top_online"
          @click="funcChangeStatus(1)"
          :class="{activity:is_online == 1}"
        >线上订单</div>
        <div
          class="list_top_shop"
          @click="funcChangeStatus(0)"
          :class="{activity:is_online == 0}"
        >门店订单</div>
      </div>
    </div>
    <div class="user_coupon_tabs" v-if="is_online == 1">
      <div class="user_coupon_tab" @click="funcOrder(1)">
        <div class="user_list_content" :class="{activity: order_status == 1}">全部</div>
      </div>
      <div class="user_coupon_tab" @click="funcOrder(2)">
        <div class="user_list_content" :class="{activity: order_status == 2}">待支付</div>
      </div>
      <div class="user_coupon_tab" @click="funcOrder(3)">
        <div class="user_list_content" :class="{activity: order_status == 3}">待收货</div>
      </div>
      <div class="user_coupon_tab" @click="funcOrder(4)">
        <div class="user_list_content" :class="{activity: order_status == 4}">待评价</div>
      </div>
    </div>
    <div class="ad_bg" v-if="BASE_AD_IMG_URL.url" @click="funcAdClick">
      <img
        :src="BASE_AD_IMG_URL.url"
        class="ad_content"
        :style="{height:BASE_AD_IMG_URL.height+'rpx'}"
      />
    </div>
    <!-- 待评价-->
    <div class="product_content" v-if="order_status == 4">
      <div v-if="order_total_source.length">
        <div class="product_bg">
          <div
            class="product_list_bg"
            style=" box-sizing: content-box; padding:20rpx 0 20rpx 20rpx;"
            v-for="(pro_items, pro_index) in order_total_source"
            :key="pro_index"
            @click.stop="funcGoDetail(pro_items)"
          >
            <img :src="BASE_IMG_URL +  pro_items.le_image" style="width:160rpx;height:160rpx;" />
            <div class="productContent">
              <div class="productName">{{pro_items.marketing_title}}</div>

              <div
                style="display: flex;justify-content: flex-end; margin-top: 44rpx;height: 52rpx; "
              >
                <div class="list_button" @click.stop="goToComment(pro_items)">评价晒单</div>
              </div>
            </div>
          </div>
        </div>
        <div class="weui-loadmore">
          <div v-if="!bottom" class="weui-loading"></div>
          <div class="weui-loadmore__tips">{{bottom?"已经到底啦":"正在加载..."}}</div>
        </div>
      </div>
      <div
        v-else
        style="display: flex;justify-content: center; align-items:center; padding-top:100rpx;flex-direction: column"
      >
        <img src="/static/images/public/public_empty_pic.png" style="width:266rpx;height:222rpx;" />
        <span style="color:#333; font-size:30rpx;margin-top:20rpx">及时评价的你，棒棒哒！</span>
        <div style="color:#999; font-size:24rpx;margin-top:40rpx">没有待评价的商品</div>
      </div>
    </div>
    <!--  -->
    <div v-else class="product_content">
      <div v-if="order_total_source.length">
        <div>
          <div class="product_bg" v-for="(items, index) in order_total_source" :key="index">
            <div class="product_title">
              <span v-if="items.order_source != 1">门店订单</span>
              <span v-else>{{items.ext_desc}}</span>
              <div style="display:flex; align-items: center;">
                <!-- <button
                  class="buttonBg"
                  :data-id="index"
                  v-if="items.share_vo && items.share_vo.enable"
                >-->
                <img
                  v-if="items.share_vo && items.share_vo.enable"
                  src="../images/hongbao.gif"
                  class="productgif"
                  alt
                />
                <!-- </button> -->
                <span style="color:#ff5000;font-siez:26rpx;">{{items.status_desc}}</span>
              </div>
            </div>
            <div
              class="product_list_bg"
              @click="funcGoToOrderList(items)"
              v-for="(pro_items, pro_index) in items.order_products"
              :key="pro_index"
            >
              <img
                :src="BASE_IMG_URL +  pro_items.le_image"
                style="margin-top:10rpx;width:160rpx;height:160rpx;border-radius:10rpx;"
              />
              <div class="productContent">
                <div class="productName">{{pro_items.marketing_title}}</div>

                <div class="productBottom">
                  <div class="productStyle">
                    <div v-if="pro_items.stylecode">
                      <span v-if="pro_items.color">颜色：{{pro_items.color + ' '}}</span>
                      <span v-if="pro_items.specifications">款式：{{pro_items.specifications}}</span>
                    </div>
                  </div>
                  <div class="productCount">×{{pro_items.quantity}}</div>
                </div>
                <div
                  class="product_return_status"
                  v-if="pro_items.application_status_desc"
                >{{pro_items.application_status_desc}}</div>
              </div>
            </div>
            <div class="product_footer">
              <div class="product_footer_top">
                <div class="product_footer_price" v-if="items.ly_list_price">
                  <!-- <span>{{total_list_pro[index]}}</span> -->
                  <span>共{{items.total_quantity}}件商品，合计：</span>
                  <!-- <span
                    v-if="is_online == 1"
                    style="font-family:PingFangSC-Medium;font-size:30rpx; font-weight:600"
                  >¥{{items.ly_list_price}}</span>-->
                  <span
                    style="font-family:PingFangSC-Medium;font-size:30rpx; font-weight:600"
                  >¥{{items.ly_list_price[0]}}</span>
                  <span
                    style="font-family:PingFangSC-Medium;font-size:22rpx; color:#151515;"
                  >{{items.ly_list_price[1]}}</span>
                </div>
              </div>
              
              <div v-if="is_online == 1" class="product_footer_bottom">
                <div
                  :class="['list_button',{'list_button_color':(operation=='0003' || operation=='0009')},{'list_button_gray':(operation=='0001' && (items.pay_time > 0))}]"
                  v-for="(operation, operation_index) in total_operation[index]"
                  :key="operation_index"
                  @click="funcOperation(index,operation_index)"
                >
                  <span v-if="operation == '0001'">去支付</span>
                  <span v-else-if="operation == '0002'">取消订单</span>
                  <span v-else-if="operation == '0003'">查看物流</span>
                  <span v-else-if="operation == '0004'">再次购买</span>
                  <span v-else-if="operation == '0005'">去评价</span>
                  <span v-else-if="operation == '0006'">申请退货</span>
                  <span v-else-if="operation == '0007'">确认收货</span>
                  <span v-else-if="operation == '0008'">查看检验码</span>
                  <span v-else-if="operation == '0009'">删除订单</span>
                  <span v-else></span>
                </div>
              </div>
              <div v-else class="product_footer_bottom">
                <div class="list_button" @click="funcOperation(index,0)">
                  <span>再次购买</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="weui-loadmore">
          <div v-if="!bottom" class="weui-loading"></div>
          <div class="weui-loadmore__tips">{{bottom?"已经到底啦":"正在加载..."}}</div>
        </div>
      </div>
      <div
        v-else
        style="display: flex;justify-content: center; align-items:center; padding-top:100rpx;flex-direction: column"
      >
        <img src="/static/images/public/public_empty_pic.png" style="width:266rpx;height:222rpx;" />
        <span style="color:#333; font-size:30rpx;margin-top:40rpx">您还没有订单呢，赶紧下一单吧</span>
        <div @click="gotoLook" class="no_list_button">去逛逛</div>
      </div>
    </div>
  </div>
</template>

<script>
import { requestPayment } from "@/utils/pay/cil_minipay.sdk.js";
import { mapState, mapMutations } from "vuex";
import { priceFormat } from "@/utils";
import {
  getOrderListByStore,
  getOrderListByApp,
  userGetPayInfomaiton,
  userGetXlzfInfomaiton,
  userGetXlzfFinishInfomaiton,
  orderCancle,
  orderAccept,
  orderDelete,
  synAllShoppingCart
} from "@/api";
import { EventBus } from "@/bus/event-bus.js";
export default {
  data() {
    return {
      pageIndex: 1,
      order_status: 1,
      is_online: 1,
      count: 100,
      bottom: false, //是否到底
      order_total_source: [],
      total_list_pro: [],
      total_operation: [],
      share_vo: {},
      is_show_data: false,
      screenHeight: 667
    };
  },

  computed: {
    BASE_IMG_URL() {
      return this.$store.state.BASE_APP_INFO["download_le_image"];
    },

    BASE_AD_IMG_URL() {
      let adList = this.$store.state.BASE_AD_INFO["ad_list"];
      let ad_info = {};
      if (adList) {
        adList.forEach(item => {
          if (item.type == 10011004) {
            ad_info = item;
          }
        });
      }

      return ad_info;
    }
  },

  onLoad(options) {
    //获取手机的高度
    // this.screenHeight = wx.getStorageSync('screenHeight');
    this.pageIndex = 1;
    this.is_online = 1;
    this.bottom = false;
    this.is_show_data = false;
    this.order_total_source = [];
    this.total_list_pro = [];
    this.total_operation = [];
    if (options.order_status) {
      this.order_status = parseInt(options.order_status);
    }
    this.sa_page(this, false, "订单列表", "");
    this.funcGetNetWorkInfo();
  },

  // onShareAppMessage(res) {
  //   if (res.from === "button") {
  //     // 来自页面内转发按钮
  //     let index = res.target.dataset.id;
  //     let share_vo = this.order_total_source[index].share_vo;
  //     let share_info = {
  //       title: share_vo.share_title,
  //       imageUrl: share_vo.share_image_url,
  //       path: "/pages/transferH5/main?url=" + share_vo.share_link
  //     };
  //     return share_info;
  //   }
  // },

  mounted() {
    // 发票
    EventBus.$on("listRefersh", res => {
      this.pageIndex = 1;
      this.bottom = false;
      this.funcGetNetWorkInfo();
    });
  },

  onUnload() {
    EventBus.$off();
  },

  // onShow() {
  // this.funcGetNetWorkInfo();
  // },

  onPullDownRefresh() {
    this.pageIndex = 1;
    this.bottom = false;
    this.funcGetNetWorkInfo();
  },

  onReachBottom() {
    //加载更多数据
    if (this.bottom) {
      return;
    }
    this.pageIndex += 1;
    this.funcGetNetWorkInfo();
  },

  methods: {
    funcGetNetWorkInfo() {
      if (this.is_online == 0) {
        let request_info = {
          page_index: this.pageIndex,
          page_size: 10,
          order_status: this.order_status
        };
        getOrderListByStore(request_info).then(res => {
          wx.stopPullDownRefresh();
          this.funcOperationData(res);
          this.count = res.count;
          if (res.is_end) {
            this.bottom = true;
          }
        });
        return;
      }

      let request_info = {
        page_index: this.pageIndex,
        page_size: 10,
        order_status: this.order_status
      };
      getOrderListByApp(request_info).then(res => {
        wx.stopPullDownRefresh();
        if (res.is_end) {
          this.bottom = true;
        }
        this.funcOperationData(res);
      });
    },

    funcOperationData(res) {
      let data_result = res.my_orders;
      this.is_show_data = true;
      if (this.pageIndex == 1) {
        this.order_total_source = [];
      }
      let myorder_info = [];
      let self = this;
      data_result.forEach(item => {
        if (item.order_status == 1 || self.is_online == 0) {
          // 未支付订单 取外层
          let product_list = [];
          item.myorders.forEach(pro_info => {
            product_list.push(...pro_info.order_products);
          });
          item.order_total_fee = item.orders_total_fee;
          item.ly_list_price = priceFormat(item.order_total_fee);
          item.order_products = product_list;
          myorder_info.push(item);
        } else {
          item.myorders.forEach(item_order => {
            item_order.ly_list_price = priceFormat(item_order.order_total_fee);
            myorder_info.push(item_order);
          });
        }
      });
      if (this.order_status == 4) {
        let products = [];
        myorder_info.forEach(item => {
          products.push(...item.order_products);
        });
        this.order_total_source = [...this.order_total_source, ...products];
      } else {
        this.order_total_source = [...this.order_total_source, ...myorder_info];
        this.total_operation = [];
        this.order_total_source.forEach(item_order_info => {
          let order_operation_list = [];
          item_order_info.operations.map((operation_info, index) => {
            if (operation_info != "0002" && operation_info != "0006") {
              if (order_operation_list.length < 2) {
                order_operation_list.push(operation_info);
              }
            }
          });
          this.total_operation.push(order_operation_list);

          //   let pro_count = 0;
          //   item_order_info.order_products.forEach((item_pro_list_Info, index) => {
          //     pro_count += item_pro_list_Info.quantity;
          //   });
          //   this.total_list_pro.push("共" + pro_count + "件商品，合计：");
          let total_quantity = 0;
          item_order_info.order_products.forEach((source, x) => {
            total_quantity += source.quantity;
          });
          if (typeof item_order_info.total_quantity == "undefined") {
            this.$set(item_order_info, "total_quantity", total_quantity);
          } else {
            item_order_info.total_quantity = total_quantity;
          }
        });
      }
    },

    // funcShareRedPackage(items) {
    // this.share_vo = items;
    // },

    funcOrder(index) {
      this.order_status = index;
      this.pageIndex = 1;
      this.bottom = false;
      this.is_show_data = false;
      this.order_total_source = [];
      this.funcGetNetWorkInfo();
    },

    funcChangeStatus(index) {
      if (index == 0) {
        this.order_status = 1;
      }
      this.is_online = index;
      this.pageIndex = 1;
      this.bottom = false;
      this.is_show_data = false;
      this.order_total_source = [];
      this.funcGetNetWorkInfo();
    },
    goToComment(item) {
      let order_id = item.order_id;
      let pro_info = JSON.stringify(item);
      let url =
        "/pages/userCenter/comment/main?order_id=" +
        order_id +
        "&product=" +
        pro_info;
      wx.navigateTo({
        url: url
      });
    },

    goToLotComment(items) {
      let order_id = items.order_id;
      let pro_list_str = JSON.stringify(items.order_products);
      let url =
        "/pages/confirm/lotComment/main?order_id=" +
        order_id +
        "&product_info=" +
        pro_list_str;
      wx.navigateTo({
        url: url
      });
    },

    funcGoToOrderList(pro_items) {
      let order_id = pro_items.order_id;
      let serial_num = pro_items.serial_num;
      let query_serial = "0";
      let url = "";
      if (pro_items.order_status == "1" || pro_items.order_status == "5") {
        query_serial = "1";
      }
      if (pro_items.ext_desc == "门店扫码购") {
        url =
          "/pages/confirm/scancode/order/main?order_id=" +
          order_id +
          "&serial_num=" +
          serial_num +
          "&query_serial=" +
          query_serial +
          "&is_online=" +
          this.is_online;
      } else {

        if (pro_items.ext_type == "bm") {
          url =
          "/pages/confirm/presell/detail/main?order_id=" +
          order_id +
          "&serial_num=" +
          serial_num +
          "&query_serial=" +
          query_serial +
          "&is_online=" +
          this.is_online;
        }  else {
          url =
          "/pages/confirm/orderdetails/main?order_id=" +
          order_id +
          "&serial_num=" +
          serial_num +
          "&query_serial=" +
          query_serial +
          "&is_online=" +
          this.is_online;
        }
      }
      wx.navigateTo({
        url: url
      });
    },

    funcGoDetail(pro_items) {
      let sku = pro_items.sku;
      let url = "/pages/goodsdetailed/main?sku=" + sku;
      wx.navigateTo({
        url: url
      });
    },

    funcStyle(pro_items) {
      let style = "";
      if (pro_items.stylecode) {
        if (pro_items.color) {
          style = "颜色：" + pro_items.color + " ";
        }
        if (pro_items.specifications) {
          style = "款式：" + pro_items.specifications;
        }
      }
      return style;
    },

    funcOperation(index, operation_index) {
      let that = this;
      let order_info = this.order_total_source[index];
      let items = "";
      if (this.is_online == 0) {
        items = "0004";
      } else {
        let temp_opetaiton = this.total_operation[index];
        items = temp_opetaiton[operation_index];
      }

      let str = "";
      if (items == "0001") {
        str = "去支付";
        //   let serial_num = res.serial_num;
        // let order_id = res.order_id;
        // this.pay_money = res.payable_amount;
        console.log(order_info);

        if (order_info.ext_type == "bm") {
          // 预售单
          if (
            order_info.deposit_serial_num &&
            order_info.deposit_serial_num != ""
          ) {
            // 支付定金
            let res = {
              payable_amount: order_info.order_total_fee,
              serial_num: order_info.deposit_serial_num,
              order_id: order_info.order_id,
              type: order_info.ext_type,
              pay_way: "0"
            };
            this.funcPreSellOrderInfo(res);
          } else {
            // 支付尾款
            if (order_info.pay_time) {
              // 距离支持支付尾款
              let date = new Date(order_info.pay_time);
              let Y = date.getFullYear() + "-";
              let M =
                (date.getMonth() + 1 < 10
                  ? "0" + (date.getMonth() + 1)
                  : date.getMonth() + 1) + "-";
              let D = date.getDate() + " ";
              let h = date.getHours() + ":";
              let m = date.getMinutes();
              if (m < 10) {
                m = "0" + m + ":";
              } else {
                m = m + ":";
              }
              let s = date.getSeconds();
              if (s < 10) {
                s = "0" + s;
              } else {
                s = s;
              }
              let time = Y + M + D + h + m + s;
              let toast_str = time + "开始支付尾款哦";
              wx.showToast({
                title: toast_str,
                icon: "none",
              });
              return;
            } else {
              let res = {
                payable_amount: order_info.order_total_fee,
                serial_num: order_info.serial_num,
                order_id: order_info.order_id,
                type: order_info.ext_type,
                pay_way: "0"
              };
              this.funcPreSellOrderInfo(res);
            }
          }
        } else {
          let res = {
            payable_amount: order_info.order_total_fee,
            serial_num: order_info.serial_num,
            order_id: order_info.order_id,
            type: order_info.ext_type
          };
          this.funcWxpayInfomation(res);
        }
      } else if (items == "0002") {
        str = "取消订单";
        let pay_info = {
          serial_num: order_info.serial_num
        };
        let self = this;
        wx.showModal({
          cancelColor: "#333333",
          confirmColor: "#FF5000",
          content: "确认取消此订单？",
          success(res) {
            if (res.confirm) {
              orderCancle(pay_info).then(res => {
                self.funcRefershOrderList();
              });
            }
          }
        });
      } else if (items == "0003") {
        this.funcGoToOrderList(order_info);
        str = "查看物流";
      } else if (items == "0004") {
        this.funcAgainBuy(order_info);
        str = "再次购买";
      } else if (items == "0005") {
        this.goToLotComment(order_info);
        str = "去评价";
      } else if (items == "0006") {
        str = "申请退货";
      } else if (items == "0007") {
        let pay_info = {
          order_id: order_info.order_id
        };
        let self = this;
        wx.showModal({
          cancelColor: "#333333",
          confirmColor: "#FF5000",
          content: "请确认是否已收到货？",
          success(res) {
            if (res.confirm) {
              orderAccept(pay_info).then(res => {
                self.funcRefershOrderList();
              });
            }
          }
        });
        str = "确认收货";
      } else if (items == "0008") {
        this.funcGoToOrderList(order_info);
        str = "查看检验码";
      } else if (items == "0009") {
        let pay_info = {
          serial_num: order_info.serial_num
        };
        let self = this;
        wx.showModal({
          cancelColor: "#333333",
          confirmColor: "#FF5000",
          content: "确认删除此订单？",
          success(res) {
            if (res.confirm) {
              orderDelete(pay_info).then(res => {
                that.order_total_source.splice(index, 1);
                // self.funcRefershOrderList();
              });
            }
          }
        });
        str = "删除订单";
      } else {
      }
      return str;
    },

    funcRefershOrderList() {
      wx.startPullDownRefresh();
      // this.pageIndex = 1;
      // this.funcGetNetWorkInfo();
    },

    funcPreSellOrderInfo(res) {
      let url = '/pages/confirm/cash/main?type=100&serial_num=' + res.serial_num;
      wx.navigateTo({
        url: url,
      })
    },

    // 获取微信支付的参数
    funcWxpayInfomation(res) {
      debugger;
      let openid = wx.getStorageSync("openid");
      let product_name = "乐友孕婴童";
      let pay_info = {
        serial_num: res.serial_num,
        //detail: res.serial_num,
        //title: product_name,
        // type: "weixin",
        pay_money: res.payable_amount,
        // ipAddress: "0.0.0.0",
        type: "xunlian_small"
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
              // self.funcScan();
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

    funcGoScanCodeFinshPage(options) {
      let url =
        "/pages/confirm/scancode/finish/main?pay_info=" +
        JSON.stringify(options) +
        "&is_le_vip=0";
      wx.redirectTo({
        url: url
      });
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

    funcGoToEvaluation(pro_items) {
      let order_id = pro_items.order_id;
      let pro_list = pro_items.order_products;
    },

    funcGoFinshPage(options) {
      let url =
        "/pages/confirm/finish/main?pay_info=" +
        JSON.stringify(options) +
        "&is_le_vip=0";
      wx.redirectTo({
        url: url
      });
    },

    funcAgainBuy(order_info) {
      let pro_info_list = [];
      order_info.order_products.forEach(items => {
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
      let requset_info = {
        hander_cart: pro_info_list,
        is_uncheck: 1,
        cart_id: "0"
      };
      let order_type = "0";
      if (order_info.ext_type == "H" || order_info.ext_type == "G") {
        order_type = "3";
      }
      synAllShoppingCart(requset_info).then(res => {
        wx.navigateTo({
          url: "/pages/confirm/main?order_type=" + order_type
        });
      });
    },

    gotoLook() {
      wx.switchTab({
        url: "/pages/index/main"
      });
    },

    funcAdClick() {
      let token = wx.getStorageSync("token");
      let ad_info = this.BASE_AD_IMG_URL;
      // let link =  this.userDataList.baby_file_url;
      // wx.setStorageSync('urlH5', link);
      //   wx.navigateTo({
      //   url:'/pages/transferH5/main'
      // });
      if (ad_info.link) {
        // let url = "/pages/transferH5/main?url=" + ad_info.link +'&token=' + token+'&is_mini=1';
        let url = ad_info.link;
        wx.setStorageSync("urlH5", url);
        wx.navigateTo({
          url: "/pages/transferH5/main"
        });
      }
    },

    addInvoice() {
      wx.navigateTo({
        url: "/pages/shipAddress/changeAddress/main"
      });
    }
  }
};
</script>

<style scoped>
/* page {
  background: #f3f5f7;
} */
.backgroundView {
  background: #f3f5f7;
  height: 100vh;
  /* min-height: 1500rpx; */
}

.list_top {
  background: #fff;
  height: 76rpx;
  width: 100%;
  display: flex;
  justify-content: center;
}
.list_top_button {
  display: flex;
}
.list_top_online {
  height: 56rpx;
  width: 160rpx;
  line-height: 56rpx;
  text-align: center;
  font-size: 30rpx;
  border-radius: 30rpx 0 0 30rpx;
  background: #ffffff;
  border: 1px solid #ff5000;
  color: #ff5000;
}

.list_top_online.activity {
  background-image: linear-gradient(90deg, #ff8800 0%, #ff5000 100%);
  color: #fff;
  /* border: none; */
}

.list_top_shop {
  height: 56rpx;
  width: 160rpx;
  line-height: 56rpx;
  border-radius: 0 30rpx 30rpx 0;
  text-align: center;
  font-size: 30rpx;
  background: #ffffff;
  border: 1px solid #ff5000;
  color: #ff5000;
}

.list_top_shop.activity {
  background-image: linear-gradient(90deg, #ff8800 0%, #ff5000 100%);
  color: #fff;
  /* border: none; */
}

.user_coupon_tabs {
  display: flex;
  background: #ffffff;
  /* justify-content: space-between; */
}
.user_coupon_tab {
  /* width: 187rpx; */
  height: 64px;
  /* box-sizing: border-box; */
  /* margin: 0 20px; */
  flex: 1;
  display: flex;
  font-size: 30px;
  color: #333333;
  justify-content: center;
  /* justify-items: center; */
  align-items: center;
  /* line-height: 64px; */
}

.user_list_content {
  height: 64rpx;
  line-height: 64rpx;
  padding: 0 10rpx;
}

.user_list_content.activity {
  color: #ff5000;
  border-bottom: 4px #ff5000 solid;
}

.product_content {
  padding: 20rpx 20rpx 0rpx 20rpx;
  background: #f3f5f7;
}
.product_bg {
  background: #fff;
  border-radius: 10rpx;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
}
.product_title {
  height: 80rpx;
  font-size: 26rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: PingFangSC-Medium;
}
.productgif {
  width: 32rpx;
  height: 34rpx;
  margin-right: 8rpx;
}

.buttonBg {
  background-color: transparent;
}

.buttonBg::after {
  border: 0;
}

.product_list_bg {
  height: 180rpx;
  display: flex;
  /* flex-direction: row; */
  background: #fafafa;
  box-sizing: border-box;
  background: #fff;
  /* border-bottom: 1rpx solid #f3f5f7; */
}
.product_footer {
  height: 156rpx;
  /* display: flex; */
  /* flex-direction: -reverse; */
}
.product_footer_top {
  margin-top: 20rpx;
  /* flex-direction: row-reverse; */
  /* flex- */
  display: flex;
  justify-content: flex-end;
  font-size: 26rpx;
  color: #333;
  align-items: baseline;
}
.product_footer_bottom {
  /* flex-direction: row-reverse; */
  display: flex;

  justify-content: flex-end;
  margin-top: 28rpx;
  height: 52rpx;
}
/* .product_footer_price {
  display: flex;

} */

.list_button_color {
  border: 1rpx solid #333 !important;
  color: #333 !important;
}

.list_button_gray {
  background: #cacaca !important;
  color: #fff !important;
  border: none !important;
}

.list_button {
  border: #ff5000 1rpx solid;
  padding: 0 30rpx;
  line-height: 52rpx;
  color: #ff5000;
  background: #fff;
  text-align: center;
  font-size: 26rpx;
  border-radius: 30rpx;
  margin-left: 20rpx;
  height: 52rpx;
  /* width: 150rpx; */
}

.no_list_button {
  margin-top: 60rpx;
  padding: 0 60rpx;
  line-height: 52rpx;
  color: #fff;
  background: #ff5000;
  text-align: center;
  font-size: 26rpx;
  border-radius: 30rpx;
  margin-left: 40rpx;
  /* width: 150rpx; */
}

/* .product {
  height: 160rpx;

  padding: 20rpx;
  display: flex;

  background: #fafafa;
  box-sizing: border-box;
} */

.productIcon {
  margin-top: 10rpx;
  width: 150rpx;
  height: 150rpx;
  background: #fff;
}

.productContent {
  margin-left: 20rpx;
  width: 490rpx;
  height: 160rpx;
  box-sizing: border-box;
}

.productName {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #333;
  height: 73rpx;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.productStyle {
  margin-top: 8rpx;
  color: #999;
  line-height: 24rpx;
  font-size: 24rpx;
  height: 24rpx;
}
.productBottom {
  margin-top: 6rpx;
  display: flex;
  /* flex-direction: row; */
  justify-content: space-between;
  /* line-height: 25rpx; */
  align-items: center;
}

.product_return_status {
  height: 26rpx;
  width: 100%;
  text-align: right;
  font-size: 22rpx;
  color: #fab400;
  margin-top: 10rpx;
}

.productPriBg {
  display: flex;
  align-items: center;
}
.productPrice {
  color: #ff5000;
  font-size: 30rpx;
  display: flex;
  align-items: baseline;
}
.productVipIcon {
  width: 48rpx;
  height: 30rpx;
  margin-left: 8rpx;
  background: #000;
}
.productCount {
  color: #999;
  font-size: 24rpx;
}

.ad_bg {
  padding: 20rpx 20rpx 0 20rpx;
}

.ad_content {
  border-radius: 15rpx;
  width: 710rpx;
  vertical-align: bottom;
}
</style>


            <!-- <div class="productPriBg">
                  <div class="productPrice">
                    <span style="font-size:22rpx">¥</span>
                    <span>{{item.sale_price}}</span>
                  </div>
                  <img
                    v-if="(item.price_type === 1)"
                    class="productVipIcon"
                    src="/static/goodsdetail/product_sign_vip.png"
                  >
              </div>-->
