<template>
    <div class="search">
        <div class="search_top_fixed">
            <div class="search_classify">
                <div class="search_classify_item blod" :class="{'active':class_active == 1}" @click="funcSearchComprehensive">综合</div>
                <div class="search_classify_item blod" :class="{'active':class_active == 2}" @click="funcSearchProdcutsellamount">销量</div>
                <div class="search_classify_item blod" :class="{'active':class_active == 3}" @click="funcSearchPrice">
                    <div>价格</div>
                    <div class="search_classify_img">
                        <template v-if="initPrice == null">
                            <img style="width: 16rpx;height: 20rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_price.png" alt="">
                        </template>
                        <template v-if="initPrice">
                            <img style="width: 16rpx;height: 20rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_price_up.png" alt="">
                        </template>
                        <template v-if="initPrice == false">
                            <img style="width: 16rpx;height: 20rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_price_down.png" alt="">
                        </template>
                    </div>
                </div>
                <div class="search_classify_item blod" :class="{'active':class_active == 6}" @click="funcSearchNewProdcut">新品</div>
                <div class="search_classify_item blod" @click="funcSearchFilter">
                    <span>筛选</span>
                    <div>
                        <img class="search_screen_img" src="../../../../static/images/search/search_screen.png">
                    </div>
                </div>
            </div>
            <div class="search_sub_info">
                <div class="search_logistics" :class="{'active': class_active_wl}" @click="funcSearchLogistics">物流有货</div>
                <div class="search_shop" :class="{'active': shopLocation.shopId}" @click="funcSearchGoToShop">门店查询</div>
                <div class="search_sub_classify" :class="{'active': initCategoryShow}" @click="funcSearchCategory">
                    <div class="search_classify_item_txt">{{initCategoryTxt}}</div>
                    <div class="search_classify_img" v-if="!search_query.category.length">
                        <template v-if="initCategoryShow">
                            <img style="width: 16rpx;height: 8rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_classify_up.png" alt="">
                        </template>
                        <template v-else>
                            <img style="width: 16rpx;height: 8rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_classify_down.png" alt="">
                        </template>
                    </div>
                </div>
                <div class="search_sub_classify" :class="{'active':initMfctnamesShow}" @click="funcSearchMfctnames">
                    <div class="search_classify_item_txt">{{initMfctnamesTxt}}</div>
                    <div class="search_classify_img" v-if="!search_query.mfctcode.length">
                        <template v-if="initMfctnamesShow">
                            <img style="width: 16rpx;height: 8rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_classify_up.png" alt="">
                        </template>
                        <template v-else>
                            <img style="width: 16rpx;height: 8rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_classify_down.png" alt="">
                        </template>
                    </div>
                </div>
            </div>
            <!-- 显示门店 -->
            <div class="shop_fixed" v-if="shopLocation.name">
                <div class="shop_fixed_name">
                    已选择：{{shopLocation.name}}
                </div>
                <div class="shop_fixed_close" @click="funcShopClearInfo">
                    <img class="shop_fixed_close_img" src="../../../../static/images/public/public_icon_delete.png" alt="">
                </div>
            </div>
            <!-- 品类 -->
            <div class="category_dialog" catchtouchmove="ture" v-if="initCategoryShow">
                <scroll-view scroll-y="true" class="category_scroll_view">
                    <div class="category_lists">
                        <div class="category_item" :class="{'active':item.checked}" v-for="(item,index) in initCategoryList" :key="index" @click="funcSearchCategorySelect(item)">
                            <span>{{item.name}}</span>
                            <template v-if="item.checked">
                                <img style="width:21rpx;height:14rpx;" src="../../../../static/images/twohr_orderpop_list_pre.png">
                            </template>
                        </div>
                    </div>
                </scroll-view>
                <div class="category_footer">
                    <span class="category_reset" @click="funcSearchCategoryReset">重置</span>
                    <span class="category_enter" @click="funcSearchCategoryEnter">确定</span>
                </div>
            </div>
            <!-- End -->
            <!-- 品牌 -->
            <div class="category_dialog" catchtouchmove="ture" v-if="initMfctnamesShow">
                <scroll-view scroll-y="true" class="category_scroll_view">
                    <div class="category_lists">
                        <div class="category_item" :class="{'active':item.checked}" v-for="(item,index) in initMfctnamesList" :key="index" @click="funcSearchMfctnamesSelect(item)">
                            <span>{{item.name}}</span>
                            <template v-if="item.checked">
                                <img style="width:21rpx;height:14rpx;" src="../../../../static/images/twohr_orderpop_list_pre.png">
                            </template>
                        </div>
                    </div>
                </scroll-view>
                <div class="category_footer">
                    <span class="category_reset" @click="funcSearchMfctnamesReset">重置</span>
                    <span class="category_enter" @click="funcSearchMfctnamesEnter">确定</span>
                </div>
            </div>
            <!-- End -->
            <!-- dialog background -->
            <div class="search_updown_dialog" catchtouchmove="ture" v-if="initCategoryShow || initMfctnamesShow"></div>
        </div>
        <!-- End -->
        <!-- start -->
        <div class="sales_dialog" :class="{'margin_top':shopLocation.name}">
            <div class="sales_tag">{{sales_tag}}</div>
            <div class="sales_content">{{sales_content}}</div>
        </div>
        <!-- End -->
        <!-- 搜索结果 -->
        <template v-if="search_result.length">
            <div class="products_small_wrap" v-if="product_tabs == 'small'">
                <samll-product v-for="(item,index) in search_result" :key="index" :product="item" :logistics="flag_logistics"></samll-product>
            </div>
            <div class="products_thumb_wrap" v-if="product_tabs == 'thumb'">
                <thumbnail-product v-for="(item,index) in search_result" :key="index" :product="item" :initDetail="shansong" @shopCartNum="funCartNum" :logistics="flag_logistics"></thumbnail-product>
            </div>
            <div class="weui-loadmore">
                <div v-if="curr_page !== pages" class="weui-loading"></div>
                <div class="weui-loadmore__tips">{{curr_page == pages?"已经全部加载完毕":"正在加载..."}}</div>
            </div>
        </template>
        <template v-if="is_no_data">
            <div class="search_no_data">
                <img class="search_no_data_img" src="../../../../static/images/public/public_empty_pic.png" alt="">
                <p class="search_no_data_txt">哎呀，什么也没搜到</p>
            </div>
        </template>
        <div class="search_like" v-if="is_no_data">
            <promote-title :title_aaa_bbb="'猜你喜欢'"></promote-title>
            <div class="search_like_result">
                <likeGood :mainData="item" v-for="(item,index) in like_result" :key="index"></likegood>
            </div>
            <div class="weui-loadmore">
                <div v-if="!like_end" class="weui-loading"></div>
                <div class="weui-loadmore__tips">{{like_end?"已经全部加载完毕":"正在加载..."}}</div>
            </div>
        </div>


        <!-- 换购弹层 -->
        <div class="sales_shopcart" @click="funcClose" v-if="show_toast" catchtouchmove="ture">
            <div class="sales_shopcart_box">
                <div class="sales_shopcart_top"> 选择赠品
                    <img @click="funcClose" src="/static/images/public/public_pop_close.png" style="width:44rpx;height:44rpx;" class="toast_time_close"/>
                </div>
                <scroll-view scroll-y="true" class="sale_shopcart_content">
                <!-- <div class="sale_shopcart_content"> -->
                    <div class="shopcart_pro" @click.stop="funcSelectClick(index)" v-for="(item, index) in shop_product_list" :key="index">
                        <img v-if="item.select" src="/static/images/public/publicCircle-checkOn.png"  style="width:36rpx;height:36rpx;">
                        <img v-else src="/static/images/public/publicCircle-checkOff.png"  style="width:36rpx;height:36rpx;">
                        <div class="shopcart_pro_content">
                            <img :src="item.image || '/static/images/twohr_seat_pic70x70.png'" style="width:120rpx;height:120rpx;">
                            <div class="shopcart_pro_desc">
                                <div class="ellipsis" style="color:#333;font-size:24rpx;">{{item.marketing_title}}</div>
                                <!-- <div style="color:#999;font-size:20rpx;height:30rpx;display:none">
                                    <span>赠品</span>
                                    <span v-if="item.product_color">颜色：{{item.product_color}}</span>
                                    <span v-if="item.product_size">尺码：{{item.product_size}}</span>
                                </div> -->
                                <div class="shopcart_pro_desc_price">
                                    <div style="color:#ff5000">
                                        <span style="font-size:24rpx;font-family: PingFangSC-Medium;">赠品</span>
                                        <!-- <span style="font-size:20rpx;font-family: PingFangSC-Medium;">¥</span>
                                        <span style="font-size:30rpx;font-family: PingFangSC-Medium;">{{item.price_f[0]}}</span>
                                        <span style="font-size:20rpx;">{{item.price_f[1]}}</span> -->
                                    </div>
                                    <span style="font-size:24rpx;color:#333">×{{item.quantity}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- </div> -->
                </scroll-view>

                <div class="sales_shopcart_submit_box">
                    <!-- <div class="sales_num">已选择{{1}}/{{shop_product_list.length}}件</div> -->
                    <div class="sales_shopcart_submit" @click.stop="funcSubmit()">确定</div>
                </div>
                
            </div>
        </div>

        <!-- 查看赠品 -->
        <div class="sales_zengpin" v-if="Moregift">
            <div class="sales_zengpin_Price">
                <div class="sales_zengpin_Price_box">
                    <span class="sales_zengpin_text1">小计：</span>
                    <span class="sales_zengpin_text2">{{giftData.money}}元</span>
                </div>
                <div class="sales_zengpin_text3">{{giftData.money_desc}}</div>
            </div>
            <div class="sales_zengpin_look" @click.stop="lookMoreGift">查看赠品</div>
            <div class="sales_zengpin_look sales_zengpin_cart" @click.stop="gotocart">去购物车</div>
        </div>

    </div>
    
</template>

<script>
import { searchKeyword, productQuery, getSuggest ,searchGoodsList, getLikeInfo ,getshopcartNum, calculatePromotion,
        choosePromotion,chooseSku} from '@/api';
import samllProduct from '@/components/product/samll/index';
import thumbnailProduct from '@/components/product/thumbnail/index';
import likeGood from '@/components/public/likeGood';
import promoteTitle from '@/components/product/promote/title';
import { mapMutations, mapState } from 'vuex';
import cartModaldata from '@/components/cartModal/index';
import {priceFormat} from '@/utils'
export default {
    data() {
        return {
            shansongcart_id:'',
            ModuleClass:false,
            shopCartNum:'',

            shansong:'',
            is_no_data: false,
            sales_tag: '',
            sales_content: '',

            search_result: [],
            total: 20,
            curr_page: 1,
            pages: 0,
            product_tabs: 'thumb',
            class_active: 1,
            class_active_wl: false,
            sub_class_active: '',
            suggest: [],
            initPrice: null,
            initCategoryShow: false,

            like_result: [],
            like_curr_page: 1,
            like_end: false,

            initCategoryTxt:'品类',
            initCategoryList: [],

            initMfctnamesShow: false,
            initMfctnamesTxt: '品牌',
            initMfctnamesList: [],

            leyou_service: [],
            custom_search_key: {},
            flag_logistics: false,
            init_pp_num: 0,
            init_fl_num: 0,
            show_toast:false,
            Moregift:false, //传递过来的是否扫码赠品
            giftNum:0, //赠品的数量,
            selectIndex:0,  //默认选择的第一个赠品
            giftData:{},
            source:'',
            promotion_id:'',
            shop_product_list:[],
            search_query: {
                service: [],
                comblex_search:[],  //搜索内容
                ctyids: [],  //分类id
                promotionidList:'', //促销查询
                isMeet:1,  //闪送标识
                shopIdList:'',   //门店id
                comprehensive: '',   //综合排序
                price: '',    //价格	true升序  false降序
                addtime: '', //新品优先,
                prodcutsellamount: '',	//按销量
                priceNumber:['0','*'],    //价格
                startmonth: '', //开始时间
                endmonth: '',   //结束时间
                usingAge: '',    //年龄
                category: [],    //筛选品类
                mfctcode: [],    //筛选品牌
                logistics: ''
            }
        }
    },
    components: {
        samllProduct,
        thumbnailProduct,
        likeGood,
        promoteTitle,
        cartModaldata,
    },
    computed:mapState(['backFilterInfo','shopLocation']),
    onLoad(option){
        this.sa_page(this,false,'促销活动','');
        // console.log(option,'有闪送吧')
        if(option.shansong){
            this.shansong = option.shansong;
        }else{
            this.shansong = 'other';
        }
        if(option.channel){
            Object.assign(this.$data, this.$options.data())
        }
        if(option.gift){ //选择赠品跳入
            console.log(option,'我是传入过来的数据')
            this.Moregift = true;
            this.funcShopCartPromition(option);
        }
        this.sales_tag = option.title;
        this.sales_content = option.content;
        this.search_query.promotionidList = option.promotion_id;
        this.source = option.source;
        this.promotion_id = option.promotion_id;
        this.funcSearchKeysResult(option.c_name);
        // this.funcShopCartPromition();
        // this.funCartNum();
    },
    onShow(){
        this.show_toast = false;
        this.is_no_data = false;
        this.init_fl_num = 0;
        this.init_pp_num = 0;
        if(this.shopLocation.shopId){
            this.search_query.shopIdList = this.shopLocation.shopId;
            this.funcSearchClassAll();
        }
        if( this.backFilterInfo ){
            this.initCategoryTxt = this.backFilterInfo.initCategoryTxt||'品类';
            this.initMfctnamesTxt = this.backFilterInfo.initMfctnamesTxt||'品牌';
            this.search_query.mfctcode = this.backFilterInfo.mfctcode;
            this.search_query.category = this.backFilterInfo.category;
            this.search_query.priceNumber = this.backFilterInfo.price;
            this.search_query.service = this.backFilterInfo.service;
            this.search_query.logistics = this.backFilterInfo.logistics;
            if( this.backFilterInfo.logistics ){
                this.class_active_wl = true;
            } else {
                this.class_active_wl = false;
            }
            this.flag_logistics = this.class_active_wl;
            this.funcSearchClassAll();
        }
        this.initCategoryList.forEach((item,index) => {
            if( item.checked ){
                this.init_fl_num += 1;
            }
        });
        this.initMfctnamesList.forEach((item,index) => {
            if( item.checked ){
                this.init_pp_num += 1;
            }
        });
    },
    onReachBottom(){
        if( this.is_no_data ){
            if( !this.like_end ){
                this.like_curr_page = this.like_curr_page+1;
                this.funcGetLikeInfo();
            }
        }
        if( this.curr_page == this.pages ){
            return false;
        }
        this.curr_page = this.curr_page + 1;
        this.funcQuerySearch();
        
    },
    onUnload(){
       this.Moregift = false;
    },
    watch: {
        'input_value':function(n,o){
            this.funcGetSuggest(n);
        }
    },
    methods: {
        // 购物车促销物品接口
        funcShopCartPromition(option) {
            wx.showLoading();
            let cart_id = wx.getStorageSync('cart_id');
            let params = {
                cart_id:cart_id,
                source:option.source,
                promotion_id:option.promotion_id,
                shop_id:wx.getStorageSync('shop_id')
            };
            // console.log(params,'我是购物车接口')
            calculatePromotion(params).then(
                res => {
                    wx.hideLoading();
                    // console.log(res,'我是返回来的结果')
                    res.product_list.map((pro_item,index) => {
                        pro_item.price_f = priceFormat(pro_item.sale_price)
                        if(option.seceltSku==pro_item.sku){
                            pro_item.select = true;
                        }else{
                            pro_item.select = false;
                        }                        
                    });
                    if(option.source==1){
                        this.show_toast = true;
                    }
                    this.shop_product_list = res.product_list;
                    this.giftData=res;
                    // console.log(res);
                }
            );
        },
        lookMoreGift(){ //查看更过赠品
            this.show_toast = true;
            this.Moregift = false;
            // this.funcShopCartPromition();
        },
        funcClose() { //关闭选择赠品
            this.show_toast = false;
            this.Moregift = true;
        },
        gotocart(){ //跳转到购物车
            wx.navigateBack({
                delta: 1 // 回退前 delta(默认为1) 页面
            })
        },
        funcSelectClick(indexx) {
            this.selectIndex = indexx;
            let that = this;
            let pro = this.shop_product_list[indexx];
            this.shop_product_list.map((res,index)=>{
                if(indexx==index){
                    res.select = true;
                }else{
                    res.select = false;
                }
            })
            this.shop_product_list = this.shop_product_list;
            // let that = this;
            // this.giftNum=0;
            // let pro = this.shop_product_list[index];
            // pro.select = !pro.select;
            // this.shop_product_list.map(res=>{
            //     if(res.select==true){
            //        this.giftNum = this.giftNum+1
            //     }
            // })
            // this.shop_product_list = this.shop_product_list;
        },
        
        funcSubmit() { //确定
            let pro = this.shop_product_list[this.selectIndex];
            let cart_id = wx.getStorageSync('cart_id');
            let skus = [{
                sku:pro.sku,
                amount:pro.quantity
            }]
            let params = {
                cart_id:cart_id,
                source:this.source,    //1 ,购物车  3，扫码购
                skus:skus,
                promotion_id:this.promotion_id,
                shop_id:wx.getStorageSync('shop_id')
            };
            console.log(params,'我是传入的参数')
            // choosePromotion(params).then(
            //     res => {
            //         console.log(res);
            //     }
            // );
            chooseSku(params).then(res=>{
                wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                })
            })
        },
    
        // 购物车
        onInCart() {
            this.shansongcart_id = wx.getStorageSync('shansongcart_id');
            this.cartShopIds = wx.getStorageSync('shan_shop_id') //获取商店ID
            this.ModuleClass = true;
        },
        closeModal(msg) {   //关闭购物车模态框
            this.ModuleClass = false;
        },
         //获取购物车的数量
        funCartNum() {
            let tokenid = wx.getStorageSync('token');
            let shansongcart_id = wx.getStorageSync('shansongcart_id');
            let params ={};
            if(tokenid){
                //获取购物车数量
                params = {
                    shop_id: wx.getStorageSync('shan_shop_id'),
                    cart_type: 2,
                    is_check: 2
                };
                getshopcartNum(params).then(res => {
                    // console.log(res, "购物车数量");
                    this.shopCartNum = res.num;
                });
            }else if(shansongcart_id){
                params = {
                    shop_id: wx.getStorageSync('shan_shop_id'),
                    cart_type: 2,
                    is_check: 2,
                    cart_id:wx.getStorageSync('shansongcart_id')
                };
                getshopcartNum(params).then(res => {
                    // console.log(res, "购物车数量");
                    this.shopCartNum = res.num;
                });
            }
           
        },
        //获取猜你喜欢数据
        funcGetLikeInfo(){
            let query = {
                page_index: this.like_curr_page,
                page_size: this.total,
                is_daguan_data:1
            }
            getLikeInfo(query).then( res => {
                this.like_result = [...this.like_result,...res.product_list];
                this.like_end = res.is_end;
            });
        },
        funcQuerySearch(){
            let queryCategory = '';
            let queryMfctcode = '';
            if( this.search_query.category.length ){
                if( this.search_query.category.length == 1 ){
                    queryCategory = this.search_query.category.join('')
                } else if( this.search_query.category.length > 1){
                    queryCategory = '(' + this.search_query.category.join(' OR ') + ')'
                }
            }
            if( this.search_query.mfctcode.length ){
                if( this.search_query.mfctcode.length == 1 ){
                    queryMfctcode = this.search_query.mfctcode.join('')
                } else if( this.search_query.mfctcode.length > 1){
                    queryMfctcode = '(' + this.search_query.mfctcode.join(' OR ') + ')'
                }
            }
            let query = {
                channel: 0,
                queryList: [
                    `promotionidList:${this.search_query.promotionidList}`
                ],
                sortList: [
                    `comprehensive:${this.search_query.comprehensive}`,
                    `price:${this.search_query.price}`,
                    `prodcutsellamount:${this.search_query.prodcutsellamount}`,
                    `addtime:${this.search_query.addtime}`
                ],
                filterList: [
                    `price:${this.search_query.priceNumber.join('-')}`,
                    `category:${queryCategory}`,
                    `mfctcode:${queryMfctcode}`,
                    `shopIdList:${this.search_query.shopIdList}`
                ],
                start: this.curr_page,
                rows: this.total
            }
            if(this.search_query.logistics){
                query.filterList.push(`logistics:${this.search_query.logistics}`)
            }
            if( this.search_query.service.length ){
                query.filterList = [...query.filterList,...this.search_query.service]
            }
            this.funcInitGetProductLists(query);
        },
        //筛选
        funcSearchFilter(){
            let filter = {
                leyou_service: this.leyou_service,
                initCategoryList: this.initCategoryList,
                initMfctnamesList: this.initMfctnamesList,
                price: this.search_query.priceNumber,
                custom_search_key: this.custom_search_key
            }
            wx.navigateTo({
                url: '/pages/search/filter/main'
            });
            this.$store.commit('searchFilterMutations', filter);
        },
        //附近门店
        funcSearchGoToShop(){
            wx.navigateTo({
                url: '/pages/search/shop/index/main?source=search'
            });
        },
        //清空输入框
        funcCLearKeysWords(){
            this.input_value = '';
            this.input_foucs = true;
        },
        //获取品类品牌等筛选内容
        funcInitQueryList(){
            let query = {
                facetOn:1,
                queryList:[
                    `promotionidList:${this.search_query.promotionidList}`
                ],
                facetList: ['mfctnames','category']
            }
            productQuery(query).then( res => {
                let { category, mfctnames, leyou_service, custom_search_key} = res;
                this.initCategoryList = category;
                this.initMfctnamesList = mfctnames;
                this.leyou_service = leyou_service;
                this.custom_search_key = custom_search_key;
            })
        },
        //物流索索
        funcSearchLogistics(){
            this.class_active_wl = !this.class_active_wl;
            this.flag_logistics = this.class_active_wl;
            this.class_active_wl?this.search_query.logistics = 1:this.search_query.logistics = '';
            this.initPrice = null;
            this.funcSearchClassAll();
            this.leyou_service.forEach((item,index) => {
                if( item.name == '物流有货'){
                    if( typeof item.checked == 'undefined' ){
                        this.$set(item,'checked',this.class_active_wl)
                    } else {
                        item.checked = this.class_active_wl;
                    }
                }
            });
        },
        //新品搜索
        funcSearchNewProdcut(){
            this.class_active = 6;
            this.search_query.addtime = 'false';
            this.search_query.comprehensive = '';
            this.search_query.prodcutsellamount = '';
            this.search_query.price = '';
            this.initPrice = null;
            this.funcSearchClassAll();
        },
        //综合搜索
        funcSearchComprehensive(){
            this.class_active = 1;
            this.search_query.comprehensive = 'false';
            this.search_query.addtime = '';
            this.search_query.prodcutsellamount = '';
            this.search_query.price = '';
            this.initPrice = null;
            this.funcSearchClassAll();
        },
        //销量搜索
        funcSearchProdcutsellamount(){
            this.class_active = 2;
            this.search_query.comprehensive = '';
            this.search_query.prodcutsellamount = 'false';
            this.search_query.price = '';
            this.search_query.addtime = '';
            this.initPrice = null;
            this.funcSearchClassAll();
        },
        //价格搜索
        funcSearchPrice(){
            this.class_active = 3;
            if ( this.initPrice == null ){
                this.initPrice = true;
            } else {
                this.initPrice = !this.initPrice;
            }
            
            this.search_query.price = this.initPrice;
            this.search_query.comprehensive = '';
            this.search_query.prodcutsellamount = '';
            this.search_query.addtime = '';
            this.funcSearchClassAll();
        },
        //品类搜索
        funcSearchCategory(){
            this.sub_class_active = 2;
            this.initMfctnamesShow = false;
            this.initCategoryShow = !this.initCategoryShow;
        },
        //品类重置
        funcSearchCategoryReset(){
            this.search_query.category = [];
            this.initCategoryTxt = '品类';
            this.init_fl_num = 0;
            this.initCategoryList.forEach((item) => {
                if( typeof item.checked == 'undefined' ){
                    this.$set(item,'checked',false)
                } else {
                    item.checked = false;
                }
            });
        },
        //品类确定
        funcSearchCategoryEnter(){
            let categoryName = []
            this.initCategoryList.forEach((item) => {
                if( item.checked ){
                    categoryName.push(item.name);
                }
            });
            this.initCategoryTxt = categoryName.join(',');
            this.search_query.category = categoryName;
            this.initCategoryShow = false;
            if( !categoryName.length ){
                this.initCategoryTxt = '品类';
            }
            this.funcSearchClassAll();
        },
        //添加品类
        funcSearchCategorySelect(item){
            if( typeof item.checked == 'undefined' ){
                this.$set(item,'checked',true)
            } else {
                item.checked = !item.checked;
            }
            item.checked?this.init_fl_num += 1:this.init_fl_num -= 1;
            if(this.init_fl_num > 5){
                item.checked = false;
                this.init_fl_num = 5;
                wx.showToast({
                    title:'最多可以选择5种哦',
                    icon: 'none'
                });
            }
        },
        funcSearchMfctnames(){
            this.sub_class_active = 3;
            this.initMfctnamesShow = !this.initMfctnamesShow;
            this.initCategoryShow = false;
        },
        //品牌重置
        funcSearchMfctnamesReset(){
            this.search_query.mfctcode = [];
            this.initMfctnamesTxt = '品牌';
            this.init_pp_num = 0;
            this.initMfctnamesList.forEach((item) => {
                if( typeof item.checked == 'undefined' ){
                    this.$set(item,'checked',false)
                } else {
                    item.checked = false;
                }
            });
        },
        //品牌确定
        funcSearchMfctnamesEnter(){
            let mfctnamesName = [];
            let mfctnamesCode = [];
            this.initMfctnamesList.forEach((item) => {
                if( item.checked ){
                    mfctnamesName.push(item.name);
                    mfctnamesCode.push(item.code);
                }
            });
            this.initMfctnamesTxt = mfctnamesName.join(',');
            this.search_query.mfctcode = mfctnamesCode;
            this.initMfctnamesShow = false;
            if( !mfctnamesName.length ){
                this.initMfctnamesTxt = '品牌';
            }
            this.funcSearchClassAll();
        },
        //添加品牌
        funcSearchMfctnamesSelect(item){
            if( typeof item.checked == 'undefined' ){
                this.$set(item,'checked',true)
            } else {
                item.checked = !item.checked;
            }
            item.checked?this.init_pp_num += 1:this.init_pp_num -= 1;
            if(this.init_pp_num > 5){
                item.checked = false;
                this.init_pp_num = 5;
                wx.showToast({
                    title:'最多可以选择5种哦',
                    icon: 'none'
                });
            }
        },
        //搜索
        funcSearchClassAll(){
            this.curr_page = 1;
            this.initCategoryShow = false;
            this.initMfctnamesShow = false;
            this.search_result = [];
            this.funcQuerySearch();
            
        },

        //搜索促销活动结果
        funcSearchKeysResult(){
            this.$store.commit('shopLocationMutations', {});
            this.$store.commit('backFilterInfoMutations', null);
            this.pages = 1;
            this.search_result = [];
            let query = {
                channel: 0,
                queryList: [
                    `promotionidList:${this.search_query.promotionidList}`
                ],
                sortList: [
                    `comprehensive:false`
                ],
                filterList: [
                    `price:${this.search_query.priceNumber.join('-')}`
                ]
            }
            this.funcInitGetProductLists(query);
            this.funcInitQueryList();
        },
        /**
         * 默认请求数据
         */
        funcInitGetProductLists(query){
            let _this = this;
            wx.showLoading({
                title: '数据加载中',
            });
            this.is_no_data = false;
            productQuery(query).then( res => {
                wx.hideLoading();
                if( res.data.length ){
                    res.data.forEach((item,index) => {
                        let arr = item.prices.split('.');
                        if( arr.length.length < 2){
                            arr.push('00');
                        } else {
                            if( arr[1].length < 2 ){
                                arr[1] = arr[1].toString() + '0';
                            }
                        }
                        item.prices = arr;
                    });
                    this.search_result = [...this.search_result, ...res.data];
                    this.pages = res.pages;
                } 
                // console.log(this.search_result,'dddddddddddddddddddddddddddddddd')
                if(!this.search_result.length){
                    this.is_no_data = true;
                    this.funcGetLikeInfo();
                }
            });
        },
        //删除门店
        funcShopClearInfo(){
            this.$store.commit('shopLocationMutations', {});
            this.search_query.shopIdList = '';
            this.funcSearchClassAll();
        }
    }

}
</script>

<style scoped>

/* 查看赠品 */
.sales_zengpin{
    height: 98rpx;
    width: 750rpx;
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
    position: fixed;
    bottom: 0rpx;
    z-index: 100;
}
.sales_zengpin_Price{
    display: flex;
    flex-direction: column;
    width: 370rpx;
    height: 98rpx;
    line-height: 98rpx;
    background: #FFFFFF;
    box-shadow: inset 0 1px 0 0 #DDDDDD;
    padding-left: 20rpx;
}
.sales_zengpin_Price_box{
    display: flex;
    align-items: center;
    margin-top: 15rpx;
    margin-bottom: 7rpx;
}
.sales_zengpin_text1{
    font-size: 24rpx;
    color: #333333;
    /* text-align: right; */
    line-height: 30rpx;
}
.sales_zengpin_text2{
    font-size: 30rpx;
    color: #FF5000;
    letter-spacing: 0;
    /* text-align: right; */
    line-height: 36rpx;
}
.sales_zengpin_text3{
    font-size: 20rpx;
    color: #666666;
    line-height: 24rpx;
}





.sales_zengpin_look{
    height: 98rpx;
    line-height: 98rpx;
    width: 180rpx;
    text-align: center;
    background: #FAC800;
    font-size: 30rpx;
    color: #FFFFFF;
}
.sales_zengpin_cart{
    background: #FF5000 !important;
}



.sales_shopcart {
   width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center;  */
}
.sales_shopcart_submit_box{
    display: flex;
    align-items: center;
    line-height: 98rpx;
    height: 98rpx;
    /* justify-content: center; */
    font-family: PingFangSC-Medium;
    /* text-align: center; */
}
.sales_num{
    font-size: 26px;
    color: #333333;
    line-height: 30rpx;
    width: 490rpx;
    background: #FFFFFF;
    line-height: 98rpx;
    height: 98rpx;
    padding-left: 20rpx;
    box-shadow: inset 0 1px 0 0 #DDDDDD;
}
.sales_shopcart_submit {
    width: 240rpx;
    background: #ff5000;
    font-size: 30rpx;
    text-align: center;
    color: #fff;
    width: 100%;
}
.sales_shopcart_box{
    position: fixed;
    bottom: 0rpx;
    width: 750rpx;
    height: 800rpx;
}

.sales_shopcart_top {
    background: #fff;
    width: 100%;
    height: 88px;
    text-align: center;
    line-height: 88px;
    color: #333;
    font-size: 30rpx;
    border-radius: 20rpx 20rpx 0 0;
}

.toast_time_close {
  position: absolute;
  right: 28rpx;
  top: 20rpx;
}

.sale_shopcart_content {    
    background: #fff;
    height: 614rpx;
    width: 100%;
}

.shopcart_pro {
    padding: 0 20px 0 20px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    margin-top: 20rpx;
}

.shopcart_pro_content {
    flex: 1;
    margin-left: 20rpx;
    height: 140rpx;
    display: flex;
    /* align-items: center; */
   
}

.shopcart_pro_desc {
    height: 120rpx;
    margin-left: 20rpx;
    width: 514rpx;
     border-bottom: 1px solid #eee;
     padding-bottom: 20rpx;
}
.ellipsis{
    display: inline-block;
  white-space: nowrap; 
  width: 100%; 
  overflow: hidden;
  text-overflow:ellipsis;
}

.shopcart_pro_desc_price {
    margin-top: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

/* 购物车 */

.cartImg {
  position: fixed;
  bottom: 80rpx;
  left: 30rpx;
  width: 96rpx;
  height: 96rpx;
  z-index: 111;
}

.product_cartNum {
  position: fixed;
  left: 90rpx;
  bottom: 140rpx;
  height: 25rpx;
  color: #ffffff;
  width: 25rpx;
  text-align: center;
  line-height: 22rpx;
  border-radius: 50%;
  border: 2rpx solid #ff5000;
  background: #ff5000;
  font-size: 18rpx;
  z-index: 111;
}

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

.search {
    min-height: 100vh;
    background: #f3f5f7;
}
.products_small_wrap {
    padding-top: 6px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #f3f5f7;
}
.products_thumb_wrap {
    padding-top: 20px;
}
.search_top_fixed {
    width: 100%;
    background: #fff;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 222;
}
.search_input {
    display: flex;
    margin: 6px 30px 10px 20px;
    justify-content: space-between;
    align-items: center;
    position: relative;
    outline: none;
}
.product_tab_samll {
    width: 58px;
    height: 58px;
    display: block;
}
.product_tab_thumb{
    width: 58px;
    height: 58px;
    display: block;
}
.search_dialog_lists{
    width: 100%;
    height: 100%;
    background: #ffffff;
    position: fixed;
    left: 0;
    top: 70px;
    z-index: 99;
}
.search_dialog_result {
    padding: 0 30px 0 83px;
    line-height: 58px;
    font-size: 24px;
    color: #333333;
}
.search_input_icon {
    width: 30.3px;
    height: 29.5px;
    overflow: hidden;
    position: absolute;
    left: 20px;
    top: 15px;
    z-index: 99;
}
.search_input_icon_clear {
    padding: 10px 20px;
    position: fixed;
    left: 565px;
    top: 4px;
    z-index: 999;
}
.search_input_icon_img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    border: none;
}
.search_input_wrap_value {
    padding-left: 63px;
    width: 620px;
    height: 60px;
    border-radius: 30px;
    box-sizing: border-box;
    background: #F2F2F2;
    font-size: 26px;
    color: #333333;
}
.search_input_wrap_value:placeholder{
    color: #CACACA;
}
.search_input_button {
    font-size: 30px;
    color: #333333;
}
.search_keys {
    width: 100%;
    height: 100%;
    padding: 58px 30px 0 20px;
    background: #fff;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    top: 70px;
}
.search_keys_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    font-size: 30px;
    line-break: 34px;
    color: #999999;
}
.search_keys_wrap {
    padding-bottom: 58px;
    display: flex;
    flex-wrap: wrap;
}
.search_key {
    margin: 0 20px 20px 0;
    padding: 0 34px;
    border-radius: 29px;
    background: #F6F6F6;
    line-height: 58px;
    font-size: 24px;
    color: #333333;
}
.search_keys_delete {
    width: 32px;
    height: 34px;
}
.search_keys_delete_img {
    width: 32px;
    height: 34px;
}
.products_mores {
    background: #f3f5f7;
    padding: 40px 0;
    text-align: center;
    font-size: 24px;
    line-height: 30px;
}
.search_classify{
    display: flex;
    /* border-bottom: #f3f5f7 1px solid; */
}
.search_classify_item {
    width: 200px;
    padding: 15px 25px;
    box-sizing: border-box;
    text-align: center;
    font-size: 26px;
    line-height: 32px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
}
.search_classify_item_txt{
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
}
.search_classify_img {
    margin-left: 5px;
    width: 16px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.search_classify_img_arrow {
    display: block;
}
.search_classify_item.active {
    color: #FF5000;
}
.search_classify_item.bold {
    font-weight: 700;
}
.scroll_view {
    height: 900px;;
}
.category_dialog {
    width: 100%;
    background: #ffffff;
    position: fixed;
    left: 0;
    top: 154px;
    z-index: 79;
}
.category_scroll_view {
    height: 448px;
}
.category_footer {
    display: flex;
    border-top: #dddddd 1px solid;
    
}
.category_reset,.category_enter {
    width: 50%;
    border: 0px;
    padding: 0;
    margin: 0;
    border-radius: 0;
    background: #FFFFFF;
    text-align: center;
    font-size: 30px;
    line-height: 80px;
    color: #333333;
}
.category_enter{
    background: #FF5000;
    color: #ffffff;
    
}
.category_lists {
    display: flex;
    flex-wrap: wrap;
    padding: 0 40px 0 0;
    justify-content: space-between;
}
.category_item {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 40px;
    box-sizing: border-box;
    line-height: 80px;
    font-size: 24px;
    color: #333333;
}
.category_item.active {
    color: #FF5000;
}
.search_updown_dialog {
    position: fixed;
    left: 0;
    top: 209px;
    width: 100%;
    height: 100%;
    z-index: 78;
    background: rgba(0,0,0,0.5);
}
.search_no_data {
    padding: 400px 0 250px;
    font-size: 30px;
    color: #333333;
    text-align: center;
    display: flex;
    flex-direction: column;

}
.search_no_data_img {
    width: 266px;
    height: 222px;
    display: block;
    margin: 0 auto;
}
.search_no_data_txt {
    width: 100%;
    padding-top: 40px;
    font-size: 30px;
    color: #333333;
}
.search_sub_info {
    padding: 14px 0;
    display: flex;
    font-size: 24px;
    color: #333333;
    justify-content: space-around;
}
.search_logistics,.search_shop,.search_sub_classify {
    width: 150px;
    height: 60px;
    display: flex;
    border-radius: 30px;
    line-height: 60px;
    background: #F6F6F6;
    text-align: center;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.search_sub_classify.active,.search_shop.active,.search_logistics.active{
    background: #FFF7D5;
    color: #FF5000;
}
.search_screen_img {
    width: 20px;
    height: 21px;
    margin-left: 6px;
    display: block;
}
.search_like_result {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.sales_dialog {
    margin-top: 150px;
    padding: 20px 0 0 20px;
    width: 100%;
    background: #f3f5f7;
    display: flex;
    /* align-items: center; */
    text-align: center;
    box-sizing: border-box;
}
.sales_dialog.margin_top{
    margin-top: 210px;
}
.sales_tag {
    min-width: 104px;
    height: 32px;
    line-height: 30px;
    white-space: nowrap;
    border: #FF5000 1px solid;
    box-sizing: border-box;
    font-size: 22px;
    color: #FF5000;
    padding: 0 10px;
    border-radius: 16px;
}
.sales_content {
    flex: 1;
    padding: 0 20px 0 12px;
    font-size: 24px;
    line-height: 32px;
    color: #333333;
    text-align: justify;
}
.shop_fixed {
    height: 70px;
    position: fixed;
    left: 0;
    top: 150px;
    width: 100%;
    background: #ffffff;
    font-size: 24px;
    padding: 0 40px;
    box-sizing: border-box;
    line-height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: #eeeeee 1px solid;
}
.shop_fixed_close_img {
    width: 32px;
    height: 32px;
    display: block;
}
</style>