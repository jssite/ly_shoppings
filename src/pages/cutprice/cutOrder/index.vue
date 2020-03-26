<template>
    <div>
        <div class="backgroundView" :style="{'padding-bottom':global_margin_bottom + 'px'}">

            <order-header
                    v-on:headerViewClick="headerViewClick"
                    :is_select_meituan="is_select_meituan"
                    :order_type="7"
                    @gotoselect="gotoselect"
                    :arrival_time="arrival_time"
                    :header_info="responseData"
                    :encry_id_num="encry_id_num"
                    :is_select_shan="is_select_shan"
                    :show_shan="show_shan"
            ></order-header>
            <div class="product" v-for="(item, index) in ly_sku_list" :key="index">
                <!-- <div class="productIcon"></div> -->
                <div class="icon_bg">
                    <img class="product_icon" :src="skus.img_url" />
                    <span class="icon_desc" v-if="item.product_type == 1 && item.product_status == 1">赠品缺货</span>
                </div>
                <div class="productContent">
                    <div class="productName">
            <span
                    v-if="item.product_type == 1 || item.product_type == 6"
                    class="pro_sale_style"
            >{{item.product_type == 1 ?'赠品':'换购'}}</span>
                        <span>{{item.marketing_title}}</span>
                    </div>
                    <div class="productStyle">
                        <span v-if="item.color">颜色：{{item.color + ' '}}</span>
                        <span v-if="item.specifications">尺寸：{{item.specifications + ' '}}</span>
                    </div>
                    <div class="productBottom">
                        <div class="productPriBg">
                            <div v-if="item.product_type == 1" class="productPrice">
                                <span style="font-size:24rpx">赠品</span>
                            </div>
                            <div v-else class="productPrice">
                                <span style="font-size:22rpx">¥</span>
                                <span>{{skus.current_price}}</span>
                            </div>
                            <img
                                    v-if="(item.price_type === 1)"
                                    class="productVipIcon"
                                    src="/static/goodsdetail/product_sign_vip.png"
                            />
                        </div>
                        <div class="productCount">×{{item.qty}}</div>
                    </div>
                </div>
            </div>
            <div v-if="responseData.send_coupons" class="return_coupon">
                <span>返券</span>
                <div
                        style="margin-left:20rpx;height:32rpx;display:flex;align-items:center;margin-right:10rpx"
                        v-for="(item, index) in responseData.send_coupons"
                        :key="index"
                >
                    <img
                            src="/static/goodsdetail/product_label_couponleft.png"
                            style="width:12rpx;height:32rpx;"
                    />
                    <span class="coupon_content">{{item.title}}</span>
                    <img
                            src="/static/goodsdetail/product_label_couponright.png"
                            style="width:12rpx;height:32rpx"
                    />
                </div>
            </div>
            <div class="payView">
                <div class="payViewContent">
                    <div>支付方式</div>
                    <div>网上支付</div>
                </div>

                <!--<div class="payViewContent" v-if="responseData.is_vip">-->
                    <!--<div>企业尊享价（建议开启）</div>-->
                    <!--<switch-->
                            <!--class="paySwitch"-->
                            <!--:checked="responseData.is_use_vip"-->
                            <!--color="#ff5000"-->
                            <!--@change="funcVip"-->
                    <!--&gt;</switch>-->
                <!--</div>-->
                <div class="payViewContent" v-if="cash_money_use">
                    <div>账户余额支付{{responseData.cash_money}}元</div>
                    <switch class="paySwitch" color="#ff5000" @change="funcAccountMoney"></switch>
                </div>
                <!--<div class="payViewContent" v-if="responseData.le_vip_message">-->
                    <!--<div>{{responseData.le_vip_message}}</div>-->
                    <!--<switch checked="true" class="paySwitch" color="#ff5000" @change="funcLeVip"></switch>-->
                <!--</div>-->
                <!--<div class="payViewContent" v-if="responseData.use_first_fee_des">-->
                    <!--<div>{{responseData.use_first_fee_des}}</div>-->
                    <!--<switch checked="true" class="paySwitch" color="#ff5000" @change="funcFirstFree"></switch>-->
                <!--</div>-->
                <div  class="payViewContent" @click="funcGoInvoice">
                    <div>发票</div>
                    <div class="couponRight">
                        <div>{{com_invoice_contnt}}</div>
                        <img class="arrow" src="/static/goodsdetail/lecard_arrow_right.png" />
                    </div>
                </div>

            </div>

            <div class="accountList">
                <div class="accountListDetail" v-for="(item,index) in account" :key="index">
                    <div style="color:#333;font-size:26rpx">{{item.name}}</div>
                    <div style="color:#ff5000;font-size:26rpx">{{item.value}}</div>
                </div>
            </div>
        </div>
        <div v-if= "is_select_meituan&&is_select_shan" class="remindPopView">
            <div class="remindPopView" :animation="animation" v-if="responseData.leyou_flash">
                <view class="popViewTop" @click="funcMove">
                    <img class="popViewTopBg" src="/static/images/twohr_orderpop_title_bg.png" />
                    <div class="pop_view_top_content">
                        <div class="remindTitle">{{flash_select_way_desc}}</div>
                        <img class="remindIcon" v-if="is_pop" src="/static/images/twohr_orderpop_icon_up.png" />
                        <img class="remindIcon" v-else src="/static/images/twohr_orderpop_icon_down.png" />
                    </div>
                </view>
                <div
                        class="pop_select_way"
                        @click.stop="funcPopClick(index)"
                        v-for="(item ,index) in responseData.leyou_flash.lightning_order_transfer_list"
                        :key="index"
                >
                    <img
                            v-if="index == flash_select_way"
                            style="width:36rpx; height:36rpx;"
                            src="/static/images/public/publicCircle-checkOn.png"
                    />
                    <img
                            v-else
                            style="width:36rpx; height:36rpx;"
                            src="/static/images/public/publicCircle-checkOff.png"
                    />
                    <span style="margin-left:20rpx">{{item.transfer_type_desc}}</span>
                </div>
            </div>
        </div>
        <div class="submitBgView">
            <view class="submit_left">应付金额：</view>
            <!-- {{responseData.payable_amount}} -->
            <view class="submit_mid">
                <span style="font-size:26rpx;">¥</span>
                <span style="margin-left:3rpx">{{format_order_price[0]}}</span>
                <span style="font-size:24rpx">{{format_order_price[1]}}</span>
            </view>
            <view class="submit_right" @click="funcSubmitButtonClick">立即下单</view>
        </div>
        <div class="toast" @click="funcClose" v-if="show_toast" catchtouchmove="ture">
            <!-- 取消下单提示 -->
            <div class="toast_content" v-if="order_toast_type == 1">
                <div class="toast_content_title">下单6小时内未支付，订单将被取消，确认要放弃支付吗?</div>
                <div class="toast_content_button">
                    <div class="toast_content_cancle" @click="funCancle">确认放弃</div>
                    <div class="toast_content_sure" @click="funSure">继续支付</div>
                </div>
            </div>
            <!-- 缺货继续下单 -->
            <div
                    class="toast_content"
                    style="display:block; width:710rpx;position: relative;"
                    :style="{height:(707 - 320 + not_scroll_height) +'rpx'}"
                    v-else-if="order_toast_type == 2"
            >
                <img
                        @click="funcClose"
                        src="/static/images/public/public_pop_close.png"
                        style="width:44rpx;height:44rpx;"
                        class="toast_time_close"
                />
                <div style="margin-top:80rpx;margin-left:40rpx;color:#333;font-size:30rpx;">以下商品暂时缺货</div>
                <scroll-view
                        scroll-y="true"
                        class="toast_pro_bg"
                        :style="{height: not_scroll_height + 'rpx'}"
                >
                    <ordergoods v-for="(item,index) in error_pro_list" :key="index" :pro_info="item"></ordergoods>
                </scroll-view>
                <div class="toast_button_bg">
                    <button class="toast_go_pay" @click.stop="funcGoPayOrder(0)">继续下单</button>
                    <div
                            style="text-align:center; margin-top:28rpx;color:#999;font-size:26rpx;"
                    >我们将为您忽略以上商品继续下单</div>
                </div>
            </div>

            <!-- 缺货返回购物车 -->
            <div
                    class="toast_content"
                    style="display:block; width:710rpx;height:707rpx;position: relative;"
                    :style="{height:(707 - 320 + not_scroll_height) +'rpx'}"
                    v-else-if="order_toast_type == 3"
            >
                <img
                        @click="funcClose"
                        src="/static/images/public/public_pop_close.png"
                        style="width:44rpx;height:44rpx;"
                        class="toast_time_close"
                />
                <div style="margin-top:80rpx;margin-left:40rpx;color:#333;font-size:30rpx;">以下商品暂时缺货</div>
                <scroll-view
                        scroll-y="true"
                        class="toast_pro_bg"
                        :style="{height: not_scroll_height + 'rpx'}"
                >
                    <ordergoods v-for="(item,index) in error_pro_list" :key="index" :pro_info="item"></ordergoods>
                </scroll-view>
                <div class="toast_button_bg">
                    <button class="toast_go_pay" @click.stop="gotoIndex">返回首页</button>
                    <div
                            style="text-align:center; margin-top:28rpx;color:#999;font-size:26rpx;"
                    >该商品已经被人抢完啦。快去砍其他商品吧！</div>
                </div>
            </div>

            <!-- 运费展示 -->
            <div class="toast_content_express" v-else-if="order_toast_type == 4">
                <div class="toast_express_title">
                    运费说明
                    <img
                            @click="funcClose"
                            src="/static/images/public/public_pop_close.png"
                            style="width:44rpx;height:44rpx;"
                            class="toast_time_close"
                    />
                </div>
                <div
                        class="toast_content_pro"
                        v-for="(item, index) in responseData.freight_list"
                        :key="index"
                >
                    <div class="toast_express_pro_title">
                        <span style="color:#999">{{item.carrier}}</span>
                        <span style="color:#333">运费：¥{{item.freight}}</span>
                    </div>
                    <scroll-view
                            class="toast_express_pro_bg"
                            scroll-x="true"
                            style="wdith:710rpx;height:120rpx;"
                    >
                        <img
                                v-for="(item_pro,index_pro) in item.skulist"
                                :key="index_pro"
                                class="toast_express_pro_content"
                                :src="item_pro.img"
                        />
                    </scroll-view>

                </div>
            </div>

            <!-- 闪送可选时间toast -->
            <div class="toast_time_bg" v-if="order_toast_type == 5">
                <div class="toast_time_title_bg">
                    <div class="toast_time_title">选择预计送达时间</div>
                    <img
                            @click="funcClose"
                            src="/static/images/public/public_pop_close.png"
                            style="width:44rpx;height:44rpx;"
                            class="toast_time_close"
                    />
                </div>
                <div class="toast_time_content_bg">
                    <div
                            @click.stop="funcTimeInfo(index)"
                            class="toast_time_content_left"
                            v-for="(item, index) in responseData.leyou_flash.lightning_reserve_time_list"
                            :key="index"
                    >
                        <div
                                class="toast_time_content_time"
                                :class="{activity:index == select_time}"
                        >{{item.day}}</div>
                    </div>

                    <div class="toast_time_content_right">
                        <scroll-view scroll-y="true" style="height:512rpx;background:#fff">
                            <div
                                    @click.stop="funcTimeDetail(index_detail)"
                                    class="toast_time_content_detail"
                                    v-for="(item_detail, index_detail) in time_content_detail"
                                    :key="index_detail"
                                    :class="{activity:index_detail == select_time_detail}"
                            >
                                <div>
                  <span
                          v-if="time_is_show_arrival_time && index_detail == 0"
                          style="margin-right:10rpx"
                  >立即送达：</span>
                                    <span>{{item_detail.time_limit}}</span>
                                </div>
                                <img
                                        src="/static/images/confirm/order_pay_succeecd.png"
                                        style="width:50rpx;height:50rpx"
                                        v-show="index_detail == select_time_detail"
                                />
                            </div>
                        </scroll-view>
                    </div>
                </div>
                <!-- </div> -->
            </div>
            <div v-else></div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from "vuex";
    import {
        getSubmitOrderInfo,
        userSubmitOrder,
        userGetPayInfomaiton,
        getHaiTaoSubmitOrderInfo,
        userHaiTaoSubmitOrder,
        checkHaiTaoIdCard,
        getSmgSubmitOrder,
        userSmgSubmitOrder,
        anyOrderInfo,
        anySubmitOrder,
        updateOrder
    } from "@/api";
    import ordergoods from "@/components/product/ordergoods";
    import orderHeader from "@/components/order/header/";
    import { EventBus } from "@/bus/event-bus.js";
    import wxParse from "mpvue-wxparse";
    import { priceFormat } from "@/utils";
    import { sa } from "@/utils/sensorsdata.js";
    const app = getApp();

    // import funcGlobalWxpayInfomation from "@/utils/gopay.js";

    export default {
        components: {
            ordergoods,
            orderHeader,
            wxParse
        },

        data() {
            return {
                is_select_shan:false,
                global_margin_bottom: 156,
                // base_url: BASE_IMG_URL,
                show_toast: false,
                // 1 下单提醒  2 缺货继续下单  3 缺货返回购物车 4 显示运费
                order_toast_type: 1,
                // 闪送平移动画
                animation: {},
                // 闪送处理方式
                flash_select_way: -1,
                not_scroll_height: 320,
                // 缺货清单
                error_pro_list: [],
                express_pro_bg_width: 750,
                encry_id_num: "",
                is_pop: true,
                // 支付信息清单
                account: [],
                // 礼金卡金额
                card_price: "",
                // 闪送标记选择的时间
                select_time: 0,
                select_time_detail: 0,
                // 商品列表
                ly_sku_list: [],
                // 乐享卡信息
                vip_info: {
                    buy_vip: true
                },
                // 可用优惠券
                coupon: {},
                // 可用优惠券列表
                useable_list: [],
                // 0 黑色  1 红色  2 红加黑
                coupon_state_color: 0,
                coupon_free_state: {
                    free_show: false,
                    free_color_red: false
                },

                invoice_mark: {
                    invoice_type: 0,
                    invoice_person: 0,
                    invoice_content: ""
                },
                // 公司发票信息
                invoice_info: {
                    invoice_title: "",
                    invoice_content: "",
                    invoice_id: 0
                },
                // 第一次支持闪送 自动选中
                is_auto_select_meituan: false,
                // 使用账户余额
                cash_money_use: false,
                // 使用礼金卡
                gift_card_use: false,

                consignee_id_card: "",
                // 0:普通类型  1:门店自提  2:闪送  3:海淘  4:预售  5:扫码购  6:兑换券订单
                order_type: 0,
                // 普通订单类型 是否选中乐闪送
                is_select_meituan: true,

                sea_resquest_info: {},

                exchangeCoupon: {},
                skus:"",
                // 请求信息
                show_shan:false,
                request_info: {
                    // 是否使用包邮券 默认使用 0 使用 1不使用
                    use_free_freight: "0",
                    // 企业内购 默认使用
                    is_use_vip: true,
                    // 首免金额 默认使用
                    is_use_first_fee: true,
                    // 快递配送且未购买乐享卡需要传 默认不购买
                    is_buy_vip: false,
                    // 闪送入口  1  普通订单 0
                    shop_lightning_order: 0,
                    // 门店id
                    // shops: "",
                    // 是否门店自提 扫码购 门店自提 1
                    is_o2o: "0",
                    // 乐享卡 默认使用
                    is_use_le_vip: true,
                    // 账户余额 默认使用
                    use_cash_money: "0",
                    // 门店自提
                    is_o2o: false,
                    // 忽略赠品  乐闪送订单不忽略  剩余的订单类型会在购物车拦截 但凡是能进到提交订单的都是忽略赠品
                    is_ignore_gift_stock: true,
                    // 默认使用优惠券
                    use_coupon: "0",
                    use_gift_card: "1",
                    card_num: "",
                    card_password: ""
                },
                responseData: {},
                confirm_address_info: {},
                shop_name:''
            };
        },

        mounted() {
            // 发票
            EventBus.$on("invoiceSubmit", ({ type, info }) => {
                this.$nextTick(() => {
                    this.invoice_mark = type;
                    this.invoice_info = info;
                });
            });


            //  地址
            EventBus.$on("addressSubmit", info => {
                console.log(info);
            this.request_info.address_id = info.address_id;
            this.funcGetNetWorkInfo();
        });


        },

        computed: {
            BASE_IMG_URL() {
                return this.$store.state.BASE_APP_INFO["download_le_image"];
            },

            // 发票信息
            com_invoice_contnt() {
                if (this.invoice_mark.invoice_type == 2) {
                    if (this.invoice_mark.invoice_person == 2) {
                        return "电子-" + this.invoice_info.invoice_title;
                    } else {
                        return "电子-个人";
                    }
                } else {
                    return "不开发票";
                }
            },

            // 自定义闪送时间
            arrival_time() {
                if (this.is_select_meituan) {
                    let flash = this.responseData.leyou_flash;
                    if (flash && flash.support) {
                        let lightTimeInfoArray = this.responseData.leyou_flash
                            .lightning_reserve_time_list;
                        let lightTimeInfo = lightTimeInfoArray[this.select_time];
                        let lightTimeDeatil =
                            lightTimeInfo.available_time_list[this.select_time_detail];
                        let time_limit = lightTimeDeatil.time_limit;
                        // 修改这个立即送达
                        if (lightTimeInfo.is_today == 0 && this.select_time_detail == 0) {
                            return "立即送达  " + time_limit;
                        } else {
                            return lightTimeInfo.day + "  " + time_limit;
                        }
                    } else {
                        return "";
                    }
                } else {
                    return "";
                }
            },

            //  添加立即送达
            time_is_show_arrival_time() {
                if (this.is_select_meituan || this.order_type == 2) {
                    let flash = this.responseData.leyou_flash;
                    if (flash && flash.support) {
                        let lightTimeInfoArray = this.responseData.leyou_flash
                            .lightning_reserve_time_list;
                        let lightTimeInfo = lightTimeInfoArray[this.select_time];
                        if (lightTimeInfo.is_today == 0) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },

            // 初始显示闪送送货时间
            time_content_detail() {
                if (this.is_select_meituan || this.order_type == 2) {
                    let flash = this.responseData.leyou_flash;
                    if (flash && flash.support) {
                        let lightTimeInfoArray = this.responseData.leyou_flash
                            .lightning_reserve_time_list;
                        let lightTimeInfo = lightTimeInfoArray[this.select_time];
                        return lightTimeInfo.available_time_list;
                    } else {
                        return [];
                    }
                } else {
                    return [];
                }
            },

            flash_select_way_desc() {
                let flash = this.responseData.leyou_flash;
                if (flash && flash.support&& this.is_select_shan) {
                    let select_title = "";
                    // let index = wx.getStorageSync('select_way');
                    let index = this.flash_select_way;
                    if (index >= 0) {
                        let transfer_info = this.responseData.leyou_flash
                            .lightning_order_transfer_list[index];
                        if (transfer_info) {
                            select_title =
                                this.responseData.leyou_flash.lightning_order_transfer_title +
                                transfer_info.transfer_type_desc;
                        } else {
                            select_title = "";
                        }
                    } else {
                        select_title =
                            this.responseData.leyou_flash.lightning_order_transfer_title +
                            "请选择处理方式";
                    }
                    return select_title;
                } else {
                    return "";
                }
            },

            // 修改价格
            format_order_price() {
                if (this.responseData.payable_amount) {
                    return priceFormat(this.responseData.payable_amount);
                } else {
                    return ["0", ".00"];
                }
            },

            vip_info_title() {
                let url = "";
                if (this.vip_info) {
                    url =
                        '<div style="font-family:PingFangSC-Medium;font-size: 30rpx; padding:5rpx ">' +
                        this.vip_info.order_discount +
                        "</div>";
                }
                return url;
            },

            vip_info_content() {
                let url = "";
                if (this.vip_info) {
                    url =
                        '<div style="font-family:PingFangSC-Regular;font-size: 22rpx;">' +
                        this.vip_info.vip_display_info +
                        "</div>";
                }
                return url;
            }
        },

        onLoad(options) {
            console.log(options)
            var skus =JSON.parse(options.skus)
            this.skus=skus
            console.log(skus)

            // 0:普通类型  1:门店自提  2:闪送  3:海淘  4:预售  5:扫码购  6:兑换券订单
            // this.order_type = options.params.order_type;
            // debugger
            // console.log(options);
            this.clearGlobalData();
            // let shop_name = wx.getStorageSync('shop_name');
            // this.shop_name = shop_name;
            // if (options.is_use_vip && options.is_use_vip == "1") {
            //     this.is_use_vip = true;
            // } else {
            //     this.is_use_vip = false;
            // }
            // this.is_use_vip = false;
            let request = {
                "use_cash_money":1,
                "address_id":skus.address_id||-2147481197,
                "is_o2o":false,
                "has_ship_money":skus.has_ship_money,
                "skulist":[{"sku":skus.sku,"qty":1,"sale_price":skus.current_price}]};
            this.request_info = request;
            console.log("请求参数参数", this.request_info);

            anyOrderInfo(this.request_info).then(response => {
                if(response.body.leyou_flash&&response.body.leyou_flash.support){
                    this.is_select_shan=true
                    this.show_shan=true
                }else{
                }
            });

        },
        onShow(){
            console.log(this.request_info)
            this.show_toast=false
            if(wx.getStorageSync('kanAddress')){
                this.request_info.shops=wx.getStorageSync('kanAddress').shop_id
                this.request_info.is_o2o=true
                wx.removeStorageSync('kanAddress')
            }
            this.funcGetNetWorkInfo();

        },
        onUnload() {
            EventBus.$off();
            // console.log('卸载卸载');
        },

        methods: {
            gotoIndex(){
                wx.navigateTo({
                    url:'/pages/cutprice/cutList/main'
                })
            },
            clearGlobalData() {
                (this.select_time = 0),
                    (this.select_time_detail = 0),
                    (this.responseData = {});
                this.ly_sku_list = [];
                this.account = [];
                this.vip_info = [];
                this.cash_money_use = false;
                this.gift_card_use = false;
                (this.coupon_state_color = 0),
                    (this.coupon_free_state = {
                        free_show: false,
                        free_color_red: false
                    }),
                    // (this.invoice_info = {});
                    (this.invoice_mark = {
                        invoice_type: 0,
                        invoice_person: 0,
                        invoice_content: ""
                    }),
                    // 公司发票信息
                    (this.invoice_info = {
                        invoice_title: "",
                        invoice_content: "",
                        invoice_id: 0
                    }),
                    (this.is_auto_select_meituan = false);
                this.is_select_meituan = true;
                this.confirm_address_info = {};
            },

            couponInfoWithMyCouponInfo(coupon) {
                let orderCoupon = {};
                // 后加入的字段 代替后台之前定义的id
                orderCoupon.coupon_id = coupon.coupon_id;
                orderCoupon.prod_title = coupon.title;
                orderCoupon.value = coupon.amount;
                orderCoupon.coupon_type = coupon.coupon_type;
                orderCoupon.promotion_id = coupon.promotion_id;
                orderCoupon.id = coupon.id;
                return orderCoupon;
            },

            // 普通订单 和 闪送
            funcGetNetWorkInfo() {
                /*
               需要购物车传递的参数
              1. 商品列表 skulist 不包含赠品
              2. 订单类型 order_type 0:普通类型  1:门店自提 2:闪送  3:海淘  4:预售  5:扫码购
              3. 是否使用企业尊享 is_use_vip
              4.
              */
                let self = this;
                console.log("请求参数参数", this.request_info);
                wx.showLoading({ title: "加载中...", mask: true });
                anyOrderInfo(this.request_info).then(response => {
                    wx.hideLoading();
                let code = response.header.res_code;
                let message = response.header.message;
                if (code == 0) {
                    let res = response.body;
                    this.funcFillNoramlData(res);
                } else if (code == 6002019) {
                    let res = response.body;
                    this.funcFillNoramlData(res);
                    this.show_toast_info(res);
                } else if (code == 6001002 || code == 6001003 || code == 6001007) {
                    this.funcToast(message);
                } else if (code == 6001000 || code == 6001001 || code == 6001006) {
                    let res = response.body;
                    this.funcFillNoramlData(res);
                    this.funcToast(message);
                } else if (code == 6001005) {
                    let res = response.body;
                    this.funcFillNoramlData(res);
                    // 地址不完整
                    if (res.lately_address_id) {
                        this.request_info.address_id = res.lately_address_id;
                    }
                    this.funcToast(message);
                }else if(code == 600002) {
                    let res = response.body;
                    this.funcFillNoramlData(res);
                } else {
                    if(message)this.funcToast(message);
                }
            });
            },

            // ********分割线以下是属于缺货的本地逻辑 --------------------------------- *****

            // 结算订单的赠品缺失

            //  OrderGoodsOrGiftNo  =  6002019 赠品原品缺失



            // ********分割线以上是属于缺货的本地逻辑 --------------------------------- *****

            // 闪送和普通订单填充信息

            funcFillNoramlData(res) {
                console.log(res);
                this.responseData = res;
                if (res.consumption_descs) {
                    this.account = res.consumption_descs;
                }
                if (res.vip_info) {
                    this.vip_info = res.vip_info;
                }

                let sku_list_temp = [];
                if (res.zero.group_zeros) {
                    res.zero.group_zeros.map(skuinfo => {
                        sku_list_temp.push(...skuinfo.skulist);
                });
                }
                if (res.ly.skulist) {
                    sku_list_temp = [...res.ly.skulist, ...sku_list_temp];
                }
                this.ly_sku_list = sku_list_temp;

                // 账户余额
                if (res.cash_money) {
                    this.cash_money_use = parseFloat(res.cash_money) > 0;
                } else {
                    this.cash_money_use = false;
                }

                if (res.gift_card_amount) {
                    this.gift_card_use = parseFloat(res.gift_card_amount) > 0;
                } else {
                    this.gift_card_use = false;
                }
                if (res.lately_address_id) {
                    this.request_info.address_id = res.lately_address_id;
                }
                if (this.invoice_info.invoice_id == 0 && res.invoice_info) {
                    this.invoice_info = res.invoice_info;
                }

                // 普通订单 闪送头的显示
                if (res.leyou_flash) {
                    let support = res.leyou_flash.support;
                    if (support && this.is_select_meituan&&this.is_select_shan) {
                        this.funcConfigFlashSelect();
                        this.request_info.ship_method = "ms";
                    }
                }

                // 包邮券
                if (res.free_freight_list && res.free_freight_list.length) {
                    this.coupon_free_state.free_show = true;
                    if (res.free_freight_coupons && res.free_freight_coupons.coupon_id) {
                        // this.coupon_free_title = "已使用包邮券";
                        this.coupon_free_state.free_color_red = true;
                        this.request_info.use_free_freight = "0";
                        this.request_info.use_coupon_list = [res.free_freight_coupons];
                    } else {
                        this.request_info.use_free_freight = "1";
                        this.coupon_free_state.free_color_red = false;
                        this.request_info.use_coupon_list = [];
                    }
                } else {
                    this.request_info.use_free_freight = "1";
                    this.coupon_free_state.free_show = false;
                    this.request_info.use_coupon_list = [];
                }

                // 优惠券
                if (res.coupon_available && parseInt(res.coupon_available) > 0) {
                    if (res.coupons && parseInt(res.coupons.value) > 0) {
                        this.coupon_state_color = 2;
                        this.request_info.use_coupon = "0";
                        this.request_info.coupon_id = res.coupons.coupon_id;
                    } else {
                        this.coupon_state_color = 1;
                        this.request_info.coupon_id = "";
                        this.request_info.use_coupon = "1";
                    }
                } else {
                    this.request_info.use_coupon = "1";
                    this.coupon_state_color = 0;
                    this.request_info.coupon_id = "";
                }
                this.funcFillAddressInfo(res);
            },

            funcFillAddressInfo(res) {
                this.confirm_address_info.mobile = res.consignee_mobile;
                this.confirm_address_info.consignee = res.consignee_name;
                this.confirm_address_info.address_id = res.lately_address_id;
                this.confirm_address_info.provinceId = res.post_province_id;
                this.confirm_address_info.area_id = res.post_district_id;
                this.confirm_address_info.city_id = res.post_city_id;
                this.confirm_address_info.province = res.post_province;
                this.confirm_address_info.city = res.post_city;
                this.confirm_address_info.area = res.post_district;
            },

            funcSubmitButtonClick() {
                if (this.is_select_meituan) {
                    if (this.responseData.leyou_flash) {
                        let flash_info = this.responseData.leyou_flash;
                        if (flash_info.support&&this.is_select_shan) {
                            if (this.flash_select_way == -1) {
                                this.funcToast("请选择未接单处理方式");
                                if (this.is_pop) {
                                    this.funcMove();
                                }
                                return;
                            }
                            this.funcSubmitOrder();

                        } else {
                            this.funcSubmitOrder();
                        }
                    } else {
                        this.funcSubmitOrder();
                    }
                } else {
                        if(!this.responseData.shop_info){
                        wx.showToast({
                            title:'请选择自提门店',
                            icon:'none'
                        })
                        return
                    }else{
                        this.funcSubmitOrder();
                    }
                }
                // this.funcPayInfomation({});
                // return;
                // if (this.is_select_meituan || this.order_type === 2) {
                //     if (this.responseData.leyou_flash) {
                //         let flash_info = this.responseData.leyou_flash;
                //         if (flash_info.support) {
                //             // if (flash_info.edit_address) {
                //             //   // 编辑地址去
                //             // } else {
                //             this.funcSubmitWithToast();
                //             // }
                //         } else {
                //             if (this.order_type === 2) {
                //                 this.funcToast(
                //                     "您选择的商品暂不支持1小时达，请返回购物车挑选其他商品"
                //                 );
                //                 return;
                //             }
                //         }
                //     } else {
                //         this.funcSubmitWithToast();
                //     }
                // } else {
                // }
            },





            funcSubmitOrder() {
                let pay_orderInfo = {};
                // if (this.order_type === 3) {
                //   // 海淘信息
                // } else if (this.order_type === 4) {
                //   // 预售订单
                // } else {
                pay_orderInfo.ship_time_id = "3";
                pay_orderInfo.refund_method = "2";
                pay_orderInfo.form_token = this.responseData.form_token;
                pay_orderInfo.is_use_vip = this.request_info.is_use_vip;
                pay_orderInfo.is_use_le_vip = this.request_info.is_use_le_vip;
                pay_orderInfo.is_ignore_gift_stock = this.request_info.is_ignore_gift_stock;
                pay_orderInfo.from_type = "MINI";
                pay_orderInfo.card_num = this.request_info.card_num;
                pay_orderInfo.card_password = this.request_info.card_password;
                pay_orderInfo.use_cash_money = this.request_info.use_cash_money;
                pay_orderInfo.is_use_first_fee = this.request_info.is_use_first_fee;
                pay_orderInfo.shop_lightning_order = this.request_info.shop_lightning_order;
                pay_orderInfo.has_ship_money=this.skus.has_ship_money;

                // 使用兑换券
                // pay_orderInfo.use_free_freight = this.request_info.use_free_freight;
                // if (this.order_type == 6) {
                //   pay_orderInfo.use_coupon_list = this.request_info.use_coupon_list;
                // } else {
                //   if (this.request_info.use_free_freight == "0") {
                //     pay_orderInfo.use_coupon_list = this.request_info.use_coupon_list;
                //   }
                // }
                // 使用优惠券
                if (this.request_info.use_coupon == "0" && this.order_type != 6) {
                    pay_orderInfo.coupon_id = this.request_info.coupon_id;
                }

                if (this.request_info.skulist) {
                    pay_orderInfo.skulist = this.request_info.skulist;
                }
                if (this.responseData.pay_method) {
                    pay_orderInfo.pay_method = this.responseData.pay_method[0].value;
                } else {
                    pay_orderInfo.pay_method = "ONLINE";
                }

                if (this.invoice_mark.invoice_type === 2 && this.order_type != 3) {
                    pay_orderInfo.invoice_type = 2;
                    if (this.invoice_mark.invoice_person == 1) {
                        pay_orderInfo.invoice_title = "个人";
                        pay_orderInfo.invoice_contect = this.invoice_mark.invoice_content;
                    } else {
                        pay_orderInfo.invoice_title = this.invoice_info.invoice_title;
                        pay_orderInfo.invoice_contect = this.invoice_info.invoice_content;
                    }
                    if (
                        this.invoice_info.invoice_id != 0 &&
                        this.invoice_mark.invoice_person == 2
                    ) {
                        pay_orderInfo.invoice_id = this.invoice_info.invoice_id;
                    }
                } else {
                    pay_orderInfo.invoice_type = 0;
                }
                if (
                    this.request_info.use_coupon_list &&
                    this.request_info.use_coupon_list.length
                ) {
                    pay_orderInfo.use_coupon_list = this.request_info.use_coupon_list;
                }
                if (this.responseData.vip_info) {
                    pay_orderInfo.is_buy_vip = this.request_info.is_buy_vip;
                }
                if (this.request_info.coupons_id && this.request_info.coupon_id != "") {
                    pay_orderInfo.coupon_id = this.request_info.coupon_id;
                }

                if (this.is_select_meituan) {
                    let flash = this.responseData.leyou_flash;
                    if (flash && flash.support&&this.is_select_shan) {
                        this.funcOperationFlashData(pay_orderInfo);
                    } else {
                        pay_orderInfo.ship_method = "j";
                        pay_orderInfo.address_id = this.request_info.address_id;

                    }
                } else {
                    pay_orderInfo.ship_method = "mt";
                    pay_orderInfo.shops = this.responseData.shop_info.shop_id;
                }

                wx.showLoading({ title: "加载中...", mask: true });
                console.log(pay_orderInfo)
                anySubmitOrder(pay_orderInfo).then(response => {
                    if (response.header.res_code == 0) {
                    let res = response.body;
                    updateOrder({ cut_id:this.skus.cut_id,  order_id:res.order_id}).then(datas=>{
                        console.log(res);
                        if (res.is_to_pay) {
                            this.funcWxpayInfomation(res);
                        } else {
                            wx.hideLoading();
                            this.funcGoFinshPage(res);
                        }
                    })
                } else if (response.header.res_code == 6002019) {
                    wx.hideLoading();
                    let res = response.body;
                    this.show_toast_pay_submit(res);
                } else if (
                    response.header.res_code == 6002004 ||
                    response.header.res_code == 6002001
                ) {
                    wx.hideLoading();
                    let self = this;
                    let message = response.header.message;
                    wx.showModal({
                        cancelColor: "#333333",
                        confirmColor: "#FF5000",
                        content: message,
                        success(res) {
                            if (res.confirm) {
                                self.funcGoAddressPage();
                            }
                        }
                    });
                } else {
                    wx.hideLoading();
                    this.funcToast(response.header.message);
                }
            });
                // }
            },
            // 提交订单
            show_toast_pay_submit(res) {
                // body...
                let allPro = res.all_sku_list;
                let errorPro = res.errorProducts;
                this.oeprationGoodsNotEnough(allPro, errorPro);
            },
            detailWithErrorInfo(errorProInfo) {
                let detailInfo = {};
                detailInfo.qty = errorProInfo.qty;
                detailInfo.marketing_title = errorProInfo.marketing_title;
                detailInfo.sku = errorProInfo.sku;
                detailInfo.sale_price = errorProInfo.sale_price;
                detailInfo.img = errorProInfo.image;
                detailInfo.color = errorProInfo.color;
                detailInfo.specifications = errorProInfo.specifications;
                detailInfo.product_type = errorProInfo.product_type;
                detailInfo.staff_id = errorProInfo.staff_id;
                detailInfo.stock = errorProInfo.stock;
                return detailInfo;
            },

            oeprationGoodsNotEnough(allPro, errorPro) {
                let errorInstance = {};
                errorPro.forEach(items => {
                    let error_pro_dict = this.detailWithErrorInfo(items);
                if (items.product_type != 1) {
                    let sku = items.sku;
                    errorInstance[sku] = error_pro_dict;
                } else {
                    // 存在赠品缺货  标记赠品缺货
                    this.request_info.is_ignore_gift_stock = true;
                }
             });

                let isHaveStock = true;
                let compareStockContinue = true;
                let changePro = [];
                allPro.map(items => {
                    if (items.product_type == 1) {
                    return;
                }
                let error_pro = errorInstance[items.sku];
                if (error_pro) {
                    if (error_pro.product_type == 1) {
                        // 标记 赠品缺货
                        this.request_info.is_ignore_gift_stock = true;
                    } else {
                        if (parseInt(error_pro.stock) > 0) {
                            // items.qty = error_pro.stock;
                            if (compareStockContinue) {
                                compareStockContinue = false;
                                isHaveStock = true;
                            }
                            error_pro.qty = error_pro.stock;
                            error_pro.sale_price = items.sale_price;
                            error_pro.staff_id = items.staff_id;
                            // return items;
                            changePro.push(error_pro);
                        } else {
                            // 库存为0 完全缺货
                            if (compareStockContinue) {
                                isHaveStock = false;
                            }
                        }
                    }
                } else {
                    if (items.product_type != 1) {
                        changePro.push(items);
                        if (compareStockContinue) {
                            compareStockContinue = false;
                            isHaveStock = true;
                        }
                    }
                }
            });

                if (isHaveStock) {
                    // 部分缺货	toast
                    this.show_toast = true;
                    this.order_toast_type = 2;
                    this.goods_enough_list = changePro;
                } else {
                    this.show_toast = true;
                    this.order_toast_type = 3;
                    // 完全缺货  返回购物车
                }

                this.error_pro_list = errorPro;
                if (this.error_pro_list.length < 2) {
                    this.not_scroll_height = 160;
                } else {
                    this.not_scroll_height = 320;
                }
            },
            funcGoAddressPage() {
                let address_id = "0";
                if (this.responseData.lately_address_id) {
                    address_id = this.responseData.lately_address_id;
                }
                let type = 0;
                let shops = -1;
                let flash = this.responseData.leyou_flash;
                if (flash && flash.support && this.is_select_meituan) {
                    type = 1;
                    shops = flash.shop_id;
                }
                let url =
                    "/pages/confirm/orderAdd/main?address_id=" +
                    address_id +
                    "&address_type=" +
                    type +
                    "&address_shop=" +
                    shops;
                wx.navigateTo({
                    url: url
                });
            },

            // 闪送的请求参数整理
            funcOperationFlashData(options) {

                if (this.responseData.leyou_flash) {
                    let flash = this.responseData.leyou_flash;
                    options.shops = flash.shop_id;
                    options.address_id = this.request_info.address_id;
                    options.ship_method = "ms";

                    let time_info = flash.lightning_reserve_time_list[this.select_time];
                    let available_time =
                        time_info.available_time_list[this.select_time_detail];
                    options.available_time = available_time;
                    let transInfo =
                        flash.lightning_order_transfer_list[this.flash_select_way];
                    options.transfer_type = transInfo.transfer_type;
                }
            },
            gotoselect(){
                wx.navigateTo({url: '/pages/shop/shopSelect/main?kanjia=1'+'&sku='+this.skus.sku})
            },
            // 地址头的点击事件
            headerViewClick(sender) {
                console.log(sender);
                // key 1  选中 状态   1:乐闪送   2: 快递配送
                // key 2  地址切换    1:乐闪送   2: 快递配送
                // key 3  切换送达时间
                // key 4  验证身份证

                if (sender.key === 1) {
                    if (sender.value == 1) {

                        this.is_select_shan=true

                        this.is_select_meituan = true;
                        this.request_info.ship_method = "ms";
                        this.request_info.is_o2o = false;
                        this.funcGetNetWorkInfo();
                    } else if (sender.value == 2) {
                        this.is_select_shan=false
                        this.is_select_meituan = true;
                        this.request_info.ship_method = "j";
                        this.request_info.is_o2o = false;
                        this.funcGetNetWorkInfo();
                    } else {
                        this.is_select_meituan = false;
                        this.request_info.ship_method = "mt";
                        this.request_info.is_o2o = true;
                        this.funcGetNetWorkInfo();
                    }
                } else if (sender.key === 2) {
                    // 跳转地址列表


                    this.funcGoAddressPage();
                    // let address_id = "0";
                    // if (this.responseData.lately_address_id) {
                    //   address_id = this.responseData.lately_address_id;
                    // }
                    // let type = 0;
                    // let shops = -1;
                    // if (this.order_type == 2 || this.is_select_meituan) {
                    //   if (this.is_select_meituan) {
                    //     type = 1;
                    //   } else {
                    //     type = 2;
                    //   }
                    //   let flash = this.responseData.leyou_flash;
                    //   shops = flash.shop_id;
                    //   // shops = this.request.shops;
                    // }
                    // let url =
                    //   "/pages/confirm/orderAdd/main?address_id=" +
                    //   address_id +
                    //   "&address_type=" +
                    //   type +
                    //   "&address_shop=" +
                    //   shops;
                    // wx.navigateTo({
                    //   url: url
                    // });
                } else if (sender.key === 3) {
                    // 修改闪送到达时间
                    this.show_toast = true;
                    this.order_toast_type = 5;
                } else if (sender.key == 4) {
                    let id_num = sender.value;
                    let request = {
                        name: this.responseData.consignee_name,
                        address_id: this.responseData.lately_address_id,
                        idcard: id_num
                    };
                    checkHaiTaoIdCard(request).then(response => {
                        if (response.header.res_code == 0) {
                        this.consignee_id_card = id_num;
                        this.func_encry_id_num();
                    } else {
                        this.funcToast(response.header.message);
                    }
                    console.log(response);
                });
                }
            },

            // 身份证号显示*
            func_encry_id_num() {
                if (
                    this.consignee_id_card.length == 18 ||
                    this.consignee_id_card.length == 15
                ) {
                    let strt = this.consignee_id_card;
                    let array = [];
                    for (let index = 0, jk = strt.length; index < jk; index++) {
                        let lastIndex = 11;
                        if (jk == 18) {
                            lastIndex = 14;
                        }
                        if (index < 3 || index > lastIndex) {
                            array.push(strt.charAt(index));
                        } else {
                            array.push("*");
                        }
                    }
                    this.encry_id_num = array.toString().replace(/\,/g, "");
                }
            },

            // 选择优惠券
            funcGoCoupon(is_coupon) {
                let coupon_info = {};
                if (is_coupon == "0") {
                    let un_use = this.responseData.un_useable_list;
                    if (!un_use) {
                        un_use = [];
                    }
                    let use = this.responseData.useable_list;
                    if (!use) {
                        use = [];
                    }
                    coupon_info = {
                        un_useable_list: un_use,
                        useable_list: use
                    };
                } else {
                    let use = this.responseData.free_freight_list;
                    if (!use) {
                        use = [];
                    }
                    coupon_info = {
                        useable_list: use
                    };
                }

                let url =
                    "/pages/confirm/coupons/main?is_coupon=" +
                    is_coupon +
                    "&coupon_info=" +
                    JSON.stringify(coupon_info);
                wx.navigateTo({
                    url: url
                });
            },

            //  使用企业内购
            funcVip(e) {
                // console.log(e.target.value);
                this.request_info.is_use_vip = e.target.value;
                this.funcGetNetWorkInfo();
            },

            // 使用乐享
            funcLeVip(e) {
                this.request_info.is_use_le_vip = e.target.value;
                this.funcGetNetWorkInfo();
            },

            // 账户余额
            funcAccountMoney(e) {
                if (e.target.value) {
                    this.request_info.use_cash_money = "0";
                } else {
                    this.request_info.use_cash_money = "1";
                }
                this.funcGetNetWorkInfo();
            },

            // 使用首免
            funcFirstFree(e) {
                this.request_info.is_use_first_fee = e.target.value;
                this.funcGetNetWorkInfo();
            },
            // 开通乐享卡
            funcOpenVip(e) {
                this.request_info.is_buy_vip = e.target.value;
                this.funcGetNetWorkInfo();
            },

            // 跳转发票
            funcGoInvoice() {
                let sender = {
                    type: this.invoice_mark,
                    info: this.invoice_info
                };
                let senderJson = JSON.stringify(sender);
                wx.navigateTo({
                    url:
                        "/pages/confirm/invoice/invoiceSelect/main?invoice_info=" + senderJson
                });
            },


            // 礼金卡
            funcGoGiftcard() {
                wx.navigateTo({
                    url:
                        "/pages/confirm/giftcard/main?card_num=" +
                        this.request_info.card_num +
                        "&card_price=" +
                        this.card_price
                });
            },

            // 关闭弹层
            funcClose() {
                this.show_toast = false;
            },

            funcTimeInfo(index) {
                this.select_time = index;
            },

            funcTimeDetail(index) {
                this.select_time_detail = index;
                this.funcClose();
            },

            funcMove() {
                if (this.is_pop) {
                    this.funcPop();
                } else {
                    this.funcDismiss();
                }
            },

            funcPop() {
                console.log("动画动画动画动画动画");
                this.is_pop = false;
                let animation_export = wx.createAnimation({
                    duration: 1500,
                    timingFunction: "ease"
                });
                animation_export.translateY(-98).step();
                //  animation_export.rotate(45).scale(2, 2).step()
                this.animation = animation_export.export();
                this.global_margin_bottom = 156 + 98;
            },

            funcDismiss() {
                this.is_pop = true;
                let animation_export = wx.createAnimation({
                    duration: 1500,
                    timingFunction: "ease"
                });
                animation_export.translateY(-10).step();
                //  animation_export.rotate(45).scale(2, 2).step()
                this.animation = animation_export.export();
                this.global_margin_bottom = 156;
            },

            funcPopClick(index) {
                if (index == this.flash_select_way) {
                    return false;
                }
                this.flash_select_way = index;
                wx.setStorageSync("select_way", index + 1);
                this.funcDismiss();
            },

            funcConfigFlashSelect() {
                let value = wx.getStorageSync("select_way");
                if (value > 0) {
                    this.flash_select_way = value - 1;
                } else {
                    this.funcPop();
                }
            },

            funcToast(title_info) {
                wx.showToast({
                    title: title_info,
                    icon: "none",
                    duration: 2000
                });
            },

            /***************   以下支付的逻辑  ********************/

            // 获取微信支付的参数
            funcWxpayInfomation(res) {
                console.log({ cut_id:this.skus.cut_id,  order_id:res.order_id})
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
                wx.hideLoading();
                wx.requestPayment({
                    timeStamp: res_pay_info.timeStamp,
                    nonceStr: res_pay_info.nonceStr,
                    package: res_pay_info.package,
                    signType: res_pay_info.signType,
                    paySign: res_pay_info.sign,
                    success(res_wx_info) {
                        console.log(res_wx_info);
                        self.funcGoFinshPage(le_order_info);
                    },
                    fail(res_wx_info) {
                        // 此处应该跳转订单列表
                        self.funcScan();
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
            },

            // 支付失败跳转订单列表
            funcScan() {
                let url = "/pages/confirm/list/main?order_status=2";
                wx.redirectTo({
                    url: url
                });
            }

            /***************   以上支付的逻辑  ********************/
        }
    };
</script>

<style scoped>
    @import url("~mpvue-wxparse/src/wxParse.css");

    .backgroundView {
        background: #f3f5f7;
        min-height: 1334rpx;
        padding-bottom: 156rpx;
    }

    .address {
        background: hsl(49, 100%, 89%);
        width: 100%;
        min-height: 394rpx;
    }

    .addressTop {
        height: 88rpx;
        width: 100%;
    }

    .addressWay {
        color: #333;
        font-size: 30rpx;
        padding-left: 70rpx;
        line-height: 88rpx;
    }

    .addressContent {
        /* width: 100%; */
        /* : 286rpx; */
        border-radius: 12rpx;
        background: #fff;
        margin: 0rpx 20rpx 20rpx 20rpx;
    }

    .addressContentTop {
        height: 198rpx;
    }

    .nameTel {
        height: 88rpx;
        display: flex;
        flex-direction: row;
        line-height: 88rpx;
        margin: 0 50rpx 0 50rpx;
        font-size: 30rpx;
        color: #333;
    }

    /* .name {
         f
     }*/
    .tel {
        margin-left: 50rpx;
    }

    .addressText {
        margin: 0 50rpx 0 50rpx;
        font-size: 26rpx;
    }

    .addressContentBottom {
        display: flex;
        flex-direction: row;
        line-height: 88rpx;
        justify-content: space-between;
        height: 88rpx;
        padding: 0 50rpx 0 50rpx;
    }
    .addressArrivalDesc {
        font-size: 26rpx;
        color: rgb(65, 43, 43);
    }
    .addressArrivalTime {
        color: #ff5000;
        font-size: 26rpx;
    }

    .line {
        background: #eeeeee;
        margin-left: 50rpx;
        height: 2rpx;
        /* overflow: hidden; */
        width: 660rpx;
    }

    .orderSource {
        line-height: 80rpx;
        height: 80rpx;
        font-size: 30rpx;
        width: 710rpx;
        color: #666;
        padding-left: 20rpx;
        padding-right: 20rpx;
        margin-top: 20rpx;
        background: #fff;
    }

    .orderSource.sea {
        /* line-height: 0rpx; */
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .product {
        height: 160rpx;
        /* width: 100%; */
        padding: 20rpx;
        display: flex;
        /* flex-direction: row; */
        background: #fafafa;
        box-sizing: border-box;
        border-bottom: #eee 1rpx solid;
    }

    .productIcon {
        width: 120rpx;
        height: 120rpx;
        background: #fff;
    }

    .productContent {
        margin-left: 20rpx;
        width: 570rpx;
        height: 120rpx;
        box-sizing: border-box;
    }

    .productName {
        font-size: 26rpx;
        color: #333;
        line-height: 30rpx;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .productStyle {
        margin-top: 12rpx;
        color: #999;
        line-height: 24rpx;
        font-size: 24rpx;
        height: 24rpx;
    }
    .productBottom {
        margin-top: 12rpx;
        display: flex;
        /* flex-direction: row; */
        justify-content: space-between;
        /* line-height: 25rpx; */
        align-items: center;
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
        color: #333;
        font-size: 24rpx;
    }

    .payView {
        margin-top: 20rpx;
        background: #fff;
    }

    .payViewContent {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 88rpx;
        line-height: 88rpx;
        padding: 0 20rpx;
        font-size: 26rpx;
        color: #333;
    }

    .submitBgView {
        position: fixed;
        flex-direction: row;
        bottom: 0;
        height: 98rpx;
        left: 0;
        width: 100%;
        background: #fff;
        line-height: 98rpx;
        display: flex;
        z-index: 91;
        border-top: #dddddd solid 1rpx;

        /* align-items: baseline; */
    }

    .submit_left {
        margin-left: 20rpx;
        font-size: 26rpx;
        color: #333;
    }

    .submit_mid {
        font-size: 34rpx;
        color: #ff5000;
        font-family: PingFangSC-Medium;
    }

    .submit_right {
        position: absolute;
        right: 0;
        height: 98rpx;
        line-height: 98rpx;
        color: #fff;
        text-align: center;
        font-size: 30rpx;
        background: #ff5000;
        width: 240rpx;
    }

    .remindPopView {
        position: fixed;
        bottom: -78rpx;
        /* bottom: 88rpx; */
        height: 244rpx;
        left: 0;
        width: 100%;
        /* background: #fff; */
        line-height: 68rpx;

        z-index: 90;
    }

    .popViewTopBg {
        position: absolute;
        width: 100%;
        height: 88rpx;
        left: 0;
        z-index: -1;
    }

    .popViewTop {
        height: 88rpx;
        display: flex;
        flex-direction: row;
        padding: 0 20rpx;
        justify-content: space-between;
        position: relative;
    }

    .pop_select_way {
        width: 100%;
        height: 88rpx;
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: #333;
        padding-left: 20rpx;
        box-sizing: border-box;
        background: #fff;
    }
    .remindTitle {
        /* margin-top: 8rpx; */
        color: #884c00;
        font-size: 26rpx;
    }
    .remindIcon {
        width: 32rpx;
        height: 32rpx;
    }

    .couponRight {
        line-height: 88rpx;
        height: 88rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .arrow {
        width: 13rpx;
        height: 23rpx;
        margin-left: 20rpx;
    }

    .pro_sale_style {
        font-size: 18rpx;
        color: #ff5000;
        border: 1rpx solid #ff5000;
        background: #fff;
        border-radius: 6rpx;
        padding: 0 4rpx;
        margin-right: 10rpx;
    }

    .leVipBgView {
        padding: 20rpx 20rpx 28rpx 20rpx;
        margin-top: 20rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        /* height: 142rpx; */
        /* line-height: 142rpx; */
        background: #fff;
        box-sizing: border-box;
        align-items: center;
    }

    .leVipLeft {
        /* height: 114rpx; */
    }
    .leVipLeftTop {
        display: flex;
        /* align-items: baseline; */
        /* align-items: center; */
    }
    .leVipLeftBottom {
        margin-top: 20rpx;
    }

    .accountList {
        margin-top: 17rpx;
    }

    .accountListDetail {
        padding: 0 20rpx;
        display: flex;
        justify-content: space-between;
        background: #fff;
        height: 60rpx;
        line-height: 60rpx;
    }

    /* 模态框背景 */

    .toast {
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
        height: 292rpx;
        background: #fff;
        border-radius: 16rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        /* padding: 20rpx 28rpx; */
    }

    /* 取消订单模态框 */

    .toast_content_title {
        margin-top: 60rpx;
        text-align: center;
        font-size: 30rpx;
        color: #333;
        height: 84rpx;
        width: 510rpx;
    }

    .toast_content_button {
        margin-top: 60rpx;
        width: 100%;
        height: 88rpx;
        display: flex;
        font-size: 30rpx;
        align-items: center;
        border-top: #eeeeee 1px solid;
    }
    .toast_content_sure {
        text-align: center;
        flex: 1;
        height: 42rpx;
        color: #ff5000;
        font-size: 30rpx;
    }

    .toast_content_cancle {
        text-align: center;
        height: 42rpx;
        font-size: 30rpx;
        flex: 1;
        color: #333;
        border-right: #eeeeee 1px solid;
    }

    /* 缺货模态框 */

    .toast_exit {
        position: absolute;
        top: 28rpx;
        right: 27rpx;
        width: 30rpx;
        height: 30rpx;
        background: #999;
    }
    .toast_pro_bg {
        padding: 0 40rpx;
        width: 710rpx;
        box-sizing: border-box;
        height: 320rpx;
    }
    .toast_button_bg {
        width: 100%;
        margin-top: 60rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .toast_go_pay {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        border-radius: 30rpx;
        height: 72rpx;
        box-sizing: content-box;
        background: #ff5000;
        width: 280rpx;
        padding: 0;
        font-size: 26rpx;
        border: none;
    }

    .toast_content_express {
        width: 100%;
        /* height: 292rpx; */
        background: #fff;
        position: absolute;
        bottom: 0;
        left: 0;

        /* border-radius: 16rpx; */
        /* display: flex; */
        /* flex-direction: column; */
        /* align-items: center; */
    }

    /* 运费模态框 */

    .toast_express_title {
        height: 88rpx;
        width: 100%;
        line-height: 88rpx;
        font-size: 30rpx;
        color: #333;
        text-align: center;
    }

    .toast_content_pro {
        /* height: 208rpx; */
        width: 100%;
        padding-bottom: 20rpx;
    }
    .toast_express_pro_title {
        display: flex;
        justify-content: space-between;
        padding: 12rpx 20rpx 0 20rpx;
        font-size: 26rpx;
    }

    .toast_express_pro_bg {
        /* display: flex; */
        /* flex-direction: row; */
        /* flex-wrap:  */
        padding-left: 20rpx;
        padding-right: 10rpx;
        margin-top: 28rpx;
        height: 120rpx;
        white-space: nowrap;
    }

    .toast_express_pro_content {
        margin-right: 10rpx;
        width: 120rpx;
        height: 120rpx;
        display: inline-block;
    }

    .toast_express_bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80rpx;
        width: 710rpx;
        margin-top: 20rpx;
        padding: 0 20rpx;
    }

    .return_coupon {
        width: 100%;
        background: #fff;
        align-items: center;
        color: #333;
        font-size: 26rpx;
        padding: 0 20rpx;
        display: flex;
        height: 80rpx;
    }

    .coupon_content {
        background: #ff5000;
        color: #fff;
        font-size: 22rpx;
        height: 32rpx;
    }

    /* 闪送弹层 */

    .toast_time_bg {
        height: 600rpx;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        background: #f3f5f7;
        box-shadow: inset 0 -1rpx 0 0 #eeeeee;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
    }

    .toast_time_title_bg {
        height: 88rpx;
        width: 100%;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        /* box-shadow: inset 0 -1px 0 0 #EEEEEE; */
        background: #fff;
        font-size: 26rpx;
        text-align: center;
        line-height: 88rpx;
    }

    .toast_time_close {
        position: absolute;
        right: 28rpx;
        top: 28rpx;
    }
    .toast_time_content_bg {
        width: 100%;
        height: 512rpx;
        display: flex;
        font-size: 26rpx;
        color: #333;
    }
    .toast_time_content_left {
        width: 200rpx;
        height: 100%;
    }

    .toast_time_content_right {
        /* flex: 1; */
        width: 550rpx;

        /* display: flex; */
    }

    .toast_time_content_detail {
        display: flex;
        padding-left: 40rpx;
        padding-right: 28rpx;
        height: 88rpx;
        justify-content: space-between;
        align-items: center;
        background: #fff;
    }

    .toast_time_content_detail.activity {
        color: #ff5000;
    }

    .toast_time_content_time {
        line-height: 88rpx;
        height: 88rpx;
        text-align: center;
    }
    .toast_time_content_time.activity {
        background: #fff;
    }

    .product_icon {
        position: absolute;
        left: 0;
        top: 0;
        width: 120rpx;
        height: 120rpx;
    }

    .icon_bg {
        position: relative;
        width: 120rpx;
        height: 120rpx;
    }

    .icon_desc {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 28rpx;
        background: #000;
        color: #fff;
        font-size: 22rpx;
        line-height: 28rpx;
        width: 100%;
        text-align: center;
        opacity: 0.5;
    }

    .pop_view_top_content {
        margin-top: 20rpx;
        height: 68rpx;
        display: flex;
        width: 710rpx;
        align-items: center;
        justify-content: space-between;
    }

    /* 扫码购样式表 */

    .scanshop {
        background: #fff;
        height: 80rpx;
        width: 100%;
        display: flex;
        align-items: center;
        box-sizing: content-box;
        padding-left: 10rpx;
        font-size: 26rpx;
        color: #999;
    }
</style>
