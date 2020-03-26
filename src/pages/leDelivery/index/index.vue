<template>
    <div>
        <div style="width:100%;background:#f3f5f7">
            <div class="topSearchBg">
                <div class="topSearchLeft" @click="Selectlocation">
                    <img src="../image/twohr_icon_location01.png" style="width:28rpx;height:28rpx;margin-top:18rpx;">
                    <div class="locationName">{{location_city}}</div>
                </div>
                <navigator url="/pages/search/leshansong/main?channel=index" hover-class="none">
                    <div class="search_top_fixed">
                        <em class="search_input_icon">
                            <img src="/static/images/navbar_search.png" class="search_input_icon_img">
                        </em>
                        <div class="search_input_wrap_value">搜索乐闪送商品</div>
                    </div>
                </navigator>

                <div class="changingover" v-if="changeimgShow">
                    <img src="../image/shang.png" class="shangsanjiao">
                    已为您自动切换至59分达地址
                </div>
            </div>
            <div :class="['categoryBg',{'cateGoryBgBox':cateGorymoreShow}]">
                <div class="categoryTop">
                    <div class="categotyRemind">
                        <img style="width:30rpx; height:30rpx;margin-top:2rpx" src="../image/sound.png">
                        <!-- circular="true"  autoplay="true" autoplay-->
                        <swiper style="margin-left:10rpx;width:100%; height:30rpx;" vertical autoplay circular>
                            <swiper-item v-for="(item,index) in scorllList" :key="index">
                                <div style="color:#333; font-size:24rpx">{{item}}</div>
                            </swiper-item>
                        </swiper>
                    </div>
                    <div class="categotyTab">
                        <div class="positon_wrap">
                            <swiper class="categotySwiper" interval="5000" duration="1000" @change="funcSwiperChange">
                                <swiper-item class="categotySwiper_item">
                                    <div :class="['categotyTab_box',{'colorFF55': index == TabNum1}]"
                                        v-for="(item,index) in  TabList1" @click.stop="oncatagoty(item,1,index)"
                                        :key="index">
                                        <img class="categotyTab_img" :src="item.logo_url" alt>
                                        <span class="categotyTab_name ellipsis">{{item.c_name}}</span>
                                    </div>
                                </swiper-item>
                                <swiper-item class="categotySwiper_item">
                                    <div :class="['categotyTab_box',{'colorFF55':index == TabNum2}]"
                                        v-for="(item,index) in  TabList2" @click.stop="oncatagoty(item,2,index)"
                                        :key="index">
                                        <img class="categotyTab_img" :src="item.logo_url" alt>
                                        <span class="categotyTab_name ellipsis">{{item.c_name}}</span>
                                    </div>
                                </swiper-item>
                            </swiper>
                            <div class="swiper_dots">
                                <block v-for="(item,i) in 2" :key="i">
                                    <span class="dot" :class="{'active':i == swiperCurrent}"></span>
                                </block>
                            </div>
                        </div>
                        <div class="category_subclass">
                            <span :class="['subClassName',{'subClassactive':index==subClassNum}]"
                                @click.stop="onsubClass(item,index)" v-if='index<9+moreNum' v-for="(item,index) in Tabsubclass"
                                :key="index">{{item.c_name}}</span>

                            <div class='cateGory_more cateGoryPostionshou' v-if='cateGorymoreshou' @click.stop='oncateGorymoreshou'>
                                <span class="cateGory_more_text">收起</span>
                                <img class="cateGory_more_IMG" src='/static/images/twohr_index_menu_up.png' alt="">
                            </div>

                            <div class='cateGory_more cateGoryPostion' v-if='cateGorymorezhan' @click.stop='oncateGorymorezhan'>
                                <span class="cateGory_more_text">展示</span>
                                <img class="cateGory_more_IMG" src='/static/images/twohr_index_menu_down.png'alt="">
                            </div>

                        </div>
                    </div>
                </div>
                <div class="categoryBottom"></div>
            </div>
            <div :class="['products_small_wrap',{'productsTOP':cateGorymoreShow}]">
                <samll-product v-for="(item,index) in search_result" :key="index" :shopid="userlocInfo.shop_id"
                    :initDetail="'shansong'" :product="item" @shopCartNum="funCallbackNum"></samll-product>
            </div>
            <div class="weui-loadmore">
                <div v-if="!bottom" class="weui-loading"></div>
                <div class="weui-loadmore__tips">{{bottom?"已经到底啦":"正在加载..."}}</div>
            </div>


            <img class="cartImg" @click="onInCart" src="/static/images/twohr_left_shopping.png">
            <div v-if="shopCartNum" class="product_cartNum">{{shopCartNum>99?'99+':shopCartNum}}</div>

            <!-- <div class="drawer_screen" v-if="ModuleClass" @click="closeModal">
      </div>-->

            <div v-if="ModuleClass" :class="['cartModule',{'slideModule':ModuleClass}]">
                <cart-modaldata :shop_id="userlocInfo.shop_id" @closeModel="closeModal" catchtouchmove="ture"
                    :cart_id='shansongcart_id'></cart-modaldata>
            </div>

            <!-- <div :class="['cartModule',{'slideModule':ModuleClass}]"  catchtouchmove="ture">
         <cart-modaldata :shop_id='userlocInfo.shop_id' @closeModel='closeModal'></cart-modaldata>
      </div>-->
        </div>
    </div>
</template>
<script>
    import samllProduct from "@/components/product/samll/index";
    import cartModaldata from "@/components/cartModal/index";
    import { mapak } from '@/utils';
    import {
        mapMutations,
        mapState
    } from "vuex";
    import BMapWX from '@/utils/bmap-wx.min.js';
    import {
        getmeetFacet,
        productQueryByShopId,
        getUserLocation,
        getshopcartNum,
        mermtgeShoppingCart
    } from "@/api";
    export default {
        data() {
            return {
                catelength:null,
                moreNum:0,
                cateGorymoreshou:false,
                cateGorymorezhan:false,
                cateGorymoreShow:false, //点击后显示更多
                cateGory_more:false, //超过十个显示更多
                shansongcart_id: '',
                swiperCurrent: 0,
                changeimgShow: false,
                TabNum1: 0, //初始选中第一个
                TabNum2: -1,
                shopCartNum: 0, //购物车数量
                ModuleClass: false,
                ModuleShow: false, //购物车模态框
                userlocInfo: {}, //用户信息
                curr_page: 1, //页数
                pages: [], //总页数
                bottom: false, //是否到底了
                scorllList: [], //滚动内容
                search_result: [], //搜索结果数据
                TabList1: [], //导航数据1
                TabList2: [], //导航数据2
                Tabsubclass: [], //导航子数据
                Parentclass: 0, //父类默认选中
                subClassNum: 0, //子类默认初始选中
                subAndparenlist: [], //点击后大类小类的数据
                location_city: "",
                userLocation: {},
                options: {},
                concentration:false //精选没有下拉刷新
            };
        },
        components: {
            samllProduct,
            cartModaldata
        },
        computed: mapState(["init_placeholder"]),
        onLoad(options) {
            //测试用
            // wx.setStorageSync('locationInfo', {"latitude":39.9219,"longitude":116.44355,"speed":-1,"accuracy":65,"verticalAccuracy":65,"horizontalAccuracy":65,"errMsg":"getLocation:ok"})
            wx.showLoading({title: '正在加载中', mask: true});
            // console.log(options);
            this.sa_page(this,false,'闪送首页','');
            this.cateGory_more=false;
            let that = this;
            this.options = options;
            this.moreNum=0;
            this.cateGorymoreshou=false;
            this.cateGorymorezhan=false;
            this.cateGorymoreShow=false; //点击后显示更多
            this.swiperCurrent  = 0; //初始数据

            //初始化数据
            this.search_result = [];  //初始搜索数据
            this.TabNum1 =0;
            this.TabNum2 = -1;
            this.swiperCurrent = 0;
            this.TabList1 = []; //导航数据1
            this.TabList2 = []; //导航数据2
            this.Tabsubclass = [];
            this.subClassNum = 0;
            this.location_city = "";
            // let address_id = wx.getStorageSync('address_id')
            // else if (options.longitude&&options.latitude){
            //     // let locationInfo =  wx.getStorageSync("locationInfo");
            //     wx.setStorageSync('locationInfo',{longitude:options.longitude,latitude:options.latitude})
            //     this.funUserLocation(options);
            // }else if (!address_id) { //初始进入
            //     this.funUserLocation(this.userLocation);
            // }
            //2478
            // console.log('我是走onload')
        },
        onShow() {
               //判断是否登录未登录
            let token = wx.getStorageSync("token");
            if(token){ //用户登录合并购物车
                if(wx.getStorageSync('shansongcart_id')) { //合并购物车
                   mermtgeShoppingCart({cart_id:wx.getStorageSync('shansongcart_id'),cart_type:2}).then(res=>{
                       wx.removeStorageSync('shansongcart_id')
                })
               }
            }
            let loactiondata = wx.getStorageSync("locationInfo");
            let address_id = wx.getStorageSync('address_id')
            this.userLocation = loactiondata;
            if(this.options.shan_shop_id){  //重新定位后返回这个页面

                this.funUserLocation(this.userLocation,true);

            }else if (this.options.address_id) { //用户选择已有地址

                this.funLocation(this.options.address_id);

            }else if(this.options.longitude&&this.options.latitude){ //用户如果传入有经纬度
               
                this.funUserLocation(this.options,true);

            }else if(!address_id){ //用户初始化

                this.funUserLocation(this.userLocation,false);
            }
            if (address_id) {  //订单地址也返回
                this.funLocation(address_id);
                wx.removeStorageSync('address_id')
            }
            this.funCartNum();
        },
        // onHide() {
        //   this.closeModal();
        // },
        methods: {
            funcSwiperChange(e) {
                let current = e.mp.detail.current;
                this.swiperCurrent = current;
            },
            //获取滚动新闻和shop_id
            funUserLocation(data,user_select) {
                let params ={};
                if(user_select){
                    params = {
                        location_info: {
                            user_select_location:1,
                            poi_address: data.poi_address,
                            poi_name: data.poi_name,
                            latitude: data.latitude,
                            longitude: data.longitude
                        }
                    }
                }else{
                    params = {
                        location_info: {
                            poi_address: data.poi_address,
                            poi_name: data.poi_name,
                            latitude: data.latitude,
                            longitude: data.longitude
                        }
                    }
                }
                getUserLocation(params).then(res => {
                    let that = this;
                    // debugger
                    // console.log(res,'dddddddd');
                    if (!res.shop_id) {
                        wx.showToast({title: '该地址不在配送范围',icon: 'none',duration: 1000})
                        // setTimeout(function(){
                            that.Selectlocation();
                        // },2000)
                        return false;
                    }
                    if (res.address_name) { //通过定位获取地址
                        this.location_city = res.address_name;
                    } else {
                        this.funcSetLocaton(data.latitude, data.longitude);
                    }
                    wx.setStorageSync("shan_shop_id", res.shop_id);
                    this.userlocInfo = res;
                    this.scorllList = res.lightning_tips || ["无匹配门店,请重新定位"];
                    this.funTabsList(); //获取头部导航
                });
            },
            //获取用户选择的位置
            funLocation(data) {
                let params = {
                    address_id: data
                };
                getUserLocation(params).then(res => {
                    wx.setStorageSync("shan_shop_id", res.shop_id);
                    this.location_city = res.address_name;
                    this.userlocInfo = res;
                    this.scorllList = res.lightning_tips || ["无匹配门店,请重新定位"];
                    this.funTabsList(); //获取头部导航
                });
            },
            funTabsList() {
                //获取头部导航
                let params = {
                    shopIdList: "",
                    isMeet: 1
                };
                getmeetFacet(params).then(res => {
                    this.TabList1 = res.categorys.slice(0, 6);
                    this.TabList2 = res.categorys.slice(6, 11);
                    this.Tabsubclass = res.categorys[0].sub_list;
                    this.subAndparenlist = res.categorys[0].sub_list[0];
                    // console.log(res,'我是获取头部导航---')
                    this.funcInitGetProductLists(res.categorys[0].sub_list[0],res.categorys[0].category_id);
                    wx.setStorageSync('category_id', res.categorys[0].category_id) //缓存精品分类id
                });
            },
            funCallbackNum(msg) {
                //子组件传递给父组件的购物车数量
                this.shopCartNum = msg;
            },
            funCartNum(num) {
                let tokenid = wx.getStorageSync('token');
                let cart_id  = wx.getStorageSync('shansongcart_id')
                let params = {};
                if (tokenid) {
                    //获取购物车数量
                    params = {
                        shop_id: this.userlocInfo.shop_id,
                        cart_type: 2,
                        is_check: 2
                    };
                    getshopcartNum(params).then(res => {
                        // console.log(res, "购物车数量");
                        this.shopCartNum = res.num;
                    });
                } else if(cart_id) {
                    params = {
                        shop_id: this.userlocInfo.shop_id,
                        cart_type: 2,
                        is_check: 2,
                        cart_id: wx.getStorageSync('shansongcart_id')
                    };
                    getshopcartNum(params).then(res => {
                        // console.log(res, "购物车数量");
                        this.shopCartNum = res.num;
                    });
                }
            },
            oncatagoty(item, i, index) {
                // console.log(item,'如果是点击的是大分类')
                this.subClassNum = 0;
                this.cateGorymorezhan = false;
                this.cateGorymoreshou = false;
                this.moreNum =0;
                this.cateGorymoreShow = false;
                //点击头部大分类
                if (i == 1) {
                    this.TabNum1 = index;
                    this.TabNum2 = -1;
                } else {
                    this.TabNum2 = index;
                    this.TabNum1 = -1;
                }
                if(item.sub_list.length>10){
                    this.Tabsubclass = item.sub_list;
                    this.cateGorymorezhan = true;
                    this.catelength = item.sub_list.length;

                }else{
                    this.cateGorymorezhan = false;
                    this.cateGorymoreshou = false;
                    this.moreNum =0;
                    this.cateGorymoreShow = false;
                    this.Tabsubclass = item.sub_list;
                }
                this.search_result = [];
                this.curr_page = 1;
                this.subAndparenlist = item.sub_list[0];
                this.funcInitGetProductLists(item.sub_list[0],item.category_id);
                //缓存精品分类ID
                wx.setStorageSync('category_id', item.category_id)
            },
            onsubClass(item, i) {
                //点击小分类
                this.subClassNum = i;
                this.search_result = [];
                this.curr_page = 1;
                this.subAndparenlist = item;
                if(i==0){   //如果点击的是精选
                    this.funcInitGetProductLists(item,wx.getStorageSync('category_id'));
                }else{
                    this.funcInitGetProductLists(item,'');
                }
                
            },
            funcInitGetProductLists(item,category_id) {
                 wx.showLoading({title: '正在加载中', mask: true});
                // wx.setStorageSync('shan_shop_id', '2478')
                //搜索
                let params = {
                    rows: 20,
                    start: this.curr_page,
                    channel: 0, //乐友渠道
                    queryList: [
                        `ctyids:${item.sub_category_id}`,
                        `isMeet:1`,
                        `shopIdList:${wx.getStorageSync('shan_shop_id')}`
                    ],
                    sortList: [`comprehensive:false`],
                    filterList: [`category:${category_id}`, `mfctcode:`, `price:`]
                };
                // console.log(params, "我是传入的参数---------");
                productQueryByShopId(params).then(res => {
                    // console.log(res,'我是数据')
                    if(res.product_list){
                        this.concentration = true; //如果是精选没有下拉刷新
                        this.bottom = true; //是否到底
                        res.product_list.forEach((item,index)=>{
                            let arr = item.sale_price.split(".");
                            if (arr.length.length < 2) {
                                arr.push("00");
                            } else {
                                if (arr[1].length < 2) {
                                    arr[1] = arr[1].toString() + "0";
                                }
                            }
                            item.prices = arr; //价格处理
                            item.title = item.prod_title; //商品标题
                            item.le_image = item.image.slice(30);
                            // this.search_result.push(item); //添加到数组
                        })
                         this.search_result = [...this.search_result,...res.product_list]
                    }else if(res.data){   
                        this.bottom = res.rows > 20 ? false : true;
                        this.concentration = false;
                        this.pages = res.pages;
                        res.data.forEach((item, index) => {
                            let arr = item.prices.split(".");
                            if (arr.length.length < 2) {
                                arr.push("00");
                            } else {
                                if (arr[1].length < 2) {
                                    arr[1] = arr[1].toString() + "0";
                                }
                            }
                            item.prices = arr;
                        });
                        this.search_result = [...this.search_result,...res.data]
                    }
                    // this.search_result = this.search_result.concat(res.data);
                    wx.hideLoading();
                });
            },
            Selectlocation() {
                //选择位置
                wx.navigateTo({
                    url: "/pages/shipAddress/main"
                });
            },
            closeModal(msg) {
                // let that = this;
                // getshopcartNum().then(res => {
                //   console.log(res, "购物车数量");
                //   this.shopCartNum = res.num;
                // });
                this.funCartNum();
                this.ModuleShow = false;
                this.ModuleClass = false;
            },
            onInCart() {
                //点击购物车
                var that = this;
                this.shansongcart_id = wx.getStorageSync('shansongcart_id')
                that.ModuleShow = true;
                this.ModuleClass = true;
            },
            oncateGorymoreshou(){
                this.cateGorymoreShow = false;
                this.cateGorymorezhan = true;
                this.cateGorymoreshou = false;
                this.moreNum = 0;
            },
            oncateGorymorezhan(){
                this.moreNum = this.catelength-9;
                this.cateGorymoreshou = true;
                this.cateGorymorezhan = false;
                this.cateGorymoreShow = true;
            },
            //获取当前定位
            funcSetLocaton(x, y) {
                let _this = this;
                var BMap = new BMapWX({
                    ak: mapak
                });
                BMap.regeocoding({
                    location: `${x},${y}`,
                    fail: res => {},
                    success: res => {
                        // console.log(res, '数据')
                        _this.location_city = res.originalData.result.sematic_description;

                        setTimeout(function () { //如果为默认选择的地址
                            _this.changeimgShow = true;
                        }, 2000);
                        setTimeout(function () {
                            _this.changeimgShow = false;
                        }, 10000);
                    }
                });
            },
        },
        onReachBottom() {
            if (this.curr_page == this.pages) {
                this.bottom = true;
                return false;
            } else if(this.concentration){
                return false;
            } else {
                this.curr_page += 1;
                this.funcInitGetProductLists(this.subAndparenlist,'');
            }
        },
        onPullDownRefresh() {
            // console.log(123456);
            // wx.showNavigationBarLoading();
        },
        onUnload(){
            wx.removeStorageSync('category_id')
        },
    };
</script>

<style scoped>
    .positon_wrap {
        position: relative;
    }

    .changingover {
        font-family: PingFangSC-Regular;
        font-size: 24rpx;
        color: #ffffff;
        letter-spacing: 0;
        opacity: 0.65;
        background: #000000;
        border-radius: 26px;
        height: 42rpx;
        width: 367rpx;
        line-height: 42rpx;
        text-align: center;
        position: absolute;
        top: 66rpx;
        left: 40rpx;
        z-index: 100;
    }

    .shangsanjiao {
        position: absolute;
        height: 16rpx;
        width: 25rpx;
        left: 70rpx;
        top: -15rpx;
        z-index: 111;
    }

    .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .cartImg {
        position: fixed;
        bottom: 80rpx;
        left: 30rpx;
        width: 96rpx;
        height: 96rpx;
        z-index: 111;
    }

    .slideModule {
        /* transform: translateY(0) !important; */
    }

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

    .product_cartNum {
        position: fixed;
        left: 90rpx;
        bottom: 140rpx;
        height: 25rpx;
        color: #ffffff;
        min-width: 25rpx;
        text-align: center;
        line-height: 22rpx;
        border-radius: 50%;
        border: 2rpx solid #ff5000;
        background: #ff5000;
        font-size: 18rpx;
        z-index: 111;
    }

    /* 导航栏 */
    .categotyTab {}

    .categotySwiper {
        height: 170rpx;
    }

    .categotySwiper_item {
        display: flex;
        margin-top: 20rpx;
        /* align-items: center; */
    }

    .categotyTab_box {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 96rpx;
        margin-left: 12rpx;
        margin-right: 15rpx;
        color: #333333;
    }

    .categotyTab_img {
        height: 70rpx;
        width: 70rpx;
        border-radius: 50rpx;
    }

    .categotyTab_name {
        margin-top: 6rpx;
        font-size: 24rpx;
        width: 96rpx;
        text-align: center;
    }

    /* 导航子类 */
    .category_subclass {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin: 0 15rpx;
    }
    /* 超过十个显示隐藏 */
    .cateGory_more{
        display: flex;
        align-items: center;
        height:40rpx;
        min-width:120rpx;
        line-height:40rpx;
        text-align:center;
        margin-top:10rpx;
        margin-left:10rpx;
        justify-content:center;
    }
    /*.cateGoryPostion,.cateGoryPostionshou{*/
        /*position: absolute;*/
        /*bottom: 20rpx;*/
        /*right: 50rpx;*/
    /*}*/

    .cateGory_more_text{
        font-size:24rpx;
        color:#ff5000;
        border-radius:20rpx;
    }
    .cateGory_more_IMG{
        height: 8rpx;
        width: 16rpx;
    }


    .colorFF55 {
        color: #ff5000 !important;
    }

    .subClassactive {
        color: #fff !important;
        background: #ff5000 !important;
    }

    .subClassName {
        font-size: 24rpx;
        color: #666666;
        border-radius: 20rpx;
        height: 40rpx;
        min-width: 120rpx;
        line-height: 40rpx;
        margin-top: 10rpx;
        text-align: center;
        margin-left: 10rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width:65rpx;
    }

    .topSearchBg {
        display: flex;
        padding: 0 20rpx;
        height: 1;
        height: 172rpx;
        background: rebeccapurple;
        background: #ff5000;
        justify-content: space-between;
    }

    .topSearchLeft {
        height: 60rpx;
        display: flex;
    }

    .locationName {
        font-size: 30rpx;
        margin-top: 10rpx;
        color: #ffffff;
        margin-left: 14rpx;
        height: 40rpx;
        width: 184rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .search_top_fixed {
        width: 400rpx;
        top: 5rpx;
        display: flex;
        height: 60rpx;
    }

    .search_input_icon {
        width: 30.3px;
        height: 29.5px;
        overflow: hidden;
        position: absolute;
        margin-left: 20rpx;
        margin-top: 15rpx;
        z-index: 99;
    }

    .search_input_icon_img {
        width: 30.3px;
        height: 29.5px;
        display: block;
        border: none;
        z-index: -1;
    }

    .search_input_wrap_value {
        padding-left: 63px;
        width: 620px;
        height: 60px;
        line-height: 60px;
        border-radius: 30px;
        box-sizing: border-box;
        background: #f2f2f2;
        font-size: 26px;
        color: #cacaca;
    }

    .search_input_wrap_value:placeholder {
        color: #cacaca;
    }

    .search_input_button {
        font-size: 30px;
        color: #333333;
    }

    .categoryBg {
        position: absolute;
        top: 76rpx;
        left: 20rpx;
        width: 710rpx;
        height: 338rpx;
        background: #ffffff;
        border-radius: 16rpx;
        overflow: hidden;
    }
    .cateGoryBgBox{
        height: 390rpx;
    }

    .categotyTop {
        height: 210rpx;
        width: 710rpx;
        margin-left: 20rpx;
    }

    .categotyRemind {
        display: flex;
        padding: 16rpx 20rpx;
        height: 28rpx;
        width: 670rpx;
        background: #f6f6f6;
        border-radius: 16px 16px 0 0;
    }

    .products_small_wrap {
        padding-top: 264rpx;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .productsTOP{
        padding-top: 310rpx;
    }

    .swiper_dots {
        width: 100%;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 20px;
        display: flex;
        justify-content: center;
        z-index: 5;
    }

    .swiper_dots .dot {
        width: 8px;
        height: 8px;
        background: #eeeeee;
        border-radius: 5px;
        transition: all 0.6s;
        margin-left: 10rpx;
    }

    .swiper_dots .dot.active {
        width: 40px;
        background: #ff5000;
    }
</style>
