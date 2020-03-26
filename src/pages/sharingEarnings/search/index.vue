<template>
    <div class="search">
        <div class="search_top_fixed">
            <!-- 实时搜索 -->
            <div class="search_dialog_lists" v-if="input_value && input_foucs">
                <div class="search_dialog_result" v-for="(item,index) in suggest" :key="index" @click="funcSearchKeysResult(item,0)">{{item}}</div>
            </div>
            <!-- End -->
            <div class="search_keys" v-if="input_value == ''">
                <!-- 最近搜索 -->
                <div class="search_keys_section" v-if="history_words.length">
                    <h4 class="search_keys_title"><span>历史搜索</span><span class="search_keys_delete" @click="funcSearchDeleteKey"><img src="/static/images/search/search_icon_delete.png" alt="" class="search_keys_delete_img"></span></h4>
                    <div class="search_keys_wrap">
                        <span class="search_key" v-for="(item,index) in history_words" :key="index" @click="funcSearchKeysResult(item,1)">
                            {{item}}
                        </span>
                    </div>
                </div>
                <!-- End -->
                <!-- 热门搜索 -->
                <div class="search_keys_section">
                    <h4 class="search_keys_title"><span>热门搜索</span></h4>
                    <div class="search_keys_wrap">
                        <span class="search_key" v-for="(item,index) in hot_words" :key="index" @click="funcSearchKeysResult(item,2)">
                            {{item}}
                        </span>
                    </div>
                </div>
                <!-- End -->
            </div>
            <!-- 顶部搜索 -->
            <div class="search_input">
                <em class="search_input_icon"><img src="/static/images/navbar_search.png" class="search_input_icon_img"></em>
                <div class="search_input_wrap">
                    <template v-if="input_value">
                        <span class="search_input_icon_clear" @click.stop="funcCLearKeysWords">
                            <icon type="clear" size="18" color="#999999" />
                        </span>
                    </template>
                    <input type="text" @focus="funcInputFocus" v-model="input_value" confirm-type="done" @confirm="funcSearchSubmit" class="search_input_wrap_value" :placeholder="placeholder" placeholder-style="color:#cacaca;">
                </div>
                <template v-if="input_foucs">
                    <span class="search_input_button" @click="funcSearchSubmit">搜索</span>
                </template>
                <template v-else>
                    <template v-if="product_tabs=='small'">
                        <span class="product_list_tab" @click="funcProductTabs('thumb')">
                            <img src="/static/images/search/search_icon_list.png" class="product_tab_samll">
                        </span>
                    </template>
                    <template v-if="product_tabs=='thumb'">
                        <span class="product_list_tab" @click="funcProductTabs('small')">
                            <img src="/static/images/search/search_icon_pic.png" class="product_tab_samll">
                        </span>
                    </template>
                </template>
            </div>
            <template v-if="input_value">
                <div class="search_classify">
                    <div class="search_classify_item" :class="{'active':class_active == 1}" @click="funcSearchComprehensive">综合</div>
                    <div class="search_classify_item" :class="{'active':class_active == 2}" @click="funcSearchBrokerage">
                        <div>佣金</div>
                        <div class="search_classify_img">
                            <template v-if="initBrokerage == null">
                                <img style="width: 16rpx;height: 20rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_price.png" alt="">
                            </template>
                            <template v-if="initBrokerage">
                                <img style="width: 16rpx;height: 20rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_price_up.png" alt="">
                            </template>
                            <template v-if="initBrokerage === false">
                                <img style="width: 16rpx;height: 20rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_price_down.png" alt="">
                            </template>
                        </div>
                    </div>
                    <div class="search_classify_item" :class="{'active':class_active == 3}" @click="funcSearchPrice">
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
                    <div class="search_classify_item" :class="{'active':class_active == 6}" @click="funcSearchNewProdcut">新品</div>
                    <div class="search_classify_item" @click="funcSearchFilter">
                        <span>筛选</span>
                        <div>
                            <img class="search_screen_img" src="../../../../static/images/search/search_screen.png">
                        </div>
                    </div>
                </div>
            </template>
            <!-- dialog background -->
            <div class="search_updown_dialog" catchtouchmove="ture" v-if="initCategoryShow || initMfctnamesShow"></div>
        </div>
        <!-- End -->
        <!-- 搜索结果 -->
        <template v-if="search_result.length">
            <div class="products_small_wrap" style="padding-top: 145rpx;" v-if="product_tabs == 'small'">
                <div class="product_small" v-for="(item,index) in search_result" :key="index" @click="funcGotoDetailed(item)" :sa_click_index="index" :sa_search_type='true' :sa_search_info="sa_search_info">
                    <div class="product_small_img_wrap">
                        <img class="product_small_img" :src="BASE_IMG_URL + item.le_image">
                    </div>
                    <div class="product_small_name">{{item.title}}</div>
                    <div class="product_small_tags">
                        <div class="product_samll_commission">佣金{{item.product_brokerage_dis}}%</div>
                        <div class="product_samll_money">最高可赚{{item.brokerage}}元</div>
                    </div>
                    <div class="product_samll_price">
                        <div class="product_samll_price_icon">￥</div>
                        <div class="product_thumb_price_int">{{item.prices[0]}}.</div>
                            <div class="product_thumb_price_float">{{item.prices[1]}}</div>
                    </div>
                </div>
                <!-- <samll-product  :product="item" :logistics="flag_logistics" :sa_click_index="index" :sa_search_type='true' :sa_search_info="sa_search_info"></samll-product> -->
            </div>
            <div class="products_thumb_wrap wrap_top" v-if="product_tabs == 'thumb'">
                <div class="product_thumb" v-for="(item,index) in search_result" :key="index" :sa_click_index="index" :sa_search_type='true' :sa_search_info="sa_search_info">
                    <div class="product_thumb_img_wrap">
                        <img class="product_thumb_img" :src="BASE_IMG_URL + item.le_image">
                    </div>
                    <div class="product_thumb_info">
                        <div class="product_thumb_name">{{item.title}}</div>
                        <div class="product_thumb_tags">
                            <div class="product_samll_commission">佣金{{item.product_brokerage_dis}}%</div>
                            <div class="product_samll_money">最高可赚{{item.brokerage}}元</div>
                        </div>
                        <div class="product_thumb_price">
                            <div class="product_thumb_price_icon">￥</div>
                            <div class="product_thumb_price_int">{{item.prices[0]}}.</div>
                            <div class="product_thumb_price_float">{{item.prices[1]}}</div>
                        </div>
                    </div>
                    
                </div>
                <!-- <thumbnail-product v-for="(item,index) in search_result" :key="index" :product="item" :logistics="flag_logistics" :sa_click_index="index" :sa_search_type='true' :sa_search_info="sa_search_info"></thumbnail-product> -->
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
    </div>
</template>

<script>
import { searchKeyword, shareProductQuery, getSuggest , getLikeInfo} from '@/api';
import samllProduct from '@/components/product/samll/index';
import thumbnailProduct from '@/components/product/thumbnail/index';
import likeGood from '@/components/public/likeGood';
import promoteTitle from '@/components/product/promote/title';
import { mapMutations, mapState } from 'vuex';
var app =  getApp();
export default {
    data() {
        return {
            sa_search_info:{},
            true: false,
            is_no_data: false,
            input_value: '',
            input_foucs: true,
            placeholder: '',
            history_words:[],
            hot_words:[],
            search_result: [],
            total: 20,
            curr_page: 1,
            pages: 0,
            product_tabs: 'small',
            class_active: 1,
            class_active_wl: false,
            sub_class_active: '',
            suggest: [],
            initPrice: null,
            initBrokerage: null,
            initCategoryShow: false,
            like_result: [],
            like_curr_page: 1,
            like_end: false,
            initCategoryList: [],
            init_fl_num: 0,
            init_pp_num: 0,
            initMfctnamesShow: false,
            initMfctnamesList: [],
            leyou_service: [],
            custom_search_key: {},
            flag_logistics: false,
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
                logistics: '',
                brokerage: ''
            }
        }
    },
    components: {
        samllProduct,
        thumbnailProduct,
        likeGood,
        promoteTitle
    },
    computed:{
        BASE_IMG_URL() {
            return this.$store.state.BASE_APP_INFO["download_le_image"];
        },
        backFilterInfo(){
            return this.$store.state.backFilterInfo
        },
        shopLocation(){
            return this.$store.state.shopLocation
        },
        init_placeholder(){
            return this.$store.state.init_placeholder
        }

        // mapState(['backFilterInfo','shopLocation','init_placeholder','fromTag','fromSubTag'])
    },
    onLoad(option){
        this.sa_page(this,false,'搜索','');
        this.sa_search_info = {};
        if(option.channel){
            Object.assign(this.$data, this.$options.data());
        }
        if(option.c_name){
            this.input_value = option.c_name;
            this.funcSearchKeysResult(option.c_name,3)
        } else {
            this.placeholder = '搜索乐友商品';
            // this.placeholder = this.init_placeholder.search_display;
        }
        this.funcSearchKeyword();
    },
    onShow(){
        this.is_no_data = false;
        this.init_fl_num = 0;
        this.init_pp_num = 0;
        let historyWords = wx.getStorageSync('historyWords');
        if( historyWords.length ){
            this.history_words = historyWords;
        }
        if(this.shopLocation.shopId){
            this.search_query.shopIdList = this.shopLocation.shopId;
            this.funcSearchClassAll();
        }
        if( this.backFilterInfo ){
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
        this.true = true;
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
    watch: {
        'input_value':function(n,o){
            this.funcGetSuggest(n);
        }
    },
    methods: {
        //跳转商品详情
        funcGotoDetailed(item) {
            if (this.sa_search_type) {
                let sa_info = {
                    commodityID: item.sku,
                    searchIndex: this.sa_click_index
                };
                Object.assign(sa_info, this.sa_search_info);
                appInst.sensors.track("mp_searchClick", sa_info);
            }
            wx.navigateTo({ 
                url: "/pages/goodsdetailed/main?sku=" + item.sku 
            });
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
                    `comblex_search:${this.input_value}`
                ],
                sortList: [
                    `comprehensive:${this.search_query.comprehensive}`,
                    `price:${this.search_query.price}`,
                    `prodcutsellamount:${this.search_query.prodcutsellamount}`,
                    `addtime:${this.search_query.addtime}`,
                    `brokerage:${this.search_query.brokerage}`
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
                url: '/pages/sharingEarnings/filter/main'
            });
            this.$store.commit('searchFilterMutations', filter);
        },
        
        //清空输入框
        funcCLearKeysWords(){
            this.input_value = '';
            this.placeholder = '搜索乐友商品';
            // this.placeholder = this.init_placeholder.search_display;
            this.input_foucs = true;
        },
        //获取品类品牌等筛选内容
        funcInitQueryList(){
            let query = {
                facetOn:1,
                queryList:[
                    `comblex_search:${this.input_value}`
                ],
                facetList: ['mfctnames','category']
            }
            shareProductQuery(query).then( res => {
                let { body, header } = res;
                if(header.res_code == 0){
                    let { category, mfctnames, leyou_service, custom_search_key} = body;
                    this.initCategoryList = category;
                    this.initMfctnamesList = mfctnames;
                    this.leyou_service = leyou_service;
                    this.custom_search_key = custom_search_key;
                } else {
                    wx.showToast({
                        title: header.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
            })
        },
        //新品搜索
        funcSearchNewProdcut(){
            this.class_active = 6;
            this.search_query.addtime = 'false';
            this.search_query.comprehensive = '';
            this.search_query.brokerage = '';
            // this.search_query.prodcutsellamount = '';
            this.search_query.price = '';
            this.initPrice = null;
            this.initBrokerage = null;
            this.funcSearchClassAll();
        },
        //综合搜索
        funcSearchComprehensive(){
            this.class_active = 1;
            this.search_query.comprehensive = 'false';
            this.search_query.addtime = '';
            // this.search_query.prodcutsellamount = '';
            this.search_query.price = '';
            this.search_query.brokerage = '';
            this.initPrice = null;
            this.initBrokerage = null;
            this.funcSearchClassAll();
        },
        //销量搜索
        funcSearchProdcutsellamount(){
            this.class_active = 2;
            this.search_query.comprehensive = '';
            this.search_query.prodcutsellamount = 'false';
            this.search_query.price = '';
            this.search_query.addtime = '';
            this.search_query.brokerage = '';
            this.initPrice = null;
            this.initBrokerage = null;
            this.funcSearchClassAll();
        },
        //佣金
        funcSearchBrokerage(){
            this.class_active = 2;
            if ( this.initBrokerage == null ){
                this.initBrokerage = true;
            } else {
                this.initBrokerage = !this.initBrokerage;
            }
            
            this.search_query.brokerage = this.initBrokerage;
            this.search_query.comprehensive = '';
            this.search_query.price = '';
            // this.search_query.prodcutsellamount = '';
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
            this.search_query.brokerage = '';
            // this.search_query.prodcutsellamount = '';
            this.search_query.addtime = '';
            this.initBrokerage = null;
            this.funcSearchClassAll();
        },
        //搜索
        funcSearchClassAll(){
            this.curr_page = 1;
            this.initCategoryShow = false;
            this.initMfctnamesShow = false;
            this.search_result = [];
            this.funcQuerySearch();
            
        },
        //获取搜索热词
        funcSearchKeyword(){
            let query =  {
                "channel" : 0
            }
            wx.showLoading({
                title: '数据加载中',
            });
            searchKeyword(query).then(res => {
                let { hot_words } = res;
                this.hot_words = hot_words;
                wx.hideLoading();
            });
        },
        //获取搜索关联字
        funcGetSuggest(n){
            let query = {
                channel: 0,
                suggest: n
            }
            getSuggest(query).then(res => {
                let { data } = res;
                this.suggest = data;
            })
        },
        //搜索关键字结果
        funcSearchKeysResult(val,sa_type){
            let hotKeys = this.hot_words;
            let arr = [...this.history_words];
            if( arr.indexOf(val) < 0 ){
                arr.unshift(val)
            }
            wx.setStorageSync('historyWords',arr);
            if (sa_type != 3) {
                this.$store.commit('fromTagMutations',val);
                this.$store.commit('fromSubTagMutations','');    
            }
            this.$store.commit('shopLocationMutations', {});
            this.$store.commit('backFilterInfoMutations', null);
            Object.assign(this.$data, this.$options.data())
            this.pages = 1;
            this.input_value = val;
            this.input_foucs = false;
            this.search_result = [];
            this.hot_words = hotKeys;
            this.history_words = wx.getStorageSync('historyWords');
            let query = {
                channel: 0,
                queryList: [
                    `comblex_search:${this.input_value}`
                ],
                sortList: [
                    `comprehensive:false`
                ],
                filterList: [
                    `price:${this.search_query.priceNumber.join('-')}`
                ]
            }
            let history = false;
            let recomend = false;
            if (sa_type == 1) {
                history = true;
            } 
            if (sa_type == 2) {
                recomend = true;  
            } 
            this.sa_search_info = {
                keyWord:val,
                searchFrom:'乐友',
                searchType:'',
                isHistory:history,
                isRecommend:recomend
            }
            this.funcInitGetProductLists(query);
            this.funcInitQueryList();
        },
        /**
         * 默认请求数据
         */
        funcInitGetProductLists(query){
            wx.showLoading({
                title: '数据加载中',
            });
            this.is_no_data = false;
            shareProductQuery(query).then( res => {
                wx.hideLoading();
                let { body, header } = res;
                if(header.res_code == 0){
                    if( body.data.length ){
                        body.data.forEach((item,index) => {
                            let arr = item.prices.split('.');
                            if( arr.length.length < 2){
                                arr.push('00');
                            } else {
                                if( arr[1].length < 2 ){
                                    arr[1] = arr[1].toString() + '0';
                                }
                            }
                            item.prices = arr;
                            // this.search_result.push(item);
                        });
                        this.search_result = [...this.search_result, ...body.data];
                        this.pages = body.pages;
                    }
                    if(!this.search_result.length){
                        this.is_no_data = true;
                        this.funcGetLikeInfo();
                    }
                    this.sa_search_info.resultNum = this.search_result.length;
                    app.sensors.track('mp_search', this.sa_search_info);
                    
                } else {
                    wx.showToast({
                        title: header.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        },
        /**
         * 输入框获取焦点
         */
        funcInputFocus(){
            this.placeholder = '';
            this.input_foucs = true;
            this.search_result = [];
        },
        /**
         * 搜索
         */
        funcSearchSubmit(){
            if( this.input_value ){
                this.funcSearchKeysResult(this.input_value,3);
            } else {
                let result = this.init_placeholder;
                let type = result.search_type;
                let content = result.search_content;
                if( type == 1 ){
                    this.funcSearchKeysResult(content,4);
                } else if( type == 2 ){
                    wx.setStorageSync('urlH5',content);
                    wx.navigateTo({
                        url: '/pages/transferH5/main'
                    })
                }
            }
        },
        /**
         * 删除最近的关键字
         */
        funcSearchDeleteKey(){
            let _this = this;
            wx.showModal({
                cancelColor: '#333333',
                confirmColor: '#FF5000',
                content:'是否清空历史搜索记录',
                success(res){
                    let { confirm } = res;
                    if( confirm ){
                        _this.history_words = [];
                        wx.removeStorageSync('historyWords')
                    }
                }
            })
        },
        /**
         * 预览模式切换
         */
        funcProductTabs(val){
            this.product_tabs = val;
            // this.curr_page = 1;
            // this.funcSearchKeysResult(this.input_value);
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
.search {
    min-height: 100vh;
background: #f3f5f7;}
.wrap_top {
    padding-top: 137px;
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
.search_dialog_lists{
    width: 100%;
    height: 100%;
    padding: 10px 0 0 20px;
    box-sizing: border-box;
    background: #ffffff;
    position: fixed;
    left: 0;
    top: 70px;
    z-index: 99;
}
.search_dialog_result {
    padding: 0 30px 0 0;
    line-height: 88px;
    font-size: 26px;
    color: #333333;
    border-bottom: #f3f5f7 1px solid;
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
    top: 8px;
    z-index: 999;
}
.search_input_icon_img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    border: none;
}
.search_input_wrap {
    padding-left: 63px;
    width: 620px;
    height: 60px;
    border-radius: 30px;
    box-sizing: border-box;
    background: #F2F2F2;
}
.search_input_wrap_value {
    width: 400px;
    height: 60px;
    line-height: 60px;
    color: #333333;
    font-size: 26px;
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
    z-index: 888;
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

.search_classify{
    display: flex;
    border-bottom: 1rpx solid #ddd;
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
.search_classify_item.bold {
    font-weight: 700;
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
.search_updown_dialog {
    position: fixed;
    left: 0;
    top: 209px;
    width: 100%;
    height: 100%;
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

/* 商品列表 */
.products_small_wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #f3f5f7;
}
.products_thumb_wrap {
    padding-top: 137px;
    /* background: #f3f5f7; */
}
.product_small {
    width: 372px;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 6px;
}
.product_small_img {
    width: 372px;
    height: 372px;
}
.product_small_name{
    margin: 0 20px;
    color: #333333;
    font-size: 26px;
    line-height: 36px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.product_small_tags {
    display: flex;
    padding: 10px 0 0px 20px;
    line-height: 28px;
    font-size: 20px;
}
.product_samll_commission {
    height: 28px;
    color: #FF5000;
    background: #fdf0eb;
    padding: 0 8px;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
}
.product_samll_money {
    padding: 0 8px;
    height: 28px;
    background: -webkit-linear-gradient(left, #FF8800 , #FF5000); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #FF8800, #FF5000); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #FF8800, #FF5000); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #FF8800 , #FF5000); /* 标准的语法（必须放在最后） */
    color: #ffffff;
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;
}

.product_samll_price {
    padding: 15px 0 15px 20px;
    display: flex;
    align-items: flex-end;
}
.product_samll_price_icon {
    font-size: 26px;
    line-height: 26px;
}
.product_samll_price_int {
    font-size: 34px;
    line-height: 34px;
}
.product_samll_price_float {
    font-size: 26px;
    line-height: 26px;
}

.product_thumb {
    padding: 0 20px;
    background: #ffffff;
    overflow: hidden;
    display: flex;
}
.product_thumb_info {
    flex: 1;
}
.product_thumb:not(:last-child) .product_thumb_info{
    border-bottom: 1px solid #eee;
}
.product_thumb_img_wrap {
    width: 220px;
}
.product_thumb_img {
    width: 220px;
    height: 220px;
}
.product_thumb_name{
    height: 72px;
    margin: 20px 20px 0;
    color: #333333;
    font-size: 26px;
    line-height: 36px;
}
.product_thumb_tags {
    display: flex;
    margin: 59px 0 5px;
    padding-left: 20px;
    line-height: 28px;
    font-size: 20px;
}
.product_thumb_commission {
    height: 28px;
    color: #FF5000;
    background: #fdf0eb;
    padding: 0 8px;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
}
.product_thumb_money {
    padding: 0 8px;
    height: 28px;
    background: -webkit-linear-gradient(left, #FF8800 , #FF5000); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #FF8800, #FF5000); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #FF8800, #FF5000); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #FF8800 , #FF5000); /* 标准的语法（必须放在最后） */
    color: #ffffff;
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;
}

.product_thumb_price {
    padding: 15px 20px 28px 20px;
    display: flex;
    align-items: flex-end;
}
.product_thumb_price_icon {
    font-size: 26px;
    line-height: 26px;
}
.product_thumb_price_int {
    font-size: 34px;
    line-height: 34px;
}
.product_thumb_price_float {
    font-size: 26px;
    line-height: 26px;
}
</style>